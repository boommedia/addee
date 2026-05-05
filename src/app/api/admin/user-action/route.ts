import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, action } = await request.json()
  if (!userId || !action) {
    return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (action === 'delete') {
    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    // Clean up subscription row too
    await admin.from('subscriptions').delete().eq('user_id', userId)
    return NextResponse.json({ ok: true })
  }

  if (action === 'reset-password') {
    const { data: userData } = await admin.auth.admin.getUserById(userId)
    const email = userData.user?.email
    if (!email) return NextResponse.json({ error: 'User has no email' }, { status: 400 })
    const { error } = await admin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online'}/reset-password`,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'ban' || action === 'suspend') {
    const { error } = await admin.auth.admin.updateUserById(userId, { ban_duration: '87600h' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'unban' || action === 'unsuspend') {
    const { error } = await admin.auth.admin.updateUserById(userId, { ban_duration: 'none' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
