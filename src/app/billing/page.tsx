'use client'

import { useState, useEffect, Suspense } from 'react'
import AppNav from '@/components/AppNav'
import { Check, Loader2, ExternalLink, Zap, Tag, Lock, Sparkles, CalendarDays, FileText, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    price: 29,
    annualMonthlyPrice: 23,
    posts: 25,
    brands: 3,
    featured: false,
    features: [
      '25 ADs per month',
      '3 brands',
      'All formats & platforms',
      'Design Studio (Canva + Firefly)',
      'A/B variant generation',
      'Client report PDF',
      'Email support',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 79,
    annualMonthlyPrice: 63,
    posts: 100,
    brands: 10,
    featured: true,
    features: [
      '100 ADs per month',
      '10 brands',
      'Everything in Starter',
      'Bulk generation (coming soon)',
      'Ad scheduler / queue (coming soon)',
      'Priority support',
    ],
  },
  {
    key: 'agency',
    name: 'Agency',
    price: 199,
    annualMonthlyPrice: 159,
    posts: 9999,
    brands: 9999,
    featured: false,
    features: [
      'Unlimited ADs',
      'Unlimited brands',
      'Everything in Growth',
      'White-label client reports',
      'Team seats',
      'API access',
      'Dedicated support',
    ],
  },
]

type Subscription = {
  plan: string
  status: string
  posts_limit: number
  sites_limit: number
  current_period_end: string | null
}

function BillingPage() {
  const [sub, setSub] = useState<Subscription | null>(null)
  const [postsUsed, setPostsUsed] = useState(0)
  const [brandsCount, setBrandsCount] = useState(0)
  const [wordsThisMonth, setWordsThisMonth] = useState(0)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [resolvedCouponId, setResolvedCouponId] = useState<string | null>(null)
  const [resolvedPromoCodeId, setResolvedPromoCodeId] = useState<string | null>(null)
  const [couponDetails, setCouponDetails] = useState<{ name: string | null; percent_off: number | null; amount_off: number | null } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly')
  const router = useRouter()
  const searchParams = useSearchParams()

  async function applyPromo(code: string) {
    if (!code) return
    setCouponLoading(true)
    setCouponError(null)
    try {
      const res = await fetch(`/api/stripe/coupon?id=${encodeURIComponent(code)}`)
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setCouponError(data.error ?? 'Invalid or expired coupon')
        setCouponDetails(null)
        return
      }
      setPromoApplied(true)
      setResolvedCouponId(data.id)
      setResolvedPromoCodeId(data.promo_code_id ?? null)
      setCouponDetails({ name: data.name, percent_off: data.percent_off, amount_off: data.amount_off })
    } catch {
      setCouponError('Could not validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  function discountedPrice(original: number): number {
    if (!couponDetails) return original
    if (couponDetails.percent_off) return Math.round(original * (1 - couponDetails.percent_off / 100) * 100) / 100
    if (couponDetails.amount_off) return Math.max(0, original - couponDetails.amount_off / 100)
    return original
  }

  useEffect(() => {
    const coupon = searchParams.get('coupon') ?? localStorage.getItem('addee_coupon')
    if (coupon) {
      setPromoCode(coupon)
      applyPromo(coupon)
      localStorage.removeItem('addee_coupon')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const [{ data: subData }, { count: postCount }, { count: brandCount }, { data: wordData }] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', monthStart),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
        supabase.from('posts').select('word_count').eq('created_by', user.id).gte('created_at', monthStart),
      ])

      setSub(subData)
      setPostsUsed(postCount ?? 0)
      setBrandsCount(brandCount ?? 0)
      setWordsThisMonth(wordData?.reduce((s, p) => s + (p.word_count ?? 0), 0) ?? 0)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleCheckout(plan: string) {
    setCheckoutLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          couponId: promoApplied && resolvedCouponId ? resolvedCouponId : undefined,
          promoCodeId: promoApplied && resolvedPromoCodeId ? resolvedPromoCodeId : undefined,
          interval: billingInterval,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Checkout failed — please try again.')
    } catch {
      alert('Something went wrong — please try again.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  async function handleChangePlan(plan: string) {
    setChangePlanLoading(plan)
    try {
      const res = await fetch('/api/stripe/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          couponId: promoApplied && resolvedCouponId ? resolvedCouponId : undefined,
          promoCodeId: promoApplied && resolvedPromoCodeId ? resolvedPromoCodeId : undefined,
          interval: billingInterval,
        }),
      })
      const data = await res.json()
      if (data.ok) { alert('Plan updated! Refreshing…'); window.location.reload() }
      else alert(data.error ?? 'Could not change plan.')
    } catch {
      alert('Something went wrong — please try again.')
    } finally {
      setChangePlanLoading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Could not open billing portal.')
    } catch {
      alert('Something went wrong — please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  const isActive = sub?.status === 'active' || sub?.status === 'past_due'
  const isPastDue = sub?.status === 'past_due'
  const postsLimit = sub?.posts_limit ?? 2

  const COMING_SOON_ADDONS = [
    { icon: CalendarDays, title: 'Scheduler / Auto-Publish', desc: 'Queue ads and publish directly to Instagram, LinkedIn, and TikTok on a schedule.', price: '$15/mo' },
    { icon: Sparkles, title: 'Bulk Generation', desc: '10–25 ad variations at once for large-scale A/B testing across platforms.', price: '$15/mo', badge: 'Growth+' },
    { icon: FileText, title: 'White-Label Reports', desc: 'Custom-branded PDF reports for your clients with your logo and domain.', price: '$15/mo', badge: 'Agency+' },
    { icon: Users, title: 'Performance Analytics', desc: 'CTR, ROAS, and impression data from Meta, LinkedIn, and Google Ads.', price: '$8/mo' },
  ]

  return (
    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#0a0900', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/billing" />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#84cc16' }}>Billing</h1>
          <p className="text-sm" style={{ color: '#b8a870' }}>Manage your plan and usage.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#ca8a04' }} />
          </div>
        ) : (
          <>
            {/* Success banners */}
            {searchParams.get('success') === '1' && (
              <div className="mb-6 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm">
                <Check className="w-4 h-4" /> You're subscribed! Welcome to AdDee.
              </div>
            )}

            {/* Current plan + usage */}
            {isActive && sub && (
              <div className="rounded-2xl p-6 mb-8 border" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg capitalize" style={{ color: '#dde4f0' }}>{sub.plan.replace('_', ' ')} Plan</span>
                      {isPastDue
                        ? <span className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-2 py-0.5 rounded-full font-semibold">Payment Failed</span>
                        : <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold">Active</span>
                      }
                    </div>
                    {sub.current_period_end && (
                      <p className="text-xs" style={{ color: '#b8a870' }}>
                        Renews {new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                    {isPastDue && (
                      <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3" /> Your last payment failed. Update your payment method to keep access.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors"
                    style={{ color: '#b8a870', background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}
                  >
                    {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    Manage subscription
                  </button>
                </div>
                <div className="space-y-4">
                  <UsageBar label="ADs this month" used={postsUsed} limit={postsLimit} unit="ADs" />
                  <UsageBar label="Brands" used={brandsCount} limit={sub.sites_limit} unit="brands" />
                  <div className="flex items-center justify-between pt-1" style={{ borderTopColor: 'rgba(202,138,4,0.2)', borderTop: '1px solid' }}>
                    <span className="text-xs" style={{ color: '#b8a870' }}>Words generated this month</span>
                    <span className="text-xs font-semibold" style={{ color: '#dde4f0' }}>{wordsThisMonth.toLocaleString()}</span>
                  </div>
                  {postsLimit > 0 && postsUsed / postsLimit >= 0.9 && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <Zap className="w-3 h-3" /> You're near your AD limit — consider upgrading.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Free plan usage */}
            {!isActive && (
              <div className="rounded-2xl p-5 mb-8 border" style={{ background: 'rgba(20,18,0,0.5)', borderColor: 'rgba(202,138,4,0.2)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Free Plan</span>
                  <span className="text-xs px-2.5 py-1 rounded-full border" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', color: '#b8a870' }}>2 ADs / month</span>
                </div>
                <UsageBar label="ADs this month" used={postsUsed} limit={2} unit="ADs" />
              </div>
            )}

            {/* Promo code */}
            <div className="mb-6">
              {promoApplied && couponDetails ? (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="flex-1">
                    <span className="text-emerald-400 font-semibold text-sm">
                      {couponDetails.percent_off ? `${couponDetails.percent_off}% off` : `$${(couponDetails.amount_off! / 100).toFixed(2)} off`} applied
                      {couponDetails.name ? ` — ${couponDetails.name}` : ''}
                    </span>
                    <p className="text-emerald-400/70 text-xs mt-0.5">Discount will be applied at checkout</p>
                  </div>
                  <button onClick={() => { setPromoCode(''); setPromoApplied(false); setResolvedCouponId(null); setResolvedPromoCodeId(null); setCouponDetails(null) }}
                    className="text-xs transition-colors" style={{ color: '#b8a870' }}>Remove</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value.trim()); setCouponError(null) }}
                    onKeyDown={e => e.key === 'Enter' && applyPromo(promoCode)}
                    placeholder="Have a promo code?"
                    className="text-sm px-3 py-2 rounded-lg focus:outline-none w-52 border"
                    style={{ background: 'rgba(20,18,0,0.6)', color: '#dde4f0', borderColor: couponError ? '#ef4444' : 'rgba(202,138,4,0.3)' }}
                  />
                  <button onClick={() => applyPromo(promoCode)} disabled={!promoCode || couponLoading}
                    className="text-xs px-3 py-2 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5 text-white font-semibold"
                    style={{ background: '#ca8a04' }}>
                    {couponLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    Apply
                  </button>
                  {couponError && <span className="text-red-400 text-xs">{couponError}</span>}
                </div>
              )}
            </div>

            {/* Plans */}
            <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-bold text-lg mb-1" style={{ color: '#dde4f0' }}>Plans</h2>
                <p className="text-sm" style={{ color: '#b8a870' }}>Upgrade to unlock more ADs, brands, and features.</p>
              </div>
              <div className="flex rounded-lg overflow-hidden text-xs font-semibold border" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}>
                <button onClick={() => setBillingInterval('monthly')} className="px-3 py-2 transition-colors"
                  style={billingInterval === 'monthly' ? { background: 'rgba(202,138,4,0.25)', color: 'white' } : { color: '#b8a870' }}>
                  Monthly
                </button>
                <button onClick={() => setBillingInterval('annual')} className="px-3 py-2 transition-colors flex items-center gap-1.5"
                  style={billingInterval === 'annual' ? { background: 'rgba(16,185,129,0.2)', color: '#10b981' } : { color: '#b8a870' }}>
                  Annual
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {PLANS.map(plan => {
                const isCurrent = sub?.plan === plan.key && isActive
                const displayPrice = billingInterval === 'annual' ? plan.annualMonthlyPrice : plan.price
                const finalPrice = promoApplied && couponDetails ? discountedPrice(displayPrice) : displayPrice

                return (
                  <div
                    key={plan.key}
                    className="relative rounded-2xl p-6 flex flex-col gap-4 border"
                    style={plan.featured
                      ? { background: 'rgba(202,138,4,0.08)', borderColor: '#ca8a04', borderWidth: '2px' }
                      : { background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: '#ca8a04' }}>
                        Most Popular
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#b8a870' }}>{plan.name}</div>
                      <div className="flex items-end gap-1.5">
                        <span className="text-3xl font-black" style={{ color: promoApplied && couponDetails ? '#10b981' : '#dde4f0' }}>
                          ${finalPrice % 1 === 0 ? finalPrice : finalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm mb-1" style={{ color: '#b8a870' }}>/mo</span>
                      </div>
                      {billingInterval === 'annual' && (
                        <p className="text-emerald-400 text-xs mt-0.5">${plan.annualMonthlyPrice * 12}/yr <span className="line-through" style={{ color: '#7a6a40' }}>${plan.price * 12}</span></p>
                      )}
                      {promoApplied && couponDetails && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs line-through" style={{ color: '#7a6a40' }}>${displayPrice}</span>
                          <span className="text-emerald-400 text-xs font-semibold">
                            {couponDetails.percent_off ? `${couponDetails.percent_off}% off` : `$${(couponDetails.amount_off! / 100).toFixed(2)} off`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs pt-3 space-y-1" style={{ color: '#b8a870', borderTopColor: 'rgba(202,138,4,0.2)', borderTop: '1px solid' }}>
                      <div className="font-semibold" style={{ color: '#dde4f0' }}>{plan.posts === 9999 ? 'Unlimited' : plan.posts} ADs/mo</div>
                      <div>{plan.brands === 9999 ? 'Unlimited' : plan.brands} brands</div>
                    </div>

                    <ul className="space-y-2 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#b8a870' }}>
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <div className="w-full text-center text-xs font-bold py-2.5 rounded-lg border" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                        Current Plan
                      </div>
                    ) : isActive ? (
                      <button
                        onClick={() => handleChangePlan(plan.key)}
                        disabled={!!changePlanLoading}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg transition-colors border"
                        style={plan.featured
                          ? { background: '#ca8a04', color: 'white', borderColor: '#ca8a04' }
                          : { background: 'rgba(20,18,0,0.6)', color: 'white', borderColor: 'rgba(202,138,4,0.4)' }}
                      >
                        {changePlanLoading === plan.key && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {(PLANS.findIndex(p => p.key === plan.key) > PLANS.findIndex(p => p.key === sub?.plan)) ? 'Upgrade' : 'Downgrade'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan.key)}
                        disabled={!!checkoutLoading}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg transition-colors"
                        style={plan.featured
                          ? { background: '#ca8a04', color: 'white' }
                          : { background: 'rgba(20,18,0,0.6)', color: 'white', border: '1px solid rgba(202,138,4,0.4)' }}
                      >
                        {checkoutLoading === plan.key && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Subscribe
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Coming Soon Add-ons */}
            <div className="mb-2">
              <h2 className="font-bold text-lg mb-1" style={{ color: '#dde4f0' }}>Coming Soon Add-ons</h2>
              <p className="text-sm mb-6" style={{ color: '#b8a870' }}>Power-up bolt-ons for any paid plan. Beta users will get early access pricing.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMING_SOON_ADDONS.map(addon => (
                <div key={addon.title} className="rounded-xl border p-5 flex gap-4 opacity-80" style={{ background: 'rgba(20,18,0,0.5)', borderColor: 'rgba(202,138,4,0.2)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 opacity-60" style={{ background: 'linear-gradient(135deg, #ca8a04, #84cc16)' }}>
                    <addon.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: '#dde4f0' }}>{addon.title}</span>
                      {addon.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(202,138,4,0.15)', color: '#ca8a04', border: '1px solid rgba(202,138,4,0.3)' }}>{addon.badge}</span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: '#b8a870' }}>{addon.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: '#ca8a04' }}>{addon.price}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#7a6a40' }}>
                        <Lock className="w-2.5 h-2.5" /> Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function BillingPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0a0900' }} />}>
      <BillingPage />
    </Suspense>
  )
}

function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = Math.min((used / limit) * 100, 100)
  const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#fbbf24' : '#84cc16'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs" style={{ color: '#b8a870' }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color: '#dde4f0' }}>{used} / {limit === 9999 ? '∞' : limit} {unit}</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(202,138,4,0.15)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  )
}
