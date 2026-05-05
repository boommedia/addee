import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeCode, listAccountsAndLocations } from '@/lib/gmb'

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

  let tokens, locations
  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/gmb/callback`
    console.log('[GMB] Exchange code with redirect URI:', redirectUri)
    tokens = await exchangeCode(code, redirectUri)
    console.log('[GMB] Got tokens, access_token length:', tokens.access_token.length)

    const accounts = await listAccountsAndLocations(tokens.access_token)
    console.log('[GMB] Got accounts:', accounts.length)
    locations = accounts.flatMap(a => (a.locations ?? []).map(l => ({ ...l, accountName: a.accountName })))
    console.log('[GMB] Got locations:', locations.length)

    if (locations.length === 0) {
      return new NextResponse(closePopupHtml('error', 'No Google Business locations found on this account'), { headers: { 'Content-Type': 'text/html' } })
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[GMB Error]', msg, err instanceof Error ? err.stack : '')
    return new NextResponse(closePopupHtml('error', msg), { headers: { 'Content-Type': 'text/html' } })
  }

  if (locations.length === 1) {
    try {
      const supabase = createAdminClient()
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      console.log('[GMB] Saving single location:', locations[0].title)

      const { error } = await supabase.from('client_integrations').upsert({
        client_id: parsed.clientId,
        platform: 'gmb',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: expiresAt,
        platform_account_id: locations[0].name,
        platform_account_name: locations[0].title,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'client_id,platform' })

      if (error) {
        console.error('[GMB Supabase Error]', error)
        return new NextResponse(closePopupHtml('error', `Database error: ${error.message}`), { headers: { 'Content-Type': 'text/html' } })
      }
      console.log('[GMB] Successfully saved integration')
      return new NextResponse(closePopupHtml('success', 'gmb'), { headers: { 'Content-Type': 'text/html' } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      console.error('[GMB Save Error]', msg)
      return new NextResponse(closePopupHtml('error', msg), { headers: { 'Content-Type': 'text/html' } })
    }
  }

  // Multiple locations — redirect to selector page
  const params = new URLSearchParams({
    tokens: Buffer.from(JSON.stringify(tokens)).toString('base64url'),
    locations: Buffer.from(JSON.stringify(locations)).toString('base64url'),
    clientId: parsed.clientId,
  })
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/social/gmb/select?${params}`)
}

function closePopupHtml(status: string, detail: string) {
  return `<!DOCTYPE html><html><body><script>
    try {
      const ch = new BroadcastChannel('gmb_oauth');
      ch.postMessage({ type: 'gmb_oauth', status: '${status}', detail: '${detail.replace(/'/g, "\\'")}' });
      ch.close();
    } catch(e) {}
    window.close();
  </script></body></html>`
}
