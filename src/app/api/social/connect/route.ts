import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProfile, generateConnectUrl } from '@/lib/ayrshare'

// GET /api/social/connect?clientId=xxx → returns the Social Connect URL for the client
// POST /api/social/connect { clientId } → creates the Ayrshare profile if needed, returns connect URL
export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, ayrshare_profile_key')
    .eq('id', clientId)
    .eq('created_by', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  let profileKey = client.ayrshare_profile_key as string | null

  // Create Ayrshare profile if this client doesn't have one yet
  if (!profileKey) {
    profileKey = await createProfile(client.name)
    await supabase
      .from('clients')
      .update({ ayrshare_profile_key: profileKey })
      .eq('id', clientId)
  }

  const connectUrl = await generateConnectUrl(profileKey)
  return NextResponse.json({ connectUrl, profileKey })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
