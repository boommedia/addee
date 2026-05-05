import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Check, Zap, Globe, Image, Calendar, Share2, Sparkles, TrendingUp, Lock, Users } from 'lucide-react'

export const metadata = {
  title: 'Addee — AI Ad Creatives & Social Content by Boom Media',
  description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice. Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more. From Boom Media.',
  keywords: ['AI ad generator', 'social media content', 'ad creative tools', 'Instagram ads', 'LinkedIn ads', 'TikTok ads'],
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return <AuthenticatedDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-foreground/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold">A</div>
            <span>Addee</span>
            <span className="text-xs text-foreground/50 ml-2">by Boom Media</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition">Features</a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition">Pricing</a>
            <a href="#faq" className="text-foreground/70 hover:text-foreground transition">FAQ</a>
            <Link href="/login" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Early Access Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm text-primary">
        🎨 Addee is in early access — Get started free. No credit card required.
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-foreground leading-tight">
            One Platform.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Every Ad. Done.</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Generate AI-powered ad creatives and social posts in your brand's voice.
            Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more — from one dashboard.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login" className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-bold text-lg">
              Start Free
            </Link>
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition font-bold text-lg">
              See the math →
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-8 py-12 border-t border-border/30">
          {[
            { name: 'Claude Sonnet', label: 'Powered by' },
            { name: 'Instagram, LinkedIn, TikTok', label: 'Publishes to' },
            { name: 'Brand Voice Training', label: 'Trained on' },
            { name: 'One-Click Publishing', label: 'Shipped with' },
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div className="text-xs uppercase tracking-wider text-foreground/50 mb-1">{item.label}</div>
              <div className="text-foreground font-semibold">{item.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-foreground/5 py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Everything you need to crush your ads</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">All in one platform. No plugins. No integrations. No headaches.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI Ad Generation',
                desc: 'Claude writes brand-matched ad copy in seconds. 3 variations per platform, per format.',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Multi-Platform Publishing',
                desc: 'One click publishes to Instagram, LinkedIn, TikTok, Google Ads, Meta, and more.',
              },
              {
                icon: <Image className="w-6 h-6" />,
                title: 'Multi-Format Support',
                desc: 'Stories, feeds, reels, carousels, carousel ads, collection ads — all supported.',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Brand Voice Training',
                desc: 'Upload brand guidelines. AI learns your tone, style, and messaging patterns.',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Performance Tracking',
                desc: 'See how ads perform across channels. Track CTR, conversions, and ROI.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Team Collaboration',
                desc: 'Invite team members, set approval workflows, and manage permissions.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-background border border-border/30 rounded-xl p-8 hover:border-primary/30 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Addee pays for itself</h2>
            <p className="text-xl text-foreground/70">Here's what agencies and solopreneurs save:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { before: 'Paying $200–$500 per ad creative to freelance designers', after: 'Generate publish-ready ads for $0 with AI' },
              { before: 'Manually posting to 5+ platforms one by one', after: 'One-click publish to every platform at once' },
              { before: '2–3 hours spent on ad copy, design, and publishing', after: '5 minutes from idea to live ad' },
              { before: 'Limited to whatever your designer can produce this week', after: '3 variations per platform, instantly' },
            ].map((item) => (
              <div key={item.before} className="border border-border/30 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="text-2xl">❌</span>
                    <span className="text-foreground/70">{item.before}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-2xl">✅</span>
                    <span className="text-foreground font-semibold">{item.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-foreground/5 py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Simple, predictable pricing</h2>
            <p className="text-xl text-foreground/70">No per-ad charges. No surprise fees. Choose your plan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$29',
                period: '/month',
                desc: 'Perfect for freelancers and solopreneurs',
                features: ['3 Brand profiles', '50 ads/month', 'All platforms', 'Brand voice training', 'Email support'],
              },
              {
                name: 'Growth',
                price: '$79',
                period: '/month',
                desc: 'For growing agencies managing multiple clients',
                features: ['Unlimited brands', '200 ads/month', 'All platforms', 'Team collaboration (3 users)', 'Priority support', 'Approval workflows'],
                featured: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'Contact us',
                desc: 'For large agencies with custom needs',
                features: ['Unlimited everything', 'Unlimited users', 'White-label option', 'Custom integrations', 'Dedicated support', '99.9% SLA'],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 transition ${
                  plan.featured
                    ? 'bg-primary text-white border-2 border-primary shadow-xl scale-105'
                    : 'bg-background border border-border/30 hover:border-primary/30'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={plan.featured ? 'text-white/90' : 'text-foreground/70'}>{plan.desc}</p>
                <div className="my-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={plan.featured ? 'text-white/80' : 'text-foreground/60'}>{plan.period}</span>
                </div>
                <button
                  className={`w-full py-3 rounded-lg font-bold transition mb-8 ${
                    plan.featured
                      ? 'bg-white text-primary hover:bg-white/90'
                      : 'border-2 border-primary text-primary hover:bg-primary/5'
                  }`}
                >
                  Get Started
                </button>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border/30">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Common questions</h2>
            <p className="text-xl text-foreground/70">Everything you need to know about Addee.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'What AI model powers Addee?',
                a: 'Addee runs on Claude Sonnet 4.6 by Anthropic — one of the most capable models for copywriting and brand voice consistency.',
              },
              {
                q: 'How does brand voice training work?',
                a: 'Upload your brand guidelines, past ads, tone examples, and visual preferences. Addee learns your brand and generates ads that sound like you.',
              },
              {
                q: 'Can I edit ads before publishing?',
                a: 'Yes. Every generated ad has a full editor built in. Edit copy, headlines, CTAs, and hashtags before one-click publishing.',
              },
              {
                q: 'Which platforms do you support?',
                a: 'Instagram (Feed, Stories, Reels), LinkedIn, TikTok, Google Ads, Meta (Facebook & Instagram), Twitter/X, Pinterest, and more coming soon.',
              },
              {
                q: 'Do you have a free trial?',
                a: 'Yes. Every account starts with 5 free ads and full feature access. No credit card required. Cancel anytime.',
              },
              {
                q: 'Who is Addee built for?',
                a: 'Addee is built for freelancers, agencies, and solopreneurs who manage ads for clients or their own brands. If you\'re creating ads for 2+ brands, Addee saves you 5–10 hours per week.',
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-border/30 pb-6 last:border-b-0">
                <h3 className="text-lg font-bold text-foreground mb-3">{item.q}</h3>
                <p className="text-foreground/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-t border-primary/20 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-foreground">Ready to launch your ad empire?</h2>
          <p className="text-xl text-foreground/70">Start free. No credit card. 5 ads included.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-bold text-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-foreground/60 text-sm">
          <p>© 2026 Addee by Boom Media. All rights reserved.</p>
          <p className="mt-2">Built with care for agencies and solopreneurs.</p>
        </div>
      </footer>
    </div>
  )
}

function AuthenticatedDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold">A</div>
            <span>Addee</span>
          </Link>
          <nav className="flex gap-8">
            <Link href="/campaigns" className="text-foreground/70 hover:text-foreground transition">Campaigns</Link>
            <Link href="/brands" className="text-foreground/70 hover:text-foreground transition">Brands</Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-foreground/70 hover:text-foreground transition">Sign Out</button>
            </form>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-foreground">Welcome back</h1>
              <p className="text-foreground/60 mt-2">Generate your next round of killer ads.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/brands/new" className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition font-bold">
                New Brand
              </Link>
              <Link href="/campaigns/new" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-bold">
                New Campaign
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/brands" className="bg-background border border-border/30 rounded-lg p-8 hover:border-primary/30 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-foreground mb-2">Your Brands</h3>
              <p className="text-foreground/70">Manage brand profiles and voice guidelines</p>
            </Link>
            <Link href="/campaigns" className="bg-background border border-border/30 rounded-lg p-8 hover:border-primary/30 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-foreground mb-2">Your Campaigns</h3>
              <p className="text-foreground/70">View and manage all your ad campaigns</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
