'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { login } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const coupon = searchParams.get('coupon')
    if (coupon) {
      router.replace(`/signup?coupon=${encodeURIComponent(coupon)}`)
    }
  }, [searchParams, router])

  async function handleGoogleSignin() {
    setGoogleLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://www.addee.online'}/auth/callback?next=/home`,
        },
      })
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignin}
        disabled={googleLoading}
        className="w-full bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-900 font-semibold rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2 mb-4"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? 'Signing in…' : 'Sign in with Google'}
      </button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2a2a3d]"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-[#555570]" style={{ background: '#0b1628' }}>or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" style={{ background: '#0a0900', border: '1px solid #1a2d50' }}
          placeholder="you@agency.com"
        />
      </div>

      <div>
        <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" style={{ background: '#0a0900', border: '1px solid #1a2d50' }}
          placeholder="••••••••"
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
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-all hover:opacity-90 mt-2"
        style={{ background: 'linear-gradient(135deg, #ca8a04, #0055FF)' }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0900' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <Logo />
          </div>
          <p className="text-sm" style={{ color: '#b8a870' }}>Sign in to your account</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: '#0b1628', borderColor: '#1c1800' }}>
          <h1 className="text-white font-bold text-lg mb-6">Welcome back</h1>
          <Suspense>
            <LoginForm />
          </Suspense>
          <div className="mt-4 flex items-center justify-between">
            <a href="/forgot-password" className="hover:text-blue-400 text-xs transition-colors" style={{ color: '#b8a870' }}>
              Forgot password?
            </a>
            <a href="/signup" className="hover:text-blue-400 text-xs transition-colors" style={{ color: '#b8a870' }}>
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
