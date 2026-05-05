import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ platforms: [] })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ platforms: [] })

  const { data } = await supabase
    .from('client_integrations')
    .select('platform, platform_account_name, token_expires_at')
    .eq('client_id', clientId)

  const platforms = (data ?? []).map(r => ({
    platform: r.platform,
    platform_account_name: r.platform_account_name,
    token_expires_at: r.token_expires_at
  }))
  return NextResponse.json({ platforms })
}

export async function DELETE(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId')
  const platform = req.nextUrl.searchParams.get('platform')

  if (!clientId || !platform) {
    return NextResponse.json({ error: 'clientId and platform required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user owns this client
  const { data: clientData } = await supabase
    .from('clients')
    .select('id')
    .eq('id', clientId)
    .eq('user_id', user.id)
    .single()

  if (!clientData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Delete the integration
  const { error } = await supabase
    .from('client_integrations')
    .delete()
    .eq('client_id', clientId)
    .eq('platform', platform)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
