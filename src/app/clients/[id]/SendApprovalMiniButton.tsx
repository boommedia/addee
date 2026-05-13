'use client'

import { useState } from 'react'
import { Send, Clock, CheckCircle, Loader2 } from 'lucide-react'

export default function SendApprovalMiniButton({
  postId,
  initialStatus,
  clientEmail,
}: {
  postId: string
  initialStatus: string
  clientEmail: string | null
}) {
  const [status, setStatus] = useState(initialStatus)
  const [sending, setSending] = useState(false)

  if (!clientEmail) return null
  if (status === 'approved') {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
        <CheckCircle className="w-3 h-3" /> Approved
      </span>
    )
  }
  if (status === 'pending_approval') {
    return (
      <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
        <Clock className="w-3 h-3" /> Awaiting
      </span>
    )
  }

  async function send() {
    setSending(true)
    try {
      const res = await fetch(`/api/posts/${postId}/send-approval`, { method: 'POST' })
      if (res.ok) setStatus('pending_approval')
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      onClick={send}
      disabled={sending}
      className="flex items-center gap-1 text-xs font-semibold text-white bg-[#ca8a04] hover:bg-[#fbbf24] disabled:opacity-50 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
    >
      {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
      {sending ? '…' : 'Send Approval'}
    </button>
  )
}
