import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, prompt, created_by, clients(name)')
    .eq('approval_token', token)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const userId = post.created_by

  // Check if this is the first free content generation for this user
  const { count: contentGenCount } = await supabase
    .from('approval_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', 'content')

  const isFreeGeneration = (contentGenCount ?? 0) === 0

  if (!isFreeGeneration) {
    // Check user credits
    const { data: credits } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    const balance = credits?.balance ?? 0
    if (balance < 2) {
      return NextResponse.json(
        { error: 'Not enough credits. Content generation requires 2 credits. Please purchase more credits.' },
        { status: 402 }
      )
    }

    // Deduct 2 credits
    await supabase
      .from('user_credits')
      .update({ balance: balance - 2 })
      .eq('user_id', userId)
  }

  try {
    // Call the rewrite API to regenerate content
    const rewriteRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: post.content,
        customInstruction: 'Regenerate this blog post with fresh perspective and improved clarity. Keep the same overall structure and length, but make the content more engaging and impactful.',
      }),
    })

    if (!rewriteRes.ok) throw new Error('Failed to regenerate content')

    // Stream the rewritten content
    let newContent = ''
    const reader = rewriteRes.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      newContent += decoder.decode(value, { stream: true })
    }

    // Update post with new content
    await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('id', post.id)

    // Log generation
    await supabase
      .from('approval_generations')
      .insert({
        user_id: userId,
        post_id: post.id,
        type: 'content',
        is_free: isFreeGeneration,
      })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to regenerate content' },
      { status: 500 }
    )
  }
}
