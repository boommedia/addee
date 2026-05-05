import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/social/devto
// Body: { title, content (markdown), tags?: string[], canonicalUrl?: string }
// Publishes to Dev.to using the user's stored API key
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

  const { data: integration } = await supabase
    .from('user_integrations')
    .select('token')
    .eq('user_id', user.id)
    .eq('platform', 'devto')
    .single()

  if (!integration?.token) {
    return NextResponse.json({
      error: 'Dev.to not connected. Add your Dev.to API key in Settings → Integrations.',
    }, { status: 422 })
  }

  const article: Record<string, unknown> = {
    title,
    body_markdown: content,
    published: true,
  }
  if (tags?.length) article.tags = tags.slice(0, 4).map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
  if (canonicalUrl) article.canonical_url = canonicalUrl

  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: { 'api-key': integration.token as string, 'Content-Type': 'application/json' },
    body: JSON.stringify({ article }),
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: data.error ?? 'Dev.to publish failed' }, { status: 500 })
  }

  return NextResponse.json({ url: data.url, id: data.id })
}
