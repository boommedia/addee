'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [agencyUrl, setAgencyUrl] = useState('')
  const [urlStatus, setUrlStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [urlError, setUrlError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', ''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [coupon, setCoupon] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(emailParam)
    const agencyParam = searchParams.get('agency')
    if (agencyParam) setAgencyName(agencyParam)
    const couponParam = searchParams.get('coupon')
    if (couponParam) setCoupon(couponParam)
  }, [searchParams])

  async function checkUrl(url: string): Promise<'valid' | 'invalid' | 'idle'> {
    if (!url.trim()) { setUrlStatus('idle'); setUrlError(null); return 'idle' }
    setUrlStatus('checking')
    setUrlError(null)
    try {
      const res = await fetch(`/api/validate-url?url=${encodeURIComponent(url.trim())}`)
      const data = await res.json()
      if (data.ok) {
        setUrlStatus('valid')
        return 'valid'
      } else {
        setUrlStatus('invalid')
        setUrlError(data.error ?? 'Could not verify this website')
        return 'invalid'
      }
    } catch {
      setUrlStatus('invalid')
      setUrlError('Could not verify this website')
      return 'invalid'
    }
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true)
    setError(null)
    try {
      if (coupon) localStorage.setItem('addee_coupon', coupon)
      const next = coupon ? '/billing' : '/welcome'
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://www.addee.online'}/auth/callback?next=${next}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (!agencyUrl.trim()) { setError('Please enter your agency website URL'); return }
    if (urlStatus === 'invalid') { setError('Please enter a valid agency website URL'); return }
    if (urlStatus === 'idle' || urlStatus === 'checking') {
      const result = await checkUrl(agencyUrl)
      if (result !== 'valid') { setError('Please verify your agency website URL'); return }
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://www.addee.online'}/auth/callback?next=/home`,
          data: {
            full_name: fullName.trim(),
            agency_name: agencyName.trim(),
            agency_url: agencyUrl.trim(),
          },
        },
      })
      if (error) {
        setError(error.message)
      } else {
        if (coupon) localStorage.setItem('addee_coupon', coupon)
        setOtpStep(true)
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8)
    if (pasted.length >= 6) {
      const padded = pasted.padEnd(8, '').split('').slice(0, 8)
      setOtp(padded)
      inputRefs.current[7]?.focus()
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const token = otp.join('')
    if (token.length < 8) { setOtpError('Enter all 8 digits'); return }
    setOtpLoading(true)
    setOtpError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
      if (error) {
        setOtpError(error.message)
      } else {
        // Fire Google Ads conversion on completed signup
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('event', 'conversion', { send_to: 'AW-18109945240/signup' })
          ;(window as any).gtag('event', 'sign_up', { method: 'email' })
        }
        router.push('/home')
      }
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  if (otpStep) {
    return (
      <div>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border" style={{ background: 'rgba(202,138,4,0.15)', borderColor: 'rgba(202,138,4,0.3)' }}>
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-lg mb-1">Check your email</h2>
          <p className="text-[#8888a8] text-sm">
            We sent an 8-digit code to <strong className="text-white">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3 text-center">
              Enter verification code
            </label>
            <div className="flex gap-1.5 justify-center" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-11 h-14 rounded-xl text-white text-xl font-bold text-center focus:outline-none focus:border-blue-500 transition-colors" style={{ background: '#0a0900', border: '1px solid #1a2d50' }}
                />
              ))}
            </div>
          </div>

          {otpError && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
              {otpError}
            </p>
          )}

          <button
            type="submit"
            disabled={otpLoading || otp.join('').length < 8}
            className="w-full disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ca8a04, #0055FF)' }}
          >
            {otpLoading ? 'Verifying…' : 'Verify & continue'}
          </button>
        </form>

        <p className="text-[#555570] text-xs text-center mt-4">
          Didn&apos;t get it? Check your spam folder or{' '}
          <button
            onClick={() => { setOtpStep(false); setOtp(['', '', '', '', '', '', '', '']); setOtpError(null) }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            try again
          </button>
        </p>
      </div>
    )
  }

  const inputClass = 'w-full rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors'
  const inputStyle = { background: '#0a0900', border: '1px solid #1a2d50' }
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="w-full bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-900 font-semibold rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? 'Signing in…' : 'Sign up with Google'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: '#1c1800' }}></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-[#555570]" style={{ background: '#0b1628' }}>or continue with email</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: '#b8a870' }}>Full Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            autoComplete="name"
            className={inputClass}
            style={inputStyle}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: '#b8a870' }}>Agency Name *</label>
          <input
            type="text"
            required
            value={agencyName}
            onChange={e => setAgencyName(e.target.value)}
            autoComplete="organization"
            className={inputClass}
            style={inputStyle}
            placeholder="Acme Marketing"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ color: '#b8a870' }}>Agency Website *</label>
        <div className="relative">
          <input
            type="text"
            required
            value={agencyUrl}
            onChange={e => { setAgencyUrl(e.target.value); setUrlStatus('idle'); setUrlError(null) }}
            onBlur={() => checkUrl(agencyUrl)}
            autoComplete="url"
            className={`${inputClass} pr-10`}
            style={{ ...inputStyle, ...(urlStatus === 'valid' ? { borderColor: '#10b981' } : urlStatus === 'invalid' ? { borderColor: '#ca8a04' } : {}) }}
            placeholder="https://youragency.com"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {urlStatus === 'checking' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            {urlStatus === 'valid' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {urlStatus === 'invalid' && <XCircle className="w-4 h-4 text-red-400" />}
          </div>
        </div>
        {urlStatus === 'valid' && <p className="text-emerald-400 text-xs mt-1">✓ Website verified</p>}
        {urlStatus === 'invalid' && urlError && <p className="text-red-400 text-xs mt-1">{urlError}</p>}
      </div>

      <div>
        <label className={labelClass} style={{ color: '#b8a870' }}>Work Email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          className={inputClass}
          style={inputStyle}
          placeholder="you@agency.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: '#b8a870' }}>Password *</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
            style={inputStyle}
            placeholder="Min. 8 characters"
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: '#b8a870' }}>Confirm Password *</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
            style={inputStyle}
            placeholder="Repeat password"
          />
        </div>
      </div>

      {/* Coupon banner */}
      {coupon && (
        <div className="rounded-xl px-4 py-3 flex items-start gap-3 border" style={{ background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.25)' }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: 'rgba(52,211,153,0.15)', borderColor: 'rgba(52,211,153,0.3)' }}>
            <span className="text-emerald-400 text-xs font-bold">%</span>
          </div>
          <div>
            <p className="text-emerald-300 text-xs font-semibold">Discount code applied: <span className="font-mono">{coupon}</span></p>
            <p className="text-xs mt-0.5" style={{ color: '#3a5070' }}>Your discount will be applied when you upgrade to a paid plan.</p>
          </div>
        </div>
      )}

      {/* Free plan callout */}
      {!coupon && (
        <div className="rounded-xl px-4 py-3 flex items-start gap-3 border" style={{ background: 'rgba(202,138,4,0.08)', borderColor: 'rgba(202,138,4,0.2)' }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: 'rgba(202,138,4,0.15)', borderColor: 'rgba(202,138,4,0.3)' }}>
            <span className="text-blue-400 text-xs font-bold">✓</span>
          </div>
          <div>
            <p className="text-blue-300 text-xs font-semibold">Free plan includes 10 ADs</p>
            <p className="text-xs mt-0.5" style={{ color: '#3a5070' }}>No credit card required. Upgrade anytime for unlimited access.</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #ca8a04, #0055FF)' }}
      >
        {loading ? 'Creating account…' : 'Create free account'}
      </button>

      <p className="text-[#555570] text-xs text-center">
        By signing up you agree to our{' '}
        <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>.
      </p>
    </form>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: '#0a0900' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <Logo />
          </div>
          <p className="text-sm" style={{ color: '#b8a870' }}>Start generating AI ad creatives for your brands</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: '#0b1628', borderColor: '#1c1800' }}>
          <h1 className="text-white font-bold text-lg mb-6">Create your free account</h1>
          <Suspense>
            <SignupForm />
          </Suspense>
          <div className="mt-5 text-center">
            <span className="text-xs" style={{ color: '#b8a870' }}>Already have an account? </span>
            <a href="/login" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  )
}
