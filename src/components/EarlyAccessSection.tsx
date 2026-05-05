'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Lock, Zap, Users } from 'lucide-react'

const COUPON_ID = 'sn28Uv8i'   // Stripe coupon ID
const PROMO_CODE = 'EARLY50'   // user-facing promotion code

type CouponData = {
  valid: boolean
  percent_off: number | null
  times_redeemed: number
  max_redemptions: number | null
  name: string | null
}

const EARLY_PRICES = [
  { name: 'Freelancer Starter', original: 49, sites: 5, posts: 20, description: 'Perfect for freelancers managing a few clients. AI generation + basic publishing.' },
  { name: 'Growth', original: 99, sites: 15, posts: 60, description: 'Agencies scaling up. Autoblog, AI images, team collab, URL/YouTube to blog.' },
  { name: 'Agency', original: 149, sites: 40, posts: 175, description: 'Full-service agencies. LocalFalcon rankings, white-label portal, advanced analytics.' },
  { name: 'Agency Max', original: 299, sites: 150, posts: 500, description: 'Enterprise teams. White-label domain, custom integrations, API access, 24/7 support.' },
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
    <section id="early-access" className="px-6 py-14 border-t border-[#2a2a3d]/50">
      <div className="max-w-5xl mx-auto">
        <div className={`relative rounded-2xl overflow-hidden border ${soldOut ? 'border-[#2a2a3d] bg-[#12121a]' : 'border-violet-500/30 bg-gradient-to-br from-violet-950/60 via-[#0f0718] to-cyan-950/40'}`}>
          {/* Glow */}
          {!soldOut && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-600/8 rounded-full blur-3xl" />
            </div>
          )}

          <div className="relative p-8 sm:p-10">
            {soldOut ? (
              <div className="text-center py-6">
                <div className="text-[#8888a8] text-sm font-bold uppercase tracking-widest mb-3">Early Access Closed</div>
                <p className="text-[#555570] text-sm">All early access spots have been claimed. Join the waitlist below to be notified when we open again.</p>
                <a href="#waitlist" className="inline-flex items-center gap-2 mt-6 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  Join the Waitlist <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <>
              <div className="mb-10">
                <div className="text-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8888a8]">See Bloggy in Action</span>
                </div>
                <div className="relative w-full rounded-xl overflow-hidden border border-[#2a2a3d] shadow-2xl" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/rrZKE6zg-f8?rel=0&modestbranding=1"
                    title="Bloggy — AI Blog Automation for Agencies"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Left: Offer details */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/25 text-yellow-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                    <Zap className="w-3 h-3" />
                    Limited Early Access
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    {discount}% off for 1 year.<br />
                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      Early access pricing.
                    </span>
                  </h2>
                  <p className="text-[#8888a8] text-sm leading-relaxed mb-6">
                    We're opening Bloggy to a small group of agencies before public launch. Early access members get {discount}% off for 12 months — saving hundreds compared to full price. Once these spots are gone, pricing returns to normal.
                  </p>

                  {/* Spot counter */}
                  <div className="bg-[#0a0a0f]/60 border border-[#2a2a3d] rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-violet-400" />
                        <span className="text-white font-bold">{left} spots remaining</span>
                        <span className="text-[#555570]">of {total}</span>
                      </div>
                      <span className="text-xs text-[#555570]">{used} claimed</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a26] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {left <= 5 && (
                      <p className="text-yellow-400 text-xs font-semibold mt-2">
                        Only {left} left — don't miss out
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/signup?coupon=${COUPON_ID}`}
                      className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      Claim Your Spot — {PROMO_CODE}
                    </a>
                    <a
                      href={`/billing?coupon=${COUPON_ID}`}
                      className="flex items-center justify-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-[#8888a8] hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                    >
                      Already have an account
                    </a>
                  </div>
                  <p className="text-[#555570] text-xs mt-3">
                    New to Bloggy? Create your account above — discount is applied automatically at checkout.
                  </p>
                  <div className="mt-4 bg-[#0a0a0f]/60 border border-[#2a2a3d] rounded-xl p-3">
                    <p className="text-[#555570] text-xs leading-relaxed">
                      <strong className="text-[#8888a8]">Early access terms:</strong> The 50% discount is locked in for 12 months for the first {total} members only.
                      If you cancel your subscription at any time, you permanently lose the early access rate —
                      reactivating your account will be charged at full price on any plan tier.
                    </p>
                  </div>
                </div>

                {/* Right: Early access pricing table */}
                <div className="lg:w-72 w-full shrink-0">
                  <div className="text-xs text-[#8888a8] font-bold uppercase tracking-wider mb-3">Early Access Pricing</div>
                  <div className="space-y-2">
                    {EARLY_PRICES.map(p => {
                      const discounted = Math.round(p.original * (1 - discount / 100) * 100) / 100
                      return (
                        <div key={p.name} className="flex flex-col bg-[#0a0a0f]/60 border border-[#2a2a3d] rounded-xl px-4 py-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-white text-sm font-semibold">{p.name}</div>
                              <div className="text-[#555570] text-xs">{p.sites} sites · {p.posts} posts/mo</div>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-400 font-black text-sm">${discounted}/mo</div>
                              <div className="text-[#555570] text-xs line-through">${p.original}/mo</div>
                            </div>
                          </div>
                          <div className="text-[#8888a8] text-xs leading-relaxed">{p.description}</div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[#555570] text-xs mt-3 text-center">50% off for 12 months · First {total} members only</p>
                  <p className="text-[#3a3a5a] text-[10px] mt-1 text-center">Cancellation forfeits early access pricing permanently</p>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
