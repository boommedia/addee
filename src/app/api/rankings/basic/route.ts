import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type BasicRankingRow = {
  keyword: string
  position: number | null
  gscPosition: number | null
  clicks: number | null
  impressions: number | null
  ctr: number | null
  searchVolume: number | null
  url: string | null
  lastChecked: string | null
  source: 'gsc' | 'dataforseo' | 'both'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    const clientId = request.nextUrl.searchParams.get('clientId')

    const rows: BasicRankingRow[] = []
    const keywordMap = new Map<string, BasicRankingRow>()

    // Check if GSC is connected
    const { data: gscTokens } = await serviceClient
      .from('gsc_tokens')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    const gscConnected = (gscTokens?.length ?? 0) > 0

    // Fetch GSC data
    if (gscConnected) {
      let gscQuery = serviceClient
        .from('gsc_data')
        .select('query, clicks, impressions, ctr, position')
        .eq('user_id', userId)

      if (clientId) {
        gscQuery = gscQuery.eq('client_id', clientId)
      }

      const { data: gscData } = await gscQuery.limit(500)

      if (gscData) {
        const aggregated = new Map<string, { clicks: number; impressions: number; ctr: number; position: number }>()

        gscData.forEach((row) => {
          const key = (row.query || '').toLowerCase()
          if (!key) return

          const current = aggregated.get(key) || { clicks: 0, impressions: 0, ctr: 0, position: 0 }
          aggregated.set(key, {
            clicks: (current.clicks || 0) + (row.clicks || 0),
            impressions: (current.impressions || 0) + (row.impressions || 0),
            ctr: Math.max(current.ctr || 0, row.ctr || 0),
            position: row.position ? Math.min(current.position || Infinity, row.position) : current.position,
          })
        })

        aggregated.forEach((agg, key) => {
          keywordMap.set(key, {
            keyword: key,
            position: null,
            gscPosition: agg.position || null,
            clicks: agg.clicks || null,
            impressions: agg.impressions || null,
            ctr: agg.ctr || null,
            searchVolume: null,
            url: null,
            lastChecked: null,
            source: 'gsc',
          })
        })
      }
    }

    // Fetch DataForSEO keyword rankings
    let dfQuery = serviceClient
      .from('keyword_rankings')
      .select('keyword, position, url, search_volume, checked_at')
      .eq('user_id', userId)
      .order('checked_at', { ascending: false })

    if (clientId) {
      dfQuery = dfQuery.eq('client_id', clientId)
    }

    const { data: dfData } = await dfQuery.limit(500)

    if (dfData) {
      const latestByKeyword = new Map<string, (typeof dfData)[0]>()

      dfData.forEach((row) => {
        const key = (row.keyword || '').toLowerCase()
        if (!key) return

        if (!latestByKeyword.has(key)) {
          latestByKeyword.set(key, row)
        }
      })

      latestByKeyword.forEach((row, key) => {
        if (keywordMap.has(key)) {
          const existing = keywordMap.get(key)!
          keywordMap.set(key, {
            ...existing,
            position: row.position || existing.position,
            searchVolume: row.search_volume || existing.searchVolume,
            url: row.url || existing.url,
            lastChecked: row.checked_at || existing.lastChecked,
            source: 'both',
          })
        } else {
          keywordMap.set(key, {
            keyword: key,
            position: row.position || null,
            gscPosition: null,
            clicks: null,
            impressions: null,
            ctr: null,
            searchVolume: row.search_volume || null,
            url: row.url || null,
            lastChecked: row.checked_at || null,
            source: 'dataforseo',
          })
        }
      })
    }

    // Convert to array and sort
    const hasDataForSeo = (dfData?.length ?? 0) > 0

    const keywords = Array.from(keywordMap.values())
      .sort((a, b) => {
        const posA = a.position ?? 999
        const posB = b.position ?? 999
        if (posA !== posB) return posA - posB
        return (b.clicks ?? 0) - (a.clicks ?? 0)
      })
      .slice(0, 200)

    return NextResponse.json({
      gscConnected,
      hasDataForSeo,
      keywords,
    })
  } catch (error) {
    console.error('Error in /api/rankings/basic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
