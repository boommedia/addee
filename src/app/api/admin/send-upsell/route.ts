import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendUpsellEmail } from '@/lib/email'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, email, postsUsed, postsLimit } = await request.json()
  if (!userId || !email) {
    return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: { user: targetUser } } = await admin.auth.admin.getUserById(userId)
  const firstName = (targetUser?.user_metadata?.full_name as string) ?? null

  await sendUpsellEmail(email, firstName, postsUsed ?? 0, postsLimit ?? 2)

  return NextResponse.json({ ok: true })
}
