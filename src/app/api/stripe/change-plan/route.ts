import { NextResponse } from 'next/server'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, couponId } = await request.json()
  if (!plan || !(plan in PLANS)) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, stripe_customer_id, plan')
    .eq('user_id', user.id)
    .single()

  if (sub?.plan === plan) {
    return NextResponse.json({ error: 'Already on this plan' }, { status: 400 })
  }

  // Resolve stripe subscription ID — prefer stored value, fall back to lookup by email
  let stripeSubId: string | null = sub?.stripe_subscription_id ?? null

  if (!stripeSubId) {
    // Try by stored customer ID first
    let customerId = sub?.stripe_customer_id ?? null

    if (!customerId && user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 10 })
      // Find a customer with an active subscription
      for (const c of customers.data) {
        const subs = await stripe.subscriptions.list({ customer: c.id, status: 'active', limit: 1 })
        if (subs.data.length) {
          customerId = c.id
          stripeSubId = subs.data[0].id
          break
        }
      }
    } else if (customerId) {
      const subs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 })
      if (subs.data.length) stripeSubId = subs.data[0].id
    }
  }

  if (!stripeSubId) {
    return NextResponse.json({ error: 'No active Stripe subscription found. Please subscribe first.' }, { status: 400 })
  }

  try {
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubId)
    const itemId = stripeSub.items.data[0]?.id
    if (!itemId) return NextResponse.json({ error: 'Could not find subscription item' }, { status: 400 })

    const updateParams: Parameters<typeof stripe.subscriptions.update>[1] = {
      items: [{ id: itemId, price: PLANS[plan as PlanKey].priceId }],
      proration_behavior: 'create_prorations',
    }

    if (couponId) {
      updateParams.discounts = [{ coupon: couponId }]
    }

    await stripe.subscriptions.update(stripeSubId, updateParams)

    // Persist the resolved stripe_subscription_id so future calls are fast
    await supabase
      .from('subscriptions')
      .update({ stripe_subscription_id: stripeSubId })
      .eq('user_id', user.id)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Stripe error' }, { status: 500 })
  }
}
