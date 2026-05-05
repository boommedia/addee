'use client'

import { useState } from 'react'
import { Loader2, Link2, Copy, ExternalLink, RefreshCw } from 'lucide-react'

type Client = { id: string; name: string }
type Suggestion = { title: string; url: string; anchorText: string; reason: string }

export default function InternalLinksClient({ clients }: { clients: Client[] }) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  async function handleFind() {
    if (!content.trim()) { setError('Paste your blog content first'); return }
    setLoading(true)
    setError(null)
    setSuggestions([])
    try {
      const res = await fetch('/api/internal-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: title.trim() || 'Blog Post', clientId: clientId || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to find suggestions')
      setSuggestions(data.suggestions ?? [])
      if ((data.suggestions ?? []).length === 0) setError('No internal link opportunities found. Make sure you have published posts for the selected client.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function copyLink(idx: number, s: Suggestion) {
    navigator.clipboard.writeText(`<a href="${s.url}">${s.anchorText}</a>`)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
      {/* Left: input */}
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Post Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Complete Guide to Local SEO for Plumbers"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Blog Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={14}
            placeholder="Paste the blog post you want to find internal links for…"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        {clients.length > 0 && (
          <div>
            <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Client</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="">No specific client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <p className="text-[#555570] text-xs mt-1">Suggestions are pulled from published posts for the selected client.</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

        <button
          onClick={handleFind}
          disabled={loading || !content.trim()}
          className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Finding opportunities…</> : <><Link2 className="w-4 h-4" />Find Internal Links</>}
        </button>

        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 text-xs text-[#8888a8]">
          <div className="font-semibold uppercase tracking-wider text-[#555570] mb-2">How it works</div>
          <p>Bloggy scans all published posts for the selected client and uses AI to find the best internal linking opportunities for your new post. You get: the post to link to, the ideal anchor text, and the reason why it fits.</p>
        </div>
      </div>

      {/* Right: results */}
      <div className="min-h-[500px]">
        {!loading && suggestions.length === 0 && !error && (
          <div className="h-full min-h-[500px] bg-[#12121a] border border-dashed border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-4">
            <Link2 className="w-12 h-12 text-[#2a2a3d]" />
            <div className="text-center">
              <p className="text-[#8888a8] text-sm font-semibold">Paste your content and find link opportunities</p>
              <p className="text-[#555570] text-xs mt-1">AI matches your new post to your existing published library</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="h-full min-h-[500px] bg-[#12121a] border border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            <p className="text-[#8888a8] text-sm">Scanning published posts for opportunities…</p>
          </div>
        )}
        {!loading && suggestions.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-semibold">{suggestions.length} internal link suggestion{suggestions.length !== 1 ? 's' : ''}</span>
              <button onClick={handleFind} className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
            {suggestions.map((s, i) => (
              <div key={i} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{s.title}</div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-violet-400 text-xs hover:text-violet-300 flex items-center gap-1 mt-0.5 truncate">
                      {s.url} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <button
                    onClick={() => copyLink(i, s)}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy className="w-3 h-3" />{copiedIdx === i ? 'Copied!' : 'Copy HTML'}
                  </button>
                </div>
                <div className="bg-[#0a0a12] border border-[#2a2a3a] rounded-lg px-3 py-2">
                  <div className="text-[#555570] text-[10px] uppercase tracking-wider mb-0.5">Suggested anchor text</div>
                  <div className="text-cyan-300 text-sm font-semibold">"{s.anchorText}"</div>
                </div>
                <p className="text-[#8888a8] text-xs">{s.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
