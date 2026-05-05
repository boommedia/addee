import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { keyword, blog_title, intent, niche, location } = await request.json()
  if (!keyword) return NextResponse.json({ error: 'Keyword required' }, { status: 400 })

  const locationLine = location ? ` in ${location}` : ''

  const prompt = `You are a senior SEO content strategist. Generate a detailed content brief for the following keyword.

Target keyword: ${keyword}
Suggested title: ${blog_title ?? ''}
Search intent: ${intent ?? 'informational'}
Niche: ${niche ?? 'general'}${locationLine}

Output a JSON object with this exact structure:
{
  "search_intent_summary": "1-2 sentences explaining what the searcher is looking for",
  "target_audience": "1 sentence describing who is searching this",
  "recommended_word_count": 1500,
  "title_options": ["Title A", "Title B", "Title C"],
  "meta_description": "Under 160 chars, includes keyword, compelling CTA",
  "outline": [
    { "type": "h2", "text": "Section heading", "notes": "What to cover in 1 sentence" },
    { "type": "h3", "text": "Sub-section", "notes": "What to cover" }
  ],
  "key_points": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "related_keywords": ["related keyword 1", "related keyword 2", "related keyword 3", "related keyword 4", "related keyword 5"],
  "internal_link_opportunities": ["Topic that might link to this post", "Another topic"],
  "cta_suggestions": ["CTA 1", "CTA 2"],
  "content_angle": "The unique angle or hook that makes this post stand out"
}

Return ONLY valid JSON — no markdown, no code fences, no explanation.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const brief = JSON.parse(cleaned)
    return NextResponse.json({ brief })
  } catch {
    return NextResponse.json({ error: 'Failed to parse brief' }, { status: 500 })
  }
}
