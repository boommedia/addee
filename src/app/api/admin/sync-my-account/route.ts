import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// One-time endpoint to sync eric@bloggy.online Stripe subscription into Supabase
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()

  const values = {
    plan: 'agency',
    status: 'active',
    posts_limit: 80,
    sites_limit: 20,
    stripe_subscription_id: 'sub_1TOSzKKnTmqeO7PSTuBjEuOf',
    stripe_customer_id: 'cus_UNDP7eucfWeKSH',
    current_period_end: '2026-05-20T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await admin
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { error } = existing
    ? await admin.from('subscriptions').update(values).eq('user_id', user.id)
    : await admin.from('subscriptions').insert({ user_id: user.id, ...values })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, plan: 'agency', message: 'Subscription synced to Agency plan with 80% discount' })
}
