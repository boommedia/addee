'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Lock, Zap, Users } from 'lucide-react'

// TODO: Replace with your AdDee Stripe coupon ID (create at dashboard.stripe.com/coupons)
// Set max_redemptions: 20, percent_off: 50, duration: repeating, duration_in_months: 12
const COUPON_ID = 'ADDEE_COUPON_ID'
const PROMO_CODE = 'EARLY50'

type CouponData = {
  valid: boolean
  percent_off: number | null
  times_redeemed: number
  max_redemptions: number | null
  name: string | null
}

const EARLY_PRICES = [
  { name: 'Starter', original: 29, brands: 5, ads: 50, description: 'Perfect for freelancers. AI AD generation + all platforms + brand voice training.' },
  { name: 'Growth', original: 79, brands: 15, ads: 150, description: 'Agencies scaling up. Team collaboration, approval workflows, priority support.' },
  { name: 'Agency', original: 149, brands: 40, ads: 400, description: 'Full-service agencies. 10 users, performance analytics, Slack support.' },
  { name: 'Agency Max', original: 299, brands: 100, ads: 1000, description: 'Enterprise teams. White-label, custom integrations, dedicated account manager.' },
]

export default function EarlyAccessSection() {
  const [coupon, setCoupon] = useState<CouponData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/stripe/coupon?id=${COUPON_ID}`)
      .then(r => r.json())
      .then(data => { setCoupon(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Hide section entirely if coupon couldn't be fetched — never show "closed" due to API failure
  if (loading || !coupon || coupon.valid === undefined) return <div id="early-access" />

  const total = coupon.max_redemptions ?? 20
  const used = coupon.times_redeemed ?? 0
  const left = Math.max(0, total - used)
  const soldOut = coupon.valid === false || left <= 0
  const pct = Math.min(100, Math.round((used / total) * 100))
  const discount = coupon.percent_off ?? 50

  return (
    <section id="early-access" className="px-6 py-14 border-t" style={{ borderColor: '#1c1800' }}>
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border"
          style={soldOut
            ? { background: '#141200', borderColor: '#2a2200' }
            : { background: 'linear-gradient(135deg, rgba(202,138,4,0.5) 0%, rgba(10,9,0,0.95) 50%, rgba(15,30,50,0.9) 100%)', borderColor: 'rgba(202,138,4,0.35)' }
          }>

          {/* Glow */}
          {!soldOut && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl"
                style={{ background: 'rgba(202,138,4,0.12)' }} />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl"
                style={{ background: 'rgba(132,204,22,0.08)' }} />
            </div>
          )}

          <div className="relative p-8 sm:p-10">
            {soldOut ? (
              <div className="text-center py-6">
                <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#7a6a40' }}>Early Access Closed</div>
                <p className="text-sm" style={{ color: '#7a6a40' }}>All 20 early access spots have been claimed. Join the waitlist to be notified when we open again.</p>
                <a href="#waitlist"
                  className="inline-flex items-center gap-2 mt-6 font-semibold px-6 py-3 rounded-xl transition-colors text-sm border"
                  style={{ background: '#141200', borderColor: '#2a2200', color: '#dde4f0' }}>
                  Join the Waitlist <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Left: Offer details */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border"
                    style={{ background: 'rgba(132,204,22,0.15)', borderColor: 'rgba(132,204,22,0.3)', color: '#84cc16' }}>
                    <Zap className="w-3 h-3" />
                    Limited Early Access — {left} of {total} spots left
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    {discount}% off for 1 year.<br />
                    <span style={{ backgroundImage: 'linear-gradient(90deg, #ca8a04, #84cc16)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      Founding member pricing.
                    </span>
                  </h2>

                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#b8a870' }}>
                    We're opening AdDee to a small group of agencies before public launch. The first {total} members lock in {discount}% off for 12 months — saving hundreds compared to full price. Once these spots are gone, pricing returns to normal.
                  </p>

                  {/* Spot counter */}
                  <div className="rounded-xl p-4 mb-6 border"
                    style={{ background: 'rgba(10,9,0,0.7)', borderColor: '#2a2200' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" style={{ color: '#84cc16' }} />
                        <span className="text-white font-bold">{left} spots remaining</span>
                        <span style={{ color: '#7a6a40' }}>of {total}</span>
                      </div>
                      <span className="text-xs" style={{ color: '#7a6a40' }}>{used} claimed</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#1c1800' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ca8a04, #84cc16)' }}
                      />
                    </div>
                    {left <= 5 && (
                      <p className="text-xs font-semibold mt-2" style={{ color: '#84cc16' }}>
                        Only {left} left — don't miss out
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/signup?coupon=${COUPON_ID}`}
                      className="flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-xl transition-all hover:opacity-90 text-sm"
                      style={{ background: '#ca8a04', boxShadow: '0 6px 24px rgba(202,138,4,0.3)' }}
                    >
                      <Lock className="w-4 h-4" />
                      Claim Your Spot — {PROMO_CODE}
                    </a>
                    <a
                      href={`/billing?coupon=${COUPON_ID}`}
                      className="flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-colors text-sm border hover:text-white"
                      style={{ background: 'rgba(10,9,0,0.8)', borderColor: '#2a2200', color: '#b8a870' }}
                    >
                      Already have an account
                    </a>
                  </div>

                  <p className="text-xs mt-3" style={{ color: '#7a6a40' }}>
                    New to AdDee? Create your account above — discount applied automatically at checkout.
                  </p>

                  <div className="mt-4 rounded-xl p-3 border" style={{ background: 'rgba(10,9,0,0.7)', borderColor: '#2a2200' }}>
                    <p className="text-xs leading-relaxed" style={{ color: '#7a6a40' }}>
                      <strong style={{ color: '#7a6a40' }}>Early access terms:</strong> The 50% discount is locked in for 12 months for the first {total} members only.
                      If you cancel at any time, you permanently lose the early access rate —
                      reactivating will be charged at full price.
                    </p>
                  </div>
                </div>

                {/* Right: Early access pricing table */}
                <div className="lg:w-72 w-full shrink-0">
                  <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7a6a40' }}>Early Access Pricing</div>
                  <div className="space-y-2">
                    {EARLY_PRICES.map(p => {
                      const discounted = Math.round(p.original * (1 - discount / 100) * 100) / 100
                      return (
                        <div key={p.name} className="flex flex-col rounded-xl px-4 py-3 border"
                          style={{ background: 'rgba(10,9,0,0.7)', borderColor: '#2a2200' }}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-white text-sm font-semibold">{p.name}</div>
                              <div className="text-xs" style={{ color: '#7a6a40' }}>{p.brands} brands · {p.ads} ADs/mo</div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-sm" style={{ color: '#34d399' }}>${discounted}/mo</div>
                              <div className="text-xs line-through" style={{ color: '#7a6a40' }}>${p.original}/mo</div>
                            </div>
                          </div>
                          <div className="text-xs leading-relaxed" style={{ color: '#7a6a40' }}>{p.description}</div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs mt-3 text-center" style={{ color: '#7a6a40' }}>50% off for 12 months · First {total} members only</p>
                  <p className="text-xs mt-1 text-center" style={{ color: '#2a2200' }}>Cancellation forfeits early access pricing permanently</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
