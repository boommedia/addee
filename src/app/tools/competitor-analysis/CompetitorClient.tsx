'use client'

import { useState } from 'react'
import { Loader2, TrendingUp, Copy, ArrowRight, CheckCircle } from 'lucide-react'

type Client = { id: string; name: string; industry?: string | null; target_keywords?: string | null }
type KeywordResult = { keyword: string; volume: number; difficulty: number; intent: string; yourRank: number | null; competitorRank: number | null; gap: number }

export default function CompetitorClient({ clients }: { clients: Client[] }) {
  const [yourDomain, setYourDomain] = useState('')
  const [competitorDomain, setCompetitorDomain] = useState('')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<KeywordResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copiedKw, setCopiedKw] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!yourDomain.trim() || !competitorDomain.trim()) { setError('Enter both domains to compare'); return }
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const res = await fetch('/api/keywords/competitor-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yourDomain: yourDomain.trim(), competitorDomain: competitorDomain.trim(), clientId: clientId || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setResults(data.keywords ?? [])
      if ((data.keywords ?? []).length === 0) setError('No gap keywords found. Both domains may rank for the same keywords, or ranking data is unavailable.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function getIntentColor(intent: string) {
    const map: Record<string, string> = { informational: 'text-blue-400', navigational: 'text-cyan-400', commercial: 'text-amber-400', transactional: 'text-emerald-400' }
    return map[intent?.toLowerCase()] ?? 'text-[#8888a8]'
  }

  function getDifficultyColor(diff: number) {
    if (diff < 30) return 'text-emerald-400'
    if (diff < 60) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Input row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Your Domain</label>
          <input
            value={yourDomain}
            onChange={e => setYourDomain(e.target.value)}
            placeholder="yourdomain.com"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Competitor Domain</label>
          <input
            value={competitorDomain}
            onChange={e => setCompetitorDomain(e.target.value)}
            placeholder="competitor.com"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !yourDomain.trim() || !competitorDomain.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</> : <><TrendingUp className="w-4 h-4" />Find Gaps</>}
        </button>
      </div>

      {clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-4">
          <div>
            <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Client (optional)</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="">No specific client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}

      {/* Results */}
      {!loading && results.length === 0 && !error && (
        <div className="bg-[#12121a] border border-dashed border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-4 py-20">
          <TrendingUp className="w-12 h-12 text-[#2a2a3d]" />
          <div className="text-center">
            <p className="text-[#8888a8] text-sm font-semibold">Enter both domains to discover keyword gaps</p>
            <p className="text-[#555570] text-xs mt-1">Find keywords your competitor ranks for that you don't — then generate posts to close the gap</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          <p className="text-[#8888a8] text-sm">Fetching keyword rankings for both domains…</p>
          <p className="text-[#555570] text-xs">May take 10–20 seconds</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold">{results.length} gap keyword{results.length !== 1 ? 's' : ''} found</h3>
              <p className="text-[#555570] text-xs mt-0.5">Keywords <span className="text-cyan-400 font-semibold">{competitorDomain}</span> ranks for that you don't — sorted by opportunity</p>
            </div>
            <a
              href={`/dashboard?prompt=${encodeURIComponent('Write a blog post targeting: ' + results.slice(0, 3).map(r => r.keyword).join(', '))}`}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Generate posts for top 3 <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_70px_90px_90px_44px] text-[10px] font-bold uppercase tracking-wider text-[#555570] px-4 py-2.5 border-b border-[#2a2a3d]">
              <span>Keyword</span>
              <span className="text-right">Volume</span>
              <span className="text-right">Diff</span>
              <span className="text-right">Intent</span>
              <span className="text-right">Their rank</span>
              <span></span>
            </div>
            {results.map((kw, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_70px_90px_90px_44px] px-4 py-3 border-b border-[#1a1a26] last:border-0 hover:bg-[#14141f] transition-colors items-center">
                <div>
                  <div className="text-white text-sm font-semibold">{kw.keyword}</div>
                </div>
                <div className="text-right text-[#8888a8] text-xs">{kw.volume?.toLocaleString() ?? '—'}</div>
                <div className={`text-right text-xs font-bold ${getDifficultyColor(kw.difficulty)}`}>{kw.difficulty ?? '—'}</div>
                <div className={`text-right text-xs font-semibold capitalize ${getIntentColor(kw.intent)}`}>{kw.intent ?? '—'}</div>
                <div className="text-right">
                  {kw.competitorRank ? (
                    <span className="text-emerald-400 text-xs font-bold">#{kw.competitorRank}</span>
                  ) : <span className="text-[#555570] text-xs">—</span>}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => { navigator.clipboard.writeText(kw.keyword); setCopiedKw(kw.keyword); setTimeout(() => setCopiedKw(null), 1500) }}
                    className="text-[#555570] hover:text-white transition-colors"
                    title="Copy keyword"
                  >
                    {copiedKw === kw.keyword ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
