import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get or create referral record
  let { data: ref } = await supabase
    .from('referrals')
    .select('code, referrals_count, credits_earned')
    .eq('user_id', user.id)
    .single()

  if (!ref) {
    const code = user.id.slice(0, 8).toUpperCase()
    const { data: newRef } = await supabase
      .from('referrals')
      .insert({ user_id: user.id, code, referrals_count: 0, credits_earned: 0 })
      .select()
      .single()
    ref = newRef
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online'
  const referralUrl = `${appUrl}/signup?ref=${ref?.code}`

  return NextResponse.json({ code: ref?.code, referralUrl, referralsCount: ref?.referrals_count ?? 0, creditsEarned: ref?.credits_earned ?? 0 })
}
