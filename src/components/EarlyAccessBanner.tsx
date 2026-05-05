'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, X, Zap } from 'lucide-react'

const COUPON_ID = 'sn28Uv8i'   // Stripe coupon ID
const PROMO_CODE = 'EARLY50'   // user-facing promotion code
const DISMISS_KEY = 'bloggy_ea_dismissed'

type CouponData = {
  valid: boolean
  percent_off: number | null
  times_redeemed: number
  max_redemptions: number | null
}

export default function EarlyAccessBanner() {
  const [coupon, setCoupon] = useState<CouponData | null>(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === '1') return
    setDismissed(false)
    fetch(`/api/stripe/coupon?id=${COUPON_ID}`)
      .then(r => r.json())
      .then(setCoupon)
      .catch(() => {})
  }, [])

  function dismiss() {
    setDismissed(true)
    localStorage.setItem(DISMISS_KEY, '1')
  }

  // Don't render if dismissed or if the fetch failed (coupon.valid would be undefined)
  if (dismissed || !coupon || coupon.valid === undefined) return null

  const total = coupon.max_redemptions ?? 20
  const left = Math.max(0, total - coupon.times_redeemed)
  const soldOut = coupon.valid === false || left <= 0
  const fillPct = Math.min(100, Math.round((coupon.times_redeemed / total) * 100))

  if (soldOut) {
    return (
      <div className="relative bg-[#12121a] border-b border-[#2a2a3d] px-4 py-2 text-center text-sm">
        <span className="text-[#8888a8]">Early access is closed — </span>
        <a href="#waitlist" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">join the waitlist</a>
        <button onClick={dismiss} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555570] hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative bg-gradient-to-r from-violet-950 via-[#160920] to-cyan-950 border-b border-violet-500/25 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span className="text-white font-bold">Early Access Open</span>
          <span className="text-violet-300 hidden sm:inline">
            — {coupon.percent_off}% off for 1 year · Code: {PROMO_CODE}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all"
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <span className="text-[#8888a8] text-xs">
              <span className="text-white font-bold">{left}</span>/{total} spots left
            </span>
          </div>
          <a
            href={`/billing?coupon=${COUPON_ID}`}
            className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            Claim Spot <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555570] hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
