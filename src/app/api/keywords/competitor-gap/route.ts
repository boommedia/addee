import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { competitorDomain, niche, location, yourKeywords } = await request.json()
  if (!competitorDomain || !niche) return NextResponse.json({ error: 'Competitor domain and niche required' }, { status: 400 })

  const locationLine = location ? `\nTarget location: ${location}` : ''
  const yourKwLine = yourKeywords?.length ? `\nKeywords you already target (exclude these): ${yourKeywords.slice(0, 20).join(', ')}` : ''

  const prompt = `You are a senior SEO competitor analyst. A business in the "${niche}" niche wants to find keyword gaps compared to their competitor.

Competitor domain: ${competitorDomain}${locationLine}${yourKwLine}

Based on what a typical "${niche}" website at ${competitorDomain} would rank for, generate 20 keyword opportunities that:
1. The competitor likely ranks for
2. Have clear content/blog potential
3. The user could realistically compete for
4. Are NOT already in their keyword list (if provided)

Return ONLY valid JSON — no markdown, no code fences. Array of 20 objects:
[
  {
    "keyword": "exact keyword phrase",
    "intent": "informational" | "transactional" | "local" | "navigational",
    "difficulty": "easy" | "medium" | "hard",
    "volume": "low" | "medium" | "high",
    "blog_title": "A compelling blog post title targeting this keyword",
    "cluster": "Short topic cluster name",
    "gap_reason": "One sentence: why this is a valuable gap to fill"
  }
]`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const keywords = JSON.parse(cleaned)
    return NextResponse.json({ keywords })
  } catch {
    return NextResponse.json({ error: 'Failed to parse results' }, { status: 500 })
  }
}
