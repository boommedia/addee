import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only send once — check user_metadata flag
  if (user.user_metadata?.welcome_sent) {
    return NextResponse.json({ skipped: true })
  }

  const plan = (await supabase.from('subscriptions').select('plan').eq('user_id', user.id).single())?.data?.plan ?? 'free'

  if (user.email) {
    await sendWelcomeEmail(user.email, plan)
  }

  await supabase.auth.updateUser({ data: { welcome_sent: true } })

  return NextResponse.json({ sent: true })
}
