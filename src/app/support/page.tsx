import Logo from '@/components/Logo'
import HelpAccordion from '@/components/HelpAccordion'
import SupportFaq from './SupportFaq'
import {
  Zap, Send, Clock, TrendingUp, Search, Share2,
  MessageCircle, Mail, ArrowRight, BookOpen, Users,
} from 'lucide-react'

export const metadata = {
  title: 'Help Center & Tutorials',
  description: 'Step-by-step guides and FAQs for WordPress publishing, AutoBlog configuration, keyword tracking, and more.',
  keywords: ['Bloggy help center', 'Bloggy tutorials', 'how to use Bloggy', 'WordPress blog automation setup', 'AutoBlog configuration guide', 'blog automation FAQs'],
  alternates: { canonical: 'https://bloggy.online/support' },
  openGraph: {
    title: 'Bloggy Help Center & Tutorials — Guides for Every Feature',
    description: 'Step-by-step guides and FAQs for Bloggy AI blog automation. No login required.',
    url: 'https://bloggy.online/support',
    type: 'website',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Bloggy Help Center' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggy Help Center & Tutorials',
    description: 'Step-by-step guides and FAQs for Bloggy AI blog automation.',
    images: ['https://bloggy.online/og-image.png'],
    site: '@GetBloggy',
  },
}

const QUICK_LINKS = [
  {
    icon: <Zap className="w-5 h-5 text-violet-400" />,
    bg: 'bg-violet-600/10 border-violet-500/20',
    title: 'Quick Start',
    desc: 'Publish your first post in 5 minutes',
    href: '#quickstart',
  },
  {
    icon: <Send className="w-5 h-5 text-cyan-400" />,
    bg: 'bg-cyan-600/10 border-cyan-500/20',
    title: 'WordPress Setup',
    desc: 'Connect and publish to any WP site',
    href: '#wordpress',
  },
  {
    icon: <Clock className="w-5 h-5 text-orange-400" />,
    bg: 'bg-orange-600/10 border-orange-500/20',
    title: 'AutoBlog',
    desc: 'Automate publishing on a schedule',
    href: '#autoblog',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    bg: 'bg-emerald-600/10 border-emerald-500/20',
    title: 'Rankings Tracker',
    desc: 'Track keyword positions on Google',
    href: '#rankings',
  },
  {
    icon: <Search className="w-5 h-5 text-yellow-400" />,
    bg: 'bg-yellow-600/10 border-yellow-500/20',
    title: 'Keyword Research',
    desc: 'Find and save keywords per client',
    href: '#keywords',
  },
  {
    icon: <Share2 className="w-5 h-5 text-pink-400" />,
    bg: 'bg-pink-600/10 border-pink-500/20',
    title: 'Content Repurposing',
    desc: 'Turn posts into social media content',
    href: '#repurpose',
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0]">

      {/* Nav */}
      <nav className="border-b border-[#2a2a3d]/60 bg-[#0a0900]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <Logo />
            </a>
            <span className="text-[#2a2a3d] hidden sm:inline">·</span>
            <span className="text-[#8888a8] text-xs hidden sm:inline font-medium">Help Center</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Home</a>
            <a href="https://discord.gg/9avYXden" target="_blank" rel="noopener noreferrer" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Community</a>
            <a href="/login" className="text-[#8888a8] hover:text-white text-xs sm:text-sm transition-colors">Sign In</a>
            <a href="/signup" className="bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors whitespace-nowrap">
              Start Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-16 pb-12 text-center border-b border-[#2a2a3d]/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Help Center & Tutorials
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            How can we help?
          </h1>
          <p className="text-[#8888a8] text-sm sm:text-base mb-8 leading-relaxed">
            Step-by-step guides for every Bloggy feature. No login required.
          </p>

          {/* Search — scrolls to accordion */}
          <a
            href="#guides"
            className="inline-flex items-center gap-2 bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500/40 text-[#555570] px-5 py-3 rounded-xl text-sm w-full max-w-md transition-colors group"
          >
            <Search className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
            <span className="flex-1 text-left">Search guides…</span>
            <span className="text-xs text-[#3a3a5a]">↓ Browse below</span>
          </a>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Quick links */}
        <div className="mb-12">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-violet-500 rounded-full inline-block" />
            Most Visited
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_LINKS.map(link => (
              <a
                key={link.title}
                href={link.href}
                className="flex items-start gap-3 bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500/40 rounded-xl p-4 transition-all hover:bg-[#16161f] group"
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${link.bg}`}>
                  {link.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold group-hover:text-violet-300 transition-colors">{link.title}</div>
                  <div className="text-[#555570] text-xs mt-0.5 leading-snug">{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Guides accordion */}
        <div id="guides" className="mb-14">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-violet-500 rounded-full inline-block" />
            All Guides & Tutorials
          </h2>
          <HelpAccordion />
        </div>

        {/* FAQ */}
        <div className="mb-14">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-cyan-500 rounded-full inline-block" />
            Frequently Asked Questions
          </h2>
          <SupportFaq />
        </div>

        {/* CTA strip */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">Community Discord</div>
              <p className="text-[#8888a8] text-xs leading-relaxed">Chat with other agencies, get quick answers, and share what's working. 300+ members.</p>
            </div>
            <a
              href="https://discord.gg/9avYXden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors mt-auto"
            >
              Join the community <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1">Email Support</div>
              <p className="text-[#8888a8] text-xs leading-relaxed">Can't find your answer? Email us directly and we'll get back to you within a few hours.</p>
            </div>
            <a
              href="mailto:eric@boommedia.us"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mt-auto"
            >
              eric@boommedia.us <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Not a member yet */}
        <div className="bg-gradient-to-r from-violet-950/60 to-[#12121a] border border-violet-500/20 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Ready to try Bloggy?</h3>
          <p className="text-[#8888a8] text-sm mb-6 max-w-md mx-auto">
            Start publishing AI-generated SEO blog posts for your clients today. 7-day free trial, no credit card required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/login" className="text-[#8888a8] hover:text-white text-sm transition-colors font-medium">
              Already a member? Sign in →
            </a>
          </div>
        </div>
      </main>

      {/* FAQPage schema — boosts Google featured snippets */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is Bloggy and who is it for?', acceptedAnswer: { '@type': 'Answer', text: 'Bloggy is an AI blog automation platform built for digital marketing agencies. It lets you generate, optimize, and publish SEO blog posts to WordPress for all your clients from one dashboard.' } },
          { '@type': 'Question', name: 'Do I need technical skills to use Bloggy?', acceptedAnswer: { '@type': 'Answer', text: 'No technical skills required. Connecting a client WordPress site takes about 2 minutes. Generating a post takes 15 seconds. Just add clients and start generating.' } },
          { '@type': 'Question', name: 'How does the 7-day free trial work?', acceptedAnswer: { '@type': 'Answer', text: 'Sign up for the Starter plan and get 7 days free with no credit card required. Full access to all Starter features: 20 posts, 5 client sites, AI generation, WordPress publishing, and SEO meta output.' } },
          { '@type': 'Question', name: 'Does Bloggy generate unique content?', acceptedAnswer: { '@type': 'Answer', text: 'Every post is generated fresh from scratch by Claude (Anthropic\'s AI). No templates, no spinning, no recycled content. Each post is unique based on your topic, client brand voice, keywords, and settings.' } },
          { '@type': 'Question', name: 'Which WordPress version is required?', acceptedAnswer: { '@type': 'Answer', text: 'WordPress 5.6 or higher is required. Application Passwords were introduced in WordPress 5.6 and are needed for Bloggy to connect and publish.' } },
          { '@type': 'Question', name: 'What is AutoBlog and how does it work?', acceptedAnswer: { '@type': 'Answer', text: 'AutoBlog is Bloggy\'s set-and-forget publishing engine. Queue topics for each client, set a publish date and time, and Bloggy automatically generates and publishes each post when scheduled.' } },
          { '@type': 'Question', name: 'Can I cancel my subscription anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cancel anytime via the Stripe customer portal on the Billing page. No penalty, no minimum term. Your access continues until the end of the current billing period.' } },
          { '@type': 'Question', name: 'What SEO plugins does Bloggy support?', acceptedAnswer: { '@type': 'Answer', text: 'Bloggy pushes SEO meta fields compatible with SmartCrawl, Yoast SEO, and Rank Math. Meta title, description, and focus keyword are written by AI and sent on every publish.' } },
        ],
      })}} />

      {/* Footer */}
      <footer className="border-t border-[#2a2a3d]/50 px-6 py-8 mt-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555570]">
          <div className="flex items-center gap-2">
            <Logo className="h-5" />
            <span>by Boom Media</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="https://discord.gg/9avYXden" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community</a>
          </div>
          <p>© 2025 Boom Media.</p>
        </div>
      </footer>
    </div>
  )
}
