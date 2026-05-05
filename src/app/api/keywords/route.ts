import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { niche, location, industry } = await request.json()
  if (!niche) return NextResponse.json({ error: 'Niche is required' }, { status: 400 })

  const locationLine = location ? `\nTarget location: ${location}` : ''
  const industryLine = industry ? `\nIndustry: ${industry}` : ''

  const prompt = `You are an expert SEO keyword researcher. Generate 20 high-value keywords for the following niche.

Niche: ${niche}${industryLine}${locationLine}

Return ONLY valid JSON — no explanation, no markdown, no code fences. Output a JSON array of exactly 20 objects:

[
  {
    "keyword": "the exact keyword phrase",
    "intent": "informational" | "transactional" | "local" | "navigational",
    "difficulty": "easy" | "medium" | "hard",
    "volume": "low" | "medium" | "high",
    "blog_title": "A compelling blog post title using this keyword",
    "cluster": "A short topic cluster name (2-4 words, e.g. 'Local Services', 'Buying Guides', 'How-To Tips', 'Cost & Pricing')"
  }
]

Guidelines:
- Mix short-tail and long-tail keywords
- Include buying-intent and informational keywords
- If a location was provided, include localised variants
- Prioritise keywords a small business or agency client could realistically rank for
- blog_title should be click-worthy and SEO-optimised
- cluster groups related keywords under a shared topic umbrella (typically 3-6 keywords per cluster)`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  let keywords: unknown[]
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    keywords = JSON.parse(cleaned)
  } catch {
    return NextResponse.json({ error: 'Failed to parse keyword results' }, { status: 500 })
  }

  return NextResponse.json({ keywords })
}
