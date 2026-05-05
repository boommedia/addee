import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const PLAN_LIMITS: Record<string, { posts_limit: number; sites_limit: number }> = {
  free:       { posts_limit: 2,    sites_limit: 2  },
  starter:    { posts_limit: 25,   sites_limit: 5  },
  growth:     { posts_limit: 50,   sites_limit: 10 },
  agency:     { posts_limit: 100,  sites_limit: 20 },
  agency_max: { posts_limit: 200,  sites_limit: 40 },
  internal:   { posts_limit: 9999, sites_limit: 9999 },
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, email, plan, stripeSubscriptionId, stripeCustomerId, currentPeriodEnd } = await request.json()
  if ((!userId && !email) || !plan || !PLAN_LIMITS[plan]) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Resolve userId from email if needed
  let targetUserId = userId
  if (!targetUserId && email) {
    const { data: { users }, error } = await admin.auth.admin.listUsers()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const match = users.find(u => u.email === email)
    if (!match) return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 })
    targetUserId = match.id
  }

  const limits = PLAN_LIMITS[plan]
  const values: Record<string, unknown> = {
    plan,
    status: plan === 'free' ? 'inactive' : 'active',
    posts_limit: limits.posts_limit,
    sites_limit: limits.sites_limit,
    updated_at: new Date().toISOString(),
  }
  if (stripeSubscriptionId) values.stripe_subscription_id = stripeSubscriptionId
  if (stripeCustomerId) values.stripe_customer_id = stripeCustomerId
  if (currentPeriodEnd) values.current_period_end = currentPeriodEnd

  const { data: existing } = await admin.from('subscriptions').select('id').eq('user_id', targetUserId).single()
  const { error } = existing
    ? await admin.from('subscriptions').update(values).eq('user_id', targetUserId)
    : await admin.from('subscriptions').insert({ user_id: targetUserId, ...values })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, userId: targetUserId, plan })
}
