import Logo from '@/components/Logo'
import WaitlistForm from '@/components/WaitlistForm'
import EarlyAccessBanner from '@/components/EarlyAccessBanner'
import EarlyAccessSection from '@/components/EarlyAccessSection'
import DashboardMockup from '@/components/DashboardMockup'
import {
  Check, Zap, Globe, BarChart2, Image, Calendar, ArrowRight,
  FileText, Link2, Tag, Clock, Upload, Pencil, BarChart, Users, RefreshCw, DollarSign, TrendingUp,
  Search, Lock, Sparkles, GitBranch, Code2,
  Share2, Video, Mail, UserCheck, BookOpen, Copy, Languages,
} from 'lucide-react'

export const metadata = {
  title: 'Bloggy — AI Blog Management for Freelancers & Agencies',
  description: 'Manage client blogs across WordPress, Shopify & Webflow from one dashboard. Generate, publish, and track rankings for 2-unlimited client sites. Plans from $49/mo. Start free.',
  keywords: ['freelance blog management', 'multi-client WordPress management', 'AI blog generation', 'autoblog software', 'freelancer SEO tool', 'agency content automation'],
  alternates: { canonical: 'https://bloggy.online' },
  openGraph: {
    title: 'Bloggy — AI Blog Management for Freelancers & Agencies',
    description: 'Manage client blogs across WordPress, Shopify & Webflow from one dashboard. Generate, publish, and track rankings for 2-unlimited client sites.',
    url: 'https://bloggy.online',
    type: 'website',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Bloggy AI Blog Management' }],
  },
}

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    color: 'text-violet-400',
    bg: 'bg-violet-600/15 border-violet-500/20',
    title: 'AI Blog Generation',
    desc: 'Claude Sonnet writes long-form, SEO-structured, brand-matched content in under 30 seconds. Tables, charts, and AI hero images included.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-600/15 border-cyan-500/20',
    title: 'One-Click WordPress Publish',
    desc: 'Publish as draft, live, or scheduled — directly to any client WordPress site. Featured image, categories, and tags uploaded automatically.',
  },
  {
    icon: <Tag className="w-5 h-5" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-600/15 border-emerald-500/20',
    title: 'SmartCrawl SEO Integration',
    desc: 'Focus keyword, title tag, and meta description written by AI and pushed directly to SmartCrawl on every publish.',
  },
  {
    icon: <Upload className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-600/15 border-blue-500/20',
    title: 'Bulk Publish',
    desc: 'Select multiple posts and publish them all to WordPress in one click — as draft or live. Progress tracked in real time.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    color: 'text-orange-400',
    bg: 'bg-orange-600/15 border-orange-500/20',
    title: 'Post Scheduling',
    desc: 'Pick a future date and time — Bloggy sets the WordPress publish date and WP handles the release automatically.',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-pink-400',
    bg: 'bg-pink-600/15 border-pink-500/20',
    title: 'Autoblogging Scheduler',
    desc: 'Queue topics per client and set a cadence. Bloggy generates and publishes posts on autopilot — zero manual work.',
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-600/15 border-yellow-500/20',
    title: 'Internal Linking AI',
    desc: "AI scans a client's published posts and suggests internal link opportunities — with anchor text and one-click copy.",
  },
  {
    icon: <Pencil className="w-5 h-5" />,
    color: 'text-violet-400',
    bg: 'bg-violet-600/15 border-violet-500/20',
    title: 'Post Editor',
    desc: 'Edit any generated post in a live markdown editor before publishing. Word count updates in real time.',
  },
  {
    icon: <BarChart className="w-5 h-5" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-600/15 border-cyan-500/20',
    title: 'Client Reports',
    desc: 'One-click PDF reports per client: posts published, words written, SEO keywords, and live URLs — ready to send.',
  },
  {
    icon: <Image className="w-5 h-5" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-600/15 border-emerald-500/20',
    title: 'AI Hero Images',
    desc: 'DALL-E 3 generates a custom blog hero image for every post. Automatically uploaded to the WP media library.',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-600/15 border-blue-500/20',
    title: 'URL & YouTube to Blog',
    desc: 'Paste any article URL or YouTube video link — Bloggy extracts the content and rewrites it as a full SEO blog post.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    color: 'text-orange-400',
    bg: 'bg-orange-600/15 border-orange-500/20',
    title: 'Per-Client Brand Voice',
    desc: "Store tone, style, audience, and keywords per client. Every post sounds like they wrote it — not a robot.",
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-600/15 border-purple-500/20',
    title: 'Client Approval Workflow',
    desc: 'Send any post for client sign-off with one click. They get a branded email with the full post — approve or request revisions. No login required.',
  },
]

const PRICING = [
  {
    name: 'Freelancer Starter',
    price: 49,
    annualMonthlyPrice: 42,
    sites: 5,
    features: ['2-5 client sites', '20 posts/month', 'AI blog generation', 'WordPress & Shopify publish', 'Per-client brand voice', 'Basic keyword rankings', 'Email support'],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Growth',
    price: 99,
    annualMonthlyPrice: 84,
    sites: 15,
    features: ['5-15 client sites', '60 posts/month', 'Everything in Starter', 'Autoblog scheduler', 'AI hero images', 'Team collaboration (1 user)', 'URL & YouTube to blog', 'Approval workflows'],
    cta: 'Upgrade to Growth',
    featured: true,
  },
  {
    name: 'Agency',
    price: 149,
    annualMonthlyPrice: 127,
    sites: 40,
    features: ['15-40 client sites', '175 posts/month', 'Everything in Growth', 'LocalFalcon grid rankings', 'Competitive analysis', 'Team collaboration (up to 5)', 'White-label portal', 'Scheduled reports', 'Slack support'],
    cta: 'Upgrade to Agency',
    featured: false,
  },
  {
    name: 'Agency Max',
    price: 299,
    annualMonthlyPrice: 254,
    sites: 999,
    sitesDisplay: '40-150',
    features: ['40-150 client sites', '500 posts/month', 'Everything in Agency', 'White-label domain', 'Custom integrations', 'Phone support', 'Dedicated account manager', '24/7 support'],
    cta: 'Talk to Sales',
    featured: false,
  },
]

const FAQS = [
  {
    q: 'What AI model powers Bloggy?',
    a: "Bloggy runs on Anthropic's Claude Sonnet — one of the most capable models for long-form content. It consistently produces structured, SEO-optimized writing that ranks.",
  },
  {
    q: 'How does WordPress publishing work?',
    a: 'You enter your WordPress site URL, username, and an Application Password (generated in WP under Users → Profile). Bloggy publishes directly — including featured image, categories, tags, and SmartCrawl SEO fields.',
  },
  {
    q: 'What is SmartCrawl integration?',
    a: 'SmartCrawl is a popular SEO plugin by WPMUDEV. When you publish from Bloggy, it automatically fills in the Focus Keyphrase, Title Tag, and Meta Description fields — no manual entry needed.',
  },
  {
    q: 'How does autoblogging work?',
    a: 'You queue a list of topics per client and set a publishing cadence. Bloggy generates each post and publishes it directly to WordPress automatically — you just review the results.',
  },
  {
    q: 'Can I edit posts before publishing?',
    a: 'Yes — every generated post has a live markdown editor built in. Edit content, update headings, and the word count updates in real time before you push to WordPress.',
  },
  {
    q: 'What are client reports?',
    a: "One click generates a printable PDF report per client showing posts published this month, words written, live URLs, focus keywords, and all-time totals. Great for client billing and check-ins.",
  },
  {
    q: 'Who is Bloggy built for?',
    a: "Bloggy is built for anyone who manages more than one WordPress site — freelancers, solopreneurs, and agencies alike. If you're a freelancer running blogs for 2–5 clients, a solopreneur juggling multiple niche sites, or an agency with dozens of client retainers, Bloggy saves you hours every month. Most users bill $150–$400/mo per client for content — at $49/mo for 5 clients, your tool cost is less than the price of one post.",
  },
  {
    q: 'Is there a free trial?',
    a: 'Every account starts with 2 free blog posts and 2 client slots. No credit card required to try.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes — change plans anytime from the Billing page. Changes take effect immediately with Stripe proration, so you only pay for what you use.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Bloggy?',
            acceptedAnswer: { '@type': 'Answer', text: 'Bloggy is AI blog automation software built for freelancers, solopreneurs, and agencies who manage more than one WordPress site. It generates SEO-optimized blog posts using Claude AI, publishes them directly to WordPress, and manages content across all your client sites from a single dashboard.' },
          },
          {
            '@type': 'Question',
            name: 'How much does Bloggy cost?',
            acceptedAnswer: { '@type': 'Answer', text: 'Bloggy plans start at $49/month for freelancers managing up to 5 client sites. Growth is $99/month for up to 15 sites with autoblog and team features. Agency is $149/month for up to 40 sites with LocalFalcon rankings and white-label reports. Agency Max is $299/month for up to 150 sites with custom integrations and 24/7 support.' },
          },
          {
            '@type': 'Question',
            name: 'Does Bloggy publish directly to WordPress?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Bloggy connects to any WordPress site via the REST API and publishes posts directly as draft, live, or scheduled — including featured images, categories, tags, and SEO metadata via Yoast or SmartCrawl.' },
          },
          {
            '@type': 'Question',
            name: 'What AI model does Bloggy use to write blog posts?',
            acceptedAnswer: { '@type': 'Answer', text: 'Bloggy uses Claude Sonnet 4.6 by Anthropic as the default generation model, with Claude Opus 4.7 available for premium posts. Claude produces more consistent long-form content and better keyword integration than GPT-based tools.' },
          },
          {
            '@type': 'Question',
            name: 'Can Bloggy manage blog content for multiple clients?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes — multi-client management is the core use case. Each client has its own brand voice, keyword settings, WordPress credentials, and autoblogging schedule. All clients are managed from one dashboard under one login.' },
          },
          {
            '@type': 'Question',
            name: 'What is autoblogging?',
            acceptedAnswer: { '@type': 'Answer', text: 'Autoblogging is the automated generation and publishing of blog content on a defined schedule. You queue topics per client, set a cadence (e.g. weekly), and Bloggy generates and publishes posts automatically — no manual work required.' },
          },
          {
            '@type': 'Question',
            name: 'Is there a free trial?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Bloggy offers a free trial with 2 posts and 2 client sites — no credit card required. You can test the full generation and WordPress publish workflow before upgrading.' },
          },
        ],
      })}} />

      {/* Sticky wrapper: announcement bar + nav */}
      <div className="sticky top-0 z-50">
        <EarlyAccessBanner />
        <nav className="border-b border-[#2a2a3d]/60 bg-[#0a0a0f]/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-[#2a2a3d] mx-1 hidden sm:inline">·</span>
              <span className="text-[#8888a8] text-xs hidden sm:inline">by Boom Media</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="#features" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Features</a>
              <a href="#roi" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">ROI</a>
              <a href="#early-access" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors font-semibold hidden sm:block">Early Access</a>
              <a href="#pricing" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Pricing</a>
              <a href="#faq" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">FAQ</a>
              <a href="/support" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Support</a>
              <a href="https://discord.gg/9avYXden" target="_blank" rel="noopener noreferrer" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Community</a>
              <a href="/login" className="text-[#8888a8] hover:text-white text-xs sm:text-sm transition-colors">Sign In</a>
              <a href="/signup" className="bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors whitespace-nowrap">
                Start Free
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <a href="#early-access" className="inline-flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/25 text-yellow-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 hover:bg-yellow-500/20 transition-colors">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            Early Access — 50% off for 1 year · Limited spots
          </a>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
            One Dashboard.<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Every Client Blog. Done.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#8888a8] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Bloggy is built for freelancers, solopreneurs, and agencies who manage more than one WordPress site.
            Generate, publish, and track SEO blog posts for all your clients — from one login. As low as <span className="text-white font-semibold">$9.80 per client.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-3 sm:px-8 sm:py-3.5 rounded-xl transition-colors text-sm"
            >
              Start Free — No Card Required
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#roi" className="text-[#8888a8] hover:text-white text-sm transition-colors font-semibold">
              See the math →
            </a>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              ['Claude Sonnet', 'Powered by'],
              ['DALL-E 3', 'Images via'],
              ['WordPress', 'Publishes to'],
              ['SmartCrawl', 'SEO via'],
            ].map(([val, label]) => (
              <div key={val} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-3 text-center">
                <div className="text-white font-bold text-sm leading-none">{val}</div>
                <div className="text-[#555570] text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boom Media Case Study */}
      <section className="border-y border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#555570] text-xs font-bold uppercase tracking-widest mb-10">Real Agency. Real Results.</p>
          <div className="bg-[#12121a] border border-violet-500/20 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-violet-600/15 border border-violet-500/20 text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  Case Study
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-black mb-3">Boom Media</h3>
                <p className="text-[#8888a8] text-sm leading-relaxed mb-4">
                  Boom Media is a full-service digital marketing agency managing SEO, social media, and web design for local businesses across South Florida.
                  They built Bloggy to eliminate per-post content costs and streamline blog delivery across their entire client base.
                </p>
                <p className="text-[#8888a8] text-sm leading-relaxed">
                  With 15 active client sites, Boom Media generates 4 SEO posts per client per month, publishes directly to each WordPress site, and delivers branded monthly reports — all without a content writer on staff.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:w-72 w-full shrink-0">
                {[
                  { label: 'Client Sites Managed', value: '15', color: 'text-violet-400' },
                  { label: 'Posts Per Month', value: '60', color: 'text-cyan-400' },
                  { label: 'Tool Cost Per Client', value: '$3.27', color: 'text-emerald-400' },
                  { label: 'Content Margin', value: '~95%', color: 'text-emerald-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4 text-center">
                    <p className={`text-xl sm:text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-[#555570] text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain → Solution */}
      <section className="border-b border-[#2a2a3d]/50 bg-[#0a0a0f] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#555570] text-xs font-bold uppercase tracking-widest mb-8">Sound familiar?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { before: 'Paying $100–$300 per blog post to freelance writers', after: 'Generate publish-ready posts for pennies with AI' },
              { before: 'Logging into 10 different WordPress sites to post content', after: 'Publish to every client site from one dashboard' },
              { before: 'Manually filling in SEO title, meta, and keywords each time', after: 'SEO fields auto-filled and pushed via SmartCrawl' },
            ].map(({ before, after }) => (
              <div key={before} className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5 text-xs text-[#555570]">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-[10px] font-bold shrink-0 mt-0.5">✕</span>
                  {before}
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#c8c8d8] font-semibold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section id="roi" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">The Agency Math</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">You're already charging for content.</h2>
          <p className="text-[#8888a8] mt-3 max-w-xl mx-auto text-sm">
            Bloggy doesn't replace your revenue — it replaces your cost. Here's what the numbers look like at each plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { plan: 'Freelancer Starter', price: 49, clients: 5, billing: 200, posts: 20 },
            { plan: 'Growth', price: 99, clients: 15, billing: 200, posts: 60 },
            { plan: 'Agency', price: 149, clients: 40, billing: 200, posts: 175 },
            { plan: 'Agency Max', price: 299, clients: 150, billing: 200, posts: 500 },
          ].map(({ plan, price, clients, billing, posts }) => {
            const revenue = clients * billing
            const profit = revenue - price
            const margin = Math.round((profit / revenue) * 100)
            return (
              <div key={plan} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <p className="text-[#8888a8] text-xs font-bold uppercase tracking-wider mb-1">{plan}</p>
                  <p className="text-white font-black text-xl">${price}<span className="text-[#8888a8] text-sm font-normal">/mo</span></p>
                </div>
                <div className="space-y-2 text-xs border-t border-[#2a2a3d] pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#555570]">Client sites</span>
                    <span className="text-white font-semibold">{clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555570]">Posts/mo</span>
                    <span className="text-white font-semibold">{posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555570]">You bill clients*</span>
                    <span className="text-cyan-400 font-semibold">${revenue.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555570]">Your tool cost</span>
                    <span className="text-[#8888a8] font-semibold">−${price}/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-[#2a2a3d] pt-2 mt-2">
                    <span className="text-[#8888a8] font-semibold">Content profit</span>
                    <span className="text-emerald-400 font-black">${profit.toLocaleString()}/mo</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-center">
                  <p className="text-emerald-400 text-xs font-black">{margin}% margin</p>
                  <p className="text-[#555570] text-xs">${(price / clients).toFixed(2)}/client/mo tool cost</p>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-center text-[#555570] text-xs mt-6">* Based on billing $200/client/mo for content — many agencies charge $300–$500. Your margin only improves.</p>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-[#2a2a3d]/50">
        <div className="text-center mb-14">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">How It Works</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">From brief to published in 3 steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Set up your clients',
              desc: "Add a client profile with brand voice, target keywords, and WordPress credentials. Connect SmartCrawl for automatic SEO. Takes 2 minutes.",
              detail: 'Brand voice · WordPress credentials · SmartCrawl SEO',
            },
            {
              step: '02',
              title: 'Generate or queue posts',
              desc: "Enter a topic, paste a URL, or drop a YouTube link. Bloggy writes an SEO post with a hero image, tables, and charts. Or queue topics and walk away.",
              detail: 'AI writing · Hero images · Autoblog queue',
            },
            {
              step: '03',
              title: 'Publish, schedule, or bulk send',
              desc: "One click publishes to WordPress — as draft, live, or scheduled. Categories, tags, and SmartCrawl fields filled automatically. Bulk publish across all clients.",
              detail: 'Scheduling · Bulk publish · Categories & tags',
            },
          ].map(({ step, title, desc, detail }) => (
            <div key={step} className="relative bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-7 hover:border-violet-500/30 transition-colors">
              <div className="text-3xl sm:text-5xl font-black text-[#1a1a26] mb-4 leading-none">{step}</div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-[#8888a8] text-sm leading-relaxed mb-4">{desc}</p>
              <p className="text-[#555570] text-xs">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT SCREENSHOTS ── */}
      <section id="product" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#2a2a3d]/50">
        <div className="text-center mb-14">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Product Tour</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">See Bloggy in action</h2>
          <p className="text-[#8888a8] mt-3 max-w-xl mx-auto text-sm">
            A single dashboard to generate, manage, and publish content for every client — no switching tabs, no copy-pasting.
          </p>
        </div>

        {/* Large hero mockup — Dashboard */}
        <div className="mb-10">
          <DashboardMockup />
        </div>

        {/* 6-up feature highlight grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* 1 — Post History */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-colors group">
            <div className="border-b border-[#2a2a3d] bg-[#0d0d14] px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/></div>
              <div className="flex-1 bg-[#1a1a26] rounded px-2 py-0.5 text-[10px] text-[#555570] font-mono">bloggy.online/posts</div>
            </div>
            <div className="p-4">
              <div className="space-y-1.5">
                {[
                  { title: 'Best HVAC Tips for South Florida Homes', words: '1,847', status: 'Live', color: 'emerald' },
                  { title: 'How to Choose a Local Plumber', words: '1,423', status: 'Draft', color: 'yellow' },
                  { title: 'Signs Your AC Unit Needs Replacement', words: '2,104', status: 'Live', color: 'emerald' },
                  { title: '5 Kitchen Remodel Trends for 2025', words: '1,651', status: 'Local', color: '[#555570]' },
                ].map(({ title, words, status, color }) => (
                  <div key={title} className="flex items-center gap-2 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-2.5 py-1.5">
                    <div className="flex-1 text-[#c8c8d8] text-xs truncate">{title}</div>
                    <div className="text-[#555570] text-[10px] shrink-0">{words}w</div>
                    <span className={`text-${color} text-[10px] px-1.5 py-0.5 rounded-full border border-${color}/20 bg-${color}/10 shrink-0`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-white font-bold text-sm">Post History</div>
              <div className="text-[#555570] text-xs mt-0.5">Every generated post saved with full edit, republish, and bulk-export controls.</div>
            </div>
          </div>

          {/* 2 — Client Management */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-colors group">
            <div className="border-b border-[#2a2a3d] bg-[#0d0d14] px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/></div>
              <div className="flex-1 bg-[#1a1a26] rounded px-2 py-0.5 text-[10px] text-[#555570] font-mono">bloggy.online/clients</div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {[
                { name: 'Acme Roofing', industry: 'Home Services', posts: '4/5', wp: true, color: '#6d28d9' },
                { name: 'Bay Dental', industry: 'Healthcare', posts: '3/5', wp: true, color: '#0891b2' },
                { name: 'FitLife Gym', industry: 'Fitness', posts: '5/5', wp: false, color: '#059669' },
                { name: 'LMN Law Firm', industry: 'Legal', posts: '2/5', wp: true, color: '#7c3aed' },
              ].map(({ name, industry, posts, wp, color }) => (
                <div key={name} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-black shrink-0" style={{ background: color }}>{name[0]}</div>
                    <div className="text-white text-[10px] font-bold truncate">{name}</div>
                  </div>
                  <div className="text-[#555570] text-[9px]">{industry}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[#8888a8] text-[9px]">{posts} posts</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded-full border ${wp ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10'}`}>
                      {wp ? 'WP ✓' : 'WP —'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="text-white font-bold text-sm">Client Profiles</div>
              <div className="text-[#555570] text-xs mt-0.5">Brand voice, WordPress credentials, target keywords, and post usage tracked per client.</div>
            </div>
          </div>

          {/* 3 — Post Editor + Stats */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-colors group">
            <div className="border-b border-[#2a2a3d] bg-[#0d0d14] px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/></div>
              <div className="flex-1 bg-[#1a1a26] rounded px-2 py-0.5 text-[10px] text-[#555570] font-mono">bloggy.online/posts/[id]</div>
            </div>
            <div className="p-4 flex gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold mb-2 truncate">10 Local SEO Strategies for 2025</div>
                <div className="space-y-1 text-[10px] text-[#8888a8] leading-relaxed">
                  <div className="h-2 bg-[#2a2a3d] rounded w-full" />
                  <div className="h-2 bg-[#2a2a3d] rounded w-5/6" />
                  <div className="h-2 bg-[#2a2a3d] rounded w-full" />
                  <div className="h-2 bg-[#2a2a3d] rounded w-3/4" />
                  <div className="h-2 bg-[#1a1a26] rounded w-full mt-2" />
                  <div className="h-2 bg-[#1a1a26] rounded w-5/6" />
                  <div className="h-2 bg-[#1a1a26] rounded w-full" />
                </div>
              </div>
              <div className="w-24 shrink-0 space-y-1.5">
                {[
                  { label: 'Words', val: '1,847', color: 'text-violet-400' },
                  { label: 'Headings', val: '8', color: 'text-yellow-400' },
                  { label: 'Read', val: '~9 min', color: 'text-cyan-400' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-1.5 text-center">
                    <div className={`${color} text-xs font-bold`}>{val}</div>
                    <div className="text-[#555570] text-[9px]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-white font-bold text-sm">Post Editor & Analytics</div>
              <div className="text-[#555570] text-xs mt-0.5">Live markdown editor with real-time word count, headings, and reading time right in the sidebar.</div>
            </div>
          </div>

          {/* 4 — WordPress Publishing */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-colors group">
            <div className="border-b border-[#2a2a3d] bg-[#0d0d14] px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/></div>
              <div className="flex-1 bg-[#1a1a26] rounded px-2 py-0.5 text-[10px] text-[#555570] font-mono">WordPress Publishing</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5">
                <div className="text-[#555570] text-[9px] mb-1">SEO Meta</div>
                <div className="text-[#c8c8d8] text-[10px] font-medium">10 Local SEO Strategies for Small Businesses</div>
                <div className="text-[#555570] text-[9px] mt-1">Discover the top 10 local SEO strategies to help small businesses rank…</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2">
                  <div className="text-[#555570] text-[9px]">Focus Keyword</div>
                  <div className="text-violet-400 text-[10px] font-semibold">local SEO strategies</div>
                </div>
                <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2">
                  <div className="text-[#555570] text-[9px]">Status</div>
                  <div className="text-emerald-400 text-[10px] font-semibold">● Live</div>
                </div>
              </div>
              <div className="bg-emerald-600 rounded-lg py-2 text-center text-white text-[10px] font-bold">
                ✓ Published to WordPress
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-white font-bold text-sm">One-Click WordPress Publish</div>
              <div className="text-[#555570] text-xs mt-0.5">Title tag, meta description, focus keyword, and hero image pushed in a single click. SmartCrawl auto-filled.</div>
            </div>
          </div>

          {/* 5 — Autoblog Scheduler */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-colors group">
            <div className="border-b border-[#2a2a3d] bg-[#0d0d14] px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/><div className="w-2 h-2 rounded-full bg-[#2a2a3d]"/></div>
              <div className="flex-1 bg-[#1a1a26] rounded px-2 py-0.5 text-[10px] text-[#555570] font-mono">bloggy.online/autoblog</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[#8888a8] text-[9px] font-semibold uppercase tracking-wider">Topic Queue — Acme Roofing</div>
                <span className="text-emerald-400 text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">Active</span>
              </div>
              {[
                { topic: 'Roof repair vs replacement cost guide', status: 'Queued' },
                { topic: 'How long does a roof installation take?', status: 'Queued' },
                { topic: 'Best roofing materials for Florida weather', status: 'Done' },
                { topic: 'Emergency roof repair: what to do first', status: 'Done' },
              ].map(({ topic, status }) => (
                <div key={topic} className="flex items-center gap-2 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-2.5 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'Done' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                  <div className="flex-1 text-[#c8c8d8] text-[10px] truncate">{topic}</div>
                  <span className={`text-[9px] shrink-0 ${status === 'Done' ? 'text-emerald-400' : 'text-yellow-400'}`}>{status}</span>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="text-white font-bold text-sm">Autoblog Scheduler</div>
              <div className="text-[#555570] text-xs mt-0.5">Queue topics per client. Bloggy generates and publishes on autopilot at your chosen cadence.</div>
            </div>
          </div>

          {/* 6 — Always evolving callout */}
          <div className="bg-gradient-to-br from-violet-600/15 to-cyan-600/5 border border-violet-500/25 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <span className="text-violet-400 text-sm">⚡</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-semibold">Active development</span>
              </div>
              <h3 className="text-white font-black text-lg mb-3">Always getting better</h3>
              <p className="text-[#8888a8] text-sm leading-relaxed mb-4">
                Bloggy ships new features and improvements every week. What you see today is just the beginning — every agency feature request shapes what we build next.
              </p>
              <div className="space-y-2">
                {[
                  'New features released weekly',
                  'Feedback from freelancers & agencies drives the roadmap',
                  'Built by people who manage real client sites',
                  'Discord community for direct input',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-[#c8c8d8]">
                    <span className="w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-[9px] shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <a href="/signup" className="mt-6 w-full text-center bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors block">
              Start Free — 2 Posts Included →
            </a>
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#2a2a3d]/50">
        <div className="text-center mb-14">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Features</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Everything your agency needs</h2>
          <p className="text-[#8888a8] mt-3 max-w-xl mx-auto text-sm">
            No duct tape. No 5-tool stack. Bloggy handles the entire content pipeline end to end.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, color, bg, title, desc }) => (
            <div key={title} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${bg} ${color}`}>
                {icon}
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
              <p className="text-[#8888a8] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[#555570] text-xs font-bold uppercase tracking-widest mb-8">Built on trusted infrastructure</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            {[
              { name: 'Anthropic Claude', role: 'AI writing engine' },
              { name: 'DALL-E 3', role: 'Hero image generation' },
              { name: 'Stripe', role: 'Secure billing' },
              { name: 'Supabase', role: 'Database & auth' },
              { name: 'Vercel', role: 'Global CDN hosting' },
            ].map(({ name, role }) => (
              <div key={name} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-3 py-3">
                <p className="text-white text-xs font-bold">{name}</p>
                <p className="text-[#555570] text-xs mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access */}
      <EarlyAccessSection />

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Pricing</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Priced for how many sites you manage</h2>
          <p className="text-[#8888a8] mt-3 max-w-xl mx-auto text-sm">
            Whether you're a freelancer with 3 clients or an agency with 50, every plan is built around 4 posts per client per month. Scale up as you grow.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICING.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col gap-4 ${
                plan.featured
                  ? 'bg-gradient-to-b from-violet-600/20 to-violet-600/5 border-2 border-violet-500'
                  : 'bg-[#12121a] border border-[#2a2a3d]'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div>
                <div className="text-[#8888a8] text-xs font-bold uppercase tracking-wider mb-2">{plan.name}</div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">${plan.price}</span>
                  <span className="text-[#8888a8] text-sm mb-1">/mo</span>
                </div>
              </div>
              <div className="text-xs text-[#8888a8] space-y-1 border-t border-[#2a2a3d] pt-4">
                <div className="text-white font-semibold">{plan.sitesDisplay || plan.sites} client sites</div>
                {!plan.sitesDisplay && <div className="text-emerald-400 font-semibold pt-1">${(plan.price / plan.sites).toFixed(2)}/client/mo</div>}
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#c8c8d8]">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className={`w-full text-center text-xs font-bold py-2.5 rounded-lg transition-colors ${
                  plan.featured
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'bg-[#1a1a26] hover:bg-[#2a2a3d] text-white border border-[#2a2a3d]'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-[#8888a8] text-xs mt-6">
          Every account starts with <span className="text-white font-semibold">2 free posts</span> and <span className="text-white font-semibold">2 client slots</span>. No credit card required. &nbsp;·&nbsp; Upgrade or cancel anytime.
        </p>
      </section>

      {/* Roadmap / Coming Soon */}
      <section id="roadmap" className="px-6 py-20 border-t border-[#2a2a3d]/50">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Product Roadmap
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">We&apos;re just getting started</h2>
            <p className="text-[#8888a8] text-sm max-w-xl mx-auto leading-relaxed">
              Bloggy is growing fast. Here&apos;s everything we&apos;re building — 10 optional add-ons and 8 features shipping free to every plan. Early access members get it all first.
            </p>
            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
              {[
                { value: '10', label: 'Add-ons in dev' },
                { value: '8',  label: 'Free feature updates' },
                { value: 'Q3', label: 'First wave shipping' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-black text-2xl">{s.value}</div>
                  <div className="text-[#555570] text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Power-up Add-ons ── */}
          <div className="mb-12">
            <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
              <div>
                <h3 className="text-white font-black text-lg mb-0.5">Power-up Add-ons</h3>
                <p className="text-[#8888a8] text-xs">Optional bolt-ons priced individually — bolt on only what your agency needs.</p>
              </div>
              <span className="text-[#555570] text-xs">Priced per workspace · cancel anytime</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              {/* Rankings History Pro */}
              <div className="bg-[#12121a] border border-violet-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-4.5 h-4.5 text-violet-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-600/15 border border-violet-500/20 px-2 py-0.5 rounded-full shrink-0">$8/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Rankings History Pro</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Weekly automated rank checks stored as history. Trend charts, keyword movement alerts, and exportable reports per client.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q3 2025</span>
                </div>
              </div>

              {/* White-label Portal */}
              <div className="bg-[#12121a] border border-cyan-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Globe className="w-4.5 h-4.5 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-600/15 border border-cyan-500/20 px-2 py-0.5 rounded-full shrink-0">$15/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">White-label Client Portal</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Your domain, your brand. Clients see rankings, posts, and reports — zero Bloggy branding anywhere.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q3 2025</span>
                </div>
              </div>

              {/* Competitor Gap Analysis */}
              <div className="bg-[#12121a] border border-emerald-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Search className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-600/15 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">$15/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Competitor Gap Analysis</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Surface every keyword competitors rank for that you don&apos;t. One click to generate a post and close the gap.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q4 2025</span>
                </div>
              </div>

              {/* Branded Monthly Reports */}
              <div className="bg-[#12121a] border border-orange-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 text-orange-400" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 bg-orange-600/15 border border-orange-500/20 px-2 py-0.5 rounded-full">$8/mo</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">Agency fave</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Branded Monthly Reports</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Auto-generated PDF SEO reports emailed to each client every month. Rankings, posts published, traffic estimates — your logo on the cover.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q3 2025</span>
                </div>
              </div>

              {/* Social Media Autopilot */}
              <div className="bg-[#12121a] border border-pink-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-pink-600/15 border border-pink-500/20 flex items-center justify-center shrink-0">
                    <Share2 className="w-4.5 h-4.5 text-pink-400" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 bg-pink-600/15 border border-pink-500/20 px-2 py-0.5 rounded-full">$15/mo</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">Most requested</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Social Media Autopilot</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Every blog post auto-repurposed into LinkedIn, Facebook, and X posts. Auto-schedule or send via Buffer/Zapier webhook.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q3 2025</span>
                </div>
              </div>

              {/* AI Image Pack */}
              <div className="bg-[#12121a] border border-blue-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Image className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-600/15 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">$8/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">AI Image Pack</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Generate a unique hero image + 2 inline images per post using Flux AI. Uploaded automatically to the WordPress media library.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q4 2025</span>
                </div>
              </div>

              {/* Video Script Generator */}
              <div className="bg-[#12121a] border border-yellow-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-yellow-600/15 border border-yellow-500/20 flex items-center justify-center shrink-0">
                    <Video className="w-4.5 h-4.5 text-yellow-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-300 bg-yellow-600/15 border border-yellow-500/20 px-2 py-0.5 rounded-full shrink-0">$8/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Video Script Generator</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Convert any blog post into a YouTube script — hook, timestamps, B-roll notes, and CTA. Download or push to Google Docs.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q4 2025</span>
                </div>
              </div>

              {/* Email Newsletter Digest */}
              <div className="bg-[#12121a] border border-teal-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/15 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-600/15 border border-teal-500/20 px-2 py-0.5 rounded-full shrink-0">$8/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Email Newsletter Digest</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Turn each month&apos;s posts into a branded email newsletter. One-click send via Mailchimp or Resend to a client mailing list.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q4 2025</span>
                </div>
              </div>

              {/* Client Approval Workflow */}
              <div className="bg-[#12121a] border border-emerald-500/30 rounded-2xl p-5 flex flex-col gap-3 ring-1 ring-emerald-500/10">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4.5 h-4.5 text-purple-400" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-600/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">✓ Live Now</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">Included free</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Client Approval Workflow</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Send any post for client sign-off with one click. They get a branded email with the full post — approve or request revisions. No client login required.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">✓ Available on all plans</span>
                </div>
              </div>

              {/* Search Console Sync */}
              <div className="bg-[#12121a] border border-red-500/20 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/20 flex items-center justify-center shrink-0">
                    <BarChart className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 bg-red-600/15 border border-red-500/20 px-2 py-0.5 rounded-full shrink-0">$8/mo</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm mb-1">Search Console Sync</div>
                  <p className="text-[#8888a8] text-xs leading-relaxed">Pull real impressions, clicks, and CTR from Google Search Console per post. Surface which posts need rewrites to convert.</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2a3d]">
                  <span className="text-[#555570] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Q1 2026</span>
                </div>
              </div>

            </div>
          </div>

          {/* ── Shipping Free to All Plans ── */}
          <div>
            <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
              <div>
                <h3 className="text-white font-black text-lg mb-0.5">Shipping free to all plans</h3>
                <p className="text-[#8888a8] text-xs">8 features being built into every subscription at no extra cost.</p>
              </div>
              <span className="text-emerald-400 text-xs font-semibold">No price increase — ever</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: <RefreshCw className="w-4 h-4 text-orange-400" />, bg: 'bg-orange-600/10', title: 'AI Post Refresh', desc: 'Detect and auto-rewrite stale posts with updated stats and improved SEO, then re-publish.', eta: 'Q3 2025' },
                { icon: <Code2 className="w-4 h-4 text-pink-400" />, bg: 'bg-pink-600/10', title: 'Schema Markup Generator', desc: 'Auto-generate Article, FAQ, and HowTo JSON-LD schema and push it to WordPress.', eta: 'Q3 2025' },
                { icon: <GitBranch className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-600/10', title: 'Topic Cluster Planner', desc: 'AI maps one pillar + 8–12 cluster posts per client with automatic internal linking.', eta: 'Q4 2025' },
                { icon: <Pencil className="w-4 h-4 text-yellow-400" />, bg: 'bg-yellow-600/10', title: 'Content Brief Generator', desc: 'AI writes a full brief — keyword, angle, sections, competitor gaps — before you hit generate.', eta: 'Q4 2025' },
                { icon: <BookOpen className="w-4 h-4 text-cyan-400" />, bg: 'bg-cyan-600/10', title: 'Readability Optimizer', desc: 'Grade each post on reading level, flag dense paragraphs, and surface one-click rewrites.', eta: 'Q4 2025' },
                { icon: <Languages className="w-4 h-4 text-violet-400" />, bg: 'bg-violet-600/10', title: 'Multi-language Publishing', desc: 'Translate and publish any post into Spanish, French, German, and more — one click per language.', eta: 'Q4 2025' },
                { icon: <Copy className="w-4 h-4 text-emerald-400" />, bg: 'bg-emerald-600/10', title: 'Duplicate Content Checker', desc: 'Before generating, scan existing posts for overlap and flag keyword cannibalization risks.', eta: 'Q1 2026' },
                { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, bg: 'bg-emerald-600/10', title: 'Google Analytics Integration', desc: 'Pull real pageviews and time-on-page per post into the client dashboard to prove ROI.', eta: 'Q1 2026' },
              ].map(f => (
                <div key={f.title} className="bg-[#0f0f18] border border-[#2a2a3d] rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center shrink-0`}>
                      {f.icon}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-600/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">Free</span>
                  </div>
                  <div className="text-white font-bold text-xs">{f.title}</div>
                  <p className="text-[#555570] text-xs leading-relaxed flex-1">{f.desc}</p>
                  <div className="text-[#3a3a5a] text-[10px] flex items-center gap-1 pt-1 border-t border-[#1a1a26]">
                    <Clock className="w-2.5 h-2.5" /> {f.eta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Publish & Post Everywhere ── */}
          <div className="mt-12 pt-10 border-t border-[#2a2a3d]/50">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
              <div>
                <h3 className="text-white font-black text-lg mb-0.5">Publish &amp; post everywhere</h3>
                <p className="text-[#8888a8] text-xs">WordPress is just the start. We&apos;re connecting Bloggy to every CMS and social platform your clients use.</p>
              </div>
            </div>

            {/* Blog / CMS Publishing */}
            <div className="mb-6">
              <p className="text-[#555570] text-xs font-semibold uppercase tracking-wider mb-3">Blog &amp; CMS Publishing — coming soon</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: 'WordPress',   note: 'Live now ✓', color: 'border-violet-500/30 bg-violet-600/5', textColor: 'text-violet-400', dot: 'bg-emerald-400' },
                  { name: 'Webflow',     note: 'CMS API',    color: 'border-blue-500/20 bg-blue-600/5',    textColor: 'text-blue-400',   dot: 'bg-[#2a2a3d]' },
                  { name: 'Ghost',       note: 'Admin API',  color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Shopify Blog',note: 'Articles',   color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'HubSpot CMS', note: 'Blog API',   color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Squarespace', note: 'Content API',color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Wix',         note: 'Blog API',   color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Contentful',  note: 'Headless',   color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Sanity',      note: 'Headless',   color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Medium',      note: 'API',        color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Substack',    note: 'Newsletter', color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                  { name: 'Drupal',      note: 'REST API',   color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',  dot: 'bg-[#2a2a3d]' },
                ].map(p => (
                  <div key={p.name} className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 ${p.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />
                    <div>
                      <div className={`text-xs font-semibold ${p.textColor}`}>{p.name}</div>
                      <div className="text-[#555570] text-[10px]">{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Networks */}
            <div>
              <p className="text-[#555570] text-xs font-semibold uppercase tracking-wider mb-3">Social Media — copy generation live · auto-posting coming soon</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: 'LinkedIn',         note: 'Post live ✓',       color: 'border-blue-500/30 bg-blue-600/5',     textColor: 'text-blue-400',    dot: 'bg-emerald-400' },
                  { name: 'X / Twitter',      note: 'Thread live ✓',     color: 'border-violet-500/30 bg-violet-600/5', textColor: 'text-violet-400',  dot: 'bg-emerald-400' },
                  { name: 'Facebook',         note: 'Post live ✓',       color: 'border-blue-500/30 bg-blue-600/5',     textColor: 'text-blue-400',    dot: 'bg-emerald-400' },
                  { name: 'Instagram',        note: 'Caption live ✓',    color: 'border-pink-500/30 bg-pink-600/5',     textColor: 'text-pink-400',    dot: 'bg-emerald-400' },
                  { name: 'Threads',          note: 'Post live ✓',       color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#c8c8d8]',   dot: 'bg-emerald-400' },
                  { name: 'TikTok',           note: 'Script live ✓',     color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#c8c8d8]',   dot: 'bg-emerald-400' },
                  { name: 'Google Business',  note: 'Post live ✓',       color: 'border-emerald-500/20 bg-emerald-600/5', textColor: 'text-emerald-400', dot: 'bg-emerald-400' },
                  { name: 'Pinterest',        note: 'Pin live ✓',        color: 'border-red-500/20 bg-red-600/5',       textColor: 'text-red-400',     dot: 'bg-emerald-400' },
                  { name: 'YouTube',          note: 'Description live ✓',color: 'border-red-500/20 bg-red-600/5',       textColor: 'text-red-400',     dot: 'bg-emerald-400' },
                  { name: 'Bluesky',          note: 'Auto-post Q3',      color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',   dot: 'bg-[#2a2a3d]' },
                  { name: 'Reddit',           note: 'Auto-post Q4',      color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',   dot: 'bg-[#2a2a3d]' },
                  { name: 'Snapchat',         note: 'Coming 2026',       color: 'border-[#2a2a3d] bg-[#0f0f18]',       textColor: 'text-[#8888a8]',   dot: 'bg-[#2a2a3d]' },
                ].map(p => (
                  <div key={p.name} className={`rounded-xl border px-3 py-2.5 flex items-center gap-2 ${p.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />
                    <div>
                      <div className={`text-xs font-semibold ${p.textColor}`}>{p.name}</div>
                      <div className="text-[#555570] text-[10px]">{p.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 bg-[#0a0a0f] border border-violet-500/20 text-[#8888a8] text-xs px-5 py-2.5 rounded-full">
              <Lock className="w-3.5 h-3.5 text-violet-400" />
              Early access members get every feature first — and every add-on at launch pricing
            </div>
            <a href="#early-access" className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors">
              Claim early access <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" className="relative px-6 py-24 border-t border-[#2a2a3d]/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Get Started</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Are you ready to get started?</h2>
          <p className="text-[#8888a8] text-sm mb-8 leading-relaxed">
            Then choose a plan. Create your account in 30 seconds and generate your first post in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href="#early-access"
              className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Claim Early Access — 50% Off for 1 Year
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/signup"
              className="flex items-center justify-center gap-2 bg-[#12121a] hover:bg-[#1a1a26] border border-[#2a2a3d] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Create Free Account
            </a>
          </div>
          <p className="text-[#555570] text-xs">Want updates instead? Drop your email below.</p>
          <div className="mt-4">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-[#2a2a3d]/50">
        <div className="text-center mb-12">
          <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">FAQ</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Common questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5 hover:border-violet-500/20 transition-colors">
              <h3 className="text-white font-bold text-sm mb-2">{q}</h3>
              <p className="text-[#8888a8] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discord Community */}
      <section className="border-t border-[#2a2a3d]/50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#12121a] border border-indigo-500/20 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 mb-6 mx-auto">
                <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="#818cf8"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              </div>
              <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Community & Support</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Join the Bloggy Community</h2>
              <p className="text-[#8888a8] text-sm leading-relaxed max-w-xl mx-auto mb-8">
                Get help, share wins, and connect with other agency owners using Bloggy. Ask questions, get fast support, and see real results from real agencies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                {[
                  { icon: '🆘', label: 'Fast Support', desc: 'Get answers in #get-help usually within hours' },
                  { icon: '🏆', label: 'Share Wins', desc: 'Post results and see what other agencies achieve' },
                  { icon: '📚', label: 'Tutorials', desc: 'Step-by-step guides for WordPress, Autoblog & more' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-5 text-left">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-white font-bold text-sm mb-1">{label}</div>
                    <div className="text-[#555570] text-xs leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
              <a
                href="https://discord.gg/9avYXden"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Join the Community — Free
              </a>
              <p className="text-[#555570] text-xs mt-4">Free to join · No spam · Just agency owners helping each other</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQPage schema for Google rich results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      })}} />

      {/* Footer */}
      <footer className="border-t border-[#2a2a3d]/50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Logo className="h-6" />
              <span className="text-[#8888a8] text-xs">by Boom Media</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#555570]">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#roi" className="hover:text-white transition-colors">ROI</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
              <a href="/support" className="hover:text-white transition-colors">Support</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="https://discord.gg/9avYXden" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community</a>
            </div>
          </div>
          <div className="border-t border-[#2a2a3d]/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555570]">
            <p>© 2025 Boom Media. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/login" className="hover:text-white transition-colors">Sign In</a>
              <a href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Start Free →</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
