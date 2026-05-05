import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { keyword } = await request.json()
  if (!keyword?.trim()) return NextResponse.json({ error: 'Keyword required' }, { status: 400 })

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Generate 8-10 long-tail keyword variations of the main keyword "${keyword}".

Long-tail keywords are more specific, longer phrases (usually 3+ words) with lower search volume but higher intent.

Examples of long-tail variations:
- Main: "coffee" → Long-tail: "best cold brew coffee near me", "how to make espresso at home", "specialty coffee for beginners"
- Main: "pizza" → Long-tail: "authentic New York pizza recipe", "gluten free pizza delivery near me", "sourdough pizza crust"

Return ONLY a JSON array of strings, no other text:
["keyword variation 1", "keyword variation 2", ...]`
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Invalid response type')

    const suggestions = JSON.parse(content.text.trim())
    if (!Array.isArray(suggestions)) throw new Error('Invalid response format')

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Long-tail keyword generation failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
