import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, name, industry, website, brand_voice, contact_email, wp_url, wp_username, wp_app_password, logo_url, primary_color, brand_guidelines, target_keywords } = body

  const payload = {
    name,
    industry: industry || null,
    website: website || null,
    brand_voice: brand_voice || null,
    contact_email: contact_email || null,
    wp_url: wp_url || null,
    wp_username: wp_username || null,
    wp_app_password: wp_app_password || null,
    logo_url: logo_url || null,
    primary_color: primary_color || null,
    brand_guidelines: brand_guidelines || null,
    target_keywords: target_keywords || null,
  }

  if (id) {
    // Verify ownership first
    const { data: existing } = await supabase
      .from('clients')
      .select('id, created_by')
      .eq('id', id)
      .single()

    if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    if (existing.created_by && existing.created_by !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('clients')
      .update(payload)
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Insert — check plan limit first
  const [{ data: sub }, { count }] = await Promise.all([
    supabase.from('subscriptions').select('sites_limit').eq('user_id', user.id).single(),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
  ])
  const limit = sub?.sites_limit ?? 2
  if ((count ?? 0) >= limit) {
    return NextResponse.json({ error: `You've reached your ${limit}-client limit. Upgrade to add more.` }, { status: 403 })
  }

  const { error } = await supabase.from('clients').insert({ ...payload, created_by: user.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
