'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, Zap, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

const EVENTS = [
  { id: 'post.created',   label: 'Post Created',    desc: 'Fires when a blog post is generated' },
  { id: 'post.published', label: 'Post Published',  desc: 'Fires when a post is published to WordPress' },
]

type Hook = {
  id: string
  url: string
  events: string[]
  label: string | null
  last_triggered_at: string | null
  last_status: number | null
}

export default function WebhookSettings() {
  const [hooks, setHooks] = useState<Hook[]>([])
  const [loading, setLoading] = useState(true)
  const [addingUrl, setAddingUrl] = useState('')
  const [addingLabel, setAddingLabel] = useState('')
  const [addingEvents, setAddingEvents] = useState<string[]>(['post.created'])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/webhooks/outbound')
      .then(r => r.json())
      .then(d => setHooks(d.hooks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function addHook() {
    if (!addingUrl.trim() || !addingEvents.length) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/webhooks/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: addingUrl, events: addingEvents, label: addingLabel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setHooks(prev => [data.hook, ...prev])
      setAddingUrl('')
      setAddingLabel('')
      setAddingEvents(['post.created'])
      setExpanded(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function deleteHook(id: string) {
    await fetch(`/api/webhooks/outbound?id=${id}`, { method: 'DELETE' })
    setHooks(prev => prev.filter(h => h.id !== id))
  }

  function toggleEvent(id: string) {
    setAddingEvents(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-white font-semibold text-sm">Webhooks & Zapier</h2>
        </div>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Webhook
          </button>
        )}
      </div>
      <div className="px-5 py-4 space-y-4">
        <p className="text-[#8888a8] text-sm">
          Send HTTP POST events to any URL when posts are created or published.
          Works with <strong className="text-[#c8c8d8]">Zapier</strong>, Make, n8n, Slack, or any custom endpoint.
        </p>

        {/* Add form */}
        {expanded && (
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Webhook URL</label>
              <input
                value={addingUrl}
                onChange={e => setAddingUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Label (optional)</label>
              <input
                value={addingLabel}
                onChange={e => setAddingLabel(e.target.value)}
                placeholder="e.g. Zapier Slack Alert"
                className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">Events</label>
              <div className="flex flex-col gap-2">
                {EVENTS.map(ev => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleEvent(ev.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors ${
                      addingEvents.includes(ev.id)
                        ? 'bg-violet-600/10 border-violet-500/30 text-white'
                        : 'bg-[#12121a] border-[#2a2a3d] text-[#8888a8] hover:border-[#3a3a4d]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      addingEvents.includes(ev.id) ? 'bg-violet-600 border-violet-600' : 'border-[#3a3a4d]'
                    }`}>
                      {addingEvents.includes(ev.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-mono">{ev.id}</div>
                      <div className="text-xs text-[#555570]">{ev.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                onClick={addHook}
                disabled={saving || !addingUrl.trim() || !addingEvents.length}
                className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Save Webhook
              </button>
              <button onClick={() => setExpanded(false)} className="text-xs text-[#8888a8] hover:text-white px-3 py-2 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Zapier hint */}
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
          <p className="text-amber-300/80 text-xs">
            <strong className="text-amber-300">Zapier tip:</strong> Create a Zap with trigger "Webhooks by Zapier" → "Catch Hook".
            Copy the URL from step 1 and paste it above. Events include post title, content, word count, client ID, and timestamp.
          </p>
        </div>

        {/* Existing hooks */}
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          </div>
        ) : hooks.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[#555570] text-xs font-semibold uppercase tracking-wider">Active Webhooks ({hooks.length})</p>
            {hooks.map(hook => (
              <div key={hook.id} className="flex items-start gap-3 bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  {hook.label && <p className="text-white text-xs font-semibold mb-0.5">{hook.label}</p>}
                  <p className="text-[#8888a8] text-xs truncate font-mono">{hook.url}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {(hook.events as string[]).map(e => (
                      <span key={e} className="text-[10px] font-mono bg-[#1a1a26] border border-[#2a2a3d] text-[#c8c8d8] px-1.5 py-0.5 rounded">{e}</span>
                    ))}
                    {hook.last_triggered_at && (
                      <span className="text-[#555570] text-[10px]">
                        Last: {new Date(hook.last_triggered_at).toLocaleDateString()}{' '}
                        {hook.last_status && (
                          hook.last_status >= 200 && hook.last_status < 300
                            ? <span className="text-emerald-400">({hook.last_status})</span>
                            : <span className="text-red-400">({hook.last_status})</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteHook(hook.id)}
                  className="text-[#555570] hover:text-red-400 transition-colors shrink-0 mt-0.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : !expanded ? (
          <p className="text-[#555570] text-sm text-center py-4">No webhooks configured yet.</p>
        ) : null}
      </div>
    </div>
  )
}
