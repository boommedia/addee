import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topic, keywords = '', audience = '', competitors = '', clientId } = await request.json()
  if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

  let brandVoice = ''
  if (clientId) {
    const { data: client } = await supabase.from('clients').select('brand_voice, industry').eq('id', clientId).single()
    if (client?.brand_voice) brandVoice = client.brand_voice
  }

  const prompt = `You are an expert content strategist. Create a comprehensive content brief for a blog post.

Topic: ${topic}
${keywords ? `Target keywords: ${keywords}` : ''}
${audience ? `Target audience: ${audience}` : ''}
${competitors ? `Competitor URLs/context: ${competitors}` : ''}
${brandVoice ? `Brand voice: ${brandVoice}` : ''}

Output a structured content brief in this exact JSON format:
{
  "headline": "Primary H1 headline (max 60 chars)",
  "altHeadlines": ["alt 1", "alt 2", "alt 3"],
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "Meta description (max 160 chars)",
  "focusKeyword": "Primary keyword phrase",
  "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "searchIntent": "informational|commercial|transactional|navigational",
  "targetAudience": "Who this post is for",
  "wordCountTarget": 1200,
  "outline": [
    { "heading": "## Introduction", "notes": "Hook + what reader will learn", "wordTarget": 150 },
    { "heading": "## Section 1", "notes": "Key points to cover", "wordTarget": 250 }
  ],
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "callToAction": "What should readers do after reading?",
  "competitorInsights": "What competitors cover + gap opportunities",
  "internalLinkSuggestions": ["Topic 1", "Topic 2"],
  "estimatedDifficulty": "easy|medium|hard",
  "estimatedTimeToRank": "3-6 months"
}

Respond with ONLY the JSON. No markdown fences, no preamble.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  try {
    const brief = JSON.parse(text)
    return NextResponse.json({ brief })
  } catch {
    return NextResponse.json({ error: 'Failed to parse brief', raw: text }, { status: 500 })
  }
}
