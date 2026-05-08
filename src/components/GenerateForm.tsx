'use client'

import { useState, useEffect } from 'react'
import { Loader2, Copy, Download, FileText, Code, Image, Table, BarChart2, Search, Globe, ExternalLink, Pencil, RefreshCw, CheckCircle, XCircle, Share2, Link, Zap, FolderOpen, Lock, Sparkles, Cpu, Send, Clock, MessageSquare } from 'lucide-react'
import SocialPublishSection from './SocialPublishSection'
import clsx from 'clsx'
import BlogPreview from './BlogPreview'
import LimitReachedModal from './LimitReachedModal'
import { markdownToHTML } from '@/lib/markdownToHTML'
import { useToast } from '@/contexts/ToastContext'

type PlanKey = 'free' | 'starter' | 'growth' | 'agency' | 'agency_max'

type Client = { id: string; name: string; brand_voice?: string | null; wp_url?: string | null; contact_email?: string | null }

type SeoMeta = { metaTitle: string; metaDescription: string; focusKeyword: string }

type GenerateResult = {
  content: string
  title: string
  wordCount: number
  seoMeta: SeoMeta
  imageUrl: string | null
  postId: string | null
}

type WpPublishResult = {
  wpPostId: number
  wpPostUrl: string
  wpStatus: string
}

const PLAN_PREMIUM_ACCESS: PlanKey[] = ['growth', 'agency', 'agency_max']

const MODELS = [
  {
    value: 'standard' as const,
    label: 'Standard',
    sub: 'Claude Sonnet 4.6',
    desc: 'Fast, high-quality — included in your plan',
    credits: 0,
    color: 'violet',
  },
  {
    value: 'premium' as const,
    label: 'Premium',
    sub: 'Claude Opus 4.7',
    desc: 'Highest quality, nuanced reasoning, richer content',
    credits: 3,
    color: 'amber',
  },
]

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'educational', label: 'Educational' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'casual', label: 'Casual' },
]

const LENGTHS = [
  { value: 'short', label: 'Short', sub: '400-600 words' },
  { value: 'medium', label: 'Medium', sub: '800-1,200 words' },
  { value: 'long', label: 'Long', sub: '1,500-2,500 words' },
]

export default function GenerateForm({
  clients,
  preselectedClientId,
  prefilledPrompt,
  prefilledTone,
  prefilledLength,
  prefilledKeywords,
  currentPlan = 'free',
}: {
  clients: Client[]
  preselectedClientId?: string
  prefilledPrompt?: string
  prefilledTone?: string
  prefilledLength?: string
  prefilledKeywords?: string
  currentPlan?: PlanKey
}) {
  const [prompt, setPrompt] = useState(prefilledPrompt ?? '')
  const [tone, setTone] = useState(prefilledTone ?? 'professional')
  const [length, setLength] = useState(prefilledLength ?? 'medium')
  const [clientId, setClientId] = useState(preselectedClientId ?? '')
  const [keywords, setKeywords] = useState(prefilledKeywords ?? '')
  const [includeImage, setIncludeImage] = useState(false)
  const [includeTable, setIncludeTable] = useState(false)
  const [includeChart, setIncludeChart] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'seo' | 'social' | 'links'>('preview')
  const [limitReached, setLimitReached] = useState(false)
  const [internalLinks, setInternalLinks] = useState<{ title: string; url: string; anchorText: string; reason: string }[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [socialPlatform, setSocialPlatform] = useState<'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'threads' | 'tiktok' | 'gmb' | 'pinterest' | 'youtube'>('linkedin')
  const [socialContent, setSocialContent] = useState<Record<string, string>>({})
  const [socialLoading, setSocialLoading] = useState(false)
  const [socialCopied, setSocialCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState<'draft' | 'publish'>('draft')
  const [wpResult, setWpResult] = useState<WpPublishResult | null>(null)
  const [wpError, setWpError] = useState<string | null>(null)
  const [wpCategories, setWpCategories] = useState<{ id: number; name: string }[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [aiModel, setAiModel] = useState<'standard' | 'premium'>('standard')
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [streamingContent, setStreamingContent] = useState('')
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteInstruction, setRewriteInstruction] = useState('improve')
  const [customInstruction, setCustomInstruction] = useState('')
  const [unsplashQuery, setUnsplashQuery] = useState('')
  const [unsplashPhotos, setUnsplashPhotos] = useState<{ id: string; url: string; thumb: string; alt: string; credit: string; creditUrl: string }[]>([])
  const [unsplashLoading, setUnsplashLoading] = useState(false)
  const [selectedUnsplash, setSelectedUnsplash] = useState<string | null>(null)
  const [versions, setVersions] = useState<{ id: string; label: string | null; word_count: number; created_at: string; content?: string }[]>([])
  const [showVersions, setShowVersions] = useState(false)
  const [savingVersion, setSavingVersion] = useState(false)
  const [sendingApproval, setSendingApproval] = useState(false)
  const [approvalSent, setApprovalSent] = useState(false)
  const [approvalError, setApprovalError] = useState<string | null>(null)
  const [addingEmail, setAddingEmail] = useState(false)
  const [emailDraft, setEmailDraft] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [clientEmails, setClientEmails] = useState<Record<string, string>>({}) // clientId → saved email

  const toast = useToast()

  const canUsePremiumByPlan = PLAN_PREMIUM_ACCESS.includes(currentPlan)
  const canUsePremiumByCredits = (creditBalance ?? 0) >= 3
  const canUsePremium = canUsePremiumByPlan || canUsePremiumByCredits

  const selectedClient = clients.find(c => c.id === clientId)
  const clientHasWP = !!selectedClient?.wp_url

  useEffect(() => {
    fetch('/api/credits').then(r => r.json()).then(d => setCreditBalance(d.balance ?? 0)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!clientId || !clientHasWP) { setWpCategories([]); setSelectedCategories([]); return }
    setCategoriesLoading(true)
    fetch(`/api/publish/wordpress/meta?clientId=${clientId}`)
      .then(r => r.json())
      .then(data => setWpCategories(data.categories ?? []))
      .catch(() => {})
      .finally(() => setCategoriesLoading(false))
  }, [clientId, clientHasWP])

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setStreamingContent('')
    setWpResult(null)
    setWpError(null)
    setApprovalSent(false)
    setApprovalError(null)
    setAddingEmail(false)
    setEmailDraft('')
    setActiveTab('preview')

    try {
      const selectedClient = clients.find(c => c.id === clientId)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tone,
          length,
          clientId: clientId || null,
          brandVoice: selectedClient?.brand_voice ?? null,
          keywords,
          includeImage,
          includeTable,
          includeChart,
          aiModel,
        }),
      })

      // Handle non-streaming error responses (402, 401, etc.)
      if (!res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json()
        if (res.status === 402) {
          setLimitReached(true)
          setError(data.error ?? 'Post limit reached')
          return
        }
        throw new Error(data.error ?? 'Generation failed')
      }

      // Read the stream
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk

        // Check for error marker
        const errIdx = accumulated.indexOf('\n[BLOGGY_ERROR]')
        if (errIdx !== -1) {
          const errMsg = accumulated.slice(errIdx + 15)
          throw new Error(errMsg)
        }

        // Show streaming text (strip meta marker if partially received)
        const metaIdx = accumulated.indexOf('\n[BLOGGY_META]')
        const displayText = metaIdx !== -1 ? accumulated.slice(0, metaIdx) : accumulated
        // Strip SEO_META block from streaming display
        const cleanDisplay = displayText.replace(/\[SEO_META\][\s\S]*?\[\/SEO_META\]/g, '').trim()
        setStreamingContent(cleanDisplay)
      }

      // Parse final metadata
      const metaIdx = accumulated.indexOf('\n[BLOGGY_META]')
      if (metaIdx === -1) throw new Error('Incomplete response')

      const rawContent = accumulated.slice(0, metaIdx)
      const metaJson = accumulated.slice(metaIdx + 14)
      const meta = JSON.parse(metaJson)

      const content = rawContent.replace(/\[SEO_META\][\s\S]*?\[\/SEO_META\]/g, '').trim()

      setLimitReached(false)
      const finalResult = { ...meta, content }
      setResult(finalResult)
      setEditedContent(content)
      setStreamingContent('')
      setActiveTab('preview')
      toast(`"${meta.title.slice(0, 40)}${meta.title.length > 40 ? '…' : ''}" generated!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const currentContent = editedContent || result?.content || ''

  function copyMarkdown() {
    if (!result) return
    navigator.clipboard.writeText(currentContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast('Copied to clipboard')
  }

  function downloadMarkdown() {
    if (!result) return
    const blob = new Blob([currentContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadHTML() {
    if (!result) return
    const imgTag = result.imageUrl
      ? `<img src="${result.imageUrl}" alt="${result.title}" style="width:100%;border-radius:8px;margin-bottom:2rem;" />`
      : ''
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${result.seoMeta.metaTitle || result.title}</title>
<meta name="description" content="${result.seoMeta.metaDescription}" />
<style>
  body { max-width: 800px; margin: 0 auto; padding: 40px 24px; font-family: Georgia, serif; line-height: 1.7; color: #111; }
  h1 { font-size: 2rem; margin-bottom: 0.5rem; }
  h2 { font-size: 1.4rem; margin-top: 2rem; }
  h3 { font-size: 1.15rem; margin-top: 1.5rem; }
  p { margin: 1rem 0; }
  ul, ol { padding-left: 1.5rem; }
  li { margin: 0.4rem 0; }
  strong { font-weight: 700; }
  table { width:100%; border-collapse:collapse; margin: 1.5rem 0; }
  th { background:#f3f4f6; padding:10px 14px; text-align:left; font-size:0.85rem; border:1px solid #e5e7eb; }
  td { padding:10px 14px; border:1px solid #e5e7eb; font-size:0.9rem; }
  tr:nth-child(even) td { background:#f9fafb; }
</style>
</head>
<body>
${imgTag}
${markdownToHTML(currentContent)}
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handlePublishToWP() {
    if (!result) return
    setPublishing(true)
    setWpError(null)
    try {
      const res = await fetch('/api/publish/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: result.postId,
          clientId: clientId || null,
          title: result.title,
          content: currentContent,
          imageUrl: selectedUnsplash ?? result.imageUrl,
          seoMeta: result.seoMeta,
          status: publishStatus,
          categoryIds: selectedCategories,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Publish failed')
      setWpResult(data)
      toast(data.wpStatus === 'publish' ? 'Published to WordPress!' : 'Saved as draft in WordPress')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Publish failed'
      setWpError(msg)
      toast(msg, 'error')
    } finally {
      setPublishing(false)
    }
  }

  function isYouTubeUrl(url: string) {
    return /(?:youtube\.com\/(?:watch|shorts)|youtu\.be\/)/.test(url)
  }

  async function handleUrlToblog() {
    if (!sourceUrl.trim()) return
    setUrlLoading(true)
    setError(null)
    setResult(null)
    setWpResult(null)
    setWpError(null)
    setActiveTab('preview')
    try {
      const selectedClient = clients.find(c => c.id === clientId)
      const isYT = isYouTubeUrl(sourceUrl)
      const endpoint = isYT ? '/api/youtube-to-blog' : '/api/url-to-blog'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl, tone, clientId: clientId || null, brandVoice: selectedClient?.brand_voice ?? null }),
      })
      const data = await res.json()
      if (res.status === 402) {
        setLimitReached(true)
        setError(data.error ?? 'Post limit reached')
        return
      }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setLimitReached(false)
      setResult(data)
      setEditedContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUrlLoading(false)
    }
  }

  async function handleRepurpose(platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'threads' | 'tiktok' | 'gmb' | 'pinterest' | 'youtube') {
    if (!result) return
    if (socialContent[platform]) { setSocialPlatform(platform); return }
    setSocialLoading(true)
    setSocialPlatform(platform)
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent, title: result.title, platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setSocialContent(prev => ({ ...prev, [platform]: data.text }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Repurpose failed')
    } finally {
      setSocialLoading(false)
    }
  }

  async function handleRewrite() {
    if (!currentContent) return
    setRewriteLoading(true)
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent, instruction: rewriteInstruction, customInstruction }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Rewrite failed')
      }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response')
      const decoder = new TextDecoder()
      let newContent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        newContent += decoder.decode(value, { stream: true })
        if (newContent.includes('[ERROR]')) {
          throw new Error(newContent.split('[ERROR]')[1])
        }
        setEditedContent(newContent)
      }
      toast('Content rewritten!')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Rewrite failed', 'error')
    } finally {
      setRewriteLoading(false)
    }
  }

  async function saveVersion() {
    if (!result?.postId) return
    setSavingVersion(true)
    try {
      const res = await fetch('/api/posts/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: result.postId, content: editedContent, label: null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVersions(prev => [data.version, ...prev])
      toast('Version saved')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save version', 'error')
    } finally {
      setSavingVersion(false)
    }
  }

  async function loadVersions() {
    if (!result?.postId) return
    const res = await fetch(`/api/posts/versions?postId=${result.postId}`)
    const data = await res.json()
    setVersions(data.versions ?? [])
    setShowVersions(true)
  }

  async function restoreVersion(versionId: string) {
    const v = versions.find(v => v.id === versionId) as any
    if (!v?.content) return
    setEditedContent(v.content)
    setShowVersions(false)
    toast('Version restored')
  }

  async function searchUnsplash(q?: string) {
    const query = q ?? unsplashQuery
    if (!query.trim()) return
    setUnsplashLoading(true)
    try {
      const res = await fetch(`/api/tools/unsplash?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setUnsplashPhotos(data.photos ?? [])
    } catch {}
    setUnsplashLoading(false)
  }

  async function handleInternalLinks() {
    if (!result) return
    setLinksLoading(true)
    try {
      const res = await fetch('/api/internal-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentContent, title: result.title, clientId: clientId || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setInternalLinks(data.suggestions ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions')
    } finally {
      setLinksLoading(false)
    }
  }

  async function saveClientEmail() {
    if (!clientId || !emailDraft.trim()) return
    setSavingEmail(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, contact_email: emailDraft.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save')
      setClientEmails(prev => ({ ...prev, [clientId]: emailDraft.trim() }))
      setAddingEmail(false)
      setEmailDraft('')
      toast('Client email saved!')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save email', 'error')
    } finally {
      setSavingEmail(false)
    }
  }

  async function handleSendApproval() {
    if (!result?.postId) return
    setSendingApproval(true)
    setApprovalError(null)
    try {
      const res = await fetch(`/api/posts/${result.postId}/send-approval`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send')
      setApprovalSent(true)
      toast('Approval email sent to client!')
    } catch (err) {
      setApprovalError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSendingApproval(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
      {/* Left: Form */}
      <div className="flex flex-col gap-5">

        {/* Client selector */}
        {clients.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7a90b8' }}>
              Client <span className="normal-case font-normal">(optional)</span>
            </label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#dde4f0' }}
            >
              <option value="">No client / general</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Prompt */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7a90b8' }}>
            Topic / Brief
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={5}
            placeholder="e.g. Top 5 benefits of local SEO for small businesses in 2025..."
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#dde4f0' }}
          />
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#7a90b8' }}>
            <Search className="w-3 h-3" /> SEO Keywords <span className="normal-case font-normal">(optional)</span>
          </label>
          <input
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="e.g. local SEO, Google Business Profile, small business marketing"
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#dde4f0' }}
          />
          <p className="text-xs mt-1" style={{ color: '#7a90b8' }}>Comma-separated. Claude will naturally weave these into the post.</p>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a90b8' }}>Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                  tone === t.value
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'hover:border-violet-500 hover:text-white'
                )}
                style={tone !== t.value ? { background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#7a90b8' } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a90b8' }}>Length</label>
          <div className="flex gap-2">
            {LENGTHS.map(l => (
              <button
                key={l.value}
                onClick={() => setLength(l.value)}
                className={clsx(
                  'flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors text-center',
                  length === l.value
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'hover:border-violet-500 hover:text-white'
                )}
                style={length !== l.value ? { background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#7a90b8' } : undefined}
              >
                <div>{l.label}</div>
                <div className="font-normal opacity-70">{l.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhancements */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a90b8' }}>Enhancements</label>
          <div className="flex flex-col gap-2">
            <ToggleRow
              icon={<Image className="w-4 h-4" />}
              label="AI Hero Image"
              sub="DALL-E 3 generates a blog hero image"
              checked={includeImage}
              onChange={setIncludeImage}
            />
            <ToggleRow
              icon={<Table className="w-4 h-4" />}
              label="Data Table"
              sub="Include a relevant comparison or data table"
              checked={includeTable}
              onChange={setIncludeTable}
            />
            <ToggleRow
              icon={<BarChart2 className="w-4 h-4" />}
              label="Chart"
              sub="Include a visual bar chart with data"
              checked={includeChart}
              onChange={setIncludeChart}
            />
          </div>
        </div>

        {/* AI Model */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#7a90b8' }}>
            <Cpu className="w-3 h-3" /> AI Model
            {creditBalance !== null && !canUsePremiumByPlan && (
              <span className="ml-auto font-normal normal-case" style={{ color: '#7a90b8' }}>
                <span className={clsx(creditBalance >= 3 ? 'text-amber-400' : '')}>
                  {creditBalance}
                </span> credits
              </span>
            )}
          </label>
          <div className="flex flex-col gap-2">
            {MODELS.map(m => {
              const isPremium = m.value === 'premium'
              const locked = isPremium && !canUsePremium
              const active = aiModel === m.value
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => {
                    if (locked) { window.location.href = '/billing' } else { setAiModel(m.value) }
                  }}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                    active
                      ? isPremium ? 'bg-amber-600/10 border-amber-500/50' : 'bg-violet-600/10 border-violet-500/50'
                      : ''
                  )}
                  style={!active ? { background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid' } : undefined}
                >
                  <div className={clsx('shrink-0', active ? (isPremium ? 'text-amber-400' : 'text-violet-400') : '')} style={!active ? { color: '#7a90b8' } : undefined}>
                    {isPremium ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={clsx('text-xs font-semibold flex items-center gap-1.5', active ? 'text-white' : '')} style={!active ? { color: '#dde4f0' } : undefined}>
                      {m.label}
                      <span className={clsx('text-[10px] font-normal', active ? (isPremium ? 'text-amber-300' : 'text-violet-300') : '')} style={!active ? { color: '#7a90b8' } : undefined}>
                        {m.sub}
                      </span>
                    </div>
                    <div className="text-[11px] truncate" style={{ color: '#7a90b8' }}>{m.desc}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    {locked ? (
                      <div className="flex items-center gap-1 text-[10px]" style={{ color: '#7a90b8' }}>
                        <Lock className="w-3 h-3" />
                        <span>Growth+</span>
                      </div>
                    ) : isPremium && !canUsePremiumByPlan ? (
                      <span className="text-[10px] text-amber-400 font-semibold">3 credits</span>
                    ) : isPremium ? (
                      <span className="text-[10px] text-emerald-400">Included</span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
          {aiModel === 'premium' && !canUsePremiumByPlan && (
            <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: '#7a90b8' }}>
              <Sparkles className="w-3 h-3 text-amber-400" />
              3 credits will be deducted from your balance ({creditBalance ?? 0} remaining)
            </p>
          )}
        </div>

        {/* URL / YouTube to Blog */}
        <div className="pt-4" style={{ borderTop: '1px solid rgba(0,102,255,0.2)' }}>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: '#7a90b8' }}>
            <Link className="w-3 h-3" /> Or generate from URL
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="https://example.com/article or YouTube URL"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-8" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#dde4f0' }}
              />
              {isYouTubeUrl(sourceUrl) && (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-400 text-xs font-bold">▶</span>
              )}
            </div>
            <button
              onClick={handleUrlToblog}
              disabled={urlLoading || !sourceUrl.trim()}
              className="disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0" style={{ background: 'rgba(11,22,40,0.7)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}
            >
              {urlLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link className="w-3.5 h-3.5" />}
              {urlLoading ? (isYouTubeUrl(sourceUrl) ? 'Extracting...' : 'Fetching...') : 'Generate'}
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: '#7a90b8' }}>
            {isYouTubeUrl(sourceUrl)
              ? <span className="text-red-400 font-semibold">▶ YouTube detected — will extract transcript and rewrite as a blog post</span>
              : 'Paste any article, blog post, webpage, or YouTube video URL.'}
          </p>
        </div>

        {limitReached && (
          <LimitReachedModal
            currentPlan={currentPlan}
            clientName={selectedClient?.name ?? null}
            onClose={() => setLimitReached(false)}
          />
        )}

        {!limitReached && error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Generating{includeImage ? ' (image may take ~15s extra)' : ''}…</>
          ) : (
            'Generate Blog Post'
          )}
        </button>
      </div>

      {/* Right: Output */}
      <div className="min-h-[400px]">
        {!result && !loading && (
          <div className="h-full min-h-[400px] rounded-2xl flex items-center justify-center border-dashed" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.2)', border: '1px dashed' }}>
            <div className="text-center">
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(0,102,255,0.2)' }} />
              <p className="text-sm" style={{ color: '#7a90b8' }}>Your blog post will appear here</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl overflow-hidden min-h-[400px]" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}>
            {streamingContent ? (
              <>
                <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(0,102,255,0.2)' }}>
                  <Loader2 className="w-3.5 h-3.5 text-violet-500 animate-spin" />
                  <span className="text-xs" style={{ color: '#7a90b8' }}>Writing{includeImage ? ' (image will generate after)' : ''}…</span>
                  <span className="ml-auto text-xs" style={{ color: '#7a90b8' }}>{streamingContent.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <div className="p-6 max-h-[700px] overflow-y-auto">
                  <BlogPreview content={streamingContent} />
                  <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
                </div>
              </>
            ) : (
              <div className="h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-violet-500 mx-auto mb-3 animate-spin" />
                  <p className="text-sm" style={{ color: '#7a90b8' }}>Starting generation…</p>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-2" style={{ borderBottom: '1px solid rgba(0,102,255,0.2)' }}>
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold text-sm truncate max-w-[200px]">{result.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(11,22,40,0.7)', color: '#7a90b8' }}>
                  {result.wordCount.toLocaleString()} words
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors"
                  title="Re-generate with same settings"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
                <button
                  onClick={copyMarkdown}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#7a90b8', background: 'rgba(11,22,40,0.7)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a90b8'}
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#7a90b8', background: 'rgba(11,22,40,0.7)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a90b8'}
                >
                  <Download className="w-3.5 h-3.5" />.md
                </button>
                <button
                  onClick={downloadHTML}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#7a90b8', background: 'rgba(11,22,40,0.7)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a90b8'}
                >
                  <Code className="w-3.5 h-3.5" />.html
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(0,102,255,0.2)' }}>
              <button
                onClick={() => setActiveTab('preview')}
                className={clsx(
                  'px-5 py-2.5 text-xs font-semibold transition-colors',
                  activeTab === 'preview'
                    ? 'text-white border-b-2 border-violet-500'
                    : 'hover:text-white'
                )}
                style={activeTab !== 'preview' ? { color: '#7a90b8' } : undefined}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={clsx(
                  'px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                  activeTab === 'edit'
                    ? 'text-white border-b-2 border-violet-500'
                    : 'hover:text-white'
                )}
                style={activeTab !== 'edit' ? { color: '#7a90b8' } : undefined}
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={clsx(
                  'px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                  activeTab === 'seo'
                    ? 'text-white border-b-2 border-violet-500'
                    : 'hover:text-white'
                )}
                style={activeTab !== 'seo' ? { color: '#7a90b8' } : undefined}
              >
                <Search className="w-3 h-3" /> SEO Meta
              </button>
              <button
                onClick={() => { setActiveTab('social') }}
                className={clsx(
                  'px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                  activeTab === 'social'
                    ? 'text-white border-b-2 border-violet-500'
                    : 'hover:text-white'
                )}
                style={activeTab !== 'social' ? { color: '#7a90b8' } : undefined}
              >
                <Share2 className="w-3 h-3" /> Social
              </button>
              <button
                onClick={() => { setActiveTab('links'); if (!internalLinks.length) handleInternalLinks() }}
                className={clsx(
                  'px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                  activeTab === 'links'
                    ? 'text-white border-b-2 border-violet-500'
                    : 'hover:text-white'
                )}
                style={activeTab !== 'links' ? { color: '#7a90b8' } : undefined}
              >
                <Link className="w-3 h-3" /> Links
              </button>
            </div>

            {activeTab === 'preview' && (
              <div className="p-6 max-h-[700px] overflow-y-auto">
                {(result.imageUrl || selectedUnsplash) ? (
                  <div className="relative mb-6 group">
                    <img
                      src={selectedUnsplash ?? result.imageUrl!}
                      alt={result.title}
                      className="w-full rounded-xl object-cover max-h-64"
                    />
                    <button
                      onClick={() => { setSelectedUnsplash(null); searchUnsplash(result.title.split(' ').slice(0, 4).join(' ')) }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/60 text-white px-2 py-1 rounded-lg"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 rounded-xl p-4 border border-dashed" style={{ background: 'rgba(11,22,40,0.8)', borderColor: 'rgba(0,102,255,0.2)' }}>
                    <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: '#7a90b8' }}>
                      <Image className="w-3.5 h-3.5" /> Add a hero image from Unsplash (free)
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={unsplashQuery}
                        onChange={e => setUnsplashQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && searchUnsplash()}
                        placeholder={result.title.split(' ').slice(0, 4).join(' ')}
                        className="flex-1 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-violet-500" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#dde4f0' }}
                      />
                      <button
                        onClick={() => searchUnsplash()}
                        disabled={unsplashLoading}
                        className="text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50" style={{ background: 'rgba(11,22,40,0.7)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}
                      >
                        {unsplashLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        Search
                      </button>
                    </div>
                    {unsplashPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 mt-2">
                        {unsplashPhotos.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedUnsplash(p.url)}
                            className="relative aspect-video overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <img src={p.thumb} alt={p.alt} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <BlogPreview content={currentContent} />
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="p-4 flex flex-col gap-3">
                {/* AI Rewrite */}
                <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: 'rgba(11,22,40,0.8)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}>
                  <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#7a90b8' }}>
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" /> AI Rewrite
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { id: 'improve',        label: 'Improve' },
                      { id: 'shorten',        label: 'Shorten' },
                      { id: 'lengthen',       label: 'Lengthen' },
                      { id: 'more_seo',       label: 'More SEO' },
                      { id: 'simpler',        label: 'Simplify' },
                      { id: 'professional',   label: 'Professional' },
                      { id: 'conversational', label: 'Conversational' },
                    ] as const).map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setRewriteInstruction(opt.id)}
                        className={clsx(
                          'text-xs px-2.5 py-1 rounded-lg border transition-colors',
                          rewriteInstruction === opt.id
                            ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                            : 'hover:text-white'
                        )}
                        style={rewriteInstruction !== opt.id ? { background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid', color: '#7a90b8' } : undefined}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    value={customInstruction}
                    onChange={e => setCustomInstruction(e.target.value)}
                    placeholder="Or type a custom instruction… (overrides selection)"
                    className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500 transition-colors" style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)', border: '1px solid', color: '#dde4f0' }}
                  />
                  <button
                    onClick={handleRewrite}
                    disabled={rewriteLoading}
                    className="self-start flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {rewriteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {rewriteLoading ? 'Rewriting…' : 'Rewrite'}
                  </button>
                </div>
                <p className="text-xs" style={{ color: '#7a90b8' }}>Edit markdown directly. Changes apply to Copy, Export, and WordPress publish.</p>
                <textarea
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  rows={24}
                  className="w-full rounded-xl px-4 py-3 text-xs font-mono leading-relaxed focus:outline-none focus:border-violet-500 transition-colors resize-none" style={{ background: 'rgba(11,22,40,0.8)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid', color: '#dde4f0' }}
                  spellCheck={false}
                />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs" style={{ color: '#7a90b8' }}>{editedContent.split(/\s+/).filter(Boolean).length.toLocaleString()} words</span>
                  <div className="flex items-center gap-2">
                    {result.postId && (
                      <>
                        <button
                          onClick={saveVersion}
                          disabled={savingVersion}
                          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          {savingVersion ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                          Save version
                        </button>
                        <span style={{ color: 'rgba(0,102,255,0.2)' }}>|</span>
                        <button
                          onClick={loadVersions}
                          className="text-xs hover:text-white transition-colors" style={{ color: '#7a90b8' }}
                        >
                          History
                        </button>
                        <span style={{ color: 'rgba(0,102,255,0.2)' }}>|</span>
                      </>
                    )}
                    <button
                      onClick={() => { setEditedContent(result.content); }}
                      className="text-xs hover:text-white transition-colors" style={{ color: '#7a90b8' }}
                    >
                      Reset to original
                    </button>
                  </div>
                </div>
                {showVersions && versions.length > 0 && (
                  <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(11,22,40,0.8)', borderColor: 'rgba(0,102,255,0.2)', border: '1px solid' }}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7a90b8' }}>Version History</p>
                      <button onClick={() => setShowVersions(false)} className="text-xs hover:text-white transition-colors" style={{ color: '#7a90b8' }}>Close</button>
                    </div>
                    {versions.map(v => (
                      <div key={v.id} className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-white text-xs">{new Date(v.created_at).toLocaleString()}</span>
                          <span className="text-[#555570] text-xs ml-2">{v.word_count.toLocaleString()} words</span>
                        </div>
                        <button
                          onClick={() => restoreVersion(v.id)}
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="p-6 space-y-4">
                <SeoScore meta={result.seoMeta} content={currentContent} wordCount={result.wordCount} />
                <SeoField label="Meta Title" value={result.seoMeta.metaTitle} limit={60} />
                <SeoField label="Meta Description" value={result.seoMeta.metaDescription} limit={160} textarea />
                <SeoField label="Focus Keyword" value={result.seoMeta.focusKeyword} />
              </div>
            )}

            {activeTab === 'social' && (
              <div className="p-5 flex flex-col gap-4">
                {/* Platform grid */}
                <div>
                  <p className="text-[#555570] text-xs mb-3">Select a platform to generate tailored copy from this post.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'linkedin',  label: 'LinkedIn',    abbr: 'in', bg: 'bg-[#0a66c2]', hint: 'Thought-leader post', dark: false },
                      { id: 'twitter',   label: 'X / Twitter', abbr: 'X',  bg: 'bg-[#1a1a1a]', hint: 'Thread · 280c',        dark: false },
                      { id: 'facebook',  label: 'Facebook',    abbr: 'f',  bg: 'bg-[#1877f2]', hint: 'Conversational post',  dark: false },
                      { id: 'instagram', label: 'Instagram',   abbr: 'ig', bg: 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]', hint: 'Caption + hashtags',   dark: false },
                      { id: 'threads',   label: 'Threads',     abbr: '⌇',  bg: 'bg-[#0f0f0f]', hint: 'Conversation starter', dark: false },
                      { id: 'tiktok',    label: 'TikTok',      abbr: 'tt', bg: 'bg-[#010101]', hint: 'Script + caption',     dark: false },
                      { id: 'gmb',       label: 'Google Biz',  abbr: 'G',  bg: 'bg-white',     hint: 'Business post',        dark: true  },
                      { id: 'pinterest', label: 'Pinterest',   abbr: 'P',  bg: 'bg-[#e60023]', hint: 'Pin + SEO desc',       dark: false },
                      { id: 'youtube',   label: 'YouTube',     abbr: '▶',  bg: 'bg-[#ff0000]', hint: 'Desc + tags',          dark: false },
                    ] as const).map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleRepurpose(p.id)}
                        disabled={socialLoading}
                        className={clsx(
                          'flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all',
                          socialPlatform === p.id
                            ? 'border-violet-500 bg-violet-600/10'
                            : 'border-[#2a2a3d] bg-[#12121a] hover:border-[#3a3a5a]'
                        )}
                      >
                        <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0', p.bg, p.dark ? 'text-[#4285f4]' : 'text-white')}>
                          {p.abbr}
                        </div>
                        <div className="min-w-0">
                          <div className={clsx('text-xs font-semibold truncate', socialPlatform === p.id ? 'text-white' : 'text-[#c8c8d8]')}>{p.label}</div>
                          <div className="text-[#555570] text-[10px] truncate">{p.hint}</div>
                        </div>
                        {socialContent[p.id] && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-auto" title="Generated" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {socialLoading && socialPlatform && !socialContent[socialPlatform] ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-[#8888a8] text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating {socialPlatform === 'gmb' ? 'Google Business' : socialPlatform === 'twitter' ? 'X / Twitter' : socialPlatform.charAt(0).toUpperCase() + socialPlatform.slice(1)} copy…
                  </div>
                ) : socialContent[socialPlatform] ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={socialContent[socialPlatform]}
                      onChange={e => setSocialContent(prev => ({ ...prev, [socialPlatform]: e.target.value }))}
                      rows={8}
                      className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl px-4 py-3 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-violet-500 resize-none transition-colors"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-[#555570] text-xs">Edit above before publishing. Click another platform to generate more.</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(socialContent[socialPlatform])
                          setSocialCopied(true)
                          setTimeout(() => setSocialCopied(false), 2000)
                        }}
                        className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] px-3 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />{socialCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    {clientId && (
                      <SocialPublishSection
                        clientId={clientId}
                        platform={socialPlatform}
                        text={socialContent[socialPlatform]}
                        title={result?.title ?? ''}
                        content={currentContent}
                        wpPostUrl={wpResult?.wpPostUrl ?? null}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-[#555570] text-sm text-center py-8">Select a platform above to generate tailored copy.</p>
                )}
              </div>
            )}

            {activeTab === 'links' && (
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-[#8888a8] text-xs">Internal link suggestions based on your published posts for this client.</p>
                  <button
                    onClick={handleInternalLinks}
                    disabled={linksLoading}
                    className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {linksLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    Refresh
                  </button>
                </div>
                {linksLoading ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-[#8888a8] text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Finding link opportunities...
                  </div>
                ) : internalLinks.length === 0 ? (
                  <p className="text-[#8888a8] text-sm text-center py-8">
                    {clientId ? 'No published posts found for this client yet.' : 'Select a client above to get internal link suggestions.'}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {internalLinks.map((link, i) => (
                      <div key={i} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4 flex flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-white text-xs font-semibold">{link.title}</span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-[#8888a8] text-xs">Anchor: <span className="text-cyan-400">"{link.anchorText}"</span></p>
                        <p className="text-[#8888a8] text-xs">{link.reason}</p>
                        <button
                          onClick={() => {
                            const mdLink = `[${link.anchorText}](${link.url})`
                            navigator.clipboard.writeText(mdLink)
                          }}
                          className="self-start flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] px-2.5 py-1 rounded-lg transition-colors mt-1"
                        >
                          <Copy className="w-3 h-3" /> Copy link
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WordPress Publish Bar */}
            <div className="border-t border-[#2a2a3d] px-5 py-4">
              {!clientHasWP ? (
                <p className="text-[#8888a8] text-xs text-center">
                  Select a client with a WordPress connection to publish directly.{' '}
                  <a href="/clients" className="text-violet-400 hover:text-violet-300">Add one in Clients →</a>
                </p>
              ) : wpResult ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <Globe className="w-4 h-4" />
                    {wpResult.wpStatus === 'publish' ? 'Published to WordPress' : 'Saved as Draft in WordPress'}
                  </div>
                  <a
                    href={wpResult.wpPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    View post <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Category picker */}
                  {(categoriesLoading || wpCategories.length > 0) && (
                    <div>
                      <p className="flex items-center gap-1.5 text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">
                        <FolderOpen className="w-3 h-3" /> Category
                      </p>
                      {categoriesLoading ? (
                        <p className="text-[#555570] text-xs flex items-center gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" /> Loading categories…
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {wpCategories.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategories(prev =>
                                prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                              )}
                              className={clsx(
                                'text-xs px-2.5 py-1 rounded-full border transition-colors',
                                selectedCategories.includes(cat.id)
                                  ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                                  : 'bg-[#1a1a26] border-[#2a2a3d] text-[#8888a8] hover:text-white hover:border-[#3a3a4d]'
                              )}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Draft/Publish toggle + button */}
                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg overflow-hidden text-xs font-semibold">
                      <button
                        onClick={() => setPublishStatus('draft')}
                        className={clsx('px-3 py-2 transition-colors', publishStatus === 'draft' ? 'bg-[#2a2a3d] text-white' : 'text-[#8888a8] hover:text-white')}
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => setPublishStatus('publish')}
                        className={clsx('px-3 py-2 transition-colors', publishStatus === 'publish' ? 'bg-[#2a2a3d] text-white' : 'text-[#8888a8] hover:text-white')}
                      >
                        Publish
                      </button>
                    </div>
                    <button
                      onClick={handlePublishToWP}
                      disabled={publishing}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-[#2a2a3d] transition-colors"
                    >
                      {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                      {publishing ? 'Publishing...' : `Send to WordPress as ${publishStatus === 'draft' ? 'Draft' : 'Live Post'}`}
                    </button>
                  </div>
                </div>
              )}
              {wpError && (
                <p className="text-red-400 text-xs mt-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{wpError}</p>
              )}

              {/* Client Approval */}
              {result.postId && selectedClient && (
                <div className="mt-3 pt-3 border-t border-[#2a2a3d]">
                  {(() => {
                    const effectiveEmail = clientEmails[selectedClient.id] ?? selectedClient.contact_email

                    if (approvalSent) {
                      return (
                        <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Approval email sent to {effectiveEmail}
                        </div>
                      )
                    }

                    if (effectiveEmail) {
                      return (
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={handleSendApproval}
                            disabled={sendingApproval}
                            className="flex items-center justify-center gap-2 w-full bg-[#1a1a26] hover:bg-violet-600/10 border border-[#2a2a3d] hover:border-violet-500/40 disabled:opacity-50 text-[#c8c8d8] hover:text-violet-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            {sendingApproval ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            {sendingApproval ? 'Sending…' : 'Send to Client for Approval'}
                          </button>
                          {approvalError && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{approvalError}</p>
                          )}
                        </div>
                      )
                    }

                    // No email on file — inline add
                    return addingEmail ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-[#8888a8] text-xs">Enter {selectedClient.name}'s email to enable client approvals:</p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={emailDraft}
                            onChange={e => setEmailDraft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveClientEmail()}
                            placeholder="client@example.com"
                            autoFocus
                            className="flex-1 bg-[#0a0a0f] border border-[#2a2a3d] focus:border-violet-500 rounded-lg px-3 py-1.5 text-white text-xs placeholder-[#555570] focus:outline-none transition-colors"
                          />
                          <button
                            onClick={saveClientEmail}
                            disabled={savingEmail || !emailDraft.trim()}
                            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {savingEmail ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                          </button>
                          <button
                            onClick={() => { setAddingEmail(false); setEmailDraft('') }}
                            className="text-[#8888a8] hover:text-white text-xs px-2 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingEmail(true)}
                        className="flex items-center gap-2 text-xs text-[#555570] hover:text-violet-400 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Add client email to enable approvals
                      </button>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ToggleRow({
  icon, label, sub, checked, onChange,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
        checked
          ? 'bg-violet-600/10 border-violet-500/50 text-white'
          : 'bg-[#12121a] border-[#2a2a3d] text-[#8888a8] hover:border-[#3a3a4d]'
      )}
    >
      <div className={clsx('shrink-0', checked ? 'text-violet-400' : 'text-[#8888a8]')}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className={clsx('text-xs font-semibold', checked ? 'text-white' : 'text-[#c8c8d8]')}>{label}</div>
        <div className="text-xs opacity-60 truncate">{sub}</div>
      </div>
      <div className={clsx(
        'w-9 h-5 rounded-full transition-colors relative shrink-0',
        checked ? 'bg-violet-600' : 'bg-[#2a2a3d]'
      )}>
        <div className={clsx(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0.5'
        )} />
      </div>
    </button>
  )
}

const SEO_STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from',
  'is','are','was','were','be','been','being','have','has','had','do','does','did',
  'will','would','could','should','may','might','shall','can','it','its','this','that',
  'these','those','i','you','he','she','we','they','me','him','her','us','them','my',
  'your','his','our','their','what','which','who','when','where','why','how','all',
  'any','both','each','few','more','most','other','some','such','no','not','only',
  'same','so','than','too','very','just','also','if','as','up','out','about','over',
  'into','through','after','before','between','under','while','s','t','re','ve','ll',
])

function SeoScore({ meta, content, wordCount }: { meta: SeoMeta; content: string; wordCount: number }) {
  const kw = meta.focusKeyword?.toLowerCase().trim() ?? ''

  const headingCount = (content.match(/^#{1,6}\s/gm) ?? []).length
  const paragraphCount = content.split('\n').filter(l => {
    const t = l.trim()
    return t && !t.startsWith('#') && !t.startsWith('-') && !t.startsWith('|') && !t.startsWith('>')
  }).length
  const imageCount = (content.match(/!\[/g) ?? []).length

  // Keyword density: occurrences / total words as %
  const totalWords = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).length
  const kwOccurrences = kw ? (content.toLowerCase().match(new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) ?? []).length : 0
  const kwDensity = totalWords > 0 && kw ? (kwOccurrences / totalWords) * 100 : 0

  // First paragraph (first non-heading, non-empty line)
  const firstPara = content.split('\n').find(l => {
    const t = l.trim()
    return t.length > 20 && !t.startsWith('#') && !t.startsWith('-') && !t.startsWith('|') && !t.startsWith('>')
  })?.toLowerCase() ?? ''

  const checks = [
    { label: 'Meta title length', pass: (meta.metaTitle ?? '').length >= 30 && (meta.metaTitle ?? '').length <= 60, weight: 10, detail: `${(meta.metaTitle ?? '').length} chars (30–60)` },
    { label: 'Meta description length', pass: (meta.metaDescription ?? '').length >= 100 && (meta.metaDescription ?? '').length <= 160, weight: 10, detail: `${(meta.metaDescription ?? '').length} chars (100–160)` },
    { label: 'Keyword in title', pass: kw ? (meta.metaTitle ?? '').toLowerCase().includes(kw) : false, weight: 20, detail: kw ? ((meta.metaTitle ?? '').toLowerCase().includes(kw) ? 'Found ✓' : 'Missing') : 'No keyword set' },
    { label: 'Keyword in meta description', pass: kw ? (meta.metaDescription ?? '').toLowerCase().includes(kw) : false, weight: 10, detail: kw ? ((meta.metaDescription ?? '').toLowerCase().includes(kw) ? 'Found ✓' : 'Missing') : 'No keyword set' },
    { label: 'Keyword in first paragraph', pass: kw ? firstPara.toLowerCase().includes(kw) : false, weight: 10, detail: kw ? (firstPara.toLowerCase().includes(kw) ? 'Found ✓' : 'Not in intro') : 'No keyword set' },
    { label: 'Keyword in content', pass: kw ? content.toLowerCase().includes(kw) : false, weight: 10, detail: kw ? (content.toLowerCase().includes(kw) ? `${kwOccurrences}× found` : 'Missing') : 'No keyword set' },
    { label: 'Keyword density (0.5–2.5%)', pass: kw ? kwDensity >= 0.5 && kwDensity <= 2.5 : false, weight: 10, detail: kw ? `${kwDensity.toFixed(2)}%` : 'No keyword set' },
    { label: 'Word count 600+', pass: wordCount >= 600, weight: 15, detail: `${wordCount.toLocaleString()} words` },
    { label: 'Has subheadings (H2/H3)', pass: /^#{2,3}\s/m.test(content), weight: 15, detail: headingCount > 0 ? `${headingCount} headings` : 'None found' },
  ]

  const score = checks.reduce((acc, c) => acc + (c.pass ? c.weight : 0), 0)
  const scoreColor = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171'
  const scoreLabel = score >= 70 ? 'Good — strong SEO foundation' : score >= 40 ? 'Fair — a few improvements needed' : 'Needs work — review below'

  // SVG gauge params
  const R = 50
  const C = 2 * Math.PI * R
  const HALF = C / 2
  const fillLen = (score / 100) * HALF

  // Top keyword extraction
  const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !SEO_STOP_WORDS.has(w))
  const freq: Record<string, number> = {}
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1
  const topKeywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="space-y-4">
      {/* Gauge */}
      <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-5 flex flex-col items-center">
        <svg viewBox="0 0 140 82" width="200" height="117" aria-label={`SEO Score: ${score} out of 100`}>
          {/* Track */}
          <circle cx="70" cy="70" r={R} fill="none" stroke="#1a1a26" strokeWidth="12"
            strokeDasharray={`${HALF} ${HALF}`}
            strokeDashoffset={`${HALF}`}
            strokeLinecap="round"
          />
          {/* Fill */}
          <circle cx="70" cy="70" r={R} fill="none" stroke={scoreColor} strokeWidth="12"
            strokeDasharray={`${fillLen} ${C - fillLen}`}
            strokeDashoffset={`${HALF}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          {/* Score text */}
          <text x="70" y="62" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="system-ui">{score}</text>
          <text x="70" y="76" textAnchor="middle" fill="#8888a8" fontSize="10" fontFamily="system-ui">/ 100</text>
          {/* End labels */}
          <text x="14" y="78" textAnchor="middle" fill="#555570" fontSize="9" fontFamily="system-ui">0</text>
          <text x="126" y="78" textAnchor="middle" fill="#555570" fontSize="9" fontFamily="system-ui">100</text>
        </svg>
        <p className="text-xs mt-1" style={{ color: scoreColor }}>{scoreLabel}</p>
      </div>

      {/* Checks */}
      <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl px-4 py-3 space-y-2">
        <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">SEO Checks</p>
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-2">
            {c.pass
              ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
            <span className="text-[#c8c8d8] text-xs flex-1">{c.label}</span>
            <span className="text-[#8888a8] text-xs">{c.detail}</span>
          </div>
        ))}
      </div>

      {/* Content Structure */}
      <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4">
        <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3">Content Structure</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Words', value: wordCount, min: 600, max: 2500, ideal: '600–2,500' },
            { label: 'Headings', value: headingCount, min: 3, max: 20, ideal: '3–20' },
            { label: 'Paragraphs', value: paragraphCount, min: 10, max: 60, ideal: '10–60' },
            { label: 'Images', value: imageCount, min: 0, max: 5, ideal: '0–5' },
          ].map(({ label, value, min, max, ideal }) => {
            const ok = value >= min && value <= max
            return (
              <div key={label} className={`rounded-lg px-3 py-2.5 border ${ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[#2a2a3d] bg-[#12121a]'}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[#8888a8] text-xs">{label}</span>
                  {ok
                    ? <CheckCircle className="w-3 h-3 text-emerald-400" />
                    : <XCircle className="w-3 h-3 text-[#555570]" />}
                </div>
                <div className="text-white text-lg font-bold leading-none">{value.toLocaleString()}</div>
                <div className="text-[#555570] text-xs mt-0.5">ideal: {ideal}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Keywords */}
      {topKeywords.length > 0 && (
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4">
          <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3">Top Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {topKeywords.map(([word, count]) => {
              const isFocus = kw && (word === kw || word.includes(kw) || kw.includes(word))
              return (
                <span
                  key={word}
                  className={`text-xs px-2.5 py-1 rounded-full border ${isFocus
                    ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                    : 'bg-[#1a1a26] border-[#2a2a3d] text-[#c8c8d8]'
                  }`}
                >
                  {word} <span className="opacity-50">{count}x</span>
                </span>
              )
            })}
          </div>
          {kw && <p className="text-[#555570] text-xs mt-2">Focus keyword highlighted in purple</p>}
        </div>
      )}
    </div>
  )
}

function SeoField({
  label, value, limit, textarea,
}: {
  label: string
  value: string
  limit?: number
  textarea?: boolean
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const overLimit = limit && value.length > limit

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2">
          {limit && (
            <span className={clsx('text-xs', overLimit ? 'text-red-400' : 'text-[#8888a8]')}>
              {value.length}/{limit}
            </span>
          )}
          <button
            onClick={copy}
            className="text-xs text-[#8888a8] hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {textarea ? (
        <textarea
          readOnly
          value={value}
          rows={3}
          className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm resize-none focus:outline-none"
        />
      ) : (
        <input
          readOnly
          value={value}
          className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none"
        />
      )}
      {overLimit && (
        <p className="text-red-400 text-xs mt-1">Exceeds recommended {limit} character limit</p>
      )}
    </div>
  )
}
