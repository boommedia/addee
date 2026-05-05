import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

// All 24 reports synced from Local Falcon on 2026-04-22 via Claude MCP
// Update by asking Claude: "sync my Local Falcon data to Supabase"
const CACHED_REPORTS = [
  { report_key: '86994146a317946', date: '4/16/2026 7:55 AM', keyword: 'best movers palm beach gardens', location: { name: 'Castle Moving & Delivery' }, arp: 21.00, atrp: 21.00, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '10713ae268f336d', date: '4/16/2026 7:55 AM', keyword: 'best long distance moving companies west palm beach', location: { name: 'Castle Moving & Delivery' }, arp: 21.00, atrp: 21.00, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '9a5b632c95ee85e', date: '4/16/2026 7:55 AM', keyword: 'best palm beach moving company', location: { name: 'Castle Moving & Delivery' }, arp: 21.00, atrp: 21.00, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: 'ebe4f6b0970336e', date: '4/16/2026 7:55 AM', keyword: 'affordable movers west palm beach', location: { name: 'Castle Moving & Delivery' }, arp: 12.60, atrp: 20.14, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '0d9ec9f7ea99795', date: '4/16/2026 5:56 AM', keyword: 'bail bonds near me', location: { name: "Big Mike's Bail Bonds" }, arp: 15.25, atrp: 15.74, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '74ef824156c344d', date: '4/16/2026 5:56 AM', keyword: 'online bail bonds florida', location: { name: "Big Mike's Bail Bonds" }, arp: 3.29, atrp: 3.80, solv: 62.86, grid_size: 7, platform: 'google' },
  { report_key: '53450a092152f02', date: '4/16/2026 5:56 AM', keyword: 'bail bondsman west palm beach', location: { name: "Big Mike's Bail Bonds" }, arp: 14.06, atrp: 14.06, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '9b088895181c69e', date: '4/16/2026 5:56 AM', keyword: 'bail bonds west palm beach', location: { name: "Big Mike's Bail Bonds" }, arp: 13.51, atrp: 13.51, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '4c0be15a76c137f', date: '4/16/2026 5:56 AM', keyword: 'bail bonds', location: { name: "Big Mike's Bail Bonds" }, arp: 13.37, atrp: 13.37, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '0db0478b0fd13fb', date: '4/16/2026 5:13 AM', keyword: 'cuban restaurant', location: { name: 'Guarapos Cuban Cuisine' }, arp: 1.93, atrp: 1.93, solv: 79.55, grid_size: 7, platform: 'google' },
  { report_key: 'd92f5ae112e66fe', date: '4/16/2026 5:13 AM', keyword: 'authentic cuban food boynton beach', location: { name: 'Guarapos Cuban Cuisine' }, arp: 1.00, atrp: 1.00, solv: 100.00, grid_size: 7, platform: 'google' },
  { report_key: '2f2f9f2755b2e40', date: '4/16/2026 5:13 AM', keyword: 'cuban restaurants near me', location: { name: 'Guarapos Cuban Cuisine' }, arp: 2.33, atrp: 2.75, solv: 68.18, grid_size: 7, platform: 'google' },
  { report_key: 'cccb87988bc9b09', date: '4/16/2026 5:13 AM', keyword: 'cuban food near me', location: { name: 'Guarapos Cuban Cuisine' }, arp: 2.59, atrp: 2.59, solv: 72.73, grid_size: 7, platform: 'google' },
  { report_key: '9ef5113cc898e86', date: '4/13/2026 6:39 AM', keyword: 'auto accident lawyers near me', location: { name: 'RHOADS LAW GROUP, P.A.' }, arp: 6.00, atrp: 20.69, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '932c1dd0e7b02bf', date: '4/2/2026 8:24 AM', keyword: 'don ramon restaurant', location: { name: 'Don Ramon Wellington' }, arp: 2.20, atrp: 2.20, solv: 92.00, grid_size: 5, platform: 'google' },
  { report_key: 'd27a8ffc656c90e', date: '4/2/2026 8:24 AM', keyword: 'don ramon', location: { name: 'Don Ramon Wellington' }, arp: 2.12, atrp: 2.12, solv: 92.00, grid_size: 5, platform: 'google' },
  { report_key: '10da7cd60c25fc2', date: '4/2/2026 8:24 AM', keyword: 'best cuban food', location: { name: 'Don Ramon Wellington' }, arp: 7.12, atrp: 11.56, solv: 20.00, grid_size: 5, platform: 'google' },
  { report_key: 'dabc64c301c20ca', date: '4/2/2026 8:24 AM', keyword: 'cuban restaurant', location: { name: 'Don Ramon Wellington' }, arp: 5.29, atrp: 10.32, solv: 36.00, grid_size: 5, platform: 'google' },
  { report_key: '7c0c7d6b0e20981', date: '3/13/2026 6:39 AM', keyword: 'auto accident lawyers near me', location: { name: 'RHOADS LAW GROUP, P.A.' }, arp: 4.00, atrp: 20.65, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: '043439bb2927ac0', date: '2/15/2026 9:12 AM', keyword: 'local electricians near me', location: { name: 'AV2E Electrical Services' }, arp: 1.00, atrp: 20.13, solv: 4.35, grid_size: 7, platform: 'google' },
  { report_key: '4c1d45fc617149f', date: '2/15/2026 9:12 AM', keyword: 'emergency electrician', location: { name: 'AV2E Electrical Services' }, arp: 9.50, atrp: 20.00, solv: 4.35, grid_size: 7, platform: 'google' },
  { report_key: '6ac2c50f3d9dff5', date: '2/15/2026 9:12 AM', keyword: 'electrician services', location: { name: 'AV2E Electrical Services' }, arp: 9.50, atrp: 20.00, solv: 4.35, grid_size: 7, platform: 'google' },
  { report_key: 'c93cfea760abeae', date: '2/13/2026 6:39 AM', keyword: 'slip and fall attorney near me', location: { name: 'RHOADS LAW GROUP, P.A.' }, arp: 21.00, atrp: 21.00, solv: 0.00, grid_size: 7, platform: 'google' },
  { report_key: 'a12ea3eecdd608a', date: '2/13/2026 6:39 AM', keyword: 'auto accident lawyers near me', location: { name: 'RHOADS LAW GROUP, P.A.' }, arp: 14.00, atrp: 20.86, solv: 0.00, grid_size: 7, platform: 'google' },
]

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  const plan = (sub?.status === 'active' ? sub?.plan : 'free') ?? 'free'
  if (!['agency', 'agency_max'].includes(plan)) {
    return NextResponse.json({ configured: false, reason: 'upgrade' }, { status: 403 })
  }

  // Try Supabase cache first (populated by Claude MCP sync)
  try {
    const { data, error } = await supabase
      .from('local_falcon_scans')
      .select('report_key, scan_date, keyword, location_name, arp, atrp, solv, grid_size, platform')
      .order('scan_date', { ascending: false })

    if (!error && data && data.length > 0) {
      const reports = data.map(r => ({
        report_key: r.report_key,
        date: new Date(r.scan_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        keyword: r.keyword,
        location: { name: r.location_name },
        arp: r.arp,
        atrp: r.atrp,
        solv: r.solv,
        grid_size: r.grid_size,
        platform: r.platform,
      }))
      return NextResponse.json({ configured: true, reports, source: 'supabase' })
    }
  } catch {
    // fall through to cached data
  }

  // Fallback: return last-known data cached in the route
  return NextResponse.json({ configured: true, reports: CACHED_REPORTS, source: 'cache' })
}
