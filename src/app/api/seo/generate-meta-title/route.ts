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

    const prompt = `You are an SEO expert. Generate 3 compelling meta titles (50-60 characters EXACTLY) that:
- MUST include the exact focus keyword phrase: "${focusKeyword}" (even if you need to rephrase it slightly)
- Are based on this post title: "${title}"
- Are optimized for click-through rate in search results
- Each title should be between 50-60 characters

IMPORTANT: Count characters carefully. Each title MUST be at least 50 characters.

${content ? `Post content snippet: ${content.substring(0, 500)}...` : ''}

Return ONLY a JSON array of 3 strings with NO explanation. Example:
["This is a title that's exactly between 50-60 chars long!", "Another title option is between 50-60 char range!", "Third title option must also be 50-60 chars long!"]`

    const message = await client.messages.create({
      model: model,
      max_tokens: 300,
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
    console.error('Error generating meta title:', errorMessage, error)
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 })
  }
}
