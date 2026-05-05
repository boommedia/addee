import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Check, Clock, Zap, Globe, Image, Calendar, Share2, Sparkles, TrendingUp, Lock, Users, Code2, GitBranch, BookOpen, Copy, Languages, RefreshCw } from 'lucide-react'

export const metadata = {
  title: 'Addee — AI Ad Creatives & Social Content by Boom Media',
  description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice. Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more.',
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
            <a href="#roadmap" className="text-foreground/70 hover:text-foreground transition">Roadmap</a>
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
            One Dashboard.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Every Brand Ad. Done.</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Addee is built for freelancers, solopreneurs, and agencies who manage ads for more than one client. Generate, publish, and track performance for all your brands — from one login. As low as <span className="text-white font-semibold">$9.80 per brand.</span>
          </p>
          <div className="flex gap-4 justify-center pt-4 flex-wrap">
            <Link href="/login" className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-bold text-lg">
              Start Free — No Card Required →
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
            <h2 className="text-4xl md:text-5xl font-black text-foreground">What You Get</h2>
            <p className="text-xl text-foreground/70">One platform. Everything you need to dominate ads across every platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI Ad Generation',
                desc: 'Claude writes brand-matched ad copy in seconds. 3 variations per platform, every format.',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'One-Click Multi-Platform Publish',
                desc: 'Publish as draft or live directly to Instagram, LinkedIn, TikTok, Google Ads, Meta, Pinterest, and more.',
              },
              {
                icon: <Image className="w-6 h-6" />,
                title: 'Multi-Format Ads',
                desc: 'Stories, feeds, reels, carousels, carousel ads, collection ads, video ads — all supported.',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Brand Voice Training',
                desc: 'Upload brand guidelines. Addee learns your tone, style, and messaging — every ad sounds like you.',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Performance Tracking',
                desc: 'Track CTR, conversions, ROAS, and impressions across all platforms from one dashboard.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Team Collaboration',
                desc: 'Invite team members, set approval workflows, manage permissions per brand and per user.',
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
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Addee doesn't replace your revenue — it replaces your cost</h2>
            <p className="text-xl text-foreground/70">Here's what the numbers look like at each plan:</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-border/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-foreground/5 border-b border-border/30">
                  <th className="px-6 py-4 font-bold text-foreground">Plan</th>
                  <th className="px-6 py-4 font-bold text-foreground">Price/Month</th>
                  <th className="px-6 py-4 font-bold text-foreground">Brands</th>
                  <th className="px-6 py-4 font-bold text-foreground">Ads/Month</th>
                  <th className="px-6 py-4 font-bold text-primary">Cost Per Brand</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: 'Starter', price: 29, brands: 5, ads: 50, perBrand: '$5.80' },
                  { plan: 'Growth', price: 79, brands: 15, ads: 150, perBrand: '$5.27' },
                  { plan: 'Agency', price: 149, brands: 40, ads: 400, perBrand: '$3.73' },
                  { plan: 'Agency Max', price: 299, brands: 100, ads: 1000, perBrand: '$2.99' },
                ].map(({ plan, price, brands, ads, perBrand }) => (
                  <tr key={plan} className="border-b border-border/30 hover:bg-foreground/5 transition">
                    <td className="px-6 py-4 font-semibold text-foreground">{plan}</td>
                    <td className="px-6 py-4 text-foreground/70">${price}</td>
                    <td className="px-6 py-4 text-foreground/70">{brands}</td>
                    <td className="px-6 py-4 text-foreground/70">{ads}</td>
                    <td className="px-6 py-4 font-bold text-primary">{perBrand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-8">
            {[
              { before: 'Paying $300–$800 per ad creative to freelance designers', after: 'Generate publish-ready ads for $0 with AI' },
              { before: 'Manually posting to 5+ platforms one by one per ad', after: 'One-click publish to every platform at once' },
              { before: '3–5 hours on ad copy, design, and publishing per campaign', after: '15 minutes from idea to live on 5 platforms' },
              { before: 'Limited to whatever your designer can produce this week', after: '3 variations per platform per ad, instantly' },
            ].map((item) => (
              <div key={item.before} className="border border-border/30 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="text-2xl">❌</span>
                    <span className="text-foreground/70 text-sm">{item.before}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-2xl">✅</span>
                    <span className="text-foreground font-semibold text-sm">{item.after}</span>
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
            <p className="text-xl text-foreground/70">Scale from freelancer to agency. No per-ad charges. No surprise fees.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Starter',
                price: '$29',
                desc: 'Freelancers managing 2–5 brands',
                features: ['5 Brands', '50 ads/month', 'All platforms', 'Brand voice training', 'Basic support'],
              },
              {
                name: 'Growth',
                price: '$79',
                desc: 'Agencies with 5–15 client brands',
                features: ['15 Brands', '150 ads/month', 'Everything in Starter', 'Team collaboration (3 users)', 'Approval workflows', 'Priority support'],
                featured: true,
              },
              {
                name: 'Agency',
                price: '$149',
                desc: 'Agencies managing 15–40 brands',
                features: ['40 Brands', '400 ads/month', 'Everything in Growth', 'Team collaboration (10 users)', 'Performance analytics', 'Slack support'],
              },
              {
                name: 'Agency Max',
                price: '$299',
                desc: 'Large agencies with 40+ brands',
                features: ['100+ Brands', '1000+ ads/month', 'Everything in Agency', 'White-label option', 'Custom integrations', 'Dedicated support'],
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
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className={plan.featured ? 'text-white/90 text-sm mb-4' : 'text-foreground/70 text-sm mb-4'}>{plan.desc}</p>
                <div className="my-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={plan.featured ? 'text-white/80' : 'text-foreground/60'}>/month</span>
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

          <p className={`text-center text-sm`}>
            Every account starts with <span className="text-white font-semibold">10 free ads</span> and <span className="text-white font-semibold">2 brand slots</span>. No credit card required. Upgrade or cancel anytime.
          </p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Built. Shipping. Coming soon.</h2>
            <p className="text-xl text-foreground/70">Addee ships new features every week. Here's what's next.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Check className="w-5 h-5 text-emerald-400" />, title: 'Multi-Brand Dashboards', desc: 'Switch between brands instantly. See performance across all accounts.', status: 'Shipped' },
              { icon: <Check className="w-5 h-5 text-emerald-400" />, title: 'Brand Voice Training', desc: 'Upload guidelines. Addee learns your tone and style.', status: 'Shipped' },
              { icon: <Check className="w-5 h-5 text-emerald-400" />, title: 'Multi-Format Ad Generation', desc: 'Stories, reels, carousels, video ads — all auto-generated.', status: 'Shipped' },
              { icon: <Clock className="w-5 h-5 text-amber-400" />, title: 'Performance Analytics', desc: 'CTR, conversions, ROAS per platform per ad.', status: 'Q2 2026' },
              { icon: <Clock className="w-5 h-5 text-amber-400" />, title: 'Auto-Repurposing', desc: 'One ad becomes LinkedIn posts, emails, and Twitter threads.', status: 'Q2 2026' },
              { icon: <Clock className="w-5 h-5 text-amber-400" />, title: 'Competitor Analysis', desc: 'See what your competitors are running. Copy their angles.', status: 'Q3 2026' },
              { icon: <Clock className="w-5 h-5 text-amber-400" />, title: 'White-Label Portal', desc: 'Brand Addee as your own. Client-facing dashboard.', status: 'Q3 2026' },
              { icon: <Clock className="w-5 h-5 text-amber-400" />, title: 'A/B Testing Automation', desc: 'Auto-generate and test 5 variations per platform.', status: 'Q4 2026' },
            ].map((item) => (
              <div key={item.title} className="bg-background border border-border/30 rounded-xl p-6 hover:border-primary/30 transition">
                <div className="flex gap-3 mb-3">
                  {item.icon}
                  <span className="text-xs font-bold text-foreground/50 uppercase">{item.status}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="bg-foreground/5 py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Publish & Post Everywhere</h2>
            <p className="text-xl text-foreground/70">Addee connects to every platform your clients use.</p>
          </div>

          <div className="space-y-8">
            {/* Social Media */}
            <div>
              <p className="text-foreground/50 text-sm font-bold uppercase tracking-wider mb-4">Social Media — Live ✓</p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: 'Instagram', color: 'border-pink-500/30 bg-pink-600/5' },
                  { name: 'LinkedIn', color: 'border-blue-500/30 bg-blue-600/5' },
                  { name: 'TikTok', color: 'border-black/30 bg-black/5' },
                  { name: 'Facebook', color: 'border-blue-500/30 bg-blue-600/5' },
                  { name: 'Twitter/X', color: 'border-black/30 bg-black/5' },
                  { name: 'Pinterest', color: 'border-red-500/30 bg-red-600/5' },
                  { name: 'Google Ads', color: 'border-blue-500/30 bg-blue-600/5' },
                  { name: 'Meta Ads', color: 'border-blue-500/30 bg-blue-600/5' },
                ].map((platform) => (
                  <div key={platform.name} className={`border rounded-lg p-4 text-center ${platform.color}`}>
                    <p className="text-foreground font-semibold text-sm">{platform.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon */}
            <div>
              <p className="text-foreground/50 text-sm font-bold uppercase tracking-wider mb-4">Coming Soon — Q2 2026</p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: 'Bluesky' },
                  { name: 'Threads' },
                  { name: 'Mastodon' },
                  { name: 'Mailchimp' },
                ].map((platform) => (
                  <div key={platform.name} className="border border-border/30 rounded-lg p-4 text-center bg-foreground/5">
                    <p className="text-foreground/60 font-semibold text-sm">{platform.name}</p>
                  </div>
                ))}
              </div>
            </div>
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
                a: 'Addee runs on Claude Sonnet 4.6 by Anthropic — one of the most capable models for copywriting and brand voice consistency. This means better copy, faster generation, and ads that actually sound like your brand.',
              },
              {
                q: 'How does brand voice training work?',
                a: 'Upload your brand guidelines, past ads, tone examples, and visual preferences. Addee learns your brand and generates ads that sound like you — not like a robot.',
              },
              {
                q: 'Can I edit ads before publishing?',
                a: 'Yes. Every generated ad has a full editor built in. Edit copy, headlines, CTAs, hashtags, and visual elements before one-click publishing to all platforms.',
              },
              {
                q: 'Which platforms do you support?',
                a: 'Instagram (Feed, Stories, Reels), LinkedIn, TikTok, Google Ads, Meta (Facebook & Instagram), Twitter/X, Pinterest, and more coming soon. One-click publish to all of them.',
              },
              {
                q: 'Do you have a free trial?',
                a: 'Yes. Every account starts with 10 free ads and 2 brand slots. Full feature access. No credit card required. Cancel anytime.',
              },
              {
                q: 'Who is Addee built for?',
                a: 'Addee is built for anyone who manages ads for more than one brand — freelancers, solopreneurs, and agencies. If you\'re running ads for 2+ brands, Addee saves you 10–15 hours per week.',
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

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-t border-primary/20 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-foreground">Ready to dominate ads?</h2>
          <p className="text-xl text-foreground/70">Start free. 10 ads included. Set up your first brand in 30 seconds.</p>
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold">A</div>
                <span className="font-bold text-foreground">Addee</span>
              </div>
              <p className="text-foreground/60 text-sm">AI ad creatives for brands. Built by Boom Media.</p>
            </div>
            <nav className="space-y-2 text-sm">
              <p className="font-semibold text-foreground">Product</p>
              <a href="#features" className="text-foreground/60 hover:text-foreground transition block">Features</a>
              <a href="#pricing" className="text-foreground/60 hover:text-foreground transition block">Pricing</a>
              <a href="#roadmap" className="text-foreground/60 hover:text-foreground transition block">Roadmap</a>
            </nav>
          </div>
          <div className="border-t border-border/30 pt-8 text-center text-foreground/60 text-sm">
            <p>© 2026 Addee by Boom Media. All rights reserved.</p>
          </div>
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
