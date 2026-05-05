'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Trash2, Loader2, CheckCircle, ExternalLink } from 'lucide-react'

export default function WaitlistActions({
  email,
  agencyName,
}: {
  email: string
  agencyName?: string | null
}) {
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleInvite() {
    setInviteLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, agencyName }),
      })
      if (!res.ok) throw new Error('Failed')
      setInviteSent(true)
    } catch {
      setError('Failed to send')
    } finally {
      setInviteLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove ${email} from the waitlist?`)) return
    setDeleteLoading(true)
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch {
      setError('Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  const signupLink = `/signup?email=${encodeURIComponent(email)}${agencyName ? `&agency=${encodeURIComponent(agencyName)}` : ''}`

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {inviteSent ? (
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5" /> Invited
        </span>
      ) : (
        <button
          onClick={handleInvite}
          disabled={inviteLoading}
          title="Send invite email"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {inviteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
          Invite
        </button>
      )}

      <a
        href={signupLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Open pre-filled signup link"
        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <ExternalLink className="w-3 h-3" /> Signup link
      </a>

      <button
        onClick={handleDelete}
        disabled={deleteLoading}
        title="Delete from waitlist"
        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {deleteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        Delete
      </button>

      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
