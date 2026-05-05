import type { Metadata } from 'next'
import { Check, Zap, Globe, Clock, Users, ArrowRight, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Blog Automation for Agencies — Bloggy',
  description: 'Generate, optimize & publish SEO blog posts for all your clients automatically. One dashboard, every WordPress site, zero copy-paste. Plans from $49/mo.',
  robots: { index: false, follow: false },
}

const STATS = [
  { value: '180+', label: 'Posts per month possible' },
  { value: '5 min', label: 'Setup per client' },
  { value: '97%', label: 'Gross margin on content' },
  { value: '$0', label: 'To start — free trial' },
]

const STEPS = [
  { n: '1', title: 'Add a client', body: 'Enter their brand voice, target keywords, and WordPress credentials. Takes 5 minutes.' },
  { n: '2', title: 'Queue topics or autoblog', body: 'Add a topic list or turn on the autoblogger. Set a weekly cadence and walk away.' },
  { n: '3', title: 'Posts go live automatically', body: 'Bloggy generates, optimizes, and publishes to WordPress. You review results, not drafts.' },
]

const FEATURES = [
  { icon: '✍️', title: 'AI Blog Generation', body: 'Claude Sonnet writes long-form, SEO-structured posts in under 30 seconds. Tables, charts, hero images included.' },
  { icon: '🌐', title: 'Direct WordPress Publish', body: 'Push to any WordPress site as draft, live, or scheduled — with featured image, tags, and SmartCrawl SEO fields.' },
  { icon: '🔄', title: 'Autoblog Scheduler', body: 'Queue topics and set a cadence. Posts generate and publish on autopilot. Zero manual work.' },
  { icon: '🏷️', title: 'Per-Client Brand Voice', body: 'Each client has their own tone, keywords, and style. A plumber and a law firm should not sound the same.' },
  { icon: '📊', title: 'SEO Metadata on Every Post', body: 'Meta title, description, and focus keyword written automatically. No manual Yoast entry, ever.' },
  { icon: '👥', title: 'Team Access', body: 'Invite writers and account managers. Everyone works in one place, no credential sharing.' },
]

const PLANS = [
  { name: 'Freelancer Starter', price: 49, sites: 5, posts: 20, highlight: false, cta: 'Start Free' },
  { name: 'Growth', price: 99, sites: 15, posts: 60, highlight: true, cta: 'Start Free' },
  { name: 'Agency', price: 149, sites: 40, posts: 175, highlight: false, cta: 'Start Free' },
]

const FAQS = [
  { q: 'Does Bloggy publish directly to WordPress?', a: 'Yes — it connects via the WordPress REST API and publishes as draft, live, or scheduled. Featured images, categories, tags, and SEO plugin fields are all included.' },
  { q: 'How many clients can I manage?', a: 'Freelancer Starter supports 5 client sites, Growth 15, Agency 40, Agency Max up to 150. Each client gets their own brand voice, keyword settings, and WordPress connection.' },
  { q: 'What AI model writes the posts?', a: "Bloggy uses Anthropic's Claude Sonnet 4.6 — one of the best models for long-form SEO writing. Claude Opus 4.7 is available as a premium option for higher-stakes content." },
  { q: 'Is there a free trial?', a: 'Every account starts with 2 free posts and 2 client sites. No credit card required.' },
]

export default function AgencyLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Minimal header */}
      <header className="border-b border-[#2a2a3d]/60 bg-[#0a0a0f]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
            <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            Bloggy
          </a>
          <a href="/signup" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors">
            Start Free Trial →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3 h-3" /> Built for digital marketing agencies
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5">
            Blog content for<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">every client, on autopilot</span>
          </h1>
          <p className="text-lg text-[#9898b8] max-w-2xl mx-auto mb-8 leading-relaxed">
            Bloggy generates SEO-optimized blog posts and publishes them directly to WordPress — across all your clients, from one dashboard. No copy-paste. No freelancers. No missed deadlines.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a href="/signup" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-900/30">
              Start Free — No Card Required
            </a>
            <a href="#how-it-works" className="bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
              See How It Works
            </a>
          </div>
          <p className="text-[#555570] text-xs">2 free posts · 2 client sites · no credit card</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#2a2a3d] bg-[#0d0d14] py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.value}>
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-[#6666a0] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-7">
            <div className="text-xs font-bold text-rose-400 tracking-widest uppercase mb-4">Before Bloggy</div>
            {[
              'Writer bills $80–$150 per post',
              'Copy-pasting into WordPress for every client',
              'Missing deadlines when writers go quiet',
              'Inconsistent brand voice across 10 clients',
              'Zero time left for strategy or growth',
            ].map(t => (
              <div key={t} className="flex items-start gap-2.5 mb-3 text-sm text-[#8888a8]">
                <span className="text-rose-500 mt-0.5 shrink-0">✗</span> {t}
              </div>
            ))}
          </div>
          {/* After */}
          <div className="bg-[#12121a] border border-violet-500/30 rounded-2xl p-7 shadow-lg shadow-violet-900/10">
            <div className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-4">After Bloggy</div>
            {[
              'Under $5 per post in tool costs',
              'Publishes directly to WordPress automatically',
              'Autoblogger runs 24/7, nothing missed',
              'Per-client brand voice on every post',
              '90 minutes/week manages 15 clients',
            ].map(t => (
              <div key={t} className="flex items-start gap-2.5 mb-3 text-sm text-[#c8c8e0]">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-6 bg-[#0d0d14] border-y border-[#2a2a3d]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">Up and running in under an hour</h2>
          <p className="text-[#8888a8]">Three steps from signup to your first client's post on WordPress.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 font-black text-lg flex items-center justify-center mx-auto mb-4">{s.n}</div>
              <div className="font-bold text-white mb-2">{s.title}</div>
              <div className="text-sm text-[#8888a8] leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-white text-center mb-10">Everything your agency needs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500/30 rounded-2xl p-5 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-bold text-white mb-1.5 text-sm">{f.title}</div>
              <div className="text-xs text-[#8888a8] leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-[#0d0d14] border-y border-[#2a2a3d]" id="pricing">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">Simple, agency-friendly pricing</h2>
          <p className="text-[#8888a8]">One flat monthly fee covers your whole client roster. No per-site charges.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {PLANS.map(p => (
            <div key={p.name} className={`rounded-2xl p-6 border ${p.highlight ? 'bg-violet-600/10 border-violet-500/50 shadow-lg shadow-violet-900/20' : 'bg-[#12121a] border-[#2a2a3d]'}`}>
              {p.highlight && <div className="text-xs font-bold text-violet-400 tracking-widest uppercase mb-3">Most Popular</div>}
              <div className="font-bold text-white text-lg mb-1">{p.name}</div>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white">${p.price}</span>
                <span className="text-[#6666a0] text-sm mb-1.5">/mo</span>
              </div>
              <div className="space-y-2 mb-6">
                {[`${p.sites} client sites`, `${p.posts} posts/month`, 'WordPress direct publish', 'Per-client brand voice', 'SEO metadata auto-generated'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#b0b0c8]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <a href="/signup" className={`block text-center font-bold py-2.5 rounded-xl text-sm transition-colors ${p.highlight ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-[#1e1e2e] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white'}`}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-[#555570] text-xs mt-6">All plans include a 7-day free trial. Annual billing saves 20%.</p>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Common questions</h2>
        <div className="space-y-4">
          {FAQS.map(f => (
            <div key={f.q} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
              <div className="font-semibold text-white text-sm mb-2">{f.q}</div>
              <div className="text-sm text-[#8888a8] leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-xl mx-auto bg-gradient-to-br from-violet-900/30 to-[#12121a] border border-violet-500/20 rounded-3xl p-10">
          <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Start your free trial today</h2>
          <p className="text-[#8888a8] mb-7 text-sm">2 posts and 2 client sites free. No credit card. Full platform access.</p>
          <a href="/signup" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-900/30">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-[#2a2a3d] py-6 px-6 text-center">
        <div className="flex items-center justify-center gap-1 text-sm font-bold text-white mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          Bloggy
        </div>
        <div className="flex items-center justify-center gap-5 text-xs text-[#555570]">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          <a href="/support" className="hover:text-white transition-colors">Support</a>
          <a href="/" className="hover:text-white transition-colors">bloggy.online</a>
        </div>
      </footer>
    </div>
  )
}
