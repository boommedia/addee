import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail, sendPlanUpgradeEmail, sendCancellationEmail } from '@/lib/email'
import type Stripe from 'stripe'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function planFromSubscription(sub: Stripe.Subscription): { plan: PlanKey; posts: number; sites: number } {
  const priceId = sub.items.data[0]?.price.id
  for (const [key, config] of Object.entries(PLANS)) {
    if (config.priceId === priceId) {
      return { plan: key as PlanKey, posts: config.posts, sites: config.sites }
    }
  }
  return { plan: 'starter', posts: 20, sites: 5 }
}

function monthlyAmountFromSubscription(sub: Stripe.Subscription): number {
  const unitAmount = sub.items.data[0]?.price.unit_amount ?? 0 // cents
  const coupon = (sub as any).discount?.coupon
  let amount = unitAmount
  if (coupon?.percent_off) {
    amount = Math.round(unitAmount * (1 - coupon.percent_off / 100))
  } else if (coupon?.amount_off) {
    amount = Math.max(0, unitAmount - coupon.amount_off)
  }
  return amount / 100 // convert to dollars
}

async function getUserEmail(userId: string): Promise<string | null> {
  const { data } = await supabase.auth.admin.getUserById(userId)
  return data.user?.email ?? null
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    // For invoice events the object is an Invoice, not a Subscription
    const isInvoiceEvent = event.type.startsWith('invoice.')
    const sub = event.data.object as Stripe.Subscription
    const subId = isInvoiceEvent
      ? (() => {
          const s = (event.data.object as any).subscription
          if (typeof s === 'string') return s
          if (s && typeof s === 'object') return (s as Stripe.Subscription).id ?? null
          return null
        })()
      : sub.id

    let userId = sub.metadata?.supabase_user_id

    // Fallback: look up user by stripe_customer_id if metadata is missing
    if (!userId) {
      const customerId = sub.customer as string
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()
      if (existing?.user_id) {
        userId = existing.user_id
      }
    }

    // Second fallback: look up via Stripe customer metadata
    if (!userId) {
      try {
        const customer = await stripe.customers.retrieve(sub.customer as string)
        if (!customer.deleted) userId = (customer as Stripe.Customer).metadata?.supabase_user_id
      } catch { /* ignore */ }
    }

    if (!userId) return NextResponse.json({ received: true })

    // One-time credit pack purchase
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      if (session.mode === 'payment' && session.metadata?.credit_amount) {
        const creditAmount = parseInt(session.metadata.credit_amount, 10)
        const sessionUserId = session.metadata?.supabase_user_id ?? userId
        if (sessionUserId && creditAmount > 0) {
          // Upsert user_credits row
          const { data: existing } = await supabase.from('user_credits').select('balance').eq('user_id', sessionUserId).single()
          if (existing) {
            await supabase.from('user_credits').update({ balance: existing.balance + creditAmount, updated_at: new Date().toISOString() }).eq('user_id', sessionUserId)
          } else {
            await supabase.from('user_credits').insert({ user_id: sessionUserId, balance: creditAmount, updated_at: new Date().toISOString() })
          }
          // Log transaction
          void supabase.from('credit_transactions').insert({
            user_id: sessionUserId,
            amount: creditAmount,
            type: 'purchase',
            description: session.metadata?.pack_label ?? `${creditAmount} credits purchased`,
          })
        }
      }
      return NextResponse.json({ received: true })
    }

    switch (event.type) {
      case 'customer.subscription.created': {
        const { plan, posts, sites } = planFromSubscription(sub)
        const values = {
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
          plan,
          status: sub.status,
          posts_limit: posts,
          sites_limit: sites,
          monthly_amount: monthlyAmountFromSubscription(sub),
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }
        const { data: existing } = await supabase.from('subscriptions').select('id').eq('user_id', userId).single()
        if (existing) {
          await supabase.from('subscriptions').update(values).eq('user_id', userId)
        } else {
          await supabase.from('subscriptions').insert({ user_id: userId, ...values })
        }
        const email = await getUserEmail(userId)
        if (email) await sendWelcomeEmail(email, plan)
        break
      }
      case 'customer.subscription.updated': {
        const { plan, posts, sites } = planFromSubscription(sub)
        const { data: existing } = await supabase.from('subscriptions').select('id, plan').eq('user_id', userId).single()
        const values = {
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
          plan,
          status: sub.status,
          posts_limit: posts,
          sites_limit: sites,
          monthly_amount: monthlyAmountFromSubscription(sub),
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }
        if (existing) {
          await supabase.from('subscriptions').update(values).eq('user_id', userId)
        } else {
          await supabase.from('subscriptions').insert({ user_id: userId, ...values })
        }
        if (existing?.plan && existing.plan !== plan) {
          const email = await getUserEmail(userId)
          if (email) await sendPlanUpgradeEmail(email, plan)
        }
        break
      }
      case 'customer.subscription.deleted': {
        await supabase.from('subscriptions').update({
          status: 'canceled',
          plan: 'free',
          posts_limit: 2,
          sites_limit: 2,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId)
        const email = await getUserEmail(userId)
        if (email) await sendCancellationEmail(email)
        break
      }
      case 'invoice.payment_failed': {
        if (subId) {
          await supabase.from('subscriptions').update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', subId)
        }
        break
      }
      case 'invoice.paid': {
        if (subId) {
          const stripeSub = await stripe.subscriptions.retrieve(subId)
          const { plan, posts, sites } = planFromSubscription(stripeSub)
          await supabase.from('subscriptions').update({
            status: 'active',
            plan,
            posts_limit: posts,
            sites_limit: sites,
            monthly_amount: monthlyAmountFromSubscription(stripeSub),
            current_period_start: new Date((stripeSub as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((stripeSub as any).current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', subId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ received: true })
  }
}
