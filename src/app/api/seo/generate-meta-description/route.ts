import { createClient } from '@/lib/supabase/server'
import { Anthropic } from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { title, focusKeyword, content, model = 'claude-haiku-4-5-20251001' } = await req.json()

    if (!title || !focusKeyword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prompt = `You are an SEO expert. Generate 3 compelling meta descriptions (150-160 characters EXACTLY) that:
- MUST include the exact focus keyword phrase: "${focusKeyword}"
- Summarize the main value of this post: "${title}"
- Include a call-to-action or compelling hook
- Are optimized for click-through rate in search results
- Each description should be between 150-160 characters

IMPORTANT: Count characters carefully. Each description MUST be at least 150 characters and under 160.

${content ? `Post content: ${content.substring(0, 1000)}...` : ''}

Return ONLY a JSON array of 3 strings with NO explanation. Example:
["This description is between 150-160 characters long and includes the keyword. It has a hook and CTA that drives clicks!", "Another meta description option that is 150-160 chars and includes your keyword with compelling benefit-focused copy.", "Third description option staying within 150-160 character range while including keyword and strong call-to-action."]`

    const message = await client.messages.create({
      model: model,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON array from response (handle cases where model adds extra text)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Invalid response format: no JSON array found')

    const suggestions = JSON.parse(jsonMatch[0])
    if (!Array.isArray(suggestions)) throw new Error('Expected array of suggestions')

    return NextResponse.json({ suggestions })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error generating meta description:', errorMessage, error)
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 })
  }
}
