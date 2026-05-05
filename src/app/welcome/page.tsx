'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function WelcomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signup')
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12121a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Logo className="h-8" />
          </div>
          <p className="text-[#555570] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  const fullName = user?.user_metadata?.full_name || 'there'
  const firstName = fullName.split(' ')[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12121a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <Logo className="h-10" />
          </div>
          <h1 className="text-white font-bold text-4xl mb-3">
            Welcome to Bloggy, {firstName}! 🎉
          </h1>
          <p className="text-[#8888a8] text-lg max-w-lg mx-auto">
            You&apos;re one of the first to join. Your account is ready—let&apos;s get you generating amazing AI blog posts.
          </p>
        </div>

        {/* Early Adopter Banner */}
        <div className="mb-12 bg-gradient-to-r from-violet-600/20 to-violet-500/10 border border-violet-500/30 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="text-violet-300 font-semibold text-sm uppercase tracking-wider">Early Adopter</span>
          </div>
          <p className="text-white font-bold text-2xl mb-1">You're in the first 20</p>
          <p className="text-[#8888a8] text-sm">Early users get exclusive lifetime perks and direct feedback access with the team.</p>
        </div>

        {/* What You Get */}
        <div className="mb-12 bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-8">
          <h2 className="text-white font-bold text-lg mb-6">What You Can Do Now</h2>
          <div className="space-y-4">
            {[
              { title: 'Generate AI Blog Posts', desc: 'Write SEO-optimized blog posts in seconds with AI' },
              { title: 'Publish to WordPress', desc: 'Connect your WordPress site and publish directly' },
              { title: 'Publish to Social', desc: 'Share to Google Business, LinkedIn, Medium, Dev.to ($15/mo add-on)' },
              { title: 'Track Rankings', desc: 'Monitor your Google positions for target keywords' },
              { title: 'Manage Clients', desc: 'Set up multiple clients and manage their content' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-[#555570] text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/home')}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl py-4 text-center transition-colors flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="/help"
            className="bg-[#12121a] hover:bg-[#16161f] border border-[#2a2a3d] text-white font-semibold rounded-xl py-4 text-center transition-colors"
          >
            Read Help Guide
          </a>
        </div>

        {/* Quick Start Tips */}
        <div className="bg-[#0d0d16] border border-[#2a2a3d] rounded-2xl p-6">
          <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Start (5 min)</h3>
          <ol className="space-y-3">
            {[
              'Go to Clients → Add your first client',
              'In their settings, add target keywords and WordPress (optional)',
              'Go to Generate → Write your first post',
              'Publish directly to WordPress or social platforms',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300 font-bold text-xs">
                  {i + 1}
                </span>
                <span className="text-[#b0b0c8] pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-[#2a2a3d] pt-8">
          <p className="text-[#555570] text-sm">
            Have questions? Join our{' '}
            <a
              href="https://discord.gg/9avYXden"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Discord community
            </a>
            {' '}or email{' '}
            <a href="mailto:eric@boommedia.us" className="text-violet-400 hover:text-violet-300 transition-colors">
              eric@boommedia.us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
