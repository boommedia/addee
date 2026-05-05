import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getConnectedPlatforms } from '@/lib/ayrshare'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) {
    return NextResponse.json({ error: 'clientId required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Get direct OAuth integrations
  const { data: directData } = await admin
    .from('client_integrations')
    .select('platform, platform_account_name, token_expires_at')
    .eq('client_id', clientId)

  const direct = (directData ?? []).map(d => ({
    platform: d.platform,
    name: d.platform_account_name,
    token_expires_at: d.token_expires_at,
  }))

  // Get Ayrshare profile key and connected platforms
  const { data: clientData } = await admin
    .from('clients')
    .select('ayrshare_profile_key')
    .eq('id', clientId)
    .single()

  let ayrshare: string[] = []
  if (clientData?.ayrshare_profile_key) {
    try {
      ayrshare = await getConnectedPlatforms(clientData.ayrshare_profile_key)
    } catch (err) {
      console.error('Failed to fetch Ayrshare platforms:', err)
    }
  }

  return NextResponse.json({ direct, ayrshare })
}
