'use client'

import { useState } from 'react'
import { Loader2, Copy, CheckCircle, ArrowRight } from 'lucide-react'
import BlogPreview from '@/components/BlogPreview'

type Client = { id: string; name: string; brand_voice?: string | null }

export default function YouTubeToBlogClient({ clients }: { clients: Client[] }) {
  const [url, setUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ title: string; content: string; wordCount: number; seoMeta: { metaTitle: string; metaDescription: string; focusKeyword: string } } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const TONES = ['professional', 'conversational', 'educational', 'casual']

  function isValidYouTubeUrl(u: string) {
    return /(?:youtube\.com\/(?:watch|shorts)|youtu\.be\/)/.test(u)
  }

  async function handleGenerate() {
    if (!url.trim()) return
    if (!isValidYouTubeUrl(url)) { setError('Please enter a valid YouTube URL (youtube.com/watch or youtu.be/…)'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const selectedClient = clients.find(c => c.id === clientId)
      const res = await fetch('/api/youtube-to-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), tone, clientId: clientId || null, brandVoice: selectedClient?.brand_voice ?? null }),
      })
      const data = await res.json()
      if (res.status === 402) { setError(data.error ?? 'Post limit reached'); return }
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">YouTube Video URL</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-black">▶</span>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(null) }}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg pl-8 pr-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <p className="text-[#555570] text-xs mt-1">Paste a YouTube video URL — Bloggy extracts the transcript and rewrites it as a full blog post.</p>
        </div>

        {clients.length > 0 && (
          <div>
            <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Client (optional)</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="">No client / general</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${tone === t ? 'bg-violet-600 border-violet-600 text-white' : 'bg-[#12121a] border-[#2a2a3d] text-[#8888a8] hover:border-violet-500 hover:text-white'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !url.trim()}
          className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Extracting transcript…</> : '▶ Generate from YouTube'}
        </button>

        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
          <div className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3">How it works</div>
          {[
            'Bloggy fetches the full auto-generated transcript from YouTube',
            'Claude rewrites it as a structured, SEO-optimized blog post',
            'Headings, key points, and CTAs are added automatically',
            'Saved to Posts — publish to WordPress with one click',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
              <div className="w-5 h-5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-[#8888a8] text-xs">{step}</p>
            </div>
          ))}
          <p className="text-[#555570] text-xs mt-3">Requires videos with auto-generated or manual captions/subtitles enabled.</p>
        </div>
      </div>

      <div className="min-h-[500px]">
        {!result && !loading && (
          <div className="h-full min-h-[500px] bg-[#12121a] border border-dashed border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">▶</div>
            <div className="text-center">
              <p className="text-[#8888a8] text-sm font-semibold">Paste a YouTube URL above</p>
              <p className="text-[#555570] text-xs mt-1">Converts video transcripts into full blog posts</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="h-full min-h-[500px] bg-[#12121a] border border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-[#8888a8] text-sm">Extracting transcript and generating post…</p>
            <p className="text-[#555570] text-xs">Usually 20–40 seconds</p>
          </div>
        )}
        {result && (
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3d]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold text-sm truncate max-w-[240px]">{result.title}</span>
                <span className="text-[#555570] text-xs bg-[#1a1a26] px-2 py-0.5 rounded-full">{result.wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { navigator.clipboard.writeText(result.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] px-3 py-1.5 rounded-lg transition-colors">
                  <Copy className="w-3.5 h-3.5" />{copied ? 'Copied!' : 'Copy'}
                </button>
                <a href="/posts" className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors">
                  View in Posts <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
            {result.seoMeta.focusKeyword && (
              <div className="flex items-center gap-4 px-5 py-2 border-b border-[#1a1a26] bg-[#0d0d14]">
                <span className="text-[#555570] text-xs">Focus keyword: <span className="text-emerald-400 font-semibold">{result.seoMeta.focusKeyword}</span></span>
              </div>
            )}
            <div className="p-6 max-h-[700px] overflow-y-auto">
              <BlogPreview content={result.content} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
