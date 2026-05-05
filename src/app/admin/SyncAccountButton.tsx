'use client'

import { useState } from 'react'
import { Loader2, RefreshCw, Check } from 'lucide-react'

export default function SyncAccountButton() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sync() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/sync-my-account', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setDone(true)
      } else {
        setError(data.error ?? 'Sync failed')
      }
    } catch {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={sync}
        disabled={loading || done}
        className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors font-semibold"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : done ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
        {done ? 'Synced!' : 'Sync my account → Agency'}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
