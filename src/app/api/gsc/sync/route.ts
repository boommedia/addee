import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, siteUrl, startDate, endDate } = await request.json()
  if (!siteUrl) return NextResponse.json({ error: 'siteUrl required' }, { status: 400 })

  // Load stored GSC access token for this user
  const { data: gscToken } = await supabase
    .from('gsc_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', user.id)
    .eq('site_url', siteUrl)
    .single()

  if (!gscToken) {
    return NextResponse.json({ error: 'Google Search Console not connected for this site. Please connect via Settings → GSC.' }, { status: 404 })
  }

  // Refresh token if needed
  let accessToken = gscToken.access_token
  if (gscToken.expires_at && new Date(gscToken.expires_at) < new Date()) {
    try {
      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: gscToken.refresh_token,
          grant_type: 'refresh_token',
        }),
      })
      const refreshData = await refreshRes.json()
      if (refreshData.access_token) {
        accessToken = refreshData.access_token
        await supabase.from('gsc_tokens').update({
          access_token: accessToken,
          expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
        }).eq('user_id', user.id).eq('site_url', siteUrl)
      }
    } catch { /* use existing token */ }
  }

  const end = endDate ?? new Date().toISOString().slice(0, 10)
  const start = startDate ?? new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString().slice(0, 10)

  // Fetch from GSC API
  const gscRes = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: start,
        endDate: end,
        dimensions: ['query', 'page'],
        rowLimit: 1000,
      }),
    }
  )

  if (!gscRes.ok) {
    const errData = await gscRes.json()
    return NextResponse.json({ error: errData.error?.message ?? 'GSC API error' }, { status: 500 })
  }

  const gscData = await gscRes.json()
  const rows = (gscData.rows ?? []).map((row: any) => ({
    query: row.keys[0],
    page: row.keys[1],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }))

  // Upsert to gsc_data table
  if (rows.length > 0) {
    const upsertRows = rows.map((r: any) => ({
      user_id: user.id,
      client_id: clientId || null,
      site_url: siteUrl,
      query: r.query,
      page: r.page,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
      date_start: start,
      date_end: end,
      synced_at: new Date().toISOString(),
    }))
    await supabase.from('gsc_data').upsert(upsertRows, { onConflict: 'user_id,site_url,query,page,date_start,date_end' })
  }

  return NextResponse.json({ rows, count: rows.length, startDate: start, endDate: end })
}
