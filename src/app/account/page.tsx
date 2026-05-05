import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppNav from '@/components/AppNav'
import { FileText, Globe, TrendingUp, Zap, ExternalLink, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

const PLAN_STYLES: Record<string, { badge: string; card: string }> = {
  starter:    { badge: 'bg-blue-500/15 border-blue-500/30 text-blue-400',    card: 'from-blue-600/10 to-transparent border-blue-500/20' },
  growth:     { badge: 'bg-violet-500/15 border-violet-500/30 text-violet-400', card: 'from-violet-600/10 to-transparent border-violet-500/20' },
  agency:     { badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',    card: 'from-cyan-600/10 to-transparent border-cyan-500/20' },
  agency_max: { badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', card: 'from-emerald-600/10 to-transparent border-emerald-500/20' },
}

function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-violet-500'
  const left = Math.max(0, limit - used)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#8888a8] text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold">{used} / {limit}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
            left === 0 ? 'bg-red-500/15 border-red-500/30 text-red-400' :
            pct >= 70  ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' :
                         'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          }`}>
            {left} {unit} left
          </span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-[#2a2a3d] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const prevMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString()

  const [
    { data: sub },
    { count: postsThisMonth },
    { count: postsLastMonth },
    { count: sitesUsed },
    { data: recentPosts },
    { data: wordData },
    { data: wordDataLast },
  ] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', monthStart),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', prevMonthStart).lt('created_at', monthStart),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('id, title, word_count, created_at, wp_post_url, wp_status, clients(name)').eq('created_by', user.id).order('created_at', { ascending: false }).limit(8),
    supabase.from('posts').select('word_count').eq('created_by', user.id).gte('created_at', monthStart),
    supabase.from('posts').select('word_count').eq('created_by', user.id).gte('created_at', prevMonthStart).lt('created_at', monthStart),
  ])

  const isActive = sub?.status === 'active'
  if (!isActive) redirect('/billing')

  const plan = sub!.plan as string
  const styles = PLAN_STYLES[plan] ?? PLAN_STYLES.growth
  const postsUsed = postsThisMonth ?? 0
  const postsLimit = sub!.posts_limit
  const sitesLimit = sub!.sites_limit
  const wordsThisMonth = wordData?.reduce((s, p) => s + (p.word_count ?? 0), 0) ?? 0
  const wordsLastMonth = wordDataLast?.reduce((s, p) => s + (p.word_count ?? 0), 0) ?? 0
  const postGrowth = (postsLastMonth ?? 0) > 0
    ? Math.round((((postsThisMonth ?? 0) - (postsLastMonth ?? 0)) / (postsLastMonth ?? 1)) * 100)
    : null

  const renewDate = sub!.current_period_end
    ? new Date(sub!.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/account" />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Account</h1>
            <p className="text-[#8888a8] text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/billing"
              className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] px-3 py-2 rounded-lg transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              Manage subscription
            </a>
            <a href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-white bg-violet-600 hover:bg-violet-500 px-3 py-2 rounded-lg transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Generate post
            </a>
          </div>
        </div>

        {/* Plan card */}
        <div className={`bg-gradient-to-br ${styles.card} border rounded-2xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-sm px-3 py-1 rounded-full border capitalize font-bold ${styles.badge}`}>
                {plan.replace('_', ' ')} Plan
              </span>
              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </div>
            {renewDate && (
              <div className="flex items-center gap-1.5 text-[#8888a8] text-xs">
                <Calendar className="w-3.5 h-3.5" />
                Renews {renewDate}
              </div>
            )}
          </div>
          <div className="space-y-5">
            <UsageBar label="Posts this month" used={postsUsed} limit={postsLimit} unit="posts" />
            <UsageBar label="Client sites" used={sitesUsed ?? 0} limit={sitesLimit} unit="sites" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: <FileText className="w-4 h-4 text-violet-400" />,
              label: 'Posts this month',
              value: postsUsed.toLocaleString(),
              sub: postGrowth !== null ? `${postGrowth >= 0 ? '+' : ''}${postGrowth}% vs last month` : 'First month',
              color: postGrowth !== null && postGrowth >= 0 ? 'text-emerald-400' : 'text-red-400',
            },
            {
              icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
              label: 'Words this month',
              value: wordsThisMonth >= 1000 ? `${(wordsThisMonth / 1000).toFixed(1)}k` : wordsThisMonth.toString(),
              sub: wordsLastMonth > 0 ? `${(wordsLastMonth / 1000).toFixed(1)}k last month` : 'First month',
              color: 'text-[#8888a8]',
            },
            {
              icon: <Globe className="w-4 h-4 text-emerald-400" />,
              label: 'Client sites',
              value: (sitesUsed ?? 0).toString(),
              sub: `of ${sitesLimit} allowed`,
              color: 'text-[#8888a8]',
            },
            {
              icon: <Zap className="w-4 h-4 text-yellow-400" />,
              label: 'Posts remaining',
              value: Math.max(0, postsLimit - postsUsed).toString(),
              sub: `resets next month`,
              color: postsUsed / postsLimit >= 0.9 ? 'text-red-400' : 'text-[#8888a8]',
            },
          ].map((stat, i) => (
            <div key={i} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">{stat.icon}<span className="text-[#8888a8] text-xs">{stat.label}</span></div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className={`text-xs ${stat.color}`}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent posts */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a2a3d] flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Recent Posts</h2>
            <a href="/posts" className="text-violet-400 hover:text-violet-300 text-xs transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-[#2a2a3d]">
            {recentPosts?.length === 0 && (
              <div className="px-5 py-10 text-center text-[#555570] text-sm">No posts yet — <a href="/dashboard" className="text-violet-400 hover:text-violet-300">generate your first one</a></div>
            )}
            {recentPosts?.map(post => {
              const client = Array.isArray(post.clients) ? post.clients[0] : post.clients
              return (
                <div key={post.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#1a1a26] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <a href={`/posts/${post.id}`} className="text-white text-sm font-medium truncate block group-hover:text-violet-300 transition-colors">
                      {post.title}
                    </a>
                    <div className="flex items-center gap-3 mt-0.5">
                      {client && <span className="text-[#555570] text-xs">{client.name}</span>}
                      {post.word_count && <span className="text-[#555570] text-xs">{post.word_count.toLocaleString()} words</span>}
                      <span className="text-[#555570] text-xs">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {post.wp_post_url ? (
                      <a href={post.wp_post_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                        {post.wp_status === 'publish' ? 'Live' : 'Draft'}
                      </a>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-[#1a1a26] border-[#2a2a3d] text-[#555570]">Not published</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
