import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { schedules } = await request.json() as {
    // schedules: array of { clientId, postsPerMonth, industry, keywords }
    schedules: { clientId: string; postsPerMonth: number; industry: string | null; keywords: string | null }[]
  }

  if (!Array.isArray(schedules) || !schedules.length) {
    return NextResponse.json({ error: 'No schedules provided' }, { status: 400 })
  }

  const results: { clientId: string; added: number; error?: string }[] = []

  for (const s of schedules) {
    try {
      const count = Math.min(s.postsPerMonth, 30)
      const industryCtx = s.industry ? `for a ${s.industry} business` : ''
      const keywordsCtx = s.keywords ? `Focus on these keywords: ${s.keywords}.` : ''

      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `Generate ${count} unique, SEO-optimized blog post topics ${industryCtx}. ${keywordsCtx}
Output ONLY a JSON array of strings, no other text. Example: ["Topic 1","Topic 2"]
Make them specific, valuable, and varied (how-tos, listicles, guides, comparisons).`,
        }],
      })

      const raw = response.content[0].type === 'text' ? response.content[0].text : '[]'
      let topics: string[] = []
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) {
        try { topics = JSON.parse(match[0]) } catch {}
      }

      if (!topics.length) {
        results.push({ clientId: s.clientId, added: 0, error: 'Could not generate topics' })
        continue
      }

      // Space evenly across the month
      const daysInMonth = 30
      const spacing = Math.floor(daysInMonth / topics.length)
      const now = new Date()
      const rows = topics.map((topic, i) => {
        const scheduled = new Date(now)
        scheduled.setDate(scheduled.getDate() + (i + 1) * spacing)
        return { client_id: s.clientId, topic, status: 'pending', scheduled_for: scheduled.toISOString() }
      })

      const { error } = await supabase.from('topic_queue').insert(rows)
      if (error) {
        results.push({ clientId: s.clientId, added: 0, error: error.message })
      } else {
        results.push({ clientId: s.clientId, added: rows.length })
      }
    } catch (err) {
      results.push({ clientId: s.clientId, added: 0, error: err instanceof Error ? err.message : 'Failed' })
    }
  }

  const total = results.reduce((sum, r) => sum + r.added, 0)
  return NextResponse.json({ total, results })
}
