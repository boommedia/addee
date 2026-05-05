import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Addee — AI Ad Creatives & Social Content Generator',
  description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice. Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more.',
  keywords: ['AI ad generator', 'social media content', 'ad creative tools', 'Instagram ads', 'LinkedIn ads', 'TikTok ads', 'Google Ads generator'],
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">🎨 Addee</h1>
          <div className="flex gap-4">
            <Link href="/campaigns" className="text-foreground/60 hover:text-foreground transition">
              Campaigns
            </Link>
            <Link href="/brands" className="text-foreground/60 hover:text-foreground transition">
              Brands
            </Link>
            {user ? (
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-foreground/60 hover:text-foreground transition">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link href="/login" className="text-primary hover:text-primary/80 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {user ? (
          <AuthenticatedView />
        ) : (
          <LandingView />
        )}
      </div>
    </div>
  )
}

function LandingView() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Create Killer Ads in Minutes</h1>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl">
          Generate AI-powered ad creatives in your brand's voice. Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-semibold"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">What You Get</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Brand Voice Training', desc: 'Customize tone, style, and messaging' },
            { title: 'Multi-Format Ads', desc: 'Stories, feeds, reels, carousels & more' },
            { title: 'AI Generation', desc: '3 variations per platform instantly' },
            { title: 'Full Editing Suite', desc: 'Refine copy before publishing' },
            { title: 'One-Click Publishing', desc: 'Push to all platforms at once' },
            { title: 'Performance Tracking', desc: 'See how ads perform across channels' },
          ].map((feature) => (
            <div key={feature.title} className="border border-border rounded-lg p-6 hover:border-primary/30 hover:bg-foreground/5 transition">
              <h3 className="font-semibold text-foreground mb-2">✓ {feature.title}</h3>
              <p className="text-foreground/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Generate Your First Campaign?</h2>
        <p className="text-foreground/70 mb-8">Set up your brand voice and start creating ads in seconds.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}

function AuthenticatedView() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to Addee</h1>
          <p className="text-foreground/60 mt-2">Generate AI ad creatives in your brand's voice</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/brands/new"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-semibold"
          >
            New Brand
          </Link>
          <Link
            href="/campaigns/new"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            New Campaign
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/brands"
          className="border border-border rounded-lg p-8 hover:border-primary/30 hover:bg-foreground/5 transition"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">Manage Brands</h3>
          <p className="text-foreground/70">Set up brand profiles with voice guidelines and visual preferences</p>
        </Link>
        <Link
          href="/campaigns"
          className="border border-border rounded-lg p-8 hover:border-primary/30 hover:bg-foreground/5 transition"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">View Campaigns</h3>
          <p className="text-foreground/70">Generate and manage ad campaigns across multiple platforms</p>
        </Link>
      </div>
    </div>
  )
}
