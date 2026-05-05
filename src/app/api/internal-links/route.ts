import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, title, clientId } = await request.json()
  if (!content || !clientId) return NextResponse.json({ error: 'Missing content or clientId' }, { status: 400 })

  // Get existing posts for this client — scoped to the authenticated user
  const { data: existingPosts } = await supabase
    .from('posts')
    .select('title, wp_post_url')
    .eq('client_id', clientId)
    .eq('created_by', user.id)
    .not('wp_post_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(30)

  if (!existingPosts?.length) {
    return NextResponse.json({ suggestions: [] })
  }

  const postList = existingPosts
    .map((p, i) => `${i + 1}. "${p.title}" — ${p.wp_post_url}`)
    .join('\n')

  const prompt = `You are an SEO expert. Given a blog post and a list of existing published posts, suggest the best internal linking opportunities.

Current post title: "${title}"

Current post excerpt (first 1000 chars):
${content.slice(0, 1000)}

Existing published posts:
${postList}

Return a JSON array of up to 5 suggestions. Each suggestion must have:
- "title": the existing post title to link to
- "url": the URL of that post
- "anchorText": the natural anchor text to use in the current post
- "reason": one sentence explaining why this link makes sense

Return ONLY valid JSON array, no markdown, no explanation.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'
  let suggestions = []
  try {
    suggestions = JSON.parse(raw)
  } catch {
    suggestions = []
  }

  return NextResponse.json({ suggestions })
}
