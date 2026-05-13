import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER!,
    annualPriceId: process.env.STRIPE_PRICE_STARTER_ANNUAL,
    posts: 25,
    sites: 3,
    price: 29,
    annualMonthlyPrice: 23,
  },
  growth: {
    name: 'Growth',
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    annualPriceId: process.env.STRIPE_PRICE_GROWTH_ANNUAL,
    posts: 100,
    sites: 10,
    price: 79,
    annualMonthlyPrice: 63,
  },
  agency: {
    name: 'Agency',
    priceId: process.env.STRIPE_PRICE_AGENCY!,
    annualPriceId: process.env.STRIPE_PRICE_AGENCY_ANNUAL,
    posts: 9999,
    sites: 9999,
    price: 199,
    annualMonthlyPrice: 159,
  },
} as const

export type PlanKey = keyof typeof PLANS
