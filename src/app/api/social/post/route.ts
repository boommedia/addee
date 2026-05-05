import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { postToSocial } from '@/lib/ayrshare'

// POST /api/social/post
// Body: { clientId, platforms: string[], text: string }
// Platforms: 'linkedin', 'facebook', 'instagram', 'gmb' (Google Business Profile)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, platforms, text } = await req.json() as {
    clientId: string
    platforms: string[]
    text: string
  }

  if (!clientId || !platforms?.length || !text?.trim()) {
    return NextResponse.json({ error: 'clientId, platforms, and text are required' }, { status: 400 })
  }

  // Look up client's Ayrshare profile key
  const { data: client } = await supabase
    .from('clients')
    .select('ayrshare_profile_key, name')
    .eq('id', clientId)
    .eq('created_by', user.id)
    .single()

  if (!client?.ayrshare_profile_key) {
    return NextResponse.json({ error: 'Social accounts not connected for this client. Go to Clients → connect social accounts first.' }, { status: 422 })
  }

  const result = await postToSocial(client.ayrshare_profile_key as string, text, platforms)
  return NextResponse.json(result)
}
