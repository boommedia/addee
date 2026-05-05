'use client'

import { useState } from 'react'
import { TrendingUp, Loader2, CheckCircle } from 'lucide-react'

export default function UpsellButton({
  userId,
  email,
  postsUsed,
  postsLimit,
}: {
  userId: string
  email: string
  postsUsed: number
  postsLimit: number
}) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/send-upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, postsUsed, postsLimit }),
      })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
    } catch {
      setError('Failed')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
        <CheckCircle className="w-3.5 h-3.5" /> Sent
      </span>
    )
  }

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
      {error ?? 'Send Upsell'}
    </button>
  )
}
