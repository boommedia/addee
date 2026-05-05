import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Extend Vercel function timeout to 60s (Pro plan) — SERP API can be slow for large batches
export const maxDuration = 60

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

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const auth = dfsAuth()
  console.log('[DFS] auth configured:', !!auth)
  if (!auth) return NextResponse.json({ configured: false })

  const clientId = req.nextUrl.searchParams.get('clientId')
  const debug = req.nextUrl.searchParams.get('debug') === '1'

  // Fetch clients (one or all)
  const baseQ = supabase
    .from('clients')
    .select('id, name, website, target_keywords')
    .eq('created_by', user.id)
  const { data: clients } = await (clientId ? baseQ.eq('id', clientId) : baseQ)

  if (!clients || clients.length === 0) {
    return NextResponse.json({ configured: true, results: [] })
  }

  // Build keyword tasks — one per (client, keyword)
  type Task = { clientId: string; clientName: string; clientDomain: string; keyword: string }
  const tasks: Task[] = []

  for (const client of clients) {
    if (!client.target_keywords) continue
    const domain = client.website ? domainOf(client.website) : ''
    const kws = (client.target_keywords as string)
      .split(',')
      .map((k: string) => k.trim())
      .filter(Boolean)
    for (const kw of kws) {
      tasks.push({ clientId: client.id, clientName: client.name, clientDomain: domain, keyword: kw })
    }
  }

  if (tasks.length === 0) {
    return NextResponse.json({ configured: true, results: [] })
  }

  console.log('[DFS] total tasks:', tasks.length)

  // SERP API — batch all keywords
  const serpPayload = tasks.map(t => ({
    keyword: t.keyword,
    language_code: 'en',
    location_code: 2840, // United States
    depth: 100,
    se_domain: 'google.com',
  }))

  const serpResults: Record<string, { rank: number | null; url: string | null }> = {}
  let serpRaw: unknown = null
  let serpError: string | null = null

  try {
    const serpRes = await fetch(`${DFS_BASE}/serp/google/organic/live/regular`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(serpPayload),
    })
    const serpData = await serpRes.json()
    if (debug) serpRaw = serpData

    console.log('[DFS SERP] status:', serpRes.status, 'tasks:', serpData?.tasks?.length, 'error:', serpData?.tasks?.[0]?.status_message)

    if (!serpRes.ok) {
      serpError = `SERP HTTP ${serpRes.status}: ${JSON.stringify(serpData).slice(0, 300)}`
    } else {
      const taskResults: {
        data?: { keyword?: string }
        result?: { items?: { rank_absolute?: number; url?: string; type?: string }[] }[]
      }[] = serpData?.tasks ?? []

      taskResults.forEach((task, i) => {
        const kwRaw = task?.data?.keyword ?? tasks[i]?.keyword ?? ''
        const items = task?.result?.[0]?.items ?? []

        // Find the matching task (case-insensitive keyword match, fallback to index)
        const taskObj = tasks.find(t => t.keyword.toLowerCase() === kwRaw.toLowerCase()) ?? tasks[i]
        if (!taskObj) return

        const domain = taskObj.clientDomain
        const key = `${taskObj.clientId}__${taskObj.keyword}`

        if (!domain) {
          serpResults[key] = { rank: null, url: null }
          return
        }

        const match = items.find(
          item => item.type === 'organic' && item.url && domainOf(item.url) === domain
        )
        serpResults[key] = { rank: match?.rank_absolute ?? null, url: match?.url ?? null }
      })
    }
  } catch (e) {
    serpError = e instanceof Error ? e.message : String(e)
    console.log('[DFS SERP ERROR]', serpError)
  }

  // Keywords Data API — search volumes
  const allKeywords = [...new Set(tasks.map(t => t.keyword))]
  const volumeMap: Record<string, number | null> = {}
  let volRaw: unknown = null
  let volError: string | null = null

  try {
    const volRes = await fetch(`${DFS_BASE}/keywords_data/google_ads/search_volume/live`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ keywords: allKeywords, language_code: 'en', location_code: 2840 }]),
    })
    const volData = await volRes.json()
    if (debug) volRaw = volData

    console.log('[DFS VOL] status:', volRes.status, 'results:', volData?.tasks?.[0]?.result_count, 'error:', volData?.tasks?.[0]?.status_message)

    if (!volRes.ok) {
      volError = `Volume HTTP ${volRes.status}: ${JSON.stringify(volData).slice(0, 300)}`
    } else {
      const items: { keyword?: string; search_volume?: number }[] =
        volData?.tasks?.[0]?.result ?? []
      for (const item of items) {
        if (item.keyword) {
          // Store lowercase key for case-insensitive lookup
          volumeMap[item.keyword.toLowerCase()] = item.search_volume ?? null
        }
      }
    }
  } catch (e) {
    volError = e instanceof Error ? e.message : String(e)
    console.log('[DFS VOL ERROR]', volError)
  }

  // Assemble per-client results
  type ClientResult = {
    clientId: string
    clientName: string
    clientDomain: string
    keywords: { keyword: string; rank: number | null; url: string | null; searchVolume: number | null }[]
  }
  const resultMap: Record<string, ClientResult> = {}

  for (const task of tasks) {
    if (!resultMap[task.clientId]) {
      resultMap[task.clientId] = {
        clientId: task.clientId,
        clientName: task.clientName,
        clientDomain: task.clientDomain,
        keywords: [],
      }
    }
    const sr = serpResults[`${task.clientId}__${task.keyword}`]
    resultMap[task.clientId].keywords.push({
      keyword: task.keyword,
      rank: sr?.rank ?? null,
      url: sr?.url ?? null,
      searchVolume: volumeMap[task.keyword.toLowerCase()] ?? null,
    })
  }

  // Persist snapshots to DB (non-blocking — don't fail the response if this errors)
  const snapshots = []
  for (const result of Object.values(resultMap)) {
    for (const kw of result.keywords) {
      snapshots.push({
        user_id: user.id,
        client_id: result.clientId,
        keyword: kw.keyword,
        position: kw.rank,
        url: kw.url,
        search_volume: kw.searchVolume,
      })
    }
  }
  if (snapshots.length > 0) {
    supabase.from('keyword_rankings').insert(snapshots).then(() => {})
  }

  const response: Record<string, unknown> = {
    configured: true,
    results: Object.values(resultMap),
    savedAt: new Date().toISOString(),
  }

  if (debug) {
    response.debug = { serpError, volError, serpRaw, volRaw, volumeMapKeys: Object.keys(volumeMap) }
  } else if (serpError || volError) {
    response.warnings = { serpError, volError }
  }

  return NextResponse.json(response)
}
