import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export const CREDIT_PACKS = [
  { id: 'credits_10',  credits: 10,  price: 700,   label: 'Starter Pack',  priceEnv: 'STRIPE_PRICE_CREDITS_10'  },
  { id: 'credits_50',  credits: 50,  price: 2900,  label: 'Power Pack',    priceEnv: 'STRIPE_PRICE_CREDITS_50'  },
  { id: 'credits_150', credits: 150, price: 6900,  label: 'Agency Pack',   priceEnv: 'STRIPE_PRICE_CREDITS_150' },
] as const

export type CreditPackId = typeof CREDIT_PACKS[number]['id']

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { packId } = await request.json() as { packId: CreditPackId }
  const pack = CREDIT_PACKS.find(p => p.id === packId)
  if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })

  const priceId = process.env[pack.priceEnv]
  if (!priceId) return NextResponse.json({ error: 'Credit pack not configured' }, { status: 500 })

  // Get or create Stripe customer
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
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?credits_success=1`,
    cancel_url: `${appUrl}/billing`,
    metadata: {
      supabase_user_id: user.id,
      credit_amount: String(pack.credits),
      pack_label: pack.label,
    },
  })

  return NextResponse.json({ url: session.url })
}
