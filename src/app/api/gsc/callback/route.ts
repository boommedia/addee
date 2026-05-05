import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const siteUrl = searchParams.get('state')
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online').replace(/\/$/, '')

  if (!code) return NextResponse.redirect(`${appUrl}/settings?gsc_error=no_code`)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${appUrl}/login`)

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${appUrl}/api/gsc/callback`,
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/settings?gsc_error=token_failed`)
  }

  // Store token
  await supabase.from('gsc_tokens').upsert({
    user_id: user.id,
    site_url: siteUrl ?? 'default',
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token ?? null,
    expires_at: tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null,
  }, { onConflict: 'user_id,site_url' })

  return NextResponse.redirect(`${appUrl}/analytics?gsc_connected=1`)
}
