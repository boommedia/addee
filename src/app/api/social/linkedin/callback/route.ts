import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeCode, getMemberProfile } from '@/lib/linkedin'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return new NextResponse(closePopupHtml('error', error), { headers: { 'Content-Type': 'text/html' } })
  }
  if (!code || !state) {
    return new NextResponse(closePopupHtml('error', 'Missing code or state'), { headers: { 'Content-Type': 'text/html' } })
  }

  let parsed: { clientId: string; userId: string }
  try {
    parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
  } catch {
    return new NextResponse(closePopupHtml('error', 'Invalid state'), { headers: { 'Content-Type': 'text/html' } })
  }

  let tokens, profile
  try {
    const redirectUri = `${process.env.LINKEDIN_REDIRECT_URI ?? 'https://www.bloggy.online/api/social/linkedin/callback'}`
    tokens = await exchangeCode(code, redirectUri)
    profile = await getMemberProfile(tokens.access_token)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[LinkedIn OAuth Error]', msg)
    return new NextResponse(closePopupHtml('error', msg), { headers: { 'Content-Type': 'text/html' } })
  }

  const supabase = createAdminClient()
  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    : null

  const { error: upsertError } = await supabase.from('client_integrations').upsert({
    client_id: parsed.clientId,
    platform: 'linkedin',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    token_expires_at: expiresAt,
    platform_account_id: profile.urn,
    platform_account_name: profile.name,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'client_id,platform' })

  if (upsertError) {
    console.error('[LinkedIn Upsert Error]', upsertError)
    return new NextResponse(closePopupHtml('error', upsertError.message), { headers: { 'Content-Type': 'text/html' } })
  }

  return new NextResponse(closePopupHtml('success', 'linkedin'), { headers: { 'Content-Type': 'text/html' } })
}

function closePopupHtml(status: string, detail: string) {
  return `<!DOCTYPE html><html><body><script>
    try {
      const ch = new BroadcastChannel('linkedin_oauth');
      ch.postMessage({ type: 'linkedin_oauth', status: '${status}', detail: '${detail.replace(/'/g, "\\'")}' });
      ch.close();
    } catch(e) {}
    window.close();
  </script></body></html>`
}
