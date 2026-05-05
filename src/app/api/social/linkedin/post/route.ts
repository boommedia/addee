import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPost, refreshAccessToken } from '@/lib/linkedin'

export async function POST(req: NextRequest) {
  const { clientId, text, url } = await req.json()
  if (!clientId || !text) return NextResponse.json({ error: 'clientId and text required' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: integration, error: fetchErr } = await supabase
    .from('client_integrations')
    .select('*')
    .eq('client_id', clientId)
    .eq('platform', 'linkedin')
    .single()

  if (fetchErr || !integration) {
    return NextResponse.json({ error: 'LinkedIn not connected for this client' }, { status: 400 })
  }

  let accessToken: string = integration.access_token

  // LinkedIn tokens last 60 days; refresh if within 7 days of expiry
  if (integration.token_expires_at) {
    const expiresAt = new Date(integration.token_expires_at)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    if (expiresAt.getTime() - Date.now() < sevenDays) {
      if (!integration.refresh_token) {
        return NextResponse.json({ error: 'LinkedIn token expired — client must reconnect' }, { status: 400 })
      }
      const refreshed = await refreshAccessToken(integration.refresh_token)
      accessToken = refreshed.access_token
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      await supabase.from('client_integrations').update({
        access_token: accessToken,
        token_expires_at: newExpiry,
        updated_at: new Date().toISOString(),
      }).eq('id', integration.id)
    }
  }

  try {
    const result = await createPost(integration.platform_account_id, text, accessToken, url)
    return NextResponse.json({ ok: true, post: result })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Post failed' }, { status: 500 })
  }
}
