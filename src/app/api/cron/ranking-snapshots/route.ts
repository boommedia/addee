import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const maxDuration = 300

const DFS_BASE = 'https://api.dataforseo.com/v3'

function dfsAuth() {
  const login = process.env.DATAFORSEO_LOGIN
  const password = process.env.DATAFORSEO_PASSWORD
  if (!login || !password) return null
  return 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')
}

function domainOf(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname
      .replace(/^www\./, '')
      .toLowerCase()
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0].toLowerCase()
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const auth = dfsAuth()
  if (!auth) {
    console.log('[RankingCron] DataForSEO not configured — skipping')
    return NextResponse.json({ skipped: true, reason: 'DataForSEO not configured' })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get all clients with target keywords
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, website, target_keywords, created_by')
    .not('target_keywords', 'is', null)
    .neq('target_keywords', '')

  if (!clients || clients.length === 0) {
    return NextResponse.json({ checked: 0 })
  }

  type Task = { userId: string; clientId: string; clientDomain: string; keyword: string }
  const tasks: Task[] = []

  for (const client of clients) {
    const domain = client.website ? domainOf(client.website) : ''
    const kws = (client.target_keywords as string)
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean)
    for (const kw of kws) {
      tasks.push({ userId: client.created_by as string, clientId: client.id, clientDomain: domain, keyword: kw })
    }
  }

  console.log(`[RankingCron] Checking ${tasks.length} keyword-client pairs`)

  // Batch SERP check (no volume — saves cost on automated runs)
  const serpPayload = tasks.map(t => ({
    keyword: t.keyword,
    language_code: 'en',
    location_code: 2840,
    depth: 100,
    se_domain: 'google.com',
  }))

  const serpRes = await fetch(`${DFS_BASE}/serp/google/organic/live/regular`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(serpPayload),
  })

  if (!serpRes.ok) {
    const body = await serpRes.text()
    console.error('[RankingCron] SERP API error:', serpRes.status, body.slice(0, 200))
    return NextResponse.json({ error: `SERP API ${serpRes.status}` }, { status: 500 })
  }

  const serpData = await serpRes.json()
  const taskResults: {
    data?: { keyword?: string }
    result?: { items?: { rank_absolute?: number; url?: string; type?: string }[] }[]
  }[] = serpData?.tasks ?? []

  const snapshots: {
    user_id: string; client_id: string; keyword: string
    position: number | null; url: string | null; search_volume: null
  }[] = []

  taskResults.forEach((task, i) => {
    const kwRaw = task?.data?.keyword ?? tasks[i]?.keyword ?? ''
    const items = task?.result?.[0]?.items ?? []
    const taskObj = tasks.find(t => t.keyword.toLowerCase() === kwRaw.toLowerCase()) ?? tasks[i]
    if (!taskObj) return

    const match = taskObj.clientDomain
      ? items.find(item => item.type === 'organic' && item.url && domainOf(item.url) === taskObj.clientDomain)
      : undefined

    snapshots.push({
      user_id: taskObj.userId,
      client_id: taskObj.clientId,
      keyword: taskObj.keyword,
      position: match?.rank_absolute ?? null,
      url: match?.url ?? null,
      search_volume: null,
    })
  })

  if (snapshots.length > 0) {
    const { error } = await supabase.from('keyword_rankings').insert(snapshots)
    if (error) console.error('[RankingCron] DB insert error:', error.message)
  }

  console.log(`[RankingCron] Saved ${snapshots.length} snapshots`)
  return NextResponse.json({ checked: snapshots.length, clients: clients.length })
}
