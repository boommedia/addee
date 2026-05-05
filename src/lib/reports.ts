import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export interface MonthlyReportData {
  postsCount: number
  postsWordCount: number
  gscImpressions: number
  gscClicks: number
  gscCtr: number
  gscAvgPosition: number
  impressionsDelta: number | null
  clicksDelta: number | null
  ctrDelta: number | null
  positionDelta: number | null
}

/**
 * Get posts published in a specific month
 */
export async function getMonthlyPosts(
  clientId: string,
  month: Date // first day of month
) {
  const supabase = await createClient()
  const start = startOfMonth(month)
  const end = endOfMonth(month)

  const { data, error } = await supabase
    .from('posts')
    .select('id, word_count')
    .eq('client_id', clientId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  if (error) throw error
  return data || []
}

/**
 * Get aggregated GSC data for a month (by client's site_url)
 */
export async function getMonthlyGscData(
  userId: string,
  clientId: string,
  siteUrl: string,
  month: Date
) {
  const supabase = await createClient()
  const start = startOfMonth(month)
  const end = endOfMonth(month)

  const { data, error } = await supabase
    .from('gsc_data')
    .select('clicks, impressions, ctr, position')
    .eq('user_id', userId)
    .eq('site_url', siteUrl)
    .gte('date_start', start.toISOString().split('T')[0])
    .lte('date_end', end.toISOString().split('T')[0])

  if (error) throw error

  // Aggregate: sum clicks/impressions, avg CTR and position
  const rows = data || []
  if (rows.length === 0) {
    return {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      avgPosition: 0,
    }
  }

  const totalClicks = rows.reduce((sum, r) => sum + (r.clicks || 0), 0)
  const totalImpressions = rows.reduce((sum, r) => sum + (r.impressions || 0), 0)
  const avgCtr = rows.reduce((sum, r) => sum + (r.ctr || 0), 0) / rows.length
  const avgPosition = rows.reduce((sum, r) => sum + (r.position || 0), 0) / rows.length

  return {
    clicks: totalClicks,
    impressions: totalImpressions,
    ctr: parseFloat(avgCtr.toFixed(4)),
    avgPosition: parseFloat(avgPosition.toFixed(2)),
  }
}

/**
 * Generate complete monthly report data for a client
 */
export async function generateMonthlyReportData(
  userId: string,
  clientId: string,
  siteUrl: string,
  month: Date
): Promise<MonthlyReportData> {
  const posts = await getMonthlyPosts(clientId, month)
  const currentMonth = await getMonthlyGscData(userId, clientId, siteUrl, month)
  const priorMonth = await getMonthlyGscData(userId, clientId, siteUrl, subMonths(month, 1))

  const postsCount = posts.length
  const postsWordCount = posts.reduce((sum, p) => sum + (p.word_count || 0), 0)

  return {
    postsCount,
    postsWordCount,
    gscImpressions: currentMonth.impressions,
    gscClicks: currentMonth.clicks,
    gscCtr: currentMonth.ctr,
    gscAvgPosition: currentMonth.avgPosition,
    impressionsDelta: currentMonth.impressions - priorMonth.impressions,
    clicksDelta: currentMonth.clicks - priorMonth.clicks,
    ctrDelta: parseFloat((currentMonth.ctr - priorMonth.ctr).toFixed(4)),
    positionDelta: parseFloat((currentMonth.avgPosition - priorMonth.avgPosition).toFixed(2)),
  }
}
