'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://www.bloggy.online'}/reset-password`,
      })
      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Logo className="h-9" />
          </div>
          <p className="text-[#8888a8] text-sm">Password reset</p>
        </div>

        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Check your email</h2>
              <p className="text-[#8888a8] text-sm">We sent a password reset link to <strong className="text-white">{email}</strong>. Check your inbox and follow the link.</p>
              <a href="/login" className="inline-block mt-6 text-violet-400 hover:text-violet-300 text-sm transition-colors">
                ← Back to sign in
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-white font-bold text-lg mb-2">Forgot your password?</h1>
              <p className="text-[#8888a8] text-sm mb-6">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <a href="/login" className="text-[#8888a8] hover:text-violet-400 text-xs transition-colors">
                  ← Back to sign in
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
