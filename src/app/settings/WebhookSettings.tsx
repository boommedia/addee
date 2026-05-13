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
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Webhooks & Zapier</h2>
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
        <p className="text-sm" style={{ color: '#b8a870' }}>
          Send HTTP POST events to any URL when posts are created or published.
          Works with <strong style={{ color: '#dde4f0' }}>Zapier</strong>, Make, n8n, Slack, or any custom endpoint.
        </p>

        {/* Add form */}
        {expanded && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(10,9,0,0.8)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#b8a870' }}>Webhook URL</label>
              <input
                value={addingUrl}
                onChange={e => setAddingUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid', color: '#dde4f0' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#b8a870' }}>Label (optional)</label>
              <input
                value={addingLabel}
                onChange={e => setAddingLabel(e.target.value)}
                placeholder="e.g. Zapier Slack Alert"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid', color: '#dde4f0' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#b8a870' }}>Events</label>
              <div className="flex flex-col gap-2">
                {EVENTS.map(ev => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleEvent(ev.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors ${
                      addingEvents.includes(ev.id)
                        ? 'bg-violet-600/10 border-violet-500/30'
                        : ''
                    }`}
                    style={{
                      background: addingEvents.includes(ev.id) ? 'rgba(124,58,202,0.1)' : 'rgba(20,18,0,0.6)',
                      borderColor: addingEvents.includes(ev.id) ? 'rgba(124,58,202,0.3)' : 'rgba(202,138,4,0.3)',
                      color: addingEvents.includes(ev.id) ? '#dde4f0' : '#b8a870',
                    }}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      addingEvents.includes(ev.id) ? 'bg-violet-600 border-violet-600' : ''
                    }`}
                    style={{
                      borderColor: addingEvents.includes(ev.id) ? undefined : 'rgba(202,138,4,0.3)',
                    }}>
                      {addingEvents.includes(ev.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-mono" style={{ color: 'inherit' }}>{ev.id}</div>
                      <div className="text-xs" style={{ color: addingEvents.includes(ev.id) ? '#b8a870' : '#b8a870' }}>{ev.desc}</div>
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
              <button onClick={() => setExpanded(false)} className="text-xs px-3 py-2 transition-colors" style={{ color: '#b8a870' }}>
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
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#b8a870' }}>Active Webhooks ({hooks.length})</p>
            {hooks.map(hook => (
              <div key={hook.id} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
                <div className="flex-1 min-w-0">
                  {hook.label && <p className="text-xs font-semibold mb-0.5" style={{ color: '#dde4f0' }}>{hook.label}</p>}
                  <p className="text-xs truncate font-mono" style={{ color: '#b8a870' }}>{hook.url}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {(hook.events as string[]).map(e => (
                      <span key={e} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid', color: '#dde4f0' }}>{e}</span>
                    ))}
                    {hook.last_triggered_at && (
                      <span className="text-[10px]" style={{ color: '#b8a870' }}>
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
                  className="transition-colors shrink-0 mt-0.5" style={{ color: '#b8a870' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : !expanded ? (
          <p className="text-sm text-center py-4" style={{ color: '#b8a870' }}>No webhooks configured yet.</p>
        ) : null}
      </div>
    </div>
  )
}
