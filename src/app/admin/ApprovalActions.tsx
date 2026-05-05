'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, X } from 'lucide-react'

export default function ApprovalActions({ userId, email }: { userId: string; email: string }) {
  const router = useRouter()
  const [approveLoading, setApproveLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  async function handleApprove() {
    setApproveLoading(true)
    try {
      const res = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'approve' }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Approve failed:', err)
    } finally {
      setApproveLoading(false)
    }
  }

  async function handleReject() {
    setRejectLoading(true)
    try {
      const res = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reject' }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Reject failed:', err)
    } finally {
      setRejectLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleApprove}
        disabled={approveLoading || rejectLoading}
        className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {approveLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={rejectLoading || approveLoading}
        className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {rejectLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
        Reject
      </button>
    </div>
  )
}
