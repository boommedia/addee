import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns up to 10 snapshots per keyword, grouped by clientId → keyword
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clientId = req.nextUrl.searchParams.get('clientId')

  let query = supabase
    .from('keyword_rankings')
    .select('client_id, keyword, position, checked_at')
    .eq('user_id', user.id)
    .order('checked_at', { ascending: false })
    .limit(1000)

  if (clientId) query = query.eq('client_id', clientId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group: clientId → keyword → snapshots[] (most recent first, max 10)
  const grouped: Record<string, Record<string, { position: number | null; checked_at: string }[]>> = {}

  for (const row of data ?? []) {
    if (!grouped[row.client_id]) grouped[row.client_id] = {}
    if (!grouped[row.client_id][row.keyword]) grouped[row.client_id][row.keyword] = []
    const list = grouped[row.client_id][row.keyword]
    if (list.length < 10) {
      list.push({ position: row.position, checked_at: row.checked_at })
    }
  }

  return NextResponse.json({ history: grouped })
}
