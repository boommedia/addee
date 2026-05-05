import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { keywords, niche, location } = await request.json()
  if (!Array.isArray(keywords) || keywords.length === 0) return NextResponse.json({ error: 'Keywords array required' }, { status: 400 })
  if (keywords.length > 50) return NextResponse.json({ error: 'Max 50 keywords per batch' }, { status: 400 })

  const locationLine = location ? `\nTarget location: ${location}` : ''
  const nicheContext = niche ? `\nNiche context: ${niche}` : ''

  const prompt = `You are an expert SEO keyword analyst. Score each keyword below and return structured data.${nicheContext}${locationLine}

Keywords to score:
${keywords.map((k: string, i: number) => `${i + 1}. ${k}`).join('\n')}

Return ONLY a valid JSON array — no markdown, no explanation. One object per keyword in the same order:

[
  {
    "keyword": "exact keyword from input",
    "intent": "informational" | "transactional" | "local" | "navigational",
    "difficulty": "easy" | "medium" | "hard",
    "volume": "low" | "medium" | "high",
    "blog_title": "A compelling, click-worthy SEO blog post title",
    "cluster": "Short topic cluster name (2-4 words)"
  }
]`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const scored = JSON.parse(cleaned)
    return NextResponse.json({ keywords: scored })
  } catch {
    return NextResponse.json({ error: 'Failed to parse results' }, { status: 500 })
  }
}
