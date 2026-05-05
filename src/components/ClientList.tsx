'use client'

import { useState } from 'react'
import { Pencil, Trash2, Globe, Building2, FileText, BarChart2, Wifi, Link2, Check, LayoutGrid, List } from 'lucide-react'
import { deleteClient } from '@/app/clients/actions'
import ClientForm from './ClientForm'

type Client = {
  id: string
  name: string
  industry: string | null
  website: string | null
  wp_url: string | null
  wp_username: string | null
  wp_app_password: string | null
  brand_voice: string | null
  logo_url: string | null
  primary_color: string | null
  brand_guidelines: string | null
  target_keywords: string | null
  contact_email: string | null
  created_at: string
}

function WpHealthBadge({ hasWp }: { hasWp: boolean }) {
  if (hasWp) {
    return (
      <span
        title="WordPress connected"
        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      >
        <Wifi className="w-2.5 h-2.5" />
        WP
      </span>
    )
  }
  return (
    <span
      title="No WordPress credentials — edit client to connect"
      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
    >
      <Wifi className="w-2.5 h-2.5" />
      WP
    </span>
  )
}

function CopyReportLink({ clientId }: { clientId: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}/r/${clientId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      title="Copy shareable report link"
      className="flex items-center gap-1 text-xs font-semibold text-[#8888a8] hover:text-white bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a3d] px-2.5 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Link2 className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}

function ClientAvatar({ client }: { client: Client }) {
  if (client.logo_url) {
    return <img src={client.logo_url} alt={client.name} className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-[#2a2a3d] shrink-0 p-0.5" />
  }
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-base"
      style={{ background: client.primary_color ?? '#6d28d9' }}
    >
      {client.name.charAt(0).toUpperCase()}
    </div>
  )
}

function PostUsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / Math.max(1, limit)) * 100))
  const left = Math.max(0, limit - used)
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-emerald-500'
  return (
    <div className="mt-2.5 mb-0.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#555570] text-xs">Posts this month</span>
        <span className={`text-xs font-semibold ${pct >= 100 ? 'text-red-400' : pct >= 80 ? 'text-yellow-400' : 'text-[#8888a8]'}`}>
          {used}/{limit} · {left} left
        </span>
      </div>
      <div className="h-1 bg-[#1a1a26] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function ClientList({
  clients,
  postCountByClient = {},
  perClientLimit = 5,
}: {
  clients: Client[]
  postCountByClient?: Record<string, number>
  perClientLimit?: number
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This will also delete all their posts.`)) return
    setDeletingId(id)
    await deleteClient(id)
    setDeletingId(null)
  }

  if (clients.length === 0) {
    return (
      <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-20 text-center">
        <Building2 className="w-10 h-10 text-[#2a2a3d] mx-auto mb-3" />
        <p className="text-[#8888a8] text-sm">No clients yet</p>
        <p className="text-[#8888a8] text-xs mt-1 opacity-60">Add your first client to get started</p>
      </div>
    )
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-1 bg-[#12121a] border border-[#2a2a3d] rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-[#2a2a3d] text-white' : 'text-[#555570] hover:text-white'}`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-[#2a2a3d] text-white' : 'text-[#555570] hover:text-white'}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {clients.map(client => (
            <div
              key={client.id}
              className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-4 flex flex-col hover:border-violet-500/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ClientAvatar client={client} />
                  <div className="min-w-0">
                    <a href={`/clients/${client.id}`} className="text-white hover:text-violet-300 font-bold text-sm leading-tight truncate block transition-colors">{client.name}</a>
                    <div className="flex items-center gap-2 mt-0.5">
                      {client.industry && <span className="text-[#555570] text-xs">{client.industry}</span>}
                      <WpHealthBadge hasWp={!!(client.wp_url && client.wp_username && client.wp_app_password)} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <ClientForm client={client} trigger={
                    <button className="p-1.5 text-[#555570] hover:text-white hover:bg-[#1a1a26] rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  } />
                  <button onClick={() => handleDelete(client.id, client.name)} disabled={deletingId === client.id}
                    className="p-1.5 text-[#555570] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {client.website && (
                <a href={client.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#555570] hover:text-cyan-400 text-xs transition-colors truncate mb-1">
                  <Globe className="w-3 h-3 shrink-0" />
                  <span className="truncate">{client.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </a>
              )}

              <PostUsageBar used={postCountByClient[client.id] ?? 0} limit={perClientLimit} />

              <div className="flex items-center gap-1.5 pt-3 border-t border-[#1a1a26] mt-auto">
                <a href={`/clients/${client.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-2.5 py-1.5 rounded-lg transition-colors">
                  Manage
                </a>
                <a href={`/clients/${client.id}/report`}
                  className="flex items-center gap-1 text-xs font-semibold text-[#8888a8] hover:text-white bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a3d] px-2.5 py-1.5 rounded-lg transition-colors">
                  <BarChart2 className="w-3 h-3" /> Report
                </a>
                <CopyReportLink clientId={client.id} />
                <a href={`/dashboard?client=${client.id}`}
                  className="ml-auto flex items-center gap-1 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  Generate →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="flex flex-col gap-2">
          {clients.map(client => (
            <div
              key={client.id}
              className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-3 flex items-center gap-4 hover:border-violet-500/30 transition-colors"
            >
              <ClientAvatar client={client} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a href={`/clients/${client.id}`} className="text-white hover:text-violet-300 font-bold text-sm truncate transition-colors">{client.name}</a>
                  <WpHealthBadge hasWp={!!(client.wp_url && client.wp_username && client.wp_app_password)} />
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {client.industry && <span className="text-[#555570] text-xs">{client.industry}</span>}
                  {client.website && (
                    <a href={client.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#555570] hover:text-cyan-400 text-xs transition-colors truncate max-w-[200px]">
                      <Globe className="w-3 h-3 shrink-0" />
                      <span className="truncate">{client.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Usage pill in list view */}
              <div className="shrink-0 text-center hidden sm:block">
                {(() => {
                  const used = postCountByClient[client.id] ?? 0
                  const pct = Math.min(100, Math.round((used / Math.max(1, perClientLimit)) * 100))
                  const color = pct >= 100 ? 'text-red-400 border-red-500/20 bg-red-500/10' : pct >= 80 ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                  return (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
                      {used}/{perClientLimit} posts
                    </span>
                  )
                })()}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a href={`/posts?client=${client.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-[#8888a8] hover:text-white bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a3d] px-2.5 py-1.5 rounded-lg transition-colors">
                  <FileText className="w-3 h-3" /> Posts
                </a>
                <a href={`/clients/${client.id}/report`}
                  className="flex items-center gap-1 text-xs font-semibold text-[#8888a8] hover:text-white bg-[#0a0a0f] hover:bg-[#1a1a26] border border-[#2a2a3d] px-2.5 py-1.5 rounded-lg transition-colors">
                  <BarChart2 className="w-3 h-3" /> Report
                </a>
                <CopyReportLink clientId={client.id} />
                <ClientForm client={client} trigger={
                  <button className="p-1.5 text-[#555570] hover:text-white hover:bg-[#1a1a26] rounded-lg transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                } />
                <button onClick={() => handleDelete(client.id, client.name)} disabled={deletingId === client.id}
                  className="p-1.5 text-[#555570] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <a href={`/dashboard?client=${client.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  Generate →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
