'use client'

import { useState, useEffect, Suspense } from 'react'
import Logo from '@/components/Logo'
import { Check, CheckCircle, Loader2, ExternalLink, Zap, Tag, Lock, BarChart2, Globe, Search, FileText, Share2, Image, Video, Mail, UserCheck, BarChart, RefreshCw, Code2, GitBranch } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

const PLAN_STYLES: Record<string, string> = {
  starter:    'bg-blue-500/15 border-blue-500/30 text-blue-400',
  growth:     'bg-violet-500/15 border-violet-500/30 text-violet-400',
  agency:     'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  agency_max: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  free:       'bg-[#1a1a26] border-[#2a2a3d] text-[#8888a8]',
}

const NAV_LINKS = [
  { href: '/dashboard', label: 'Generate' },
  { href: '/clients',   label: 'Clients'  },
  { href: '/keywords',  label: 'Keywords' },
  { href: '/autoblog',  label: 'Autoblog' },
  { href: '/calendar',  label: 'Calendar' },
  { href: '/settings',  label: 'Settings' },
  { href: '/billing',   label: 'Billing'  },
]

const PLANS = [
  {
    key: 'starter',
    name: 'Freelancer Starter',
    price: 49,
    annualMonthlyPrice: 42,
    posts: 20,
    sites: 5,
    postsPerSite: 4,
    features: ['5 client sites', '20 posts/month', 'AI blog generation', 'WordPress & Shopify publishing', 'Per-client brand voice', 'Basic keyword rankings', 'SEO meta output', 'Email support'],
    featured: false,
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 99,
    annualMonthlyPrice: 84,
    posts: 60,
    sites: 15,
    postsPerSite: undefined,
    features: ['Up to 15 client sites', '60 posts/month', 'Everything in Freelancer Starter', 'Autoblog scheduler', 'AI hero images', 'Team collaboration (1 member)', 'URL & YouTube to blog', 'Content repurposing', 'Approval workflows', 'Priority email support'],
    featured: true,
  },
  {
    key: 'agency',
    name: 'Agency',
    price: 149,
    annualMonthlyPrice: 127,
    posts: 175,
    sites: 40,
    postsPerSite: undefined,
    features: ['Up to 40 client sites', '175 posts/month', 'Everything in Growth', 'LocalFalcon grid rankings', 'Competitive analysis', 'White-label client portal', 'Monthly PDF reports', 'Team collaboration (5 members)', 'Advanced analytics', 'Slack support'],
    featured: false,
  },
  {
    key: 'agency_max',
    name: 'Agency Max',
    price: 299,
    annualMonthlyPrice: 254,
    posts: 500,
    sites: 150,
    sitesDisplay: '40-150',
    postsPerSite: undefined,
    features: ['40-150 client sites', '500 posts/month', 'Everything in Agency', 'White-label custom domain', 'Custom integrations (Zapier, HubSpot)', 'API access tier 2', 'Unlimited team members', 'Priority phone support', '24/7 dedicated support'],
    featured: false,
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
  const [sitesUsed, setSitesUsed] = useState(0)
  const [wordsThisMonth, setWordsThisMonth] = useState(0)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [changePlanLoading, setChangePlanLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [resolvedCouponId, setResolvedCouponId] = useState<string | null>(null)
  const [resolvedPromoCodeId, setResolvedPromoCodeId] = useState<string | null>(null)
  const [couponDetails, setCouponDetails] = useState<{ name: string | null; percent_off: number | null; amount_off: number | null } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [creditBalance, setCreditBalance] = useState<number>(0)
  const [buyCreditsLoading, setBuyCreditsLoading] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly')
  const [referralUrl, setReferralUrl] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referralCount, setReferralCount] = useState(0)
  const [referralCredits, setReferralCredits] = useState(0)
  const [referralCopied, setReferralCopied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const coupon = searchParams.get('coupon') ?? localStorage.getItem('bloggy_coupon')
    if (coupon) {
      setPromoCode(coupon)
      applyPromo(coupon)
      localStorage.removeItem('bloggy_coupon')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email ?? null)

      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const [{ data: subData }, { count: postCount }, { count: siteCount }, { data: wordData }] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', monthStart),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('word_count').eq('created_by', user.id).gte('created_at', monthStart),
      ])

      setSub(subData)
      setPostsUsed(postCount ?? 0)
      setSitesUsed(siteCount ?? 0)
      setWordsThisMonth(wordData?.reduce((sum, p) => sum + (p.word_count ?? 0), 0) ?? 0)
      fetch('/api/credits').then(r => r.json()).then(d => setCreditBalance(d.balance ?? 0)).catch(() => {})
      fetch('/api/referral').then(r => r.json()).then(d => {
        setReferralUrl(d.referralUrl)
        setReferralCode(d.code)
        setReferralCount(d.referralsCount ?? 0)
        setReferralCredits(d.creditsEarned ?? 0)
      }).catch(() => {})
      setLoading(false)
    }
    load()
  }, [])

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
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? 'Checkout failed — please try again.')
      }
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
      if (data.ok) {
        alert('Plan updated! Your billing will be prorated. Refreshing…')
        window.location.reload()
      } else {
        alert(data.error ?? 'Could not change plan.')
      }
    } catch {
      alert('Something went wrong — please try again.')
    } finally {
      setChangePlanLoading(null)
    }
  }

  async function handleBuyCredits(packId: string) {
    setBuyCreditsLoading(packId)
    try {
      const res = await fetch('/api/stripe/buy-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Checkout failed')
    } catch {
      alert('Something went wrong')
    } finally {
      setBuyCreditsLoading(null)
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
  const usagePct = sub ? Math.min((postsUsed / sub.posts_limit) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <nav className="border-b border-[#2a2a3d] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/dashboard"><Logo /></a>
            <div className="flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href}
                  className={link.href === '/billing'
                    ? 'text-white text-sm px-3 py-1.5 rounded-lg bg-[#1a1a26] transition-colors'
                    : 'text-[#8888a8] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#1a1a26] transition-colors'}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sub && (
              <span className={`text-xs px-2.5 py-1 rounded-full border capitalize font-semibold hidden sm:inline-block ${PLAN_STYLES[isActive ? sub.plan : 'free'] ?? PLAN_STYLES.free}`}>
                {(isActive ? sub.plan : 'free').replace('_', ' ')}
              </span>
            )}
            {userEmail && <span className="text-[#8888a8] text-xs hidden md:block">{userEmail}</span>}
            <button onClick={handleSignOut} className="text-[#8888a8] hover:text-white text-xs transition-colors">Sign out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Billing</h1>
          <p className="text-[#8888a8] text-sm">Manage your plan and usage.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Current plan + usage */}
            {isActive && sub && (
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-lg capitalize">{sub.plan.replace('_', ' ')} Plan</span>
                      {isPastDue
                        ? <span className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-2 py-0.5 rounded-full font-semibold">Payment Failed</span>
                        : <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold">Active</span>
                      }
                    </div>
                    {isPastDue && (
                      <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3" /> Your last payment failed. Update your payment method to keep access.
                      </p>
                    )}
                    {sub.current_period_end && (
                      <p className="text-[#8888a8] text-xs">
                        Renews {new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] px-3 py-2 rounded-lg transition-colors"
                  >
                    {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    Manage subscription
                  </button>
                </div>
                <div className="space-y-4">
                  <UsageBar label="Posts this month" used={postsUsed} limit={sub.posts_limit} unit="posts" />
                  <UsageBar label="Client sites" used={sitesUsed} limit={sub.sites_limit} unit="sites" />
                  <div className="flex items-center justify-between pt-1 border-t border-[#2a2a3d]">
                    <span className="text-[#8888a8] text-xs">Words written this month</span>
                    <span className="text-white text-xs font-semibold">{wordsThisMonth.toLocaleString()}</span>
                  </div>
                  {usagePct >= 90 && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <Zap className="w-3 h-3" /> You're near your post limit — consider upgrading.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Promo code */}
            <div className="mb-5">
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
                  <button
                    onClick={() => { setPromoCode(''); setPromoApplied(false); setResolvedCouponId(null); setResolvedPromoCodeId(null); setCouponDetails(null) }}
                    className="text-[#8888a8] hover:text-white text-xs transition-colors"
                  >Remove</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value.trim()); setCouponError(null) }}
                    onKeyDown={e => e.key === 'Enter' && applyPromo(promoCode)}
                    placeholder="Have a promo code?"
                    className={`bg-[#12121a] border text-white text-sm px-3 py-2 rounded-lg focus:outline-none w-52 transition-colors ${couponError ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a2a3d] focus:border-violet-500'}`}
                  />
                  <button
                    onClick={() => applyPromo(promoCode)}
                    disabled={!promoCode || couponLoading}
                    className="text-xs bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {couponLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    Apply
                  </button>
                  {couponError && <span className="text-red-400 text-xs">{couponError}</span>}
                </div>
              )}
            </div>

            {/* Plans */}
            <div className="mb-4 flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Base Plans</h2>
                <p className="text-[#8888a8] text-sm">Choose a plan to get started. Add-ons can be added to any paid plan.</p>
              </div>
              {/* Annual toggle */}
              <div className="flex items-center gap-3">
                <div className="flex bg-[#12121a] border border-[#2a2a3d] rounded-lg overflow-hidden text-xs font-semibold">
                  <button
                    onClick={() => setBillingInterval('monthly')}
                    className={`px-3 py-2 transition-colors ${billingInterval === 'monthly' ? 'bg-[#2a2a3d] text-white' : 'text-[#8888a8] hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingInterval('annual')}
                    className={`px-3 py-2 transition-colors flex items-center gap-1.5 ${billingInterval === 'annual' ? 'bg-emerald-600/20 text-emerald-400' : 'text-[#8888a8] hover:text-white'}`}
                  >
                    Annual
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {PLANS.map(plan => {
                const isCurrent = sub?.plan === plan.key && isActive
                return (
                  <div
                    key={plan.key}
                    className={`relative rounded-2xl p-6 flex flex-col gap-4 ${
                      plan.featured
                        ? 'bg-gradient-to-b from-violet-600/20 to-violet-600/5 border-2 border-violet-500'
                        : 'bg-[#12121a] border border-[#2a2a3d]'
                    }`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div>
                      <div className="text-[#8888a8] text-xs font-bold uppercase tracking-wider mb-2">{plan.name}</div>
                      {(() => {
                        const displayPrice = billingInterval === 'annual' ? (plan as any).annualMonthlyPrice ?? plan.price : plan.price
                        const finalPrice = promoApplied && couponDetails ? discountedPrice(displayPrice) : displayPrice
                        return (
                          <div>
                            <div className="flex items-end gap-1.5">
                              <span className={`text-3xl font-black ${promoApplied && couponDetails ? 'text-emerald-400' : 'text-white'}`}>
                                ${finalPrice % 1 === 0 ? finalPrice : finalPrice.toFixed(2)}
                              </span>
                              <span className="text-[#8888a8] text-sm mb-1">/mo</span>
                            </div>
                            {billingInterval === 'annual' && (
                              <p className="text-emerald-400 text-xs mt-0.5">
                                ${((plan as any).annualMonthlyPrice ?? plan.price) * 12}/yr <span className="text-[#555570] line-through">${plan.price * 12}</span>
                              </p>
                            )}
                            {promoApplied && couponDetails && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[#555570] text-xs line-through">${displayPrice}</span>
                                <span className="text-emerald-400 text-xs font-semibold">
                                  {couponDetails.percent_off ? `${couponDetails.percent_off}% off` : `$${(couponDetails.amount_off! / 100).toFixed(2)} off`}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                    <div className="text-xs text-[#8888a8] space-y-1 border-t border-[#2a2a3d] pt-4">
                      <div className="text-white font-semibold">{plan.posts === 9999 ? 'Unlimited' : plan.posts} posts/mo</div>
                      <div>Up to {plan.sitesDisplay || plan.sites} client sites</div>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs text-[#c8c8d8]">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="w-full text-center text-xs font-bold py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        Current Plan
                      </div>
                    ) : isActive ? (
                      <button
                        onClick={() => handleChangePlan(plan.key)}
                        disabled={!!changePlanLoading}
                        className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg transition-colors ${
                          plan.featured
                            ? 'bg-violet-600 hover:bg-violet-500 text-white'
                            : 'bg-[#1a1a26] hover:bg-[#2a2a3d] text-white border border-[#2a2a3d]'
                        }`}
                      >
                        {changePlanLoading === plan.key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        {(PLANS.findIndex(p => p.key === plan.key) > PLANS.findIndex(p => p.key === sub?.plan)) ? 'Upgrade' : 'Downgrade'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan.key)}
                        disabled={!!checkoutLoading}
                        className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg transition-colors ${
                          plan.featured
                            ? 'bg-violet-600 hover:bg-violet-500 text-white'
                            : 'bg-[#1a1a26] hover:bg-[#2a2a3d] text-white border border-[#2a2a3d]'
                        }`}
                      >
                        {checkoutLoading === plan.key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        Subscribe
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Power Credits */}
            <div className="mt-12">
              <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> Power Credits
                  </h2>
                  <p className="text-[#8888a8] text-sm">Pay-as-you-go credits for premium features — Claude Opus 4.7, extra posts beyond your plan limit, and advanced tools.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#12121a] border border-amber-500/20 rounded-xl px-4 py-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold text-lg">{creditBalance}</span>
                  <span className="text-[#8888a8] text-sm">credits remaining</span>
                </div>
              </div>

              {searchParams.get('credits_success') === '1' && (
                <div className="mb-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm">
                  <Check className="w-4 h-4" /> Credits added to your account!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {([
                  { id: 'credits_10',  credits: 10,  price: '$7',  label: 'Starter Pack',  badge: null,         desc: 'Try premium features — 3 Opus generations or 10 post top-ups.' },
                  { id: 'credits_50',  credits: 50,  price: '$29', label: 'Power Pack',    badge: 'Best value',  desc: 'Most popular. ~16 Opus generations or mix any premium features.' },
                  { id: 'credits_150', credits: 150, price: '$69', label: 'Agency Pack',   badge: 'Max savings', desc: '50 Opus generations. For agencies running premium quality at scale.' },
                ] as const).map(pack => (
                  <div key={pack.id} className="bg-[#12121a] border border-[#2a2a3d] hover:border-amber-500/30 rounded-xl p-5 flex flex-col gap-3 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-white font-bold text-sm mb-0.5">{pack.label}</div>
                        {pack.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">{pack.badge}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-black text-lg">{pack.price}</div>
                        <div className="text-[#8888a8] text-xs">one-time</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-amber-300 font-bold text-xl">{pack.credits}</span>
                      <span className="text-[#8888a8] text-sm">credits</span>
                    </div>
                    <p className="text-[#8888a8] text-xs leading-relaxed flex-1">{pack.desc}</p>
                    <button
                      onClick={() => handleBuyCredits(pack.id)}
                      disabled={buyCreditsLoading === pack.id}
                      className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {buyCreditsLoading === pack.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      {buyCreditsLoading === pack.id ? 'Loading…' : `Buy ${pack.credits} Credits — ${pack.price}`}
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 mb-2">
                <div className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3">Credit costs per feature</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {([
                    { label: 'Opus 4.7 generation', cost: 3, color: 'text-amber-400' },
                    { label: 'Extra post (over limit)', cost: 1, color: 'text-violet-400' },
                    { label: 'Competitor gap analysis', cost: 2, color: 'text-cyan-400' },
                    { label: 'Bulk SEO audit', cost: 1, color: 'text-emerald-400' },
                  ]).map(item => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <span className={`text-lg font-black ${item.color}`}>{item.cost}c</span>
                      <span className="text-[#8888a8] text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="mt-12">
              <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg mb-1">Power-up Add-ons</h2>
                  <p className="text-[#8888a8] text-sm">Optional bolt-ons for any paid plan — priced separately, cancel anytime.</p>
                </div>
                <span className="text-[#555570] text-xs">10 add-ons in development</span>
              </div>

              {/* Featured: Social Media Autopilot — NEW */}
              <div className="bg-gradient-to-r from-pink-950/40 to-[#12121a] border border-pink-500/30 rounded-2xl p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center shrink-0">
                    <Share2 className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap gap-y-1">
                      <span className="text-white font-bold text-sm">Social Media Autopilot</span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-pink-600 text-white px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <p className="text-[#8888a8] text-xs">Publish blog posts directly to Google Business Profile, LinkedIn, Medium, and Dev.to — one click after generating.</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {['Google Biz', 'LinkedIn', 'Medium', 'Dev.to'].map(p => (
                        <span key={p} className="text-[9px] font-bold text-pink-300 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-white font-black text-2xl">$15<span className="text-[#8888a8] text-sm font-normal">/mo</span></div>
                    <div className="text-[#555570] text-xs">per workspace</div>
                  </div>
                  <button
                    onClick={async () => {
                      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_SOCIAL_AUTOPILOT
                      if (!priceId) { alert('Add-on not yet available — check back soon!'); return }
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ addonPriceId: priceId, addonName: 'Social Media Autopilot' }),
                      })
                      const data = await res.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="flex items-center gap-2 text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Add to Plan · $15/mo
                  </button>
                </div>
              </div>

              {/* Featured: Rankings History */}
              <div className="bg-gradient-to-r from-violet-950/60 to-[#12121a] border border-violet-500/30 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-bold text-sm">Rankings History Pro</span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-violet-600 text-white px-2 py-0.5 rounded-full">Available Now</span>
                    </div>
                    <p className="text-[#8888a8] text-xs">Weekly automated rank tracking, historical trend charts, movement alerts, and exportable PDF reports for every client keyword.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-white font-black text-2xl">$8<span className="text-[#8888a8] text-sm font-normal">/mo</span></div>
                    <div className="text-[#555570] text-xs">per workspace</div>
                  </div>
                  <button
                    onClick={async () => {
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ addonPriceId: 'price_1TP7tQKnTmqeO7PSQxkPUZqN', addonName: 'Rankings History Pro' }),
                      })
                      const data = await res.json()
                      if (data.url) window.location.href = data.url
                    }}
                    className="flex items-center gap-2 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <BarChart2 className="w-3.5 h-3.5" /> Add to Plan · $8/mo
                  </button>
                </div>
              </div>

              {/* Coming Soon grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: <Globe className="w-4 h-4 text-cyan-400" />, bg: 'bg-cyan-600/10 border-cyan-500/20', name: 'White-label Client Portal', sub: 'Your brand, your domain', price: '$15', badge: null, desc: 'Custom domain, your logo. Clients view rankings and reports — zero Bloggy branding.', eta: 'Q3 2026' },
                  { icon: <Search className="w-4 h-4 text-emerald-400" />, bg: 'bg-emerald-600/10 border-emerald-500/20', name: 'Competitor Gap Analysis', sub: 'Beat them at their own game', price: '$15', badge: null, desc: 'Surface keywords competitors rank for that you don\'t, then auto-generate posts to close the gap.', eta: 'Q4 2026' },
                  { icon: <FileText className="w-4 h-4 text-orange-400" />, bg: 'bg-orange-600/10 border-orange-500/20', name: 'Branded Monthly Reports', sub: 'Impress every client', price: '$8', badge: 'Agency fave', desc: 'Auto-generated PDF SEO reports emailed to clients monthly. Your logo, their rankings.', eta: 'Q3 2026' },
                  { icon: <Image className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-600/10 border-blue-500/20', name: 'AI Image Pack', sub: 'Flux-powered visuals', price: '$8', badge: null, desc: 'Hero image + 2 inline images generated per post, uploaded to WordPress automatically.', eta: 'Q4 2026' },
                  { icon: <Video className="w-4 h-4 text-yellow-400" />, bg: 'bg-yellow-600/10 border-yellow-500/20', name: 'Video Script Generator', sub: 'Blog → YouTube script', price: '$8', badge: null, desc: 'Convert any post into a full YouTube script with hook, timestamps, B-roll notes, and CTA.', eta: 'Q4 2026' },
                  { icon: <Mail className="w-4 h-4 text-teal-400" />, bg: 'bg-teal-600/10 border-teal-500/20', name: 'Email Newsletter Digest', sub: 'Mailchimp / Resend sync', price: '$8', badge: null, desc: 'Monthly blog posts turned into a branded email newsletter. One-click send per client list.', eta: 'Q4 2026' },
                  { icon: <UserCheck className="w-4 h-4 text-purple-400" />, bg: 'bg-purple-600/10 border-purple-500/20', name: 'Client Approval Workflow', sub: 'Review before publish', price: '$15', badge: 'Agency fave', desc: 'Email drafts to clients for sign-off. WordPress publish fires only after they approve.', eta: 'Q4 2026' },
                  { icon: <BarChart className="w-4 h-4 text-red-400" />, bg: 'bg-red-600/10 border-red-500/20', name: 'Search Console Sync', sub: 'Google GSC integration', price: '$8', badge: null, desc: 'Pull real impressions, clicks, and CTR per post. Surface which pages need rewrites to convert.', eta: 'Q1 2027' },
                ].map(addon => (
                  <div key={addon.name} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 flex flex-col gap-3 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${addon.bg}`}>
                        {addon.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white font-black text-sm">{addon.price}<span className="text-[#555570] text-xs font-normal">/mo</span></span>
                        {addon.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">{addon.badge}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs mb-0.5">{addon.name}</div>
                      <div className="text-[#555570] text-xs mb-1">{addon.sub}</div>
                      <p className="text-[#8888a8] text-xs leading-relaxed">{addon.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1a1a26]">
                      <span className="text-[#3a3a5a] text-xs flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Shipping {addon.eta}
                      </span>
                      <span className="text-[#555570] text-xs bg-[#1a1a26] border border-[#2a2a3d] px-2 py-0.5 rounded-full">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* All Add-ons Bundle */}
              <div className="mt-8 bg-gradient-to-br from-emerald-950/50 via-cyan-950/30 to-[#12121a] border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-bold text-lg">All Add-ons Bundle</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded-full">Best Value</span>
                      </div>
                      <p className="text-[#8888a8] text-sm">Get all 10 add-ons for one low price. Social Media Autopilot, Rankings History Pro, White-label Portal, and more — everything together.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white font-black text-3xl">$65<span className="text-[#8888a8] text-sm font-normal">/mo</span></div>
                      <div className="text-[#555570] text-xs mt-1">Unlocks all current + future add-ons</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
                    {['Social Media Autopilot', 'Rankings History Pro', 'White-label Portal', 'Competitor Analysis', 'Monthly Reports', 'AI Image Pack', 'Video Scripts', 'Email Digest', 'Approval Workflow', 'WordPress Hosting', 'Modern Hosting', 'GSC Sync'].map(addon => (
                      <div key={addon} className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-white text-xs font-medium">{addon}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={async () => {
                      alert('Bundle pricing coming soon! Reach out to support@bloggy.online for early access pricing.')
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-3 rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Get All Add-ons for $65/mo
                  </button>
                </div>
              </div>

              <p className="text-[#555570] text-xs text-center mt-5">Early access members will be notified and get launch pricing on every add-on.</p>
            </div>

            {/* Referral program */}
            {referralUrl && (
              <div className="mt-10 bg-gradient-to-r from-emerald-950/40 to-[#12121a] border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Refer a Friend — Earn Credits</h3>
                    <p className="text-[#8888a8] text-xs">Get 10 credits for every user who signs up with your link and subscribes.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    readOnly
                    value={referralUrl}
                    className="flex-1 bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralUrl)
                      setReferralCopied(true)
                      setTimeout(() => setReferralCopied(false), 2000)
                    }}
                    className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    {referralCopied ? <CheckCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                    {referralCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-emerald-400">{referralCount}</div>
                    <div className="text-[#555570] text-xs">Referrals</div>
                  </div>
                  <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-amber-400">{referralCredits}</div>
                    <div className="text-[#555570] text-xs">Credits Earned</div>
                  </div>
                  <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-white font-mono">{referralCode}</div>
                    <div className="text-[#555570] text-xs">Your code</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function BillingPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <BillingPage />
    </Suspense>
  )
}

function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = Math.min((used / limit) * 100, 100)
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-violet-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[#8888a8] text-xs">{label}</span>
        <span className="text-white text-xs font-semibold">{used} / {limit} {unit}</span>
      </div>
      <div className="w-full h-2 bg-[#2a2a3d] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
