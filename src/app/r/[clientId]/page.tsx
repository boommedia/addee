import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { Globe, ExternalLink, FileText, BarChart2 } from 'lucide-react'
import Logo from '@/components/Logo'

export default async function PublicReportPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const admin = createAdminClient()

  const { data: client } = await admin
    .from('clients')
    .select('id, name, industry, website, logo_url, primary_color')
    .eq('id', clientId)
    .single()

  if (!client) notFound()

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [{ data: allPosts }, { data: monthPosts }] = await Promise.all([
    admin.from('posts').select('id, title, word_count, wp_post_url, wp_status, created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
    admin.from('posts').select('id, title, word_count, wp_post_url, wp_status, created_at').eq('client_id', clientId).gte('created_at', monthStart).order('created_at', { ascending: false }),
  ])

  const posts = allPosts ?? []
  const mPosts = monthPosts ?? []
  const totalWords = posts.reduce((s, p) => s + (p.word_count ?? 0), 0)
  const published = posts.filter(p => p.wp_status === 'publish').length
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0]">
      <nav className="border-b border-[#2a2a3d] bg-[#0a0900]/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <span className="text-[#555570] text-xs">Content Report</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {client.logo_url ? (
            <img src={client.logo_url} alt={client.name} className="w-14 h-14 rounded-xl object-contain bg-white/5 border border-[#2a2a3d] p-1" />
          ) : (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl"
              style={{ background: client.primary_color ?? '#6d28d9' }}
            >
              {client.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{client.name}</h1>
            {client.industry && <p className="text-[#8888a8] text-sm">{client.industry}</p>}
            {client.website && (
              <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#555570] hover:text-cyan-400 text-xs transition-colors mt-0.5">
                <Globe className="w-3 h-3" />{client.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <div className="ml-auto text-right">
            <div className="text-[#8888a8] text-xs">Report generated</div>
            <div className="text-white text-sm font-semibold">{month}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Posts This Month', value: mPosts.length, icon: <FileText className="w-4 h-4 text-violet-400" /> },
            { label: 'Total Posts', value: posts.length, icon: <BarChart2 className="w-4 h-4 text-cyan-400" /> },
            { label: 'Published Live', value: published, icon: <Globe className="w-4 h-4 text-emerald-400" /> },
            { label: 'Total Words', value: `${(totalWords / 1000).toFixed(1)}k`, icon: <FileText className="w-4 h-4 text-yellow-400" /> },
          ].map(stat => (
            <div key={stat.label} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
              <div className="flex items-center gap-1.5 text-[#8888a8] text-xs mb-2">{stat.icon} {stat.label}</div>
              <div className="text-white text-3xl font-black">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* This month's posts */}
        {mPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-sm mb-3">Posts This Month</h2>
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl divide-y divide-[#2a2a3d] overflow-hidden">
              {mPosts.map(p => (
                <div key={p.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{p.title}</div>
                    <div className="text-[#555570] text-xs mt-0.5">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {p.word_count ? ` · ${p.word_count.toLocaleString()} words` : ''}
                    </div>
                  </div>
                  {p.wp_post_url ? (
                    <a
                      href={p.wp_post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                        p.wp_status === 'publish'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                      }`}
                    >
                      {p.wp_status === 'publish' ? 'Live' : 'Draft'}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-[#555570] bg-[#1a1a26] border border-[#2a2a3d] px-2.5 py-1 rounded-full shrink-0">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All posts */}
        {posts.length > mPosts.length && (
          <div>
            <h2 className="text-white font-bold text-sm mb-3">All Posts</h2>
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl divide-y divide-[#2a2a3d] overflow-hidden">
              {posts.filter(p => !mPosts.find(m => m.id === p.id)).slice(0, 20).map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-[#c8c8d8] text-sm truncate">{p.title}</div>
                    <div className="text-[#555570] text-xs">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  {p.wp_post_url && (
                    <a href={p.wp_post_url} target="_blank" rel="noopener noreferrer" className="text-[#555570] hover:text-cyan-400 transition-colors shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[#555570] text-xs mt-10">
          Powered by <a href="https://bloggy.online" className="hover:text-[#8888a8] transition-colors">Bloggy</a>
        </p>
      </main>
    </div>
  )
}
