'use client'

import { useState } from 'react'
import { Loader2, Copy, CheckCircle, ChevronDown, ChevronUp, Zap, Target, Search, BookOpen, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

type Client = { id: string; name: string }

type Brief = {
  headline: string
  altHeadlines: string[]
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  secondaryKeywords: string[]
  searchIntent: string
  targetAudience: string
  wordCountTarget: number
  outline: { heading: string; notes: string; wordTarget: number }[]
  keyPoints: string[]
  callToAction: string
  competitorInsights: string
  internalLinkSuggestions: string[]
  estimatedDifficulty: string
  estimatedTimeToRank: string
}

const INTENT_COLORS: Record<string, string> = {
  informational: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  commercial:    'text-violet-400 bg-violet-500/10 border-violet-500/20',
  transactional: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  navigational:  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
}

const DIFF_COLORS: Record<string, string> = {
  easy:   'text-emerald-400',
  medium: 'text-yellow-400',
  hard:   'text-red-400',
}

export default function BriefClient({ clients }: { clients: Client[] }) {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [audience, setAudience] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedOutline, setExpandedOutline] = useState(true)

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  async function generate() {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setBrief(null)
    try {
      const res = await fetch('/api/tools/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, audience, competitors, clientId: clientId || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate brief')
      setBrief(data.brief)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  function copyFullBrief() {
    if (!brief) return
    const text = [
      `# Content Brief: ${brief.headline}`,
      '',
      `## SEO`,
      `Meta Title: ${brief.metaTitle}`,
      `Meta Description: ${brief.metaDescription}`,
      `Focus Keyword: ${brief.focusKeyword}`,
      `Secondary Keywords: ${brief.secondaryKeywords.join(', ')}`,
      `Search Intent: ${brief.searchIntent}`,
      '',
      `## Target`,
      `Audience: ${brief.targetAudience}`,
      `Word Count: ${brief.wordCountTarget.toLocaleString()}`,
      `Difficulty: ${brief.estimatedDifficulty}`,
      `Time to Rank: ${brief.estimatedTimeToRank}`,
      '',
      `## Outline`,
      ...brief.outline.map(s => `${s.heading} (~${s.wordTarget}w)\n  ${s.notes}`),
      '',
      `## Key Points`,
      ...brief.keyPoints.map(p => `- ${p}`),
      '',
      `## CTA`,
      brief.callToAction,
    ].join('\n')
    copy(text, 'full')
  }

  function generateFromBrief() {
    if (!brief) return
    const kwParam = encodeURIComponent([brief.focusKeyword, ...brief.secondaryKeywords.slice(0, 3)].join(', '))
    const topicParam = encodeURIComponent(brief.headline)
    window.location.href = `/dashboard?prompt=${topicParam}&keywords=${kwParam}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
      {/* Form */}
      <div className="flex flex-col gap-5">
        {clients.length > 0 && (
          <div>
            <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Client (optional)</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="">No client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Topic / Title Idea</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            rows={3}
            placeholder="e.g. The benefits of local SEO for small businesses"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Target Keywords (optional)</label>
          <input
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="local SEO, Google Business Profile, small business"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Target Audience (optional)</label>
          <input
            value={audience}
            onChange={e => setAudience(e.target.value)}
            placeholder="Small business owners, marketing managers"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Competitor URLs / Context (optional)</label>
          <textarea
            value={competitors}
            onChange={e => setCompetitors(e.target.value)}
            rows={2}
            placeholder="https://competitor.com/article or describe what competitors cover"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Brief…</> : <><BookOpen className="w-4 h-4" />Generate Content Brief</>}
        </button>

        {brief && (
          <button
            onClick={generateFromBrief}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Generate Blog Post from Brief
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result */}
      <div>
        {!brief && !loading && (
          <div className="min-h-[400px] bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-10 h-10 text-[#2a2a3d] mx-auto mb-3" />
              <p className="text-[#8888a8] text-sm">Your content brief will appear here</p>
              <p className="text-[#555570] text-xs mt-1">Includes outline, keywords, SEO meta & more</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="min-h-[400px] bg-[#12121a] border border-[#2a2a3d] rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 mx-auto mb-3 animate-spin" />
              <p className="text-[#8888a8] text-sm">Researching topic and building brief…</p>
            </div>
          </div>
        )}

        {brief && (
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-[#2a2a3d]">
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-base leading-snug">{brief.headline}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${INTENT_COLORS[brief.searchIntent] ?? 'text-[#8888a8] bg-[#1a1a26] border-[#2a2a3d]'}`}>
                    {brief.searchIntent}
                  </span>
                  <span className={`text-xs font-semibold ${DIFF_COLORS[brief.estimatedDifficulty] ?? 'text-[#8888a8]'}`}>
                    {brief.estimatedDifficulty} difficulty
                  </span>
                  <span className="text-[#555570] text-xs">·</span>
                  <span className="text-[#8888a8] text-xs">{brief.estimatedTimeToRank} to rank</span>
                  <span className="text-[#555570] text-xs">·</span>
                  <span className="text-[#8888a8] text-xs">~{brief.wordCountTarget.toLocaleString()} words</span>
                </div>
              </div>
              <button
                onClick={copyFullBrief}
                className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] hover:bg-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors shrink-0"
              >
                {copiedId === 'full' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'full' ? 'Copied!' : 'Copy all'}
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[700px] overflow-y-auto">
              {/* Alt headlines */}
              {brief.altHeadlines?.length > 0 && (
                <Section label="Alternative Headlines" icon={<Zap className="w-3.5 h-3.5 text-violet-400" />}>
                  <div className="space-y-1.5">
                    {brief.altHeadlines.map((h, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2">
                        <span className="text-white text-sm">{h}</span>
                        <button onClick={() => copy(h, `alt-${i}`)} className="text-[#555570] hover:text-white shrink-0">
                          {copiedId === `alt-${i}` ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* SEO */}
              <Section label="SEO Metadata" icon={<Search className="w-3.5 h-3.5 text-yellow-400" />}>
                <div className="space-y-3">
                  <MetaField label="Meta Title" value={brief.metaTitle} limit={60} onCopy={v => copy(v, 'mt')} copied={copiedId === 'mt'} />
                  <MetaField label="Meta Description" value={brief.metaDescription} limit={160} onCopy={v => copy(v, 'md')} copied={copiedId === 'md'} textarea />
                  <div>
                    <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">Focus Keyword</p>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-300 text-sm font-semibold bg-violet-600/10 border border-violet-500/20 rounded-lg px-3 py-1.5">{brief.focusKeyword}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">Secondary Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {brief.secondaryKeywords.map(kw => (
                        <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-[#1a1a26] border border-[#2a2a3d] text-[#c8c8d8]">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Target */}
              <Section label="Target Audience" icon={<Target className="w-3.5 h-3.5 text-cyan-400" />}>
                <p className="text-[#c8c8d8] text-sm">{brief.targetAudience}</p>
              </Section>

              {/* Outline */}
              <Section
                label="Content Outline"
                icon={<BookOpen className="w-3.5 h-3.5 text-emerald-400" />}
                action={
                  <button onClick={() => setExpandedOutline(e => !e)} className="text-[#555570] hover:text-white transition-colors">
                    {expandedOutline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                }
              >
                {expandedOutline && (
                  <div className="space-y-2">
                    {brief.outline.map((section, i) => (
                      <div key={i} className="bg-[#0a0900] border border-[#2a2a3d] rounded-lg p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-white text-sm font-semibold font-mono">{section.heading}</span>
                          <span className="text-[#555570] text-xs shrink-0">~{section.wordTarget}w</span>
                        </div>
                        <p className="text-[#8888a8] text-xs">{section.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Key points */}
              <Section label="Key Points to Cover" icon={<CheckCircle className="w-3.5 h-3.5 text-violet-400" />}>
                <ul className="space-y-1.5">
                  {brief.keyPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#c8c8d8]">
                      <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* CTA */}
              <Section label="Call to Action">
                <p className="text-[#c8c8d8] text-sm">{brief.callToAction}</p>
              </Section>

              {/* Competitor insights */}
              {brief.competitorInsights && (
                <Section label="Competitor Insights">
                  <p className="text-[#c8c8d8] text-sm">{brief.competitorInsights}</p>
                </Section>
              )}

              {/* Internal links */}
              {brief.internalLinkSuggestions?.length > 0 && (
                <Section label="Internal Link Topic Suggestions">
                  <div className="flex flex-wrap gap-1.5">
                    {brief.internalLinkSuggestions.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#1a1a26] border border-[#2a2a3d] text-[#c8c8d8]">{s}</span>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ label, icon, children, action }: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="flex items-center gap-1.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider">
          {icon}{label}
        </p>
        {action}
      </div>
      {children}
    </div>
  )
}

function MetaField({ label, value, limit, onCopy, copied, textarea }: {
  label: string; value: string; limit: number
  onCopy: (v: string) => void; copied: boolean; textarea?: boolean
}) {
  const over = value.length > limit
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2">
          <span className={clsx('text-xs', over ? 'text-red-400' : 'text-[#555570]')}>{value.length}/{limit}</span>
          <button onClick={() => onCopy(value)} className="text-[#555570] hover:text-white transition-colors">
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      {textarea ? (
        <textarea readOnly value={value} rows={3} className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none" />
      ) : (
        <input readOnly value={value} className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
      )}
    </div>
  )
}
