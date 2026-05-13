'use client'

import { useState } from 'react'
import { Loader2, Copy, Share2, CheckCircle } from 'lucide-react'

const PLATFORMS = [
  { id: 'linkedin',  label: 'LinkedIn',    abbr: 'in', bg: 'bg-[#0a66c2]', hint: 'Thought-leader post',  dark: false },
  { id: 'twitter',   label: 'X / Twitter', abbr: 'X',  bg: 'bg-[#1a1a1a]', hint: 'Thread · 280 chars',   dark: false },
  { id: 'facebook',  label: 'Facebook',    abbr: 'f',  bg: 'bg-[#1877f2]', hint: 'Conversational post',  dark: false },
  { id: 'instagram', label: 'Instagram',   abbr: 'ig', bg: 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]', hint: 'Caption + hashtags', dark: false },
  { id: 'threads',   label: 'Threads',     abbr: '⌇',  bg: 'bg-[#0f0f0f]', hint: 'Conversation starter', dark: false },
  { id: 'tiktok',    label: 'TikTok',      abbr: 'tt', bg: 'bg-[#010101]', hint: 'Script + caption',     dark: false },
  { id: 'gmb',       label: 'Google Biz',  abbr: 'G',  bg: 'bg-white',     hint: 'Business post',        dark: true  },
  { id: 'pinterest', label: 'Pinterest',   abbr: 'P',  bg: 'bg-[#e60023]', hint: 'Pin + SEO desc',       dark: false },
  { id: 'youtube',   label: 'YouTube',     abbr: '▶',  bg: 'bg-[#ff0000]', hint: 'Desc + tags',          dark: false },
] as const

type PlatformId = typeof PLATFORMS[number]['id']

export default function RepurposeClient() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [activePlatform, setActivePlatform] = useState<PlatformId>('linkedin')
  const [results, setResults] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleRepurpose(platform: PlatformId) {
    if (!content.trim()) { setError('Paste your blog content first'); return }
    setActivePlatform(platform)
    if (results[platform]) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: title.trim() || 'Blog Post', platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Repurpose failed')
      setResults(prev => ({ ...prev, [platform]: data.text }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6 items-start">
      {/* Left: input */}
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Post Title (optional)</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. 10 Ways to Improve Your Local SEO"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
            Blog Content <span className="font-normal normal-case">(paste markdown or plain text)</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={16}
            placeholder="Paste your blog post content here…"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors resize-none font-mono"
          />
          <p className="text-[#555570] text-xs mt-1">{content.split(/\s+/).filter(Boolean).length} words pasted</p>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3">Select Platform</label>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => handleRepurpose(p.id)}
                disabled={loading && activePlatform !== p.id}
                className={`flex items-center gap-2 px-2.5 py-2.5 rounded-xl border text-left transition-all ${
                  activePlatform === p.id ? 'border-violet-500 bg-violet-600/10' : 'border-[#2a2a3d] bg-[#12121a] hover:border-[#3a3a5a]'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${p.bg} ${p.dark ? 'text-[#4285f4]' : 'text-white'}`}>
                  {p.abbr}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${activePlatform === p.id ? 'text-white' : 'text-[#c8c8d8]'}`}>{p.label}</div>
                  <div className="text-[#555570] text-[10px] truncate">{p.hint}</div>
                </div>
                {results[p.id] && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: output */}
      <div className="min-h-[500px]">
        {!results[activePlatform] && !loading && (
          <div className="h-full min-h-[500px] bg-[#12121a] border border-dashed border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-4">
            <Share2 className="w-12 h-12 text-[#2a2a3d]" />
            <div className="text-center">
              <p className="text-[#8888a8] text-sm font-semibold">Paste your content, then pick a platform</p>
              <p className="text-[#555570] text-xs mt-1">Each platform gets uniquely tailored copy</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="h-full min-h-[500px] bg-[#12121a] border border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            <p className="text-[#8888a8] text-sm">
              Generating {activePlatform === 'gmb' ? 'Google Business' : activePlatform === 'twitter' ? 'X / Twitter' : PLATFORMS.find(p => p.id === activePlatform)?.label} copy…
            </p>
          </div>
        )}
        {results[activePlatform] && !loading && (
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3d]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold text-sm">
                  {PLATFORMS.find(p => p.id === activePlatform)?.label} Copy
                </span>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(results[activePlatform]); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] px-3 py-1.5 rounded-lg transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />{copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-5">
              <textarea
                readOnly
                value={results[activePlatform]}
                rows={22}
                className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-xl px-4 py-3 text-white text-sm leading-relaxed focus:outline-none resize-none"
              />
              <p className="text-[#555570] text-xs mt-2">Click another platform above to generate more — all results are cached until you paste new content.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
