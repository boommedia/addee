'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function InviteButton({ email, agencyName }: { email: string; agencyName?: string | null }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, agencyName }),
      })
      if (!res.ok) throw new Error('Failed to send')
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
      className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
      {error ?? 'Send Invite'}
    </button>
  )
}
