import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { data: client } = await supabase
    .from('clients')
    .select('wp_url, wp_username, wp_app_password')
    .eq('id', clientId)
    .eq('created_by', user.id)
    .single()

  if (!client?.wp_url || !client?.wp_username || !client?.wp_app_password) {
    return NextResponse.json({ status: 'not_configured' })
  }

  const base = client.wp_url.replace(/\/$/, '')
  const credentials = Buffer.from(`${client.wp_username}:${client.wp_app_password}`).toString('base64')
  const authHeaders = { Authorization: `Basic ${credentials}` }

  // Try several endpoints — Wordfence often blocks /users but allows /posts
  const endpoints = [
    `${base}/wp-json/wp/v2/posts?per_page=1&status=any`,
    `${base}/wp-json/wp/v2/users/me`,
    `${base}/?rest_route=/wp/v2/posts&per_page=1`,
  ]

  let lastStatus = 0
  let lastBody = ''

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: authHeaders,
        signal: AbortSignal.timeout(8000),
        redirect: 'follow',
      })
      if (res.ok) {
        return NextResponse.json({ status: 'connected' })
      }
      lastStatus = res.status
      lastBody = await res.text().catch(() => '')
    } catch (err) {
      lastBody = err instanceof Error ? err.message : 'failed'
    }
  }

  const msg = lastStatus === 401
    ? 'Invalid credentials — regenerate the Application Password in WP → Users → Profile'
    : lastStatus === 403
    ? 'Blocked by security plugin (403) — whitelist Vercel IPs in Wordfence or disable REST API blocking'
    : lastStatus > 0
    ? `HTTP ${lastStatus}: ${lastBody.slice(0, 80)}`
    : `Could not reach ${base} — check the WP URL`

  return NextResponse.json({ status: 'error', code: lastStatus, message: msg })
}
