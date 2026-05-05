import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getConnectedPlatforms } from '@/lib/ayrshare'

// GET /api/social/profiles?clientId=xxx → returns connected platforms for a client
export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ platforms: [] })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('ayrshare_profile_key')
    .eq('id', clientId)
    .eq('created_by', user.id)
    .single()

  if (!client?.ayrshare_profile_key) {
    return NextResponse.json({ platforms: [], connected: false })
  }

  const platforms = await getConnectedPlatforms(client.ayrshare_profile_key as string)
  return NextResponse.json({ platforms, connected: platforms.length > 0 })
}
