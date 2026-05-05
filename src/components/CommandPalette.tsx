'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Zap, Users, BarChart2, Settings, CreditCard, CalendarDays, Globe, Share2, Clock, TrendingUp, Link2, BookOpen, FileText, X } from 'lucide-react'
import clsx from 'clsx'

type Command = {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  href?: string
  action?: () => void
  keywords?: string[]
}

const BASE_COMMANDS: Command[] = [
  { id: 'dashboard',      label: 'AI Blog Generator',       description: 'Generate a new blog post',           icon: <Zap className="w-4 h-4 text-violet-400" />,   href: '/dashboard',                     keywords: ['generate', 'new post', 'create', 'write'] },
  { id: 'clients',        label: 'Clients',                  description: 'Manage your client accounts',         icon: <Users className="w-4 h-4 text-cyan-400" />,    href: '/clients',                       keywords: ['client', 'brand'] },
  { id: 'posts',          label: 'Posts',                    description: 'View all generated posts',            icon: <FileText className="w-4 h-4 text-[#8888a8]" />, href: '/posts',                         keywords: ['post', 'history', 'library'] },
  { id: 'keywords',       label: 'Keyword Research',         description: 'Research keywords with AI',           icon: <Search className="w-4 h-4 text-yellow-400" />,  href: '/keywords',                      keywords: ['keyword', 'seo', 'research'] },
  { id: 'autoblog',       label: 'AutoBlog',                 description: 'Schedule automated posts',            icon: <Clock className="w-4 h-4 text-emerald-400" />,  href: '/autoblog',                      keywords: ['auto', 'schedule', 'queue'] },
  { id: 'calendar',       label: 'Content Calendar',         description: 'View scheduled & published content',  icon: <CalendarDays className="w-4 h-4 text-violet-400" />, href: '/calendar',                 keywords: ['calendar', 'schedule'] },
  { id: 'analytics',      label: 'Analytics',                description: 'Post stats and rankings',             icon: <BarChart2 className="w-4 h-4 text-emerald-400" />, href: '/analytics',                 keywords: ['analytics', 'stats', 'rankings'] },
  { id: 'url-to-blog',    label: 'URL to Blog',              description: 'Rewrite any webpage as a blog post',  icon: <Globe className="w-4 h-4 text-cyan-400" />,    href: '/tools/url-to-blog',             keywords: ['url', 'scrape', 'rewrite'] },
  { id: 'youtube',        label: 'YouTube to Blog',          description: 'Turn a YouTube video into a post',    icon: <Zap className="w-4 h-4 text-red-400" />,       href: '/tools/youtube-to-blog',         keywords: ['youtube', 'video', 'transcript'] },
  { id: 'repurpose',      label: 'Content Repurposer',       description: 'Repurpose a post for social media',   icon: <Share2 className="w-4 h-4 text-pink-400" />,   href: '/tools/repurpose',               keywords: ['repurpose', 'social', 'linkedin', 'twitter'] },
  { id: 'internal-links', label: 'Internal Link Suggester',  description: 'AI internal linking suggestions',     icon: <Link2 className="w-4 h-4 text-pink-400" />,    href: '/tools/internal-links',          keywords: ['internal', 'link'] },
  { id: 'competitor',     label: 'Competitor Gap Analysis',  description: 'Find gaps vs. competitors',           icon: <TrendingUp className="w-4 h-4 text-violet-400" />, href: '/tools/competitor-analysis',  keywords: ['competitor', 'gap', 'analysis'] },
  { id: 'brief',          label: 'Content Brief Generator',  description: 'Generate a full content brief',       icon: <BookOpen className="w-4 h-4 text-emerald-400" />, href: '/tools/brief',                keywords: ['brief', 'content plan', 'outline'] },
  { id: 'tools',          label: 'All Tools',                description: 'Browse every feature',                icon: <Zap className="w-4 h-4 text-[#8888a8]" />,    href: '/tools' },
  { id: 'billing',        label: 'Billing',                  description: 'Manage plan and credits',             icon: <CreditCard className="w-4 h-4 text-violet-400" />, href: '/billing',                   keywords: ['plan', 'upgrade', 'credits', 'payment'] },
  { id: 'settings',       label: 'Settings',                 description: 'App settings and integrations',       icon: <Settings className="w-4 h-4 text-[#8888a8]" />, href: '/settings',                   keywords: ['settings', 'integrations', 'wordpress'] },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = query.trim()
    ? BASE_COMMANDS.filter(c => {
        const q = query.toLowerCase()
        return (
          c.label.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.keywords?.some(k => k.includes(q))
        )
      })
    : BASE_COMMANDS

  const execute = useCallback((cmd: Command) => {
    setOpen(false)
    setQuery('')
    if (cmd.action) { cmd.action(); return }
    if (cmd.href) router.push(cmd.href)
  }, [router])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
        setSelected(0)
      }
      if (!open) return
      if (e.key === 'Escape') { setOpen(false); setQuery('') }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); execute(filtered[selected]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, selected, execute])

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 30) } }, [open])
  useEffect(() => { setSelected(0) }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => { setOpen(false); setQuery('') }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-[#12121a] border border-[#2a2a3d] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2a2a3d]">
          <Search className="w-4 h-4 text-[#555570] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, pages, actions…"
            className="flex-1 bg-transparent text-white text-sm placeholder-[#555570] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#555570] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#555570] bg-[#1a1a26] border border-[#2a2a3d] rounded px-1.5 py-0.5 font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-[#555570] text-sm py-8">No results for "{query}"</p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onMouseEnter={() => setSelected(i)}
                onClick={() => execute(cmd)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  i === selected ? 'bg-violet-600/15' : 'hover:bg-[#1a1a26]'
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] flex items-center justify-center shrink-0">
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{cmd.label}</div>
                  {cmd.description && <div className="text-[#555570] text-xs truncate">{cmd.description}</div>}
                </div>
                {i === selected && (
                  <kbd className="text-[10px] text-[#555570] bg-[#1a1a26] border border-[#2a2a3d] rounded px-1.5 py-0.5 font-mono">↵</kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#2a2a3d] text-[10px] text-[#555570]">
          <span className="flex items-center gap-1"><kbd className="font-mono bg-[#1a1a26] border border-[#2a2a3d] rounded px-1">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-[#1a1a26] border border-[#2a2a3d] rounded px-1">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-[#1a1a26] border border-[#2a2a3d] rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
