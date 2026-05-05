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
    name: 'Freelancer Starter',
    priceId: process.env.STRIPE_PRICE_STARTER!,
    annualPriceId: process.env.STRIPE_PRICE_STARTER_ANNUAL,
    posts: 20,
    sites: 5,
    price: 49,
    annualMonthlyPrice: 42,
  },
  growth: {
    name: 'Growth',
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    annualPriceId: process.env.STRIPE_PRICE_GROWTH_ANNUAL,
    posts: 60,
    sites: 15,
    price: 99,
    annualMonthlyPrice: 84,
  },
  agency: {
    name: 'Agency',
    priceId: process.env.STRIPE_PRICE_AGENCY!,
    annualPriceId: process.env.STRIPE_PRICE_AGENCY_ANNUAL,
    posts: 175,
    sites: 40,
    price: 149,
    annualMonthlyPrice: 127,
  },
  agency_max: {
    name: 'Agency Max',
    priceId: process.env.STRIPE_PRICE_AGENCY_MAX!,
    annualPriceId: process.env.STRIPE_PRICE_AGENCY_MAX_ANNUAL,
    posts: 500,
    sites: 150,
    price: 299,
    annualMonthlyPrice: 254,
  },
} as const

export type PlanKey = keyof typeof PLANS
