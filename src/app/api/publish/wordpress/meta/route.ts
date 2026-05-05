import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const { data: client } = await supabase
    .from('clients')
    .select('wp_url, wp_username, wp_app_password')
    .eq('id', clientId)
    .single()

  if (!client?.wp_url || !client?.wp_username || !client?.wp_app_password) {
    return NextResponse.json({ categories: [], tags: [] })
  }

  const wpBase = client.wp_url.replace(/\/$/, '')
  const credentials = Buffer.from(`${client.wp_username}:${client.wp_app_password}`).toString('base64')
  const headers = { Authorization: `Basic ${credentials}` }

  try {
    const [catRes, tagRes] = await Promise.all([
      fetch(`${wpBase}/wp-json/wp/v2/categories?per_page=100&orderby=count&order=desc`, { headers }),
      fetch(`${wpBase}/wp-json/wp/v2/tags?per_page=100&orderby=count&order=desc`, { headers }),
    ])

    const [categories, tags] = await Promise.all([
      catRes.ok ? catRes.json() : [],
      tagRes.ok ? tagRes.json() : [],
    ])

    return NextResponse.json({
      categories: (categories as any[]).map(c => ({ id: c.id, name: c.name })),
      tags: (tags as any[]).map(t => ({ id: t.id, name: t.name })),
    })
  } catch {
    return NextResponse.json({ categories: [], tags: [] })
  }
}
