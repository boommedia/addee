import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, couponId, promoCodeId, addonPriceId, addonName, interval } = await request.json() as {
    plan?: PlanKey; couponId?: string; promoCodeId?: string
    addonPriceId?: string; addonName?: string; interval?: 'monthly' | 'annual'
  }

  // Add-on checkout path — bypasses plan lookup
  if (addonPriceId) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()
    let customerId = sub?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } })
      customerId = customer.id
    }
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online').replace(/\/$/, '')
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: addonPriceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${appUrl}/billing?addon_success=1`,
      cancel_url: `${appUrl}/billing`,
      subscription_data: { metadata: { supabase_user_id: user.id, addon: addonName ?? addonPriceId } },
    })
    return NextResponse.json({ url: session.url })
  }

  const planConfig = PLANS[plan!]
  if (!planConfig) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const useAnnual = interval === 'annual' && planConfig.annualPriceId
  const selectedPriceId = useAnnual ? planConfig.annualPriceId! : planConfig.priceId

  // Get or create Stripe customer
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online').replace(/\/$/, '')

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      // Prefer promotion_code so Stripe tracks redemptions; fall back to coupon ID
      ...(promoCodeId
        ? { discounts: [{ promotion_code: promoCodeId }] }
        : couponId
        ? { discounts: [{ coupon: couponId }] }
        : { allow_promotion_codes: true }),
      success_url: `${appUrl}/billing?success=1`,
      cancel_url: `${appUrl}/billing`,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan: plan ?? '' },
        // 7-day free trial on Starter only, and only without a coupon (coupon users skip trial)
        ...(plan === 'starter' && !couponId ? { trial_period_days: 7 } : {}),
      },
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
