import Link from 'next/link'
import { Check, Clock, Zap, Globe, Image, Share2, Sparkles, TrendingUp, Lock, Users, RefreshCw, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Addee — AI Ad Creatives & Social Content by Boom Media',
  description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice. Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more.',
  keywords: ['AI ad generator', 'social media content', 'ad creative tools', 'Instagram ads', 'LinkedIn ads', 'TikTok ads'],
}

const FEATURES = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/15 border-orange-500/25',
    title: 'AI Ad Generation',
    desc: 'Claude Sonnet writes brand-matched ad copy in seconds. 3 variations per platform, every format — feeds, stories, reels, carousels.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    color: 'text-red-400',
    bg: 'bg-red-500/15 border-red-500/25',
    title: 'One-Click Multi-Platform Publish',
    desc: 'Publish as draft or live directly to Instagram, LinkedIn, TikTok, Google Ads, Meta, Pinterest — all from one click.',
  },
  {
    icon: <Image className="w-5 h-5" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/25',
    title: 'Multi-Format Ad Templates',
    desc: 'Stories, feeds, reels, carousels, collection ads, video ads — auto-generated in platform-perfect dimensions.',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    color: 'text-orange-300',
    bg: 'bg-orange-500/15 border-orange-400/25',
    title: 'Brand Voice Training',
    desc: 'Upload brand guidelines, past ads, and tone examples. Every generated ad sounds like you — not a robot.',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-red-400',
    bg: 'bg-red-500/15 border-red-500/25',
    title: 'Performance Tracking',
    desc: 'Track CTR, conversions, ROAS, and impressions across all platforms from one unified dashboard.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/25',
    title: 'Team Collaboration',
    desc: 'Invite team members, set approval workflows, manage permissions per brand — no extra logins needed.',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/15 border-orange-500/25',
    title: 'Auto-Repurposing',
    desc: 'One ad becomes LinkedIn posts, email copy, and Twitter threads. No rewriting. One click, every channel.',
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    color: 'text-red-300',
    bg: 'bg-red-500/15 border-red-500/25',
    title: 'Client Approval Workflow',
    desc: 'Send any ad for client sign-off with one click. They approve or revise — no login required.',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: 29,
    brands: 5,
    ads: 50,
    features: ['5 Brand profiles', '50 ads/month', 'All platforms', 'Brand voice training', 'Basic analytics', 'Email support'],
    featured: false,
  },
  {
    name: 'Growth',
    price: 79,
    brands: 15,
    ads: 150,
    features: ['15 Brand profiles', '150 ads/month', 'Everything in Starter', 'Team collaboration (3 users)', 'Approval workflows', 'Priority support'],
    featured: true,
  },
  {
    name: 'Agency',
    price: 149,
    brands: 40,
    ads: 400,
    features: ['40 Brand profiles', '400 ads/month', 'Everything in Growth', 'Team collaboration (10 users)', 'Performance analytics', 'Slack support'],
    featured: false,
  },
  {
    name: 'Agency Max',
    price: 299,
    brands: 100,
    ads: 1000,
    features: ['100+ Brand profiles', '1000+ ads/month', 'Everything in Agency', 'White-label option', 'Custom integrations', 'Dedicated account manager'],
    featured: false,
  },
]

const FAQS = [
  { q: 'What AI model powers Addee?', a: "Addee runs on Anthropic's Claude Sonnet 4.6 — one of the most capable models for copywriting and brand voice consistency. Better copy, faster generation, ads that sound like your brand." },
  { q: 'How does brand voice training work?', a: 'Upload your brand guidelines, past ads, tone examples, and messaging pillars. Addee learns your brand and generates ads that sound like you — not a generic AI.' },
  { q: 'Can I edit ads before publishing?', a: 'Yes — every generated ad has a full editor built in. Edit copy, headlines, CTAs, hashtags, and visual elements before one-click publishing to all platforms.' },
  { q: 'Which platforms do you support?', a: 'Instagram (Feed, Stories, Reels), LinkedIn, TikTok, Google Ads, Meta (Facebook & Instagram), Twitter/X, Pinterest — with more coming in Q2 2026.' },
  { q: 'Is there a free trial?', a: 'Yes. Every account starts with 10 free ads and 2 brand slots. Full feature access. No credit card required. Cancel anytime.' },
  { q: 'Who is Addee built for?', a: "Addee is built for anyone managing ads for more than one brand — freelancers, solopreneurs, and agencies. If you're running ads for 2+ brands, Addee saves you 10–15 hours every week." },
  { q: 'Can I upgrade or downgrade?', a: 'Yes — change plans anytime from the Billing page. Changes take effect immediately with Stripe proration.' },
]

// Dark navy blue palette (like Bloggy's dark indigo, but in navy/blue tones with orange/red accents)
// bg-base: #060d1a   card: #0b1628   border: #162040   muted: #2a3a5a
// accent-primary: #ef4444 (red)  accent-2: #fb923c (orange)  accent-3: #f97316 (orange-600)

export default function HomePage() {
  return (
    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#060d1a', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── STICKY NAV ── */}
      <div className="sticky top-0 z-50">
        {/* Early access bar */}
        <div style={{ background: 'rgba(251,146,60,0.12)', borderBottom: '1px solid rgba(251,146,60,0.25)' }}
          className="py-2.5 text-center text-xs font-bold text-orange-300 tracking-wide">
          <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse mr-2 align-middle" />
          Addee Early Access — Founding pricing locked in forever · Get started free
        </div>
        <nav style={{ background: 'rgba(6,13,26,0.92)', borderBottom: '1px solid rgba(22,32,64,0.8)' }}
          className="backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded flex items-center justify-center font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #ef4444, #fb923c)' }}>A</div>
              <span className="font-black text-white">Addee</span>
              <span style={{ color: '#162040' }} className="mx-1 hidden sm:inline">·</span>
              <span style={{ color: '#4a6080' }} className="text-xs hidden sm:inline">by Boom Media</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {['#features:Features', '#roi:ROI', '#pricing:Pricing', '#faq:FAQ'].map(s => {
                const [href, label] = s.split(':')
                return <a key={href} href={href} style={{ color: '#4a6080' }}
                  className="hover:text-white text-sm transition-colors hidden sm:block">{label}</a>
              })}
              <Link href="/login" style={{ color: '#4a6080' }} className="hover:text-white text-xs sm:text-sm transition-colors">Sign In</Link>
              <Link href="/login"
                className="text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                Start Free
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-20 sm:pt-28 pb-20 text-center">
        {/* Big radial orange/red glow — same position as Bloggy's violet blob */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.18) 0%, rgba(251,146,60,0.08) 50%, transparent 70%)' }} />
          <div className="absolute top-32 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{ background: 'rgba(251,146,60,0.06)' }} />
          <div className="absolute top-10 right-1/4 w-[350px] h-[350px] rounded-full blur-3xl"
            style={{ background: 'rgba(239,68,68,0.05)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-orange-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border"
            style={{ background: 'rgba(251,146,60,0.12)', borderColor: 'rgba(251,146,60,0.3)' }}>
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            Early Access — Founding pricing locked in forever
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            One Dashboard.<br />
            <span style={{ backgroundImage: 'linear-gradient(90deg, #ef4444, #fb923c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every Brand Ad. Done.
            </span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#7a90b8' }}>
            Addee is built for freelancers, solopreneurs, and agencies who manage ads for more than one client.
            Generate, publish, and track performance for all your brands — from one login.
            As low as <span className="text-white font-semibold">$2.99 per brand.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold px-6 py-3.5 sm:px-9 sm:py-4 rounded-xl transition-all hover:opacity-90 text-sm shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 8px 32px rgba(239,68,68,0.35)' }}>
              Start Free — No Card Required
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#roi" className="hover:text-white text-sm transition-colors font-semibold" style={{ color: '#7a90b8' }}>
              See the math →
            </a>
          </div>

          {/* Stats pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              ['Claude Sonnet', 'Powered by'],
              ['Instagram · TikTok · LinkedIn', 'Publishes to'],
              ['Brand Voice AI', 'Trained on'],
              ['One-Click Publish', 'Shipped with'],
            ].map(([val, label]) => (
              <div key={val} className="rounded-xl px-3 py-3 text-center border"
                style={{ background: '#0b1628', borderColor: '#1a2d50' }}>
                <div className="text-white font-bold text-xs leading-tight">{val}</div>
                <div className="text-xs mt-1" style={{ color: '#3a5070' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY ── */}
      <section className="border-y px-6 py-14" style={{ borderColor: '#162040', background: '#080f1e' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-10" style={{ color: '#3a5070' }}>Real Agency. Real Results.</p>
          <div className="rounded-2xl p-8 border" style={{ background: '#0b1628', borderColor: 'rgba(239,68,68,0.25)' }}>
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border"
                  style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.25)' }}>
                  Case Study
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-black mb-3">Boom Media</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#7a90b8' }}>
                  Boom Media is a full-service digital marketing agency managing SEO, social media, and web design for local businesses across South Florida.
                  They built Addee to eliminate per-ad design costs and streamline ad delivery across their entire client base.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#7a90b8' }}>
                  With 15 active client brands, Boom Media generates 10 ads per platform per month, publishes directly to Instagram, LinkedIn, and Meta — delivering branded monthly performance reports without a designer on staff.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:w-72 w-full shrink-0">
                {[
                  { label: 'Brand Profiles Managed', value: '15', color: '#fb923c' },
                  { label: 'Ads Generated Per Month', value: '150+', color: '#ef4444' },
                  { label: 'Tool Cost Per Brand', value: '$5.27', color: '#34d399' },
                  { label: 'Content Margin', value: '~97%', color: '#34d399' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl p-4 text-center border" style={{ background: '#060d1a', borderColor: '#162040' }}>
                    <p className="text-xl sm:text-2xl font-black" style={{ color }}>{value}</p>
                    <p className="text-xs mt-1" style={{ color: '#3a5070' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN → SOLUTION ── */}
      <section className="border-b px-6 py-14" style={{ borderColor: '#162040', background: '#060d1a' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-10" style={{ color: '#3a5070' }}>Sound familiar?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { before: 'Paying $300–$800 per ad creative to freelance designers', after: 'Generate publish-ready ads for pennies with AI' },
              { before: 'Logging into 5+ platforms manually to post each brand\'s ads', after: 'Publish to every platform from one dashboard' },
              { before: '3–5 hours on ad copy, design, and publishing per campaign', after: '15 minutes from idea to live across all platforms' },
            ].map(({ before, after }) => (
              <div key={before} className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5 text-xs" style={{ color: '#4a6080' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>✕</span>
                  {before}
                </div>
                <div className="flex items-start gap-2.5 text-xs font-semibold" style={{ color: '#c8d8f0' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>✓</span>
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>What You Get</div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Everything you need to dominate ads</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: '#7a90b8' }}>One platform. Every format. Every platform. All your brands.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon, color, bg, title, desc }) => (
            <div key={title}
              className="rounded-2xl p-6 border transition-all hover:scale-[1.02]"
              style={{ background: '#0b1628', borderColor: '#1a2d50' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a2d50')}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${bg} ${color}`}>
                {icon}
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#7a90b8' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROI ── */}
      <section id="roi" className="px-6 py-20 border-t" style={{ borderColor: '#162040' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#34d399' }}>The Agency Math</div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">You're already charging for content.</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: '#7a90b8' }}>
              Addee doesn't replace your revenue — it replaces your cost.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { plan: 'Starter', price: 29, brands: 5, billing: 300, ads: 50 },
              { plan: 'Growth', price: 79, brands: 15, billing: 300, ads: 150 },
              { plan: 'Agency', price: 149, brands: 40, billing: 300, ads: 400 },
              { plan: 'Agency Max', price: 299, brands: 100, billing: 300, ads: 1000 },
            ].map(({ plan, price, brands, billing, ads }) => {
              const revenue = brands * billing
              const profit = revenue - price
              const margin = Math.round((profit / revenue) * 100)
              return (
                <div key={plan} className="rounded-2xl p-6 flex flex-col gap-4 border" style={{ background: '#0b1628', borderColor: '#1a2d50' }}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#7a90b8' }}>{plan}</p>
                    <p className="text-white font-black text-xl">${price}<span className="text-sm font-normal" style={{ color: '#7a90b8' }}>/mo</span></p>
                  </div>
                  <div className="space-y-2 text-xs border-t pt-4" style={{ borderColor: '#162040' }}>
                    <div className="flex justify-between">
                      <span style={{ color: '#3a5070' }}>Brand profiles</span>
                      <span className="text-white font-semibold">{brands}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#3a5070' }}>Ads/mo</span>
                      <span className="text-white font-semibold">{ads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#3a5070' }}>You bill clients*</span>
                      <span className="font-semibold" style={{ color: '#fb923c' }}>${revenue.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#3a5070' }}>Your tool cost</span>
                      <span className="font-semibold" style={{ color: '#7a90b8' }}>−${price}/mo</span>
                    </div>
                    <div className="flex justify-between pt-2 mt-2 border-t" style={{ borderColor: '#162040' }}>
                      <span className="font-semibold" style={{ color: '#7a90b8' }}>Content profit</span>
                      <span className="font-black" style={{ color: '#34d399' }}>${profit.toLocaleString()}/mo</span>
                    </div>
                  </div>
                  <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    <p className="text-xs font-black" style={{ color: '#34d399' }}>{margin}% margin</p>
                    <p className="text-xs" style={{ color: '#3a5070' }}>${(price / brands).toFixed(2)}/brand/mo</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-center text-xs mt-6" style={{ color: '#3a5070' }}>* Based on billing $300/brand/mo — many agencies charge $500–$1,500. Your margin only improves.</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#162040' }}>
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>How It Works</div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">From brief to published in 3 steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Set up your brand', desc: 'Add a brand profile with voice guidelines, target audience, tone preferences, and visual style. Takes 2 minutes.', detail: 'Brand voice · Tone · Target audience' },
            { step: '02', title: 'Generate ad creatives', desc: 'Enter a campaign brief or product. Addee writes 3 variations per platform in your brand voice — with headlines, copy, and CTAs.', detail: 'AI writing · 3 variations · Every format' },
            { step: '03', title: 'Edit, approve, publish', desc: 'Review and refine in the built-in editor. Send for client approval. Then one-click publish to every platform at once.', detail: 'Approval workflows · Bulk publish · All platforms' },
          ].map(({ step, title, desc, detail }) => (
            <div key={step} className="relative rounded-2xl p-7 border transition-colors" style={{ background: '#0b1628', borderColor: '#1a2d50' }}>
              <div className="text-4xl sm:text-6xl font-black mb-4 leading-none" style={{ color: '#162040' }}>{step}</div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#7a90b8' }}>{desc}</p>
              <p className="text-xs" style={{ color: '#3a5070' }}>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-t px-6 py-20" style={{ borderColor: '#162040', background: '#080f1e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>Pricing</div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Simple, predictable pricing</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: '#7a90b8' }}>Scale from freelancer to agency. No per-ad charges. No surprise fees.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING.map((plan) => (
              <div key={plan.name}
                className="rounded-2xl p-7 flex flex-col gap-5 border"
                style={plan.featured
                  ? { background: 'linear-gradient(145deg, #7f1d1d, #991b1b)', borderColor: '#ef4444', boxShadow: '0 0 50px rgba(239,68,68,0.3)' }
                  : { background: '#0b1628', borderColor: '#1a2d50' }
                }>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: plan.featured ? 'rgba(254,202,202,0.8)' : '#7a90b8' }}>{plan.name}</p>
                  <p className="font-black text-3xl text-white">${plan.price}
                    <span className="text-base font-normal" style={{ color: plan.featured ? 'rgba(254,202,202,0.7)' : '#7a90b8' }}>/mo</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: plan.featured ? 'rgba(254,202,202,0.7)' : '#3a5070' }}>{plan.brands} brands · {plan.ads} ads/mo</p>
                </div>
                <Link href="/login"
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-center transition-all"
                  style={plan.featured
                    ? { background: 'white', color: '#dc2626' }
                    : { border: '1px solid rgba(239,68,68,0.5)', color: '#fb923c', background: 'rgba(239,68,68,0.06)' }
                  }>
                  Get Started
                </Link>
                <div className="space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex gap-2 items-start">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.featured ? '#fca5a5' : '#fb923c' }} />
                      <span className="text-xs" style={{ color: plan.featured ? 'rgba(254,202,202,0.9)' : '#7a90b8' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: '#3a5070' }}>
            Every account starts with <span className="text-white font-semibold">10 free ads</span> and <span className="text-white font-semibold">2 brand slots</span>. No credit card required.
          </p>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap" className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#162040' }}>
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>Roadmap</div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Built. Shipping. Coming soon.</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: '#7a90b8' }}>Addee ships new features every week.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Multi-Brand Dashboard', desc: 'Switch between brands instantly. All in one login.', status: 'shipped' },
            { title: 'Brand Voice Training', desc: 'Upload guidelines. Every ad sounds like your brand.', status: 'shipped' },
            { title: 'Multi-Format Ad Generation', desc: 'Stories, reels, carousels, video — auto-generated.', status: 'shipped' },
            { title: 'Client Approval Workflow', desc: 'One-click send for approval. No login required.', status: 'shipped' },
            { title: 'Performance Analytics', desc: 'CTR, conversions, ROAS per platform per ad.', status: 'progress' },
            { title: 'Auto-Repurposing', desc: 'One ad becomes LinkedIn posts, email, Twitter threads.', status: 'progress' },
            { title: 'Competitor Analysis', desc: 'See what competitors run. Clone winning angles.', status: 'soon' },
            { title: 'White-Label Portal', desc: 'Brand Addee as your own. Client-facing dashboard.', status: 'soon' },
            { title: 'A/B Testing Automation', desc: 'Auto-generate and test 5 ad variations per platform.', status: 'soon' },
          ].map(({ title, desc, status }) => (
            <div key={title} className="rounded-2xl p-5 border" style={{
              background: '#0b1628',
              borderColor: status === 'shipped' ? 'rgba(52,211,153,0.25)' : status === 'progress' ? 'rgba(251,146,60,0.25)' : '#1a2d50',
            }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{
                  background: status === 'shipped' ? '#34d399' : status === 'progress' ? '#fb923c' : '#3a5070',
                  animation: status === 'progress' ? 'pulse 2s infinite' : 'none',
                }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{
                  color: status === 'shipped' ? '#34d399' : status === 'progress' ? '#fb923c' : '#3a5070',
                }}>
                  {status === 'shipped' ? 'Shipped' : status === 'progress' ? 'In Progress' : 'Coming Soon'}
                </span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
              <p className="text-xs" style={{ color: '#4a6080' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="border-t px-6 py-20" style={{ borderColor: '#162040', background: '#080f1e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>Integrations</div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Publish & Post Everywhere</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: '#7a90b8' }}>Addee connects to every platform your clients use.</p>
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#3a5070' }}>Social & Ad Platforms — Live ✓</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Instagram', borderColor: 'rgba(236,72,153,0.3)', bg: 'rgba(236,72,153,0.06)', color: '#f9a8d4' },
                  { name: 'LinkedIn', borderColor: 'rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.06)', color: '#93c5fd' },
                  { name: 'TikTok', borderColor: '#1a2d50', bg: '#0b1628', color: '#dde4f0' },
                  { name: 'Facebook', borderColor: 'rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.06)', color: '#93c5fd' },
                  { name: 'Twitter/X', borderColor: '#1a2d50', bg: '#0b1628', color: '#dde4f0' },
                  { name: 'Pinterest', borderColor: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.06)', color: '#fca5a5' },
                  { name: 'Google Ads', borderColor: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.06)', color: '#fde68a' },
                  { name: 'Meta Ads', borderColor: 'rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.06)', color: '#93c5fd' },
                ].map((p) => (
                  <div key={p.name} className="rounded-xl p-3 text-center border" style={{ background: p.bg, borderColor: p.borderColor }}>
                    <p className="font-semibold text-sm" style={{ color: p.color }}>{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#3a5070' }}>Coming Soon — Q2 2026</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Bluesky', 'Threads', 'Mastodon', 'Mailchimp'].map((name) => (
                  <div key={name} className="rounded-xl p-3 text-center border opacity-40" style={{ background: '#0b1628', borderColor: '#162040' }}>
                    <p className="font-semibold text-sm" style={{ color: '#3a5070' }}>{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>FAQ</div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Common questions</h2>
        </div>
        <div>
          {FAQS.map((item, i) => (
            <div key={item.q} className="py-6" style={{ borderBottom: i < FAQS.length - 1 ? '1px solid #162040' : 'none' }}>
              <h3 className="text-white font-bold text-sm mb-2">{item.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#7a90b8' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden border-t px-6 py-28 text-center" style={{ borderColor: '#162040' }}>
        {/* Bottom glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.16) 0%, rgba(251,146,60,0.06) 50%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">Ready to dominate ads?</h2>
          <p className="mb-8 text-sm" style={{ color: '#7a90b8' }}>Start free. 10 ads included. Set up your first brand in 30 seconds.</p>
          <Link href="/login"
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl transition-all hover:opacity-90 text-base"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 8px 40px rgba(239,68,68,0.4)' }}>
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs mt-4" style={{ color: '#3a5070' }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-12 border-t" style={{ borderColor: '#162040', background: '#080f1e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded flex items-center justify-center font-black text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #fb923c)' }}>A</div>
                <span className="font-black text-white">Addee</span>
              </div>
              <p className="text-xs" style={{ color: '#3a5070' }}>AI ad creatives for agencies. Built by Boom Media.</p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="space-y-2">
                <p className="font-bold text-white text-xs uppercase tracking-wider">Product</p>
                {[['#features', 'Features'], ['#pricing', 'Pricing'], ['#roadmap', 'Roadmap']].map(([href, label]) => (
                  <a key={href} href={href} className="block text-xs hover:text-white transition" style={{ color: '#3a5070' }}>{label}</a>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-bold text-white text-xs uppercase tracking-wider">Company</p>
                {[['mailto:eric@boommedia.us', 'Contact'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([href, label]) => (
                  <a key={href} href={href} className="block text-xs hover:text-white transition" style={{ color: '#3a5070' }}>{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-xs border-t" style={{ borderColor: '#162040', color: '#3a5070' }}>
            © 2026 Addee by Boom Media. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

