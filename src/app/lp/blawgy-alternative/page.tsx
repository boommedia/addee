import type { Metadata } from 'next'
import { Check, X, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blawgy Alternative for Agencies — Bloggy',
  description: 'Looking for a Blawgy alternative that handles multiple client sites? Bloggy is built for agencies — one dashboard, per-client brand voice, direct WordPress publish. Try free.',
  alternates: { canonical: 'https://bloggy.online/lp/blawgy-alternative' },
}

const COMPARISON = [
  { feature: 'Multi-client dashboard', blawgy: false, bloggy: true },
  { feature: 'Per-client brand voice', blawgy: false, bloggy: true },
  { feature: 'WordPress direct publish', blawgy: true, bloggy: true },
  { feature: 'Autoblog scheduler', blawgy: true, bloggy: true },
  { feature: 'SEO meta auto-generated', blawgy: false, bloggy: true },
  { feature: 'AI hero images (DALL-E 3)', blawgy: false, bloggy: true },
  { feature: 'Content calendar (all clients)', blawgy: false, bloggy: true },
  { feature: 'Team / multi-user access', blawgy: false, bloggy: true },
  { feature: 'Flat agency pricing (not per-site)', blawgy: false, bloggy: true },
  { feature: 'Internal link automation', blawgy: false, bloggy: true },
  { feature: 'Social repurposing', blawgy: false, bloggy: true },
]

export default function BlawgyAlternativePage() {
  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <header className="border-b border-[#2a2a3d]/60 bg-[#0a0900]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
            <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            Bloggy
          </a>
          <a href="/signup" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors">
            Try Free →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-14 px-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#1a1a26] border border-[#2a2a3d] text-[#8888a8] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          Blawgy Alternative
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
          The Blawgy alternative<br />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">built for agencies</span>
        </h1>
        <p className="text-lg text-[#9898b8] mb-8 leading-relaxed">
          Blawgy works great for one or two sites. But if you are managing 5, 10, or 20 client WordPress sites — you need a tool built for that workflow. Bloggy is that tool.
        </p>
        <a href="/signup" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-900/30">
          Start Free — No Card Required <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-[#555570] text-xs mt-3">2 free posts · 2 client sites · cancel anytime</p>
      </section>

      {/* The core problem */}
      <section className="py-12 px-6 bg-[#0d0d14] border-y border-[#2a2a3d]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Where Blawgy hits its ceiling for agencies</h2>
          <div className="space-y-4">
            {[
              { title: 'No multi-client dashboard', body: "Blawgy is organized around sites, not clients. Managing 10 clients means 10 separate setups with no unified view of what's publishing where." },
              { title: 'No per-client brand voice', body: "Every post gets the same tone. A law firm and a landscaping company should not sound identical — but without per-client configuration, they will." },
              { title: 'Per-site pricing compounds fast', body: "Blawgy charges per site. At 10 clients, you are paying 10× the entry price. Bloggy charges one flat fee for your entire agency roster." },
              { title: 'No SEO metadata generation', body: "Blawgy publishes posts, but meta titles, descriptions, and focus keywords still require manual entry. That is 3–5 minutes per post across 40+ posts per month." },
            ].map(item => (
              <div key={item.title} className="flex gap-4 bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
                <X className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                  <div className="text-sm text-[#8888a8] leading-relaxed">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Feature comparison</h2>
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-[#0d0d14] border-b border-[#2a2a3d] px-5 py-3">
            <div className="text-xs font-semibold text-[#6666a0]">Feature</div>
            <div className="text-xs font-semibold text-[#6666a0] text-center">Blawgy</div>
            <div className="text-xs font-semibold text-violet-400 text-center">Bloggy</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 px-5 py-3.5 ${i < COMPARISON.length - 1 ? 'border-b border-[#1e1e2e]' : ''}`}>
              <div className="text-sm text-[#c8c8e0]">{row.feature}</div>
              <div className="flex justify-center">
                {row.blawgy
                  ? <Check className="w-4 h-4 text-emerald-400" />
                  : <X className="w-4 h-4 text-rose-400/60" />}
              </div>
              <div className="flex justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-12 px-6 bg-[#0d0d14] border-y border-[#2a2a3d]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">The pricing difference at agency scale</h2>
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden mb-6">
            <div className="grid grid-cols-3 bg-[#0d0d14] border-b border-[#2a2a3d] px-5 py-3">
              <div className="text-xs font-semibold text-[#6666a0]">Client sites</div>
              <div className="text-xs font-semibold text-[#6666a0] text-center">Blawgy (per-site)</div>
              <div className="text-xs font-semibold text-violet-400 text-center">Bloggy (flat)</div>
            </div>
            {[
              { sites: '5 clients', blawgy: '~$95/mo', bloggy: '$49/mo' },
              { sites: '10 clients', blawgy: '~$190/mo', bloggy: '$99/mo' },
              { sites: '40 clients', blawgy: '~$760/mo', bloggy: '$149/mo' },
            ].map((r, i) => (
              <div key={r.sites} className={`grid grid-cols-3 px-5 py-3.5 ${i < 2 ? 'border-b border-[#1e1e2e]' : ''}`}>
                <div className="text-sm text-[#c8c8e0] font-medium">{r.sites}</div>
                <div className="text-sm text-rose-400 text-center">{r.blawgy}</div>
                <div className="text-sm text-emerald-400 font-bold text-center">{r.bloggy}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[#8888a8] text-sm">At 10 clients, Bloggy is roughly half the cost of Blawgy — and built specifically for the agency workflow.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Switch to an agency-first tool</h2>
          <p className="text-[#8888a8] mb-7 text-sm">Set up your first client in 5 minutes. 2 free posts, no card required.</p>
          <a href="/signup" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-900/30">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-[#2a2a3d] py-6 px-6 text-center">
        <div className="flex items-center justify-center gap-5 text-xs text-[#555570]">
          <a href="/" className="hover:text-white transition-colors">← Back to Bloggy</a>
          <a href="/blog/blawgy-vs-rightblogger-vs-bloggy" className="hover:text-white transition-colors">Full comparison post</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
