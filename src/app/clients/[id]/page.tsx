import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Globe, FileText, BarChart2, Wifi, Link2 } from 'lucide-react'
import ClientSettingsForm from './ClientSettingsForm'
import CopyShareLink from './CopyShareLink'
import MediaLibrary from '@/components/MediaLibrary'
import IntegrationsPanel from './IntegrationsPanel'
import { sendApprovalForPost } from '@/app/clients/actions'
import { getConnectedPlatforms } from '@/lib/ayrshare'

function BarChart({ data, label }: { data: { date: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div>
      <p className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
      <div className="flex items-end gap-0.5 h-20">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative" title={`${d.date}: ${d.value}`}>
              <div className="w-full bg-[#ca8a04]/60 hover:bg-[#ca8a04] rounded-sm transition-all" style={{ height: `${Math.max(pct, 2)}%` }} />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2a2200] text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {d.value}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[#7a6a40] text-xs">{data[0]?.date}</span>
        <span className="text-[#7a6a40] text-xs">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab = 'overview' } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const isAdmin = user.email === 'eric@bloggy.online' || user.email === 'eric@boommedia.us'

  let query = supabase
    .from('clients')
    .select('*')
    .eq('id', id)

  if (!isAdmin) {
    query = query.eq('created_by', user.id)
  }

  const { data: client } = await query.single()

  if (!client) notFound()

  const { data: posts = [] } = await supabase
    .from('posts')
    .select('id, title, word_count, wp_post_url, wp_status, created_at, tone, length, approval_status')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const { data: directIntegrationData } = await supabase
    .from('client_integrations')
    .select('platform, platform_account_name, token_expires_at')
    .eq('client_id', id)
  const directIntegrations = (directIntegrationData ?? []) as any[]

  const { data: blogIntegrationData } = await supabase
    .from('user_integrations')
    .select('platform')
    .eq('user_id', user.id)
  const blogIntegrations = (blogIntegrationData ?? []) as any[]

  let ayrshareIntegrations: string[] = []
  if (client.ayrshare_profile_key) {
    try {
      ayrshareIntegrations = await getConnectedPlatforms(client.ayrshare_profile_key)
    } catch (err) {
      console.error('Failed to fetch Ayrshare platforms:', err)
    }
  }

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const publishedPosts = (posts ?? []).filter(p => p.wp_status === 'publish')
  const draftPosts = (posts ?? []).filter(p => p.wp_post_url && p.wp_status !== 'publish')
  const totalWords = (posts ?? []).reduce((sum, p) => sum + (p.word_count ?? 0), 0)
  const postsThisMonth = (posts ?? []).filter(p => p.created_at >= monthStart)
  const lastPost = posts?.[0] ?? null

  const postDays: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    postDays[d.toISOString().slice(0, 10)] = 0
  }
  for (const p of posts ?? []) {
    const day = p.created_at.slice(0, 10)
    if (postDays[day] !== undefined) postDays[day]++
  }
  const chartData = Object.entries(postDays).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value,
  }))

  const hasWp = !!(client.wp_url && client.wp_username && client.wp_app_password)

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'posts', label: `Posts (${posts?.length ?? 0})` },
    { key: 'media', label: 'Media Library' },
    { key: 'integrations', label: 'Integrations', icon: <Link2 className="w-3.5 h-3.5" /> },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0900] text-[#dde4f0]">
      <AppNav active="/clients" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <a href="/clients" className="flex items-center gap-1.5 text-[#b8a870] hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Clients
          </a>
          <div className="flex items-center gap-2">
            <a href={`/clients/${id}/report`}
              className="flex items-center gap-1.5 text-xs text-[#b8a870] hover:text-white bg-[#141200] hover:bg-[#1c1800] border border-[#2a2200] px-3 py-1.5 rounded-lg transition-colors">
              <BarChart2 className="w-3.5 h-3.5" /> Report
            </a>
            <CopyShareLink clientId={id} />
            <a href={`/dashboard?client=${id}`}
              className="flex items-center gap-1.5 text-xs text-white bg-[#ca8a04] hover:bg-[#ca8a04] px-3 py-1.5 rounded-lg transition-colors">
              + Generate Post
            </a>
          </div>
        </div>

        {/* Client identity */}
        <div className="bg-[#141200] border border-[#2a2200] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            {client.logo_url ? (
              <img src={client.logo_url} alt={client.name} className="w-14 h-14 rounded-xl object-contain bg-white/5 border border-[#2a2200] p-1 shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-2xl shrink-0"
                style={{ background: client.primary_color ?? '#ca8a04' }}>
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white">{client.name}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {client.industry && <span className="text-[#b8a870] text-sm">{client.industry}</span>}
                {client.website && (
                  <a href={client.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#7a6a40] hover:text-cyan-400 text-xs transition-colors">
                    <Globe className="w-3 h-3" />
                    {client.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold ${
                  hasWp
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                }`}>
                  <Wifi className="w-2.5 h-2.5" />
                  {hasWp ? 'WP Connected' : 'WP Not Connected'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#2a2200] mb-6">
          {TABS.map(t => (
            <a key={t.key} href={`/clients/${id}?tab=${t.key}`}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                tab === t.key
                  ? 'text-white border-b-2 border-[#ca8a04]'
                  : 'text-[#b8a870] hover:text-white'
              }`}>
              {(t as any).icon}
              {t.label}
            </a>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Posts', value: posts?.length ?? 0, sub: `${postsThisMonth.length} this month`, color: 'text-[#ca8a04]' },
                { label: 'Published', value: publishedPosts.length, sub: `${draftPosts.length} drafts`, color: 'text-emerald-400' },
                { label: 'Words Written', value: totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords, sub: 'all time', color: 'text-cyan-400' },
                {
                  label: 'Last Post',
                  value: lastPost ? new Date(lastPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—',
                  sub: lastPost ? new Date(lastPost.created_at).getFullYear().toString() : 'no posts yet',
                  color: 'text-yellow-400',
                },
              ].map(stat => (
                <div key={stat.label} className="bg-[#141200] border border-[#2a2200] rounded-xl px-4 py-3">
                  <div className="text-[#b8a870] text-xs mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[#7a6a40] text-xs mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#141200] border border-[#2a2200] rounded-2xl p-5">
              <BarChart data={chartData} label="Posts generated — last 30 days" />
            </div>

            {/* Recent posts preview */}
            <div className="bg-[#141200] border border-[#2a2200] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2200] flex items-center justify-between">
                <h2 className="text-white font-bold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#ca8a04]" /> Recent Posts
                </h2>
                {(posts?.length ?? 0) > 5 && (
                  <a href={`/clients/${id}?tab=posts`} className="text-[#ca8a04] hover:text-[#fbbf24] text-xs transition-colors">View all →</a>
                )}
              </div>
              {!(posts?.length) ? (
                <div className="py-10 text-center">
                  <p className="text-[#7a6a40] text-sm">No posts yet</p>
                  <a href={`/dashboard?client=${id}`} className="inline-block mt-3 text-xs text-white bg-[#ca8a04] hover:bg-[#ca8a04] px-4 py-1.5 rounded-lg transition-colors">
                    Generate first post
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-[#2a2200]">
                  {(posts ?? []).slice(0, 5).map(p => (
                    <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <a href={`/posts/${p.id}`} className="text-white hover:text-[#fbbf24] text-sm font-medium truncate block transition-colors">
                          {p.title ?? 'Untitled'}
                        </a>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[#7a6a40] text-xs">{(p.word_count ?? 0).toLocaleString()} words</span>
                          {p.tone && <span className="text-[#7a6a40] text-xs capitalize">{p.tone}</span>}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {client.contact_email && (
                          p.wp_status === 'publish' ? (
                            <span className="text-xs text-[#7a6a40] bg-[#1c1800] border border-[#2a2200] px-2 py-0.5 rounded-full">Published</span>
                          ) : (p as any).approval_status === 'approved' ? (
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">✓ Approved</span>
                          ) : (p as any).approval_status === 'pending_approval' ? (
                            <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">Awaiting</span>
                          ) : (
                            <form action={sendApprovalForPost}>
                              <input type="hidden" name="postId" value={p.id} />
                              <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-white bg-[#ca8a04] hover:bg-[#ca8a04] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                                Send Approval
                              </button>
                            </form>
                          )
                        )}
                        {p.wp_post_url ? (
                          <a href={p.wp_post_url} target="_blank" rel="noopener noreferrer"
                            className={`text-xs px-2 py-0.5 rounded-full border ${
                              p.wp_status === 'publish'
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                            }`}>
                            {p.wp_status === 'publish' ? 'Live' : 'Draft'}
                          </a>
                        ) : (
                          <span className="text-xs text-[#7a6a40] bg-[#1c1800] border border-[#2a2200] px-2 py-0.5 rounded-full">Local</span>
                        )}
                        <span className="text-[#7a6a40] text-xs shrink-0">
                          {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client info snapshot */}
            {(client.brand_voice || client.target_keywords || client.contact_email) && (
              <div className="bg-[#141200] border border-[#2a2200] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider">Client Info</h2>
                  <a href={`/clients/${id}?tab=settings`} className="text-[#ca8a04] hover:text-[#fbbf24] text-xs transition-colors">Edit →</a>
                </div>
                <div className="space-y-3">
                  {client.contact_email && (
                    <div>
                      <span className="text-[#7a6a40] text-xs uppercase tracking-wide">Contact</span>
                      <p className="text-[#dde4f0] text-sm mt-0.5">{client.contact_email}</p>
                    </div>
                  )}
                  {client.brand_voice && (
                    <div>
                      <span className="text-[#7a6a40] text-xs uppercase tracking-wide">Brand Voice</span>
                      <p className="text-[#dde4f0] text-sm mt-0.5 leading-relaxed line-clamp-3">{client.brand_voice}</p>
                    </div>
                  )}
                  {client.target_keywords && (
                    <div>
                      <span className="text-[#7a6a40] text-xs uppercase tracking-wide">Target Keywords</span>
                      <p className="text-[#dde4f0] text-sm mt-0.5">{client.target_keywords}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── POSTS ── */}
        {tab === 'posts' && (
          <div className="bg-[#141200] border border-[#2a2200] rounded-2xl overflow-hidden">
            {!(posts?.length) ? (
              <div className="py-20 text-center">
                <FileText className="w-8 h-8 text-[#2a2200] mx-auto mb-3" />
                <p className="text-[#b8a870] text-sm">No posts yet</p>
                <a href={`/dashboard?client=${id}`} className="inline-block mt-4 text-xs text-white bg-[#ca8a04] hover:bg-[#ca8a04] px-4 py-2 rounded-lg transition-colors">
                  Generate first post
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2200]">
                      <th className="text-left text-[#b8a870] text-xs font-semibold uppercase tracking-wider px-5 py-3">Title</th>
                      <th className="text-left text-[#b8a870] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Tone</th>
                      <th className="text-left text-[#b8a870] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Words</th>
                      <th className="text-left text-[#b8a870] text-xs font-semibold uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-[#b8a870] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {(posts ?? []).map((p, i) => (
                      <tr key={p.id} className={`${i % 2 === 0 ? '' : 'bg-[#0a0900]'} hover:bg-[#1c1800]/50 transition-colors`}>
                        <td className="px-5 py-3">
                          <a href={`/posts/${p.id}`} className="text-white hover:text-[#fbbf24] text-sm font-medium line-clamp-1 transition-colors">
                            {p.title ?? 'Untitled'}
                          </a>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {p.tone && <span className="text-xs capitalize text-[#b8a870] bg-[#1c1800] border border-[#2a2200] px-2 py-0.5 rounded-full">{p.tone}</span>}
                        </td>
                        <td className="px-4 py-3 text-[#b8a870] text-sm hidden sm:table-cell">{(p.word_count ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {p.wp_post_url ? (
                            <a href={p.wp_post_url} target="_blank" rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
                                p.wp_status === 'publish'
                                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20'
                              }`}>
                              {p.wp_status === 'publish' ? '● Live' : '○ Draft'}
                            </a>
                          ) : (
                            <span className="text-xs text-[#7a6a40] bg-[#1c1800] border border-[#2a2200] px-2 py-0.5 rounded-full">Local</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#7a6a40] text-xs hidden lg:table-cell">
                          {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {client.contact_email && (
                              p.wp_status === 'publish' ? (
                                <span className="text-xs text-[#7a6a40] bg-[#1c1800] border border-[#2a2200] px-2 py-0.5 rounded-full">Published</span>
                              ) : (p as any).approval_status === 'approved' ? (
                                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">✓ Approved</span>
                              ) : (p as any).approval_status === 'pending_approval' ? (
                                <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">Awaiting</span>
                              ) : (
                                <form action={sendApprovalForPost}>
                                  <input type="hidden" name="postId" value={p.id} />
                                  <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-white bg-[#ca8a04] hover:bg-[#ca8a04] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                                    Send Approval
                                  </button>
                                </form>
                              )
                            )}
                            <a href={`/posts/${p.id}`}
                              className="text-xs text-[#ca8a04] hover:text-[#fbbf24] bg-[#ca8a04]/10 hover:bg-[#ca8a04]/20 border border-[#ca8a04]/20 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                              Edit →
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MEDIA LIBRARY ── */}
        {tab === 'media' && (
          <MediaLibrary clientId={id} />
        )}

        {/* ── INTEGRATIONS ── */}
        {tab === 'integrations' && (
          <IntegrationsPanel
            clientId={id}
            userId={user.id}
            initialDirect={directIntegrations}
            initialAyrshare={ayrshareIntegrations}
            initialBlogPlatforms={blogIntegrations}
            wpUrl={client.wp_url}
            wpUsername={client.wp_username}
            wpAppPassword={client.wp_app_password}
          />
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <ClientSettingsForm client={client} />
        )}
      </main>
    </div>
  )
}
