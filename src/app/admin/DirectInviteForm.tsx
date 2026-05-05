'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle, UserPlus } from 'lucide-react'

export default function DirectInviteForm() {
  const [email, setEmail] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), agencyName: agencyName.trim() || null }),
      })
      if (!res.ok) throw new Error('Failed to send invite')
      setSent(true)
      setEmail('')
      setAgencyName('')
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-4 h-4 text-violet-400" />
        <h2 className="text-white font-bold text-sm">Send Platform Invite</h2>
      </div>
      <form onSubmit={handleSend} className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wide mb-1.5">Email *</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wide mb-1.5">Agency Name</label>
          <input
            type="text"
            value={agencyName}
            onChange={e => setAgencyName(e.target.value)}
            placeholder="Optional"
            className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Send Invite
        </button>
        {sent && (
          <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Invite sent!
          </span>
        )}
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </form>
    </div>
  )
}
