import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildAuthUrl } from '@/lib/gmb'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const nonce = crypto.randomBytes(16).toString('hex')
  const state = Buffer.from(JSON.stringify({ clientId, userId: user.id, nonce, ts: Date.now() })).toString('base64url')

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/gmb/callback`
  const url = buildAuthUrl(redirectUri, state)

  return NextResponse.json({ url })
}
