import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteUrl = searchParams.get('site')
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online').replace(/\/$/, '')

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}/api/gsc/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state: siteUrl ?? '',
  })

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
