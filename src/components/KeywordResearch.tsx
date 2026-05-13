'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, Loader2, Copy, ArrowRight, Check, BarChart2, History, Bookmark,
  BookmarkPlus, Trash2, Plus, X, ChevronDown, ChevronRight, Tag, Download,
  FileText, Layers, Globe, CalendarDays, Upload,
} from 'lucide-react'
import clsx from 'clsx'

type Client = { id: string; name: string; industry: string | null; target_keywords: string | null }

type Keyword = {
  keyword: string
  intent: 'informational' | 'transactional' | 'local' | 'navigational'
  difficulty: 'easy' | 'medium' | 'hard'
  volume: 'low' | 'medium' | 'high'
  blog_title: string
  cluster?: string
  gap_reason?: string
}

type ContentBrief = {
  search_intent_summary: string
  target_audience: string
  recommended_word_count: number
  title_options: string[]
  meta_description: string
  outline: Array<{ type: 'h2' | 'h3'; text: string; notes: string }>
  key_points: string[]
  related_keywords: string[]
  internal_link_opportunities: string[]
  cta_suggestions: string[]
  content_angle: string
}

type SearchRecord = {
  id: string; niche: string; location: string | null; client_id: string | null
  keywords: Keyword[]; created_at: string
}

type KeywordList = {
  id: string; name: string; description: string | null; client_id: string | null
  keywords: Keyword[]; created_at: string; updated_at: string
}

const INTENT_STYLES: Record<string, string> = {
  informational: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  transactional: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  local: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  navigational: 'bg-[#1a1a26] border-[#2a2a3d] text-[#8888a8]',
}
const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'text-emerald-400', medium: 'text-yellow-400', hard: 'text-red-400',
}
const VOLUME_DOTS: Record<string, number> = { low: 1, medium: 2, high: 3 }

// ── SERP Preview ─────────────────────────────────────────────────────────────
function SerpPreview({ keyword, blogTitle, onClose }: { keyword: Keyword; blogTitle: string; onClose: () => void }) {
  const slug = keyword.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const url = `bloggy.online/blog/${slug}`
  const desc = `Learn everything about ${keyword.keyword}. This comprehensive guide covers key insights, tips, and strategies to help you succeed.`
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Google SERP Preview</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-sm bg-gray-200 flex items-center justify-center">
              <span className="text-[7px] font-bold text-gray-500">B</span>
            </div>
            <span className="text-gray-600 text-xs">{url}</span>
            <span className="text-gray-400 text-xs">›</span>
          </div>
          <div className="text-[#1a0dab] text-lg font-normal hover:underline cursor-pointer leading-snug mb-1">
            {blogTitle.slice(0, 65)}{blogTitle.length > 65 ? '...' : ''}
          </div>
          <div className="text-[#545454] text-sm leading-relaxed">
            {desc.slice(0, 155)}…
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-3 text-center">How this post would appear in Google search results</p>
      </div>
    </div>
  )
}

// ── Content Brief Modal ───────────────────────────────────────────────────────
function BriefModal({ keyword, niche, location, onClose }: { keyword: Keyword; niche: string; location: string; onClose: () => void }) {
  const [brief, setBrief] = useState<ContentBrief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/keywords/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: keyword.keyword, blog_title: keyword.blog_title, intent: keyword.intent, niche, location }),
    }).then(r => r.json()).then(d => {
      if (d.brief) setBrief(d.brief)
      else setError(d.error ?? 'Failed to generate')
    }).catch(() => setError('Network error')).finally(() => setLoading(false))
  }, [keyword, niche, location])

  function copyBrief() {
    if (!brief) return
    const text = [
      `CONTENT BRIEF: ${keyword.keyword}`,
      `Title: ${brief.title_options[0]}`,
      `Meta: ${brief.meta_description}`,
      `Word count: ~${brief.recommended_word_count}`,
      `Audience: ${brief.target_audience}`,
      `Angle: ${brief.content_angle}`,
      `\nOUTLINE:`,
      ...brief.outline.map(h => `${h.type.toUpperCase()}: ${h.text} — ${h.notes}`),
      `\nKEY POINTS:`,
      ...brief.key_points.map(p => `• ${p}`),
      `\nRELATED KEYWORDS: ${brief.related_keywords.join(', ')}`,
      `\nCTA OPTIONS:`,
      ...brief.cta_suggestions.map(c => `• ${c}`),
    ].join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3d]">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              <span className="text-white font-bold">Content Brief</span>
            </div>
            <div className="text-[#8888a8] text-xs mt-0.5">"{keyword.keyword}"</div>
          </div>
          <div className="flex items-center gap-2">
            {brief && (
              <button onClick={copyBrief} className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors">
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy brief'}
              </button>
            )}
            <button onClick={onClose} className="text-[#555570] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {loading && <div className="flex items-center justify-center py-16 gap-2 text-[#8888a8] text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Generating brief…</div>}
          {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}
          {brief && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Word Count" value={`~${brief.recommended_word_count.toLocaleString()} words`} />
                <InfoCard label="Search Intent" value={brief.search_intent_summary} />
                <InfoCard label="Target Audience" value={brief.target_audience} />
                <InfoCard label="Content Angle" value={brief.content_angle} />
              </div>

              <div>
                <SectionLabel>Title Options</SectionLabel>
                <div className="space-y-1">
                  {brief.title_options.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#0d0d14] border border-[#2a2a3d] rounded-lg px-3 py-2">
                      <span className="text-violet-400 text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="text-[#c8c8d8] text-sm">{t}</span>
                      <button onClick={() => navigator.clipboard.writeText(t)} className="ml-auto text-[#555570] hover:text-white shrink-0"><Copy className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel>Meta Description</SectionLabel>
                <div className="bg-[#0d0d14] border border-[#2a2a3d] rounded-lg px-3 py-2.5 flex items-start gap-2">
                  <span className="text-[#c8c8d8] text-sm flex-1">{brief.meta_description}</span>
                  <button onClick={() => navigator.clipboard.writeText(brief.meta_description)} className="text-[#555570] hover:text-white shrink-0 mt-0.5"><Copy className="w-3 h-3" /></button>
                </div>
                <div className="text-[#555570] text-xs mt-1">{brief.meta_description.length} / 160 chars</div>
              </div>

              <div>
                <SectionLabel>Article Outline</SectionLabel>
                <div className="space-y-1">
                  {brief.outline.map((h, i) => (
                    <div key={i} className={clsx('flex items-start gap-2.5 rounded-lg px-3 py-2', h.type === 'h2' ? 'bg-violet-600/8 border border-violet-500/20' : 'bg-[#0d0d14] border border-[#2a2a3d] ml-4')}>
                      <span className={clsx('text-xs font-bold shrink-0 mt-0.5', h.type === 'h2' ? 'text-violet-400' : 'text-[#555570]')}>{h.type.toUpperCase()}</span>
                      <div>
                        <div className={clsx('text-sm font-medium', h.type === 'h2' ? 'text-white' : 'text-[#c8c8d8]')}>{h.text}</div>
                        <div className="text-[#555570] text-xs mt-0.5">{h.notes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SectionLabel>Key Points to Cover</SectionLabel>
                  <ul className="space-y-1">
                    {brief.key_points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#c8c8d8] text-sm">
                        <span className="text-emerald-400 mt-0.5 shrink-0">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <SectionLabel>Related Keywords to Include</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {brief.related_keywords.map((k, i) => (
                      <span key={i} className="text-xs bg-[#1a1a26] border border-[#2a2a3d] text-[#8888a8] px-2 py-1 rounded-lg">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel>CTA Suggestions</SectionLabel>
                <div className="space-y-1">
                  {brief.cta_suggestions.map((c, i) => (
                    <div key={i} className="bg-[#0d0d14] border border-[#2a2a3d] rounded-lg px-3 py-2 text-[#c8c8d8] text-sm">{c}</div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {brief && (
          <div className="px-6 py-4 border-t border-[#2a2a3d]">
            <a
              href={`/dashboard?prompt=${encodeURIComponent(brief.title_options[0] ?? keyword.blog_title)}&keywords=${encodeURIComponent(keyword.keyword)}`}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Write this post now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">{children}</div>
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0d0d14] border border-[#2a2a3d] rounded-xl px-3 py-2.5">
      <div className="text-[#555570] text-[10px] font-semibold uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[#c8c8d8] text-xs leading-relaxed">{value}</div>
    </div>
  )
}

// ── Keyword Table ─────────────────────────────────────────────────────────────
function KeywordTable({
  keywords, selected, onToggle, onToggleAll, onCopyKeyword, copiedIdx, clientId,
  compact = false, showCluster = false, onSerpPreview, onBrief,
}: {
  keywords: Keyword[]
  selected: Set<number>
  onToggle: (i: number) => void
  onToggleAll: () => void
  onCopyKeyword: (kw: string, i: number) => void
  copiedIdx: number | null
  clientId?: string
  compact?: boolean
  showCluster?: boolean
  onSerpPreview?: (kw: Keyword) => void
  onBrief?: (kw: Keyword) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2a2a3d]">
            <th className="px-4 py-2.5">
              <input type="checkbox" checked={selected.size === keywords.length && keywords.length > 0} onChange={onToggleAll} className="w-3.5 h-3.5 accent-violet-500 cursor-pointer" />
            </th>
            <th className="text-left px-3 py-2.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Keyword</th>
            {showCluster && <th className="text-left px-4 py-2.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Cluster</th>}
            <th className="text-left px-4 py-2.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Intent</th>
            {!compact && <th className="text-left px-4 py-2.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Difficulty</th>}
            <th className="text-left px-4 py-2.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Vol</th>
            {!compact && <th className="text-left px-4 py-2.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Suggested Post Title</th>}
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {keywords.map((kw, i) => (
            <tr key={i} className={clsx('border-b border-[#2a2a3d] hover:bg-[#1a1a26] transition-colors cursor-pointer', selected.has(i) ? 'bg-violet-600/5' : i % 2 === 0 ? '' : 'bg-[#0d0d14]')} onClick={() => onToggle(i)}>
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={selected.has(i)} onChange={() => onToggle(i)} className="w-3.5 h-3.5 accent-violet-500 cursor-pointer" />
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{kw.keyword}</span>
                  <button onClick={e => { e.stopPropagation(); onCopyKeyword(kw.keyword, i) }} className="text-[#555570] hover:text-white transition-colors shrink-0">
                    {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                {compact && <div className="text-[#555570] text-[11px] mt-0.5 truncate max-w-[180px]">{kw.blog_title}</div>}
                {kw.gap_reason && <div className="text-orange-400/80 text-[10px] mt-0.5 italic">{kw.gap_reason}</div>}
              </td>
              {showCluster && (
                <td className="px-4 py-3 hidden sm:table-cell">
                  {kw.cluster && <span className="text-xs bg-[#1a1a26] border border-[#2a2a3d] text-[#8888a8] px-2 py-0.5 rounded-full whitespace-nowrap">{kw.cluster}</span>}
                </td>
              )}
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${INTENT_STYLES[kw.intent]}`}>{kw.intent}</span>
              </td>
              {!compact && (
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs font-semibold capitalize ${DIFFICULTY_STYLES[kw.difficulty]}`}>{kw.difficulty}</span>
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map(dot => <div key={dot} className={clsx('w-2 h-2 rounded-full', dot <= VOLUME_DOTS[kw.volume] ? 'bg-violet-400' : 'bg-[#2a2a3d]')} />)}
                </div>
              </td>
              {!compact && (
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-[#c8c8d8] text-xs">{kw.blog_title}</span>
                </td>
              )}
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  {onSerpPreview && (
                    <button onClick={() => onSerpPreview(kw)} title="SERP Preview" className="text-[#555570] hover:text-blue-400 transition-colors p-1">
                      <Globe className="w-3 h-3" />
                    </button>
                  )}
                  {onBrief && (
                    <button onClick={() => onBrief(kw)} title="Content Brief" className="text-[#555570] hover:text-violet-400 transition-colors p-1">
                      <FileText className="w-3 h-3" />
                    </button>
                  )}
                  <a href={`/dashboard?prompt=${encodeURIComponent(kw.blog_title)}&keywords=${encodeURIComponent(kw.keyword)}${clientId ? `&client=${clientId}` : ''}`} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-semibold whitespace-nowrap transition-colors">
                    Write <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Cluster view ──────────────────────────────────────────────────────────────
function ClusterView({ keywords, clientId }: { keywords: Keyword[]; clientId?: string }) {
  const clusters: Record<string, Keyword[]> = {}
  for (const kw of keywords) {
    const key = kw.cluster ?? 'General'
    clusters[key] = clusters[key] ?? []
    clusters[key].push(kw)
  }
  return (
    <div className="p-4 space-y-4">
      {Object.entries(clusters).map(([cluster, kws]) => (
        <div key={cluster} className="bg-[#0d0d14] border border-[#2a2a3d] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#12121a] border-b border-[#2a2a3d]">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-white text-sm font-semibold">{cluster}</span>
            <span className="text-[#555570] text-xs ml-1">{kws.length} keywords</span>
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {kws.map((kw, i) => (
              <a key={i} href={`/dashboard?prompt=${encodeURIComponent(kw.blog_title)}&keywords=${encodeURIComponent(kw.keyword)}${clientId ? `&client=${clientId}` : ''}`}
                className="flex items-center gap-1.5 bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500/40 rounded-lg px-3 py-1.5 transition-colors group">
                <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', kw.difficulty === 'easy' ? 'bg-emerald-400' : kw.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400')} />
                <span className="text-[#c8c8d8] group-hover:text-white text-xs transition-colors">{kw.keyword}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Action bar ────────────────────────────────────────────────────────────────
function ActionBar({
  selectedCount, clients, onPushToQueue, onSaveToList, pushing, pushSuccess,
}: {
  selectedCount: number
  clients: Client[]
  onPushToQueue: (clientId: string) => void
  onSaveToList: () => void
  pushing: boolean
  pushSuccess: string | null
}) {
  const [pushClientId, setPushClientId] = useState('')
  if (selectedCount === 0) return null
  return (
    <div className="border-t border-[#2a2a3d] px-5 py-4 bg-[#0d0d14] flex items-center gap-3 flex-wrap">
      <span className="text-white text-xs font-semibold">{selectedCount} selected</span>
      <button onClick={onSaveToList} className="flex items-center gap-1.5 text-xs text-violet-300 hover:text-white bg-violet-600/20 hover:bg-violet-600/30 px-3 py-1.5 rounded-lg border border-violet-500/30 transition-colors">
        <BookmarkPlus className="w-3 h-3" /> Save to list
      </button>
      {clients.length > 0 && (
        <>
          <select value={pushClientId} onChange={e => setPushClientId(e.target.value)} className="flex-1 min-w-[150px] bg-[#12121a] border border-[#2a2a3d] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500 transition-colors">
            <option value="">Client for queue…</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => pushClientId && onPushToQueue(pushClientId)} disabled={pushing || !pushClientId} className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
            {pushing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CalendarDays className="w-3.5 h-3.5" />}
            {pushing ? 'Adding...' : 'Push to Autoblog'}
          </button>
        </>
      )}
      {pushSuccess && <span className="text-emerald-400 text-xs font-semibold">{pushSuccess}</span>}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function KeywordResearch({ clients }: { clients: Client[] }) {
  const [tab, setTab] = useState<'research' | 'bulk' | 'competitor' | 'history' | 'lists'>('research')

  // Research state
  const [niche, setNiche] = useState('')
  const [location, setLocation] = useState('')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<'table' | 'cluster'>('table')

  // Bulk score state
  const [bulkInput, setBulkInput] = useState('')
  const [bulkNiche, setBulkNiche] = useState('')
  const [bulkLocation, setBulkLocation] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResults, setBulkResults] = useState<Keyword[]>([])
  const [bulkSelected, setBulkSelected] = useState<Set<number>>(new Set())
  const [bulkError, setBulkError] = useState<string | null>(null)

  // Competitor gap state
  const [competitorDomain, setCompetitorDomain] = useState('')
  const [compNiche, setCompNiche] = useState('')
  const [compLocation, setCompLocation] = useState('')
  const [compLoading, setCompLoading] = useState(false)
  const [compResults, setCompResults] = useState<Keyword[]>([])
  const [compSelected, setCompSelected] = useState<Set<number>>(new Set())
  const [compError, setCompError] = useState<string | null>(null)

  // Push/queue state
  const [pushing, setPushing] = useState(false)
  const [pushSuccess, setPushSuccess] = useState<string | null>(null)

  // Save to list state
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [pendingSaveKws, setPendingSaveKws] = useState<Keyword[]>([])
  const [saveListId, setSaveListId] = useState<'new' | string>('new')
  const [newListName, setNewListName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Brief modal
  const [briefKw, setBriefKw] = useState<Keyword | null>(null)
  const [briefNiche, setBriefNiche] = useState('')

  // SERP preview
  const [serpKw, setSerpKw] = useState<Keyword | null>(null)

  // History state
  const [searches, setSearches] = useState<SearchRecord[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expandedSearch, setExpandedSearch] = useState<string | null>(null)

  // Lists state
  const [lists, setLists] = useState<KeywordList[]>([])
  const [listsLoading, setListsLoading] = useState(false)
  const [expandedList, setExpandedList] = useState<string | null>(null)
  const [listCopiedIdx, setListCopiedIdx] = useState<number | null>(null)
  const [listSelected, setListSelected] = useState<Record<string, Set<number>>>({})

  const selectedClient = clients.find(c => c.id === clientId)

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    const res = await fetch('/api/keyword-searches')
    const data = await res.json()
    setSearches(data.searches ?? [])
    setHistoryLoading(false)
  }, [])

  const fetchLists = useCallback(async () => {
    setListsLoading(true)
    const res = await fetch('/api/keyword-lists')
    const data = await res.json()
    setLists(data.lists ?? [])
    setListsLoading(false)
  }, [])

  useEffect(() => {
    if (tab === 'history') fetchHistory()
    if (tab === 'lists') fetchLists()
  }, [tab, fetchHistory, fetchLists])

  // Research
  async function handleResearch() {
    if (!niche.trim()) return
    setLoading(true); setError(null); setKeywords([]); setSelected(new Set())
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche.trim(), location: location.trim() || null, industry: selectedClient?.industry ?? null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setKeywords(data.keywords ?? [])
      fetch('/api/keyword-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche.trim(), location: location.trim() || null, client_id: clientId || null, keywords: data.keywords ?? [] }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Bulk score
  async function handleBulkScore() {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) return
    setBulkLoading(true); setBulkError(null); setBulkResults([])
    try {
      const res = await fetch('/api/keywords/bulk-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: lines, niche: bulkNiche.trim() || null, location: bulkLocation.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setBulkResults(data.keywords ?? [])
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : 'Failed to score keywords')
    } finally {
      setBulkLoading(false)
    }
  }

  // Competitor gap
  async function handleCompetitorGap() {
    if (!competitorDomain.trim() || !compNiche.trim()) return
    setCompLoading(true); setCompError(null); setCompResults([])
    try {
      const res = await fetch('/api/keywords/competitor-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorDomain: competitorDomain.trim(),
          niche: compNiche.trim(),
          location: compLocation.trim() || null,
          yourKeywords: keywords.map(k => k.keyword),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setCompResults(data.keywords ?? [])
    } catch (err) {
      setCompError(err instanceof Error ? err.message : 'Failed to analyze competitor')
    } finally {
      setCompLoading(false)
    }
  }

  function copyKeyword(kw: string, idx: number) {
    navigator.clipboard.writeText(kw); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 1500)
  }

  function copyAll(kws: Keyword[]) {
    navigator.clipboard.writeText(kws.map(k => k.keyword).join('\n')); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1500)
  }

  function exportCsv(kws: Keyword[], filename: string) {
    const header = 'Keyword,Intent,Difficulty,Volume,Cluster,Blog Title'
    const rows = kws.map(k => `"${k.keyword}","${k.intent}","${k.difficulty}","${k.volume}","${k.cluster ?? ''}","${k.blog_title.replace(/"/g, '""')}"`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function toggleSelect(i: number) {
    setSelected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  function toggleAll(kws: Keyword[], sel: Set<number>, setSel: (s: Set<number>) => void) {
    setSel(sel.size === kws.length ? new Set() : new Set(kws.map((_, i) => i)))
  }

  async function handlePushToQueue(clientId: string, kws: Keyword[], sel: Set<number>, setSel: (s: Set<number>) => void) {
    if (!clientId || sel.size === 0) return
    setPushing(true); setPushSuccess(null)
    const topics = [...sel].map(i => kws[i].blog_title)
    try {
      const res = await fetch('/api/autoblog/add-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, topics }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setPushSuccess(`${data.added} topic${data.added !== 1 ? 's' : ''} added to autoblog queue!`)
      setSel(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to push topics')
    } finally {
      setPushing(false)
    }
  }

  function openSaveModal(kws: Keyword[]) {
    setPendingSaveKws(kws)
    setSaveListId('new')
    setNewListName(niche || compNiche || '')
    setShowSaveModal(true)
  }

  async function handleSaveToList() {
    if (pendingSaveKws.length === 0) return
    setSaving(true)
    try {
      if (saveListId === 'new') {
        if (!newListName.trim()) { setSaving(false); return }
        await fetch('/api/keyword-lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newListName.trim(), keywords: pendingSaveKws }),
        })
      } else {
        const existing = lists.find(l => l.id === saveListId)
        if (!existing) { setSaving(false); return }
        const merged = [...existing.keywords, ...pendingSaveKws.filter(k => !existing.keywords.some(e => e.keyword === k.keyword))]
        await fetch(`/api/keyword-lists/${saveListId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: merged }),
        })
      }
      setSaveSuccess(true); setShowSaveModal(false); setNewListName(''); setSaveListId('new')
      fetchLists()
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  async function deleteSearch(id: string) {
    await fetch('/api/keyword-searches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setSearches(prev => prev.filter(s => s.id !== id))
  }
  async function deleteList(id: string) {
    await fetch(`/api/keyword-lists/${id}`, { method: 'DELETE' })
    setLists(prev => prev.filter(l => l.id !== id))
  }
  async function removeFromList(listId: string, keyword: string) {
    const list = lists.find(l => l.id === listId)
    if (!list) return
    const updated = list.keywords.filter(k => k.keyword !== keyword)
    await fetch(`/api/keyword-lists/${listId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keywords: updated }),
    })
    setLists(prev => prev.map(l => l.id === listId ? { ...l, keywords: updated } : l))
  }

  const TABS = [
    { key: 'research', label: 'Research', icon: <Search className="w-3.5 h-3.5" /> },
    { key: 'bulk', label: 'Bulk Import', icon: <Upload className="w-3.5 h-3.5" /> },
    { key: 'competitor', label: 'Competitor Gap', icon: <Globe className="w-3.5 h-3.5" /> },
    { key: 'history', label: 'History', icon: <History className="w-3.5 h-3.5" />, count: searches.length },
    { key: 'lists', label: 'Saved Lists', icon: <Bookmark className="w-3.5 h-3.5" />, count: lists.length },
  ] as const

  const inputClass = 'w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors'

  return (
    <div className="space-y-6">
      {/* Tab nav */}
      <div className="flex items-center gap-1 bg-[#12121a] border border-[#2a2a3d] rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={clsx('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0',
              tab === t.key ? 'bg-violet-600 text-white' : 'text-[#8888a8] hover:text-white hover:bg-[#1a1a26]')}>
            {t.icon}{t.label}
            {'count' in t && t.count > 0 && (
              <span className={clsx('text-xs px-1.5 py-0.5 rounded-full', tab === t.key ? 'bg-white/20 text-white' : 'bg-[#2a2a3d] text-[#555570]')}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── RESEARCH TAB ── */}
      {tab === 'research' && (
        <>
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 space-y-4">
            {clients.length > 0 && (
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Client (optional)</label>
                <select value={clientId} onChange={e => { setClientId(e.target.value); const c = clients.find(cl => cl.id === e.target.value); if (c?.target_keywords) setNiche(c.target_keywords.split(',')[0].trim()) }} className={inputClass}>
                  <option value="">No client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Niche / Topic *</label>
                <input value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleResearch()} placeholder="e.g. emergency plumbing, family law" className={inputClass} />
              </div>
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Location (optional)</label>
                <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleResearch()} placeholder="e.g. Sydney, Melbourne" className={inputClass} />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <button onClick={handleResearch} disabled={loading || !niche.trim()} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Researching keywords…</> : <><Search className="w-4 h-4" /> Find Keywords</>}
            </button>
          </div>

          {keywords.length > 0 && (
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3d] flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-4 h-4 text-violet-400" />
                  <span className="text-white font-semibold text-sm">{keywords.length} keywords</span>
                  <span className="text-[#8888a8] text-xs bg-[#0a0900] border border-[#2a2a3d] px-2 py-0.5 rounded-full">{niche}{location ? ` · ${location}` : ''}</span>
                  {saveSuccess && <span className="text-emerald-400 text-xs font-semibold">Saved!</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setViewMode(v => v === 'table' ? 'cluster' : 'table')} className={clsx('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors', viewMode === 'cluster' ? 'bg-violet-600/20 border-violet-500/30 text-violet-300' : 'bg-[#1a1a26] border-[#2a2a3d] text-[#8888a8] hover:text-white')}>
                    <Layers className="w-3 h-3" /> Clusters
                  </button>
                  <button onClick={() => copyAll(keywords)} className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] hover:bg-[#2a2a3d] px-3 py-1.5 rounded-lg border border-[#2a2a3d] transition-colors">
                    {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy all
                  </button>
                  <button onClick={() => exportCsv(keywords, `keywords-${niche.replace(/\s+/g, '-')}.csv`)} className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] hover:bg-[#2a2a3d] px-3 py-1.5 rounded-lg border border-[#2a2a3d] transition-colors">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button onClick={() => openSaveModal(selected.size > 0 ? [...selected].map(i => keywords[i]) : keywords)} className="flex items-center gap-1.5 text-xs text-violet-300 hover:text-white bg-violet-600/20 hover:bg-violet-600/30 px-3 py-1.5 rounded-lg border border-violet-500/30 transition-colors">
                    <BookmarkPlus className="w-3 h-3" />
                    {selected.size > 0 ? `Save ${selected.size}` : `Save all`}
                  </button>
                </div>
              </div>

              {viewMode === 'table' ? (
                <>
                  <div className="px-5 py-2.5 border-b border-[#2a2a3d] flex items-center gap-5 flex-wrap">
                    <span className="text-[#555570] text-xs font-semibold uppercase tracking-wider">Intent:</span>
                    {(['informational', 'transactional', 'local'] as const).map(i => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full border capitalize ${INTENT_STYLES[i]}`}>{i}</span>
                    ))}
                  </div>
                  <KeywordTable keywords={keywords} selected={selected} onToggle={toggleSelect}
                    onToggleAll={() => toggleAll(keywords, selected, setSelected)}
                    onCopyKeyword={copyKeyword} copiedIdx={copiedIdx} clientId={clientId}
                    showCluster
                    onSerpPreview={kw => setSerpKw(kw)}
                    onBrief={kw => { setBriefKw(kw); setBriefNiche(niche) }}
                  />
                </>
              ) : (
                <ClusterView keywords={keywords} clientId={clientId} />
              )}

              <ActionBar selectedCount={selected.size} clients={clients}
                onPushToQueue={cid => handlePushToQueue(cid, keywords, selected, setSelected)}
                onSaveToList={() => openSaveModal([...selected].map(i => keywords[i]))}
                pushing={pushing} pushSuccess={pushSuccess}
              />
            </div>
          )}

          {!loading && keywords.length === 0 && !error && (
            <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-16 text-center">
              <Search className="w-10 h-10 text-[#2a2a3d] mx-auto mb-3" />
              <p className="text-[#8888a8] text-sm">Enter a niche to find keyword opportunities</p>
              <p className="text-[#555570] text-xs mt-1">Try "emergency plumber Sydney" or "family law Brisbane"</p>
            </div>
          )}
        </>
      )}

      {/* ── BULK IMPORT TAB ── */}
      {tab === 'bulk' && (
        <>
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Paste Keywords (one per line, max 50)</label>
              <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)} rows={8} placeholder={"emergency plumber\nhow to fix a leaky faucet\nbest plumber near me\n..."} className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors font-mono resize-none" />
              <div className="flex justify-end mt-1">
                <span className="text-[#555570] text-xs">{bulkInput.split('\n').filter(l => l.trim()).length} / 50 keywords</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Niche Context (optional)</label>
                <input value={bulkNiche} onChange={e => setBulkNiche(e.target.value)} placeholder="e.g. plumbing" className={inputClass} />
              </div>
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Location (optional)</label>
                <input value={bulkLocation} onChange={e => setBulkLocation(e.target.value)} placeholder="e.g. Sydney" className={inputClass} />
              </div>
            </div>
            {bulkError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{bulkError}</p>}
            <button onClick={handleBulkScore} disabled={bulkLoading || !bulkInput.trim()} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2">
              {bulkLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scoring keywords…</> : <><Upload className="w-4 h-4" /> Score & Analyse Keywords</>}
            </button>
          </div>

          {bulkResults.length > 0 && (
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3d] flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-4 h-4 text-violet-400" />
                  <span className="text-white font-semibold text-sm">{bulkResults.length} keywords scored</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => exportCsv(bulkResults, 'bulk-keywords.csv')} className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button onClick={() => openSaveModal(bulkSelected.size > 0 ? [...bulkSelected].map(i => bulkResults[i]) : bulkResults)} className="flex items-center gap-1.5 text-xs text-violet-300 bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 rounded-lg transition-colors">
                    <BookmarkPlus className="w-3 h-3" /> Save to list
                  </button>
                </div>
              </div>
              <KeywordTable keywords={bulkResults} selected={bulkSelected} onToggle={i => { setBulkSelected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n }) }}
                onToggleAll={() => toggleAll(bulkResults, bulkSelected, setBulkSelected)}
                onCopyKeyword={copyKeyword} copiedIdx={copiedIdx} showCluster
                onSerpPreview={kw => setSerpKw(kw)}
                onBrief={kw => { setBriefKw(kw); setBriefNiche(bulkNiche) }}
              />
              <ActionBar selectedCount={bulkSelected.size} clients={clients}
                onPushToQueue={cid => handlePushToQueue(cid, bulkResults, bulkSelected, setBulkSelected)}
                onSaveToList={() => openSaveModal([...bulkSelected].map(i => bulkResults[i]))}
                pushing={pushing} pushSuccess={pushSuccess}
              />
            </div>
          )}
        </>
      )}

      {/* ── COMPETITOR GAP TAB ── */}
      {tab === 'competitor' && (
        <>
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 space-y-4">
            <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 text-orange-300 text-xs">
              Enter a competitor's domain and your niche. We'll identify keywords they likely rank for that you should be targeting.
            </div>
            <div>
              <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Competitor Domain *</label>
              <input value={competitorDomain} onChange={e => setCompetitorDomain(e.target.value)} placeholder="e.g. competitorplumbing.com.au" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Your Niche *</label>
                <input value={compNiche} onChange={e => setCompNiche(e.target.value)} placeholder="e.g. plumbing services" className={inputClass} />
              </div>
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Location (optional)</label>
                <input value={compLocation} onChange={e => setCompLocation(e.target.value)} placeholder="e.g. Sydney" className={inputClass} />
              </div>
            </div>
            {compError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{compError}</p>}
            <button onClick={handleCompetitorGap} disabled={compLoading || !competitorDomain.trim() || !compNiche.trim()} className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2">
              {compLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing competitor…</> : <><Globe className="w-4 h-4" /> Find Keyword Gaps</>}
            </button>
          </div>

          {compResults.length > 0 && (
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3d] flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-semibold text-sm">{compResults.length} keyword gaps found</span>
                  <span className="text-[#8888a8] text-xs bg-[#0a0900] border border-[#2a2a3d] px-2 py-0.5 rounded-full">{competitorDomain}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => exportCsv(compResults, `gap-${competitorDomain}.csv`)} className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button onClick={() => openSaveModal(compSelected.size > 0 ? [...compSelected].map(i => compResults[i]) : compResults)} className="flex items-center gap-1.5 text-xs text-violet-300 bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 rounded-lg transition-colors">
                    <BookmarkPlus className="w-3 h-3" /> Save to list
                  </button>
                </div>
              </div>
              <KeywordTable keywords={compResults} selected={compSelected} onToggle={i => { setCompSelected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n }) }}
                onToggleAll={() => toggleAll(compResults, compSelected, setCompSelected)}
                onCopyKeyword={copyKeyword} copiedIdx={copiedIdx} showCluster
                onSerpPreview={kw => setSerpKw(kw)}
                onBrief={kw => { setBriefKw(kw); setBriefNiche(compNiche) }}
              />
              <ActionBar selectedCount={compSelected.size} clients={clients}
                onPushToQueue={cid => handlePushToQueue(cid, compResults, compSelected, setCompSelected)}
                onSaveToList={() => openSaveModal([...compSelected].map(i => compResults[i]))}
                pushing={pushing} pushSuccess={pushSuccess}
              />
            </div>
          )}
        </>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[#8888a8] text-sm">Every keyword research run is saved here automatically.</p>
          </div>
          {historyLoading && <div className="flex items-center justify-center py-16 gap-2 text-[#8888a8] text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
          {!historyLoading && searches.length === 0 && (
            <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-16 text-center">
              <History className="w-10 h-10 text-[#2a2a3d] mx-auto mb-3" />
              <p className="text-[#8888a8] text-sm">No searches yet</p>
            </div>
          )}
          {searches.map(s => {
            const isExpanded = expandedSearch === s.id
            return (
              <div key={s.id} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <button className="flex items-center gap-3 flex-1 text-left" onClick={() => setExpandedSearch(isExpanded ? null : s.id)}>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-[#8888a8]" /> : <ChevronRight className="w-4 h-4 text-[#8888a8]" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">{s.niche}</span>
                        {s.location && <span className="text-[#8888a8] text-xs">· {s.location}</span>}
                        <span className="text-xs text-[#555570] bg-[#1a1a26] border border-[#2a2a3d] px-2 py-0.5 rounded-full">{s.keywords.length} keywords</span>
                      </div>
                      <div className="text-[#555570] text-xs mt-0.5">{new Date(s.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => exportCsv(s.keywords, `${s.niche.replace(/\s+/g, '-')}.csv`)} className="text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setNiche(s.niche); setLocation(s.location ?? ''); setTab('research') }} className="text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 px-3 py-1.5 rounded-lg border border-violet-500/20 transition-colors whitespace-nowrap">
                      Re-run
                    </button>
                    <button onClick={() => deleteSearch(s.id)} className="text-[#555570] hover:text-red-400 transition-colors p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {isExpanded && (
                  <KeywordTable keywords={s.keywords} selected={new Set()} onToggle={() => {}} onToggleAll={() => {}}
                    onCopyKeyword={copyKeyword} copiedIdx={copiedIdx} compact showCluster
                    onSerpPreview={kw => setSerpKw(kw)}
                    onBrief={kw => { setBriefKw(kw); setBriefNiche(s.niche) }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── SAVED LISTS TAB ── */}
      {tab === 'lists' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[#8888a8] text-sm">Reusable keyword collections.</p>
            <button onClick={() => { setPendingSaveKws([]); setSaveListId('new'); setNewListName(''); setShowSaveModal(true) }} className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> New List
            </button>
          </div>
          {listsLoading && <div className="flex items-center justify-center py-16 gap-2 text-[#8888a8] text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
          {!listsLoading && lists.length === 0 && (
            <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-16 text-center">
              <Bookmark className="w-10 h-10 text-[#2a2a3d] mx-auto mb-3" />
              <p className="text-[#8888a8] text-sm">No saved lists yet</p>
              <p className="text-[#555570] text-xs mt-1">Save keywords from research results to build reusable lists</p>
            </div>
          )}
          {lists.map(list => {
            const isExpanded = expandedList === list.id
            const sel = listSelected[list.id] ?? new Set<number>()
            return (
              <div key={list.id} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <button className="flex items-center gap-3 flex-1 text-left" onClick={() => setExpandedList(isExpanded ? null : list.id)}>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-[#8888a8]" /> : <ChevronRight className="w-4 h-4 text-[#8888a8]" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-white font-semibold text-sm">{list.name}</span>
                        <span className="text-xs text-[#555570] bg-[#1a1a26] border border-[#2a2a3d] px-2 py-0.5 rounded-full">{list.keywords.length} keywords</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => exportCsv(list.keywords, `${list.name.replace(/\s+/g, '-')}.csv`)} className="text-[#555570] hover:text-white transition-colors p-1.5"><Download className="w-3.5 h-3.5" /></button>
                    <button onClick={() => navigator.clipboard.writeText(list.keywords.map(k => k.keyword).join('\n'))} className="text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors">Copy all</button>
                    <button onClick={() => deleteList(list.id)} className="text-[#555570] hover:text-red-400 transition-colors p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {isExpanded && (
                  <>
                    <KeywordTable keywords={list.keywords} selected={sel}
                      onToggle={i => setListSelected(prev => { const cur = new Set(prev[list.id] ?? []); cur.has(i) ? cur.delete(i) : cur.add(i); return { ...prev, [list.id]: cur } })}
                      onToggleAll={() => setListSelected(prev => ({ ...prev, [list.id]: sel.size === list.keywords.length ? new Set() : new Set(list.keywords.map((_, i) => i)) }))}
                      onCopyKeyword={(kw, i) => { navigator.clipboard.writeText(kw); setListCopiedIdx(i); setTimeout(() => setListCopiedIdx(null), 1500) }}
                      copiedIdx={listCopiedIdx} compact showCluster
                      onSerpPreview={kw => setSerpKw(kw)}
                      onBrief={kw => { setBriefKw(kw); setBriefNiche(list.name) }}
                    />
                    {sel.size > 0 && (
                      <div className="border-t border-[#2a2a3d] px-5 py-3 bg-[#0d0d14] flex items-center gap-3">
                        <span className="text-white text-xs font-semibold">{sel.size} selected</span>
                        <button onClick={() => { [...sel].map(i => removeFromList(list.id, list.keywords[i].keyword)); setListSelected(prev => ({ ...prev, [list.id]: new Set() })) }} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors">
                          <Trash2 className="w-3 h-3" /> Remove selected
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODALS ── */}

      {/* Save to list modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">Save {pendingSaveKws.length} keyword{pendingSaveKws.length !== 1 ? 's' : ''} to list</h3>
              <button onClick={() => setShowSaveModal(false)} className="text-[#555570] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Destination</label>
                <select value={saveListId} onChange={e => setSaveListId(e.target.value)} className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors">
                  <option value="new">+ Create new list</option>
                  {lists.map(l => <option key={l.id} value={l.id}>{l.name} ({l.keywords.length} keywords)</option>)}
                </select>
              </div>
              {saveListId === 'new' && (
                <div>
                  <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">List Name *</label>
                  <input value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="e.g. Plumbing Sydney — High Intent" autoFocus
                    className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowSaveModal(false)} className="flex-1 text-sm text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-4 py-2.5 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSaveToList} disabled={saving || (saveListId === 'new' && !newListName.trim())} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-lg transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookmarkPlus className="w-4 h-4" />}
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERP preview modal */}
      {serpKw && <SerpPreview keyword={serpKw} blogTitle={serpKw.blog_title} onClose={() => setSerpKw(null)} />}

      {/* Content brief modal */}
      {briefKw && <BriefModal keyword={briefKw} niche={briefNiche} location={location || compLocation || ''} onClose={() => setBriefKw(null)} />}
    </div>
  )
}
