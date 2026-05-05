import { createClient } from '@/lib/supabase/server'
import { markdownToHTML } from '@/lib/markdownToHTML'
import { notifyGoogleIndex } from '@/lib/google-indexing'
import { NextResponse } from 'next/server'

async function resolveTagIds(wpBase: string, authHeader: string, tagNames: string[]): Promise<number[]> {
  const ids: number[] = []
  for (const name of tagNames) {
    const trimmed = name.trim()
    if (!trimmed) continue
    try {
      const searchRes = await fetch(`${wpBase}/wp-json/wp/v2/tags?search=${encodeURIComponent(trimmed)}&per_page=5`, {
        headers: { Authorization: authHeader },
      })
      if (searchRes.ok) {
        const found = await searchRes.json()
        const exact = (found as any[]).find(t => t.name.toLowerCase() === trimmed.toLowerCase())
        if (exact) { ids.push(exact.id); continue }
      }
      const createRes = await fetch(`${wpBase}/wp-json/wp/v2/tags`, {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      if (createRes.ok) {
        const created = await createRes.json()
        ids.push(created.id)
      }
    } catch { /* skip this tag */ }
  }
  return ids
}

// POST — create or update a WordPress post
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const {
    postId, clientId, title, content, imageUrl,
    status = 'draft', seoMeta,
    categoryIds, tagNames, scheduledAt,
  } = await request.json()

  if (!clientId || !title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('wp_url, wp_username, wp_app_password')
    .eq('id', clientId)
    .single()

  if (clientError || !client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  if (!client.wp_url || !client.wp_username || !client.wp_app_password) {
    return NextResponse.json(
      { error: 'This client has no WordPress connection configured. Add credentials in the Clients page.' },
      { status: 422 }
    )
  }

  const wpBase = client.wp_url.replace(/\/$/, '')
  const authHeader = `Basic ${Buffer.from(`${client.wp_username}:${client.wp_app_password}`).toString('base64')}`

  // Check if this post was already published to WordPress
  let existingWpPostId: number | null = null
  if (postId) {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('wp_post_id')
      .eq('id', postId)
      .single()
    existingWpPostId = existingPost?.wp_post_id ?? null
  }

  // Upload featured image (only on first publish to avoid duplicates)
  let featuredMediaId: number | null = null
  if (imageUrl && !existingWpPostId) {
    try {
      const imgRes = await fetch(imageUrl)
      if (imgRes.ok) {
        const imgBuffer = await imgRes.arrayBuffer()
        const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg'
        const ext = contentType.includes('png') ? 'png' : 'jpg'
        const mediaRes = await fetch(`${wpBase}/wp-json/wp/v2/media`, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="bloggy-hero.${ext}"`,
          },
          body: imgBuffer,
        })
        if (mediaRes.ok) {
          const media = await mediaRes.json()
          featuredMediaId = media.id ?? null
        }
      }
    } catch { /* non-fatal */ }
  }

  // Resolve tag IDs from names
  const resolvedTagIds = tagNames?.length
    ? await resolveTagIds(wpBase, authHeader, tagNames)
    : []

  // SmartCrawl meta
  const meta: Record<string, string> = {}
  if (seoMeta?.metaTitle) meta['_wds_title'] = seoMeta.metaTitle
  if (seoMeta?.metaDescription) meta['_wds_metadesc'] = seoMeta.metaDescription
  if (seoMeta?.focusKeyword) meta['_wds_focus_keywords'] = seoMeta.focusKeyword

  const isScheduled = scheduledAt && new Date(scheduledAt) > new Date()
  const wpStatus = isScheduled ? 'future' : status

  const postBody: Record<string, unknown> = {
    title,
    content: markdownToHTML(content),
    status: wpStatus,
    format: 'standard',
    ...(categoryIds?.length ? { categories: categoryIds } : {}),
    ...(resolvedTagIds.length ? { tags: resolvedTagIds } : {}),
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
    ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
    ...(isScheduled ? { date: new Date(scheduledAt).toISOString() } : {}),
  }

  // Update existing WP post (PUT) or create new (POST)
  const wpEndpoint = existingWpPostId
    ? `${wpBase}/wp-json/wp/v2/posts/${existingWpPostId}`
    : `${wpBase}/wp-json/wp/v2/posts`
  const wpMethod = existingWpPostId ? 'PUT' : 'POST'

  const wpResponse = await fetch(wpEndpoint, {
    method: wpMethod,
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify(postBody),
  })

  if (!wpResponse.ok) {
    const wpError = await wpResponse.json().catch(() => ({}))
    return NextResponse.json({ error: wpError?.message ?? `WordPress returned ${wpResponse.status}` }, { status: wpResponse.status })
  }

  const wpPost = await wpResponse.json()

  if (postId) {
    await supabase.from('posts').update({
      wp_post_id: wpPost.id,
      wp_post_url: wpPost.link,
      wp_status: wpPost.status,
      published_at: isScheduled ? scheduledAt : new Date().toISOString(),
    }).eq('id', postId)
  }

  // Submit to Google Indexing API when publishing live (non-blocking)
  if (wpPost.status === 'publish' && wpPost.link) {
    notifyGoogleIndex(wpPost.link).catch(() => {})
  }

  return NextResponse.json({
    wpPostId: wpPost.id,
    wpPostUrl: wpPost.link,
    wpStatus: wpPost.status,
    updated: !!existingWpPostId,
  })
}

// PATCH — change status of an already-published post (publish ↔ draft)
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, clientId, newStatus } = await request.json()

  if (!postId || !clientId || !newStatus) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: post } = await supabase
    .from('posts')
    .select('wp_post_id')
    .eq('id', postId)
    .single()

  if (!post?.wp_post_id) {
    return NextResponse.json({ error: 'Post has not been published to WordPress yet' }, { status: 422 })
  }

  const { data: client } = await supabase
    .from('clients')
    .select('wp_url, wp_username, wp_app_password')
    .eq('id', clientId)
    .single()

  if (!client?.wp_url || !client.wp_username || !client.wp_app_password) {
    return NextResponse.json({ error: 'No WordPress credentials on this client' }, { status: 422 })
  }

  const wpBase = client.wp_url.replace(/\/$/, '')
  const authHeader = `Basic ${Buffer.from(`${client.wp_username}:${client.wp_app_password}`).toString('base64')}`

  const wpResponse = await fetch(`${wpBase}/wp-json/wp/v2/posts/${post.wp_post_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ status: newStatus }),
  })

  if (!wpResponse.ok) {
    const wpError = await wpResponse.json().catch(() => ({}))
    return NextResponse.json({ error: wpError?.message ?? `WordPress returned ${wpResponse.status}` }, { status: wpResponse.status })
  }

  const wpPost = await wpResponse.json()

  await supabase.from('posts').update({
    wp_status: wpPost.status,
  }).eq('id', postId)

  // Submit to Google Indexing API when going live (non-blocking)
  if (newStatus === 'publish' && wpPost.link) {
    notifyGoogleIndex(wpPost.link).catch(() => {})
  }

  return NextResponse.json({ wpStatus: wpPost.status, wpPostUrl: wpPost.link })
}

// DELETE — remove a post from WordPress
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, clientId } = await request.json()

  if (!postId || !clientId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: post } = await supabase
    .from('posts')
    .select('wp_post_id')
    .eq('id', postId)
    .single()

  if (!post?.wp_post_id) {
    return NextResponse.json({ error: 'Post has not been published to WordPress yet' }, { status: 422 })
  }

  const { data: client } = await supabase
    .from('clients')
    .select('wp_url, wp_username, wp_app_password')
    .eq('id', clientId)
    .single()

  if (!client?.wp_url || !client.wp_username || !client.wp_app_password) {
    return NextResponse.json({ error: 'No WordPress credentials on this client' }, { status: 422 })
  }

  const wpBase = client.wp_url.replace(/\/$/, '')
  const authHeader = `Basic ${Buffer.from(`${client.wp_username}:${client.wp_app_password}`).toString('base64')}`

  const wpResponse = await fetch(`${wpBase}/wp-json/wp/v2/posts/${post.wp_post_id}?force=true`, {
    method: 'DELETE',
    headers: { Authorization: authHeader },
  })

  if (!wpResponse.ok) {
    const wpError = await wpResponse.json().catch(() => ({}))
    return NextResponse.json({ error: wpError?.message ?? `WordPress returned ${wpResponse.status}` }, { status: wpResponse.status })
  }

  await supabase.from('posts').update({
    wp_post_id: null,
    wp_post_url: null,
    wp_status: null,
  }).eq('id', postId)

  return NextResponse.json({ message: 'Post deleted successfully' })
}
