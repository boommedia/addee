import { Check, Sparkles, Palette, Film, Layers, Copy, RefreshCw, CalendarDays, FileText, Users } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing — AdDee',
  description: 'Simple, transparent pricing for AI ad creative generation. Start free, upgrade when you need more.',
}

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    annualMonthlyPrice: 0,
    posts: 2,
    brands: 1,
    featured: false,
    cta: 'Get Started Free',
    ctaHref: '/signup',
    features: [
      '2 ADs per month',
      '1 brand',
      'All platforms & formats',
      'Design Studio (Canva + Firefly)',
      '3 copy variations per AD',
    ],
  },
  {
    key: 'starter',
    name: 'Starter',
    price: 29,
    annualMonthlyPrice: 23,
    posts: 25,
    brands: 3,
    featured: false,
    cta: 'Start Starter',
    ctaHref: '/billing',
    features: [
      '25 ADs per month',
      '3 brands',
      'Everything in Free',
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
    cta: 'Start Growth',
    ctaHref: '/billing',
    features: [
      '100 ADs per month',
      '10 brands',
      'Everything in Starter',
      'Bulk generation (coming soon)',
      'Ad scheduler (coming soon)',
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
    cta: 'Start Agency',
    ctaHref: '/billing',
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

const FEATURES = [
  { icon: Sparkles, title: 'AI Ad Generator', desc: 'Generate 3 platform-ready copy variations in seconds. Instagram, TikTok, LinkedIn, Google Ads — all formats.' },
  { icon: Palette, title: 'Design Studio', desc: 'Adobe Firefly AI backgrounds + Canva templates. Go from brief to publish-ready creative in minutes.' },
  { icon: RefreshCw, title: 'Remix Winning Ads', desc: 'Paste a competitor or past high-performer. AdDee remixes it into your brand voice instantly.' },
  { icon: Layers, title: 'A/B Variants', desc: 'Conservative vs. aggressive versions of the same brief. Test what converts without extra effort.' },
  { icon: Film, title: 'Video Scripts', desc: 'TikTok, Reels, and YouTube Shorts scripts with hooks, beats, and CTAs written for you.' },
  { icon: Copy, title: 'Copy Lengths', desc: 'Short (150 chars), long (300 chars), and caption styles — three ad lengths from one brief.' },
]

const FAQ = [
  { q: 'What counts as one AD?', a: 'One generation = one AD, regardless of how many copy variations are returned (typically 3). Generating copy for Instagram and TikTok separately counts as 2 ADs.' },
  { q: 'Can I upgrade or downgrade anytime?', a: 'Yes. Plan changes take effect immediately and are prorated through your current billing cycle.' },
  { q: 'What is a "brand"?', a: 'A brand is a client or company profile with its own name, voice guidelines, logo, and target audience. Each brand can generate unlimited ADs.' },
  { q: 'Does Design Studio count against my AD limit?', a: 'No. Adobe Firefly image generation in Design Studio does not consume your AD limit — only copy generation does.' },
  { q: 'Is there a free trial?', a: 'The Free plan is permanent — 2 ADs per month, no credit card needed. Starter plans include a 7-day free trial.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from the billing portal anytime. You keep access through the end of your paid period.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#0a0900', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur border-b" style={{ background: 'rgba(10,9,0,0.95)', borderColor: 'rgba(202,138,4,0.2)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/home">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm transition-colors" style={{ color: '#b8a870' }}>Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: '#ca8a04' }}>
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border" style={{ background: 'rgba(202,138,4,0.1)', borderColor: 'rgba(202,138,4,0.3)', color: '#ca8a04' }}>
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#dde4f0' }}>
            Start free.<br /><span style={{ color: '#ca8a04' }}>Scale when you need it.</span>
          </h1>
          <p className="text-lg" style={{ color: '#b8a870' }}>
            Generate platform-ready ad creatives in your brand voice. No design skills needed.
          </p>
        </section>

        {/* Annual toggle note */}
        <section className="max-w-5xl mx-auto px-6 mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border" style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.2)', color: '#84cc16' }}>
            Save 20% with annual billing — switch at checkout
          </div>
        </section>

        {/* Plan cards */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(plan => (
              <div
                key={plan.key}
                className="relative rounded-2xl p-6 flex flex-col gap-4 border"
                style={plan.featured
                  ? { background: 'rgba(202,138,4,0.08)', borderColor: '#ca8a04', borderWidth: '2px' }
                  : { background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.28)' }}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap" style={{ background: '#ca8a04' }}>
                    Most Popular
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#7a6a40' }}>{plan.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black" style={{ color: '#dde4f0' }}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && <span className="text-sm mb-1.5" style={{ color: '#b8a870' }}>/mo</span>}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: '#7a6a40' }}>or ${plan.annualMonthlyPrice}/mo billed annually</p>
                  )}
                </div>

                <div className="text-xs pt-3 space-y-0.5" style={{ color: '#b8a870', borderTopColor: 'rgba(202,138,4,0.18)', borderTop: '1px solid' }}>
                  <div className="font-semibold" style={{ color: '#dde4f0' }}>
                    {plan.posts === 9999 ? 'Unlimited' : plan.posts} ADs/mo
                  </div>
                  <div>{plan.brands === 9999 ? 'Unlimited' : plan.brands} brand{plan.brands !== 1 ? 's' : ''}</div>
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#b8a870' }}>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className="w-full text-center text-sm font-bold py-2.5 rounded-xl transition-all block"
                  style={plan.featured
                    ? { background: '#ca8a04', color: 'white' }
                    : plan.key === 'free'
                    ? { background: 'rgba(132,204,22,0.15)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.3)' }
                    : { background: 'rgba(20,18,0,0.8)', color: 'white', border: '1px solid rgba(202,138,4,0.4)' }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t py-20 px-6" style={{ borderColor: 'rgba(202,138,4,0.15)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#dde4f0' }}>Everything included on every plan</h2>
            <p className="text-center text-sm mb-12" style={{ color: '#b8a870' }}>No feature gating on core tools. Limits are based on volume only.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(202,138,4,0.2), rgba(132,204,22,0.15))' }}>
                    <f.icon className="w-5 h-5" style={{ color: '#ca8a04' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: '#dde4f0' }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#b8a870' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t py-20 px-6" style={{ borderColor: 'rgba(202,138,4,0.15)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#dde4f0' }}>Frequently Asked Questions</h2>
            <div className="space-y-6">
              {FAQ.map(item => (
                <div key={item.q} className="border-b pb-6" style={{ borderColor: 'rgba(202,138,4,0.12)' }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: '#dde4f0' }}>{item.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#b8a870' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA footer */}
        <section className="border-t py-20 px-6 text-center" style={{ borderColor: 'rgba(202,138,4,0.15)' }}>
          <h2 className="text-3xl font-black mb-3" style={{ color: '#dde4f0' }}>Ready to generate your first AD?</h2>
          <p className="text-sm mb-8" style={{ color: '#b8a870' }}>Start free — no credit card required. Upgrade anytime.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ca8a04, #84cc16)', boxShadow: '0 4px 24px rgba(202,138,4,0.3)' }}>
            <Sparkles className="w-4 h-4" />
            Get Started Free
          </Link>
          <p className="text-xs mt-4" style={{ color: '#7a6a40' }}>2 free ADs per month. No credit card needed.</p>
        </section>
      </main>

      <footer className="border-t px-6 py-8" style={{ borderColor: 'rgba(202,138,4,0.15)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Logo />
          <div className="flex items-center gap-6 text-xs" style={{ color: '#7a6a40' }}>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:eric@boommedia.us" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs" style={{ color: '#7a6a40' }}>© 2026 Boom Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
