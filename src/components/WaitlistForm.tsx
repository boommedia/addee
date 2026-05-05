'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [agency, setAgency] = useState('')
  const [sites, setSites] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, agency, sites }),
      })
      if (!res.ok) throw new Error('Failed to join')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <CheckCircle className="w-10 h-10 text-cyan-400" />
        <div className="text-white font-bold text-lg">You're on the list!</div>
        <p className="text-[#8888a8] text-sm">We'll reach out with early access details. Check your inbox.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="Work email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full bg-[#12121a] border border-[#2a2a3d] text-white placeholder-[#8888a8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
      />
      <input
        type="text"
        placeholder="Agency name (optional)"
        value={agency}
        onChange={e => setAgency(e.target.value)}
        className="w-full bg-[#12121a] border border-[#2a2a3d] text-white placeholder-[#8888a8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
      />
      <select
        value={sites}
        onChange={e => setSites(e.target.value)}
        className="w-full bg-[#12121a] border border-[#2a2a3d] text-[#8888a8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
      >
        <option value="">How many client sites do you manage?</option>
        <option value="2-5">2–5 sites</option>
        <option value="5-10">5–10 sites</option>
        <option value="10-20">10–20 sites</option>
        <option value="20+">20+ sites</option>
      </select>
      {error && <p className="text-red-400 text-xs text-left">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? 'Joining...' : 'Join the Waitlist'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  )
}
