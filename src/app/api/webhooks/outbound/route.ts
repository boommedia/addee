import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: hooks } = await supabase
    .from('webhooks')
    .select('id, url, events, label, created_at, last_triggered_at, last_status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ hooks: hooks ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url, events, label } = await request.json()
  if (!url?.trim()) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  try { new URL(url) } catch { return NextResponse.json({ error: 'Invalid URL' }, { status: 400 }) }

  const { data, error } = await supabase.from('webhooks').insert({
    user_id: user.id,
    url: url.trim(),
    events: events ?? ['post.created'],
    label: label?.trim() || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ hook: data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await supabase.from('webhooks').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
