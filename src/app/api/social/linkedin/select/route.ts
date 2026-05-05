import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { clientId, pageUrn, pageName, tokens } = await req.json()
  if (!clientId || !pageUrn || !tokens) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  const { error } = await supabase.from('client_integrations').upsert({
    client_id: clientId,
    platform: 'linkedin',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    token_expires_at: expiresAt,
    platform_account_id: pageUrn,
    platform_account_name: pageName ?? pageUrn,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'client_id,platform' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
