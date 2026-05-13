'use client'

import { useState } from 'react'
import { Send, Plus, X, MessageSquare } from 'lucide-react'

export default function DiscordReleaseForm() {
  const [version, setVersion] = useState('')
  const [title, setTitle] = useState('')
  const [features, setFeatures] = useState<string[]>([''])
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  function addFeature() {
    setFeatures(f => [...f, ''])
  }

  function removeFeature(i: number) {
    setFeatures(f => f.filter((_, idx) => idx !== i))
  }

  function updateFeature(i: number, val: string) {
    setFeatures(f => f.map((v, idx) => idx === i ? val : v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const filled = features.filter(f => f.trim())
    if (!version.trim() || !title.trim() || !filled.length) return

    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/admin/discord-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: version.trim(), title: title.trim(), features: filled, notes: notes.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setStatus('sent')
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err: unknown) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="bg-[#141200] border border-[#2a2200] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#2a2200] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#ca8a04]" />
        <h2 className="text-white font-bold text-sm">Post Release to Discord</h2>
        <span className="ml-auto text-xs text-[#7a6a40]">Posts to #🎉changelog</span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider block mb-1.5">Version</label>
            <input
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="e.g. v1.3"
              className="w-full bg-[#0a0900] border border-[#2a2200] rounded-lg px-3 py-2 text-white text-sm placeholder-[#7a6a40] focus:outline-none focus:border-[#ca8a04]"
            />
          </div>
          <div>
            <label className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider block mb-1.5">Release Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. WordPress Publishing"
              className="w-full bg-[#0a0900] border border-[#2a2200] rounded-lg px-3 py-2 text-white text-sm placeholder-[#7a6a40] focus:outline-none focus:border-[#ca8a04]"
            />
          </div>
        </div>

        <div>
          <label className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider block mb-1.5">Features Shipped</label>
          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={f}
                  onChange={e => updateFeature(i, e.target.value)}
                  placeholder={`Feature ${i + 1}`}
                  className="flex-1 bg-[#0a0900] border border-[#2a2200] rounded-lg px-3 py-2 text-white text-sm placeholder-[#7a6a40] focus:outline-none focus:border-[#ca8a04]"
                />
                {features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(i)} className="text-[#7a6a40] hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 flex items-center gap-1.5 text-xs text-[#ca8a04] hover:text-[#fbbf24] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add feature
          </button>
        </div>

        <div>
          <label className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider block mb-1.5">Additional Notes <span className="normal-case font-normal">(optional)</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any extra context, breaking changes, or upgrade notes..."
            rows={3}
            className="w-full bg-[#0a0900] border border-[#2a2200] rounded-lg px-3 py-2 text-white text-sm placeholder-[#7a6a40] focus:outline-none focus:border-[#ca8a04] resize-none"
          />
        </div>

        {/* Preview */}
        {(version || title || features.some(f => f.trim())) && (
          <div className="bg-[#0a0900] border border-[#ca8a04]/20 rounded-xl p-4">
            <p className="text-[#7a6a40] text-xs font-semibold uppercase tracking-wider mb-2">Preview</p>
            <div className="border-l-4 border-[#ca8a04] pl-3">
              <p className="text-white font-bold text-sm">🎉 Bloggy {version} — {title}</p>
              <div className="mt-2 space-y-0.5">
                {features.filter(f => f.trim()).map((f, i) => (
                  <p key={i} className="text-[#c8c8d8] text-xs">✅ {f}</p>
                ))}
              </div>
              {notes && <p className="text-[#b8a870] text-xs mt-2">{notes}</p>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending' || !version.trim() || !title.trim() || !features.some(f => f.trim())}
            className="flex items-center gap-2 bg-[#ca8a04] hover:bg-[#fbbf24] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Posting...' : 'Post to Discord'}
          </button>
          {status === 'sent' && <span className="text-emerald-400 text-sm font-semibold">✓ Posted to #changelog</span>}
          {status === 'error' && <span className="text-red-400 text-sm">{error}</span>}
        </div>
      </form>
    </div>
  )
}
