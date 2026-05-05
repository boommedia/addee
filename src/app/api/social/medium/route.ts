import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/social/medium
// Body: { title, content (markdown), tags?: string[], canonicalUrl?: string }
// Publishes to Medium using the user's stored integration token
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, tags, canonicalUrl } = await req.json() as {
    title: string
    content: string
    tags?: string[]
    canonicalUrl?: string
  }

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
  }

  // Get Medium integration token for this user
  const { data: integration } = await supabase
    .from('user_integrations')
    .select('token, platform_user_id')
    .eq('user_id', user.id)
    .eq('platform', 'medium')
    .single()

  if (!integration?.token) {
    return NextResponse.json({
      error: 'Medium not connected. Add your Medium integration token in Settings → Integrations.',
    }, { status: 422 })
  }

  // Get Medium author ID if not cached
  let authorId = integration.platform_user_id as string | null
  if (!authorId) {
    const meRes = await fetch('https://api.medium.com/v1/me', {
      headers: { Authorization: `Bearer ${integration.token}`, 'Content-Type': 'application/json' },
    })
    if (!meRes.ok) return NextResponse.json({ error: 'Invalid Medium token. Please reconnect.' }, { status: 401 })
    const me = await meRes.json()
    authorId = me.data?.id as string
    // Cache the author ID
    await supabase
      .from('user_integrations')
      .update({ platform_user_id: authorId })
      .eq('user_id', user.id)
      .eq('platform', 'medium')
  }

  const body: Record<string, unknown> = {
    title,
    contentFormat: 'markdown',
    content,
    publishStatus: 'public',
  }
  if (tags?.length) body.tags = tags.slice(0, 5)
  if (canonicalUrl) body.canonicalUrl = canonicalUrl

  const postRes = await fetch(`https://api.medium.com/v1/users/${authorId}/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${integration.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const postData = await postRes.json()
  if (!postRes.ok) {
    return NextResponse.json({ error: postData.errors?.[0]?.message ?? 'Medium publish failed' }, { status: 500 })
  }

  return NextResponse.json({ url: postData.data?.url, id: postData.data?.id })
}
