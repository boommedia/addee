import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logout } from '@/app/auth/actions'
import { redirect } from 'next/navigation'
import { Users, DollarSign, FileText, BarChart2, AlertTriangle, Mail, Activity, TrendingUp, Building2, UserPlus, Wifi, Globe, Cpu, Server, Zap, CheckCircle, Link2 } from 'lucide-react'
import InviteButton from './InviteButton'
import WaitlistActions from './WaitlistActions'
import UpsellButton from './UpsellButton'
import UserTable from './UserTable'
import SyncAccountButton from './SyncAccountButton'
import DirectInviteForm from './DirectInviteForm'
import DiscordReleaseForm from './DiscordReleaseForm'
import ApprovalActions from './ApprovalActions'
import AdminIntegrationsPanel from './AdminIntegrationsPanel'

export const dynamic = 'force-dynamic'

const PLAN_PRICE: Record<string, number> = {
  starter: 49, growth: 99, agency: 199, agency_max: 299,
}

function BarChart({ data, label }: { data: { date: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div>
      <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
      <div className="flex items-end gap-0.5 h-20">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative" title={`${d.date}: ${d.value}`}>
              <div
                className="w-full bg-violet-500/60 hover:bg-violet-500 rounded-sm transition-all"
                style={{ height: `${Math.max(pct, 2)}%` }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2a2a3d] text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {d.value}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[#555570] text-xs">{data[0]?.date}</span>
        <span className="text-[#555570] text-xs">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) redirect('/dashboard')

  const { tab = 'overview' } = await searchParams
  const admin = createAdminClient()

  // ── Fetch all data in parallel ──
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: { users: authUsers = [] } },
    { data: allSubs = [] },
    { data: allPosts = [] },
    { data: waitlist = [] },
    { data: failedJobs = [] },
    { data: allClients = [] },
    { data: allTopicJobs = [] },
    { data: pendingApprovals = [] },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('subscriptions').select('*'),
    admin.from('posts').select('id, created_by, client_id, title, word_count, wp_post_url, wp_status, created_at').order('created_at', { ascending: false }),
    admin.from('waitlist').select('*').order('created_at', { ascending: false }),
    admin.from('topic_queue').select('id, topic, error_message, client_id, created_at').eq('status', 'failed').order('created_at', { ascending: false }).limit(50),
    admin.from('clients').select('id, name, industry, website, wp_url, wp_username, wp_app_password, logo_url, primary_color, created_by, created_at').order('created_at', { ascending: false }),
    admin.from('topic_queue').select('id, status, client_id, created_at').order('created_at', { ascending: false }).limit(5000),
    admin.from('user_approvals').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
  ])

  // ── Derived data ──
  const subMap = Object.fromEntries((allSubs ?? []).map((s: Record<string, unknown>) => [s.user_id as string, s]))

  const postsThisMonth = (allPosts ?? []).filter((p: Record<string, unknown>) => (p.created_at as string) >= monthStart)
  const postsByUser: Record<string, { month: number; total: number; words: number }> = {}
  for (const p of allPosts ?? []) {
    const uid = p.created_by as string
    if (!uid) continue
    if (!postsByUser[uid]) postsByUser[uid] = { month: 0, total: 0, words: 0 }
    postsByUser[uid].total++
    postsByUser[uid].words += (p.word_count as number) ?? 0
    if ((p.created_at as string) >= monthStart) postsByUser[uid].month++
  }

  const clientsPerUser: Record<string, number> = {}
  for (const c of allClients ?? []) {
    const uid = c.created_by as string
    if (!uid) continue
    clientsPerUser[uid] = (clientsPerUser[uid] ?? 0) + 1
  }

  const adminUsers = authUsers.map(u => {
    const sub = subMap[u.id] ?? {}
    const stats = postsByUser[u.id] ?? { month: 0, total: 0, words: 0 }
    const meta = (u as any).user_metadata ?? {}
    return {
      id: u.id,
      email: u.email ?? '',
      full_name: (meta.full_name as string) ?? null,
      agency_name: (meta.agency_name as string) ?? null,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      plan: (sub.plan as string) ?? null,
      plan_status: (sub.status as string) ?? null,
      posts_limit: (sub.posts_limit as number) ?? 2,
      sites_limit: (sub.sites_limit as number) ?? 2,
      posts_this_month: stats.month,
      total_posts: stats.total,
      total_words: stats.words,
      banned: !!(u as any).banned_until,
      clients_count: clientsPerUser[u.id] ?? 0,
    }
  })

  // Revenue stats
  const activeSubs = (allSubs ?? []).filter((s: Record<string, unknown>) => s.status === 'active')
  // Use actual billed amount (respects coupons/discounts), fall back to list price if not set
  const mrr = activeSubs.reduce((sum: number, s: Record<string, unknown>) => {
    const actual = s.monthly_amount as number | null
    return sum + (actual && actual > 0 ? actual : (PLAN_PRICE[s.plan as string] ?? 0))
  }, 0)
  const arr = mrr * 12

  const planCounts: Record<string, number> = {}
  for (const s of activeSubs) {
    const p = s.plan as string
    planCounts[p] = (planCounts[p] ?? 0) + 1
  }

  // Posts per day (last 30 days)
  const postDays: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    postDays[d.toISOString().slice(0, 10)] = 0
  }
  for (const p of allPosts ?? []) {
    const day = (p.created_at as string).slice(0, 10)
    if (postDays[day] !== undefined) postDays[day]++
  }
  const postsChartData = Object.entries(postDays).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value,
  }))

  // Signups per day (last 30 days)
  const signupDays: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    signupDays[d.toISOString().slice(0, 10)] = 0
  }
  for (const u of authUsers) {
    const day = u.created_at.slice(0, 10)
    if (signupDays[day] !== undefined) signupDays[day]++
  }
  const signupsChartData = Object.entries(signupDays).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value,
  }))

  const totalWords = (allPosts ?? []).reduce((sum: number, p: Record<string, unknown>) => sum + ((p.word_count as number) ?? 0), 0)

  // New users in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const newUsers = authUsers.filter(u => u.created_at >= sevenDaysAgo)

  // Per-client post stats from allPosts
  const clientPostStats: Record<string, { total: number; published: number; words: number; lastPost: string | null }> = {}
  for (const p of allPosts ?? []) {
    const cid = p.client_id as string | null
    if (!cid) continue
    if (!clientPostStats[cid]) clientPostStats[cid] = { total: 0, published: 0, words: 0, lastPost: null }
    clientPostStats[cid].total++
    clientPostStats[cid].words += (p.word_count as number) ?? 0
    if ((p.wp_status as string) === 'publish') clientPostStats[cid].published++
    if (!clientPostStats[cid].lastPost || (p.created_at as string) > clientPostStats[cid].lastPost!) {
      clientPostStats[cid].lastPost = p.created_at as string
    }
  }

  // Email → user map for clients
  const userEmailMap: Record<string, string> = {}
  for (const u of authUsers) userEmailMap[u.id] = u.email ?? ''

  // User ID → metadata map for pending approvals
  const userMetadataMap: Record<string, { agency_name: string | null; full_name: string | null }> = {}
  for (const u of authUsers) {
    const meta = (u as any).user_metadata ?? {}
    userMetadataMap[u.id] = {
      agency_name: (meta.agency_name as string) ?? null,
      full_name: (meta.full_name as string) ?? null,
    }
  }

  // ── Leads pipeline (waitlist + users merged) ──
  const authEmailMap = new Map(authUsers.map(u => [u.email ?? '', u]))
  const waitlistEmails = new Set((waitlist ?? []).map((w: Record<string, unknown>) => w.email as string))

  type LeadStatus = 'waitlisted' | 'free' | 'paying'
  type Lead = {
    email: string
    agency_name: string | null
    full_name: string | null
    sites_managed: string | null
    joined_at: string
    status: LeadStatus
    plan: string | null
    source: 'waitlist' | 'direct'
  }

  const leadsMap = new Map<string, Lead>()

  // Add waitlist entries first
  for (const w of waitlist ?? []) {
    const email = w.email as string
    const authUser = authEmailMap.get(email)
    const sub = authUser ? (subMap[authUser.id] ?? {}) : {}
    const plan = (sub.plan as string) ?? null
    const isPaying = plan && plan !== 'free' && (sub.status as string) === 'active'
    const meta = authUser ? ((authUser as any).user_metadata ?? {}) : {}
    leadsMap.set(email, {
      email,
      agency_name: (w.agency_name as string) ?? (meta.agency_name as string) ?? null,
      full_name: (meta.full_name as string) ?? null,
      sites_managed: (w.sites_managed as string) ?? null,
      joined_at: w.created_at as string,
      status: authUser ? (isPaying ? 'paying' : 'free') : 'waitlisted',
      plan,
      source: 'waitlist',
    })
  }

  // Add registered users not on waitlist
  for (const u of authUsers) {
    const email = u.email ?? ''
    if (leadsMap.has(email)) continue
    const sub = subMap[u.id] ?? {}
    const plan = (sub.plan as string) ?? null
    const isPaying = plan && plan !== 'free' && (sub.status as string) === 'active'
    const meta = (u as any).user_metadata ?? {}
    leadsMap.set(email, {
      email,
      agency_name: (meta.agency_name as string) ?? null,
      full_name: (meta.full_name as string) ?? null,
      sites_managed: null,
      joined_at: u.created_at,
      status: isPaying ? 'paying' : 'free',
      plan,
      source: 'direct',
    })
  }

  const leads = Array.from(leadsMap.values()).sort((a, b) => b.joined_at.localeCompare(a.joined_at))
  const leadCounts = { waitlisted: 0, free: 0, paying: 0 }
  for (const l of leads) leadCounts[l.status]++

  // ── Usage tab computed stats ──
  const clientOwnerMap: Record<string, string> = {}
  for (const c of allClients ?? []) clientOwnerMap[c.id as string] = c.created_by as string

  // Autoblog platform stats
  const totalAutoblogJobs = (allTopicJobs ?? []).length
  const completedAutoblog = (allTopicJobs ?? []).filter((j: Record<string, unknown>) => (j.status as string) === 'done').length
  const pendingAutoblog = (allTopicJobs ?? []).filter((j: Record<string, unknown>) => (j.status as string) === 'pending' || (j.status as string) === 'processing').length
  const autoblogSuccessRate = totalAutoblogJobs > 0 ? Math.round((completedAutoblog / totalAutoblogJobs) * 100) : 0

  // Per-user autoblog counts (via client → owner map)
  const autoblogByUser: Record<string, { total: number; completed: number; failed: number }> = {}
  for (const job of allTopicJobs ?? []) {
    const j = job as Record<string, unknown>
    const uid = clientOwnerMap[j.client_id as string]
    if (!uid) continue
    if (!autoblogByUser[uid]) autoblogByUser[uid] = { total: 0, completed: 0, failed: 0 }
    autoblogByUser[uid].total++
    if (j.status === 'done') autoblogByUser[uid].completed++
    if (j.status === 'failed') autoblogByUser[uid].failed++
  }

  // WordPress publish stats
  const publishedPostsCount = (allPosts ?? []).filter((p: Record<string, unknown>) => p.wp_status === 'publish').length
  const wpPublishRate = (allPosts?.length ?? 0) > 0 ? Math.round((publishedPostsCount / (allPosts?.length ?? 1)) * 100) : 0
  const draftPostsCount = (allPosts ?? []).filter((p: Record<string, unknown>) => p.wp_status === 'draft').length
  const unpublishedCount = (allPosts?.length ?? 0) - publishedPostsCount - draftPostsCount

  // Cost estimation (~$0.035/post for Claude Sonnet)
  const EST_COST = 0.035
  const estCostMonth = postsThisMonth.length * EST_COST
  const estCostTotal = (allPosts?.length ?? 0) * EST_COST
  const totalWordsThisMonth = postsThisMonth.reduce((s: number, p: Record<string, unknown>) => s + ((p.word_count as number) ?? 0), 0)
  const avgWordsPerPost = (allPosts?.length ?? 0) > 0 ? Math.round(totalWords / (allPosts?.length ?? 1)) : 0

  // Words per day (last 30 days)
  const wordDays: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    wordDays[d.toISOString().slice(0, 10)] = 0
  }
  for (const p of allPosts ?? []) {
    const day = (p.created_at as string).slice(0, 10)
    if (wordDays[day] !== undefined) wordDays[day] += (p.word_count as number) ?? 0
  }
  const wordsChartData = Object.entries(wordDays).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value,
  }))

  // Per-plan usage stats
  const planUsage: Record<string, { users: number; posts: number; words: number }> = {}
  for (const u of adminUsers) {
    const plan = (u.plan && (subMap[u.id] as Record<string, unknown>)?.status === 'active') ? u.plan : 'free'
    if (!planUsage[plan]) planUsage[plan] = { users: 0, posts: 0, words: 0 }
    planUsage[plan].users++
    planUsage[plan].posts += u.total_posts
    planUsage[plan].words += u.total_words
  }

  // Users ranked by usage
  const userUsageRanked = adminUsers
    .filter(u => u.total_posts > 0)
    .sort((a, b) => b.posts_this_month - a.posts_this_month || b.total_posts - a.total_posts)

  // Top clients by content output
  type ClientWithStats = {
    id: string; name: string; created_by: string; logo_url: string | null
    primary_color: string | null; wp_url: string | null; wp_username: string | null; wp_app_password: string | null
    stats: { total: number; published: number; words: number; lastPost: string | null }
  }
  const topClientsByOutput: ClientWithStats[] = (allClients ?? [])
    .map((c: Record<string, unknown>) => ({
      id: c.id as string, name: c.name as string, created_by: c.created_by as string,
      logo_url: c.logo_url as string | null, primary_color: c.primary_color as string | null,
      wp_url: c.wp_url as string | null, wp_username: c.wp_username as string | null, wp_app_password: c.wp_app_password as string | null,
      stats: clientPostStats[c.id as string] ?? { total: 0, published: 0, words: 0, lastPost: null },
    }))
    .filter((c: ClientWithStats) => c.stats.total > 0)
    .sort((a: ClientWithStats, b: ClientWithStats) => b.stats.total - a.stats.total)

  const pendingCount = (pendingApprovals ?? []).length
  const TABS = [
    { key: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { key: 'approvals', label: `Approvals (${pendingCount})`, icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { key: 'users', label: `Users (${authUsers.length})`, icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'clients', label: `Clients (${allClients?.length ?? 0})`, icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'integrations', label: 'Integrations', icon: <Link2 className="w-3.5 h-3.5" /> },
    { key: 'leads', label: `Leads (${leads.length})`, icon: <UserPlus className="w-3.5 h-3.5" /> },
    { key: 'usage', label: 'Usage & APIs', icon: <Cpu className="w-3.5 h-3.5" /> },
    { key: 'health', label: `Health${(failedJobs?.length ?? 0) > 0 ? ` (${failedJobs?.length})` : ''}`, icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { key: 'discord', label: 'Discord', icon: <Zap className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <nav className="border-b border-[#2a2a3d] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <span className="text-[#2a2a3d]">·</span>
            <span className="text-violet-400 text-xs font-bold uppercase tracking-widest">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-[#8888a8] hover:text-white text-xs transition-colors">← Dashboard</a>
            <span className="text-[#8888a8] text-xs">{user.email}</span>
            <form action={logout}>
              <button type="submit" className="text-[#8888a8] hover:text-white text-xs transition-colors">Sign out</button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-[#8888a8] text-sm">Platform analytics, user management, and health monitoring.</p>
          </div>
          <div className="flex items-center gap-3">
            <SyncAccountButton />
            <div className="flex items-center gap-2 text-xs text-[#555570]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live data
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#2a2a3d] mb-8">
          {TABS.map(t => (
            <a
              key={t.key}
              href={`/admin?tab=${t.key}`}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                tab === t.key
                  ? 'text-white border-b-2 border-violet-500'
                  : 'text-[#8888a8] hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </a>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Users', value: authUsers.length, icon: <Users className="w-4 h-4 text-violet-400" />, sub: `${activeSubs.length} paid` },
                { label: 'MRR', value: `$${mrr.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-emerald-400" />, sub: `$${arr.toLocaleString()} ARR` },
                { label: 'Posts All Time', value: (allPosts?.length ?? 0).toLocaleString(), icon: <FileText className="w-4 h-4 text-cyan-400" />, sub: `${postsThisMonth.length} this month` },
                { label: 'Words Generated', value: `${(totalWords / 1000).toFixed(0)}k`, icon: <BarChart2 className="w-4 h-4 text-yellow-400" />, sub: 'all time' },
                { label: 'Waitlist', value: waitlist?.length ?? 0, icon: <Mail className="w-4 h-4 text-pink-400" />, sub: 'signups' },
                { label: 'Failed Jobs', value: failedJobs?.length ?? 0, icon: <AlertTriangle className="w-4 h-4 text-red-400" />, sub: 'autoblog errors' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[#8888a8] text-xs mb-1">{stat.icon} {stat.label}</div>
                  <div className="text-white font-bold text-xl leading-none">{stat.value}</div>
                  <div className="text-[#555570] text-xs mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
                <BarChart data={postsChartData} label="Posts generated — last 30 days" />
              </div>
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
                <BarChart data={signupsChartData} label="New signups — last 30 days" />
              </div>
            </div>

            {/* Revenue by plan */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-white font-bold text-sm">Revenue by Plan</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['starter', 'growth', 'agency', 'agency_max'] as const).map(p => {
                  const count = planCounts[p] ?? 0
                  const rev = count * PLAN_PRICE[p]
                  return (
                    <div key={p} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4">
                      <div className="text-[#8888a8] text-xs capitalize mb-1">{p.replace('_', ' ')}</div>
                      <div className="text-white text-2xl font-black">{count}</div>
                      <div className="text-emerald-400 text-xs font-semibold mt-0.5">${rev}/mo</div>
                      <div className="text-[#555570] text-xs">${PLAN_PRICE[p]}/seat</div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-[#2a2a3d] flex items-center justify-between">
                <span className="text-[#8888a8] text-sm">Total MRR</span>
                <span className="text-emerald-400 text-2xl font-black">${mrr.toLocaleString()}</span>
              </div>
            </div>

            {/* New users this week */}
            {newUsers.length > 0 && (
              <div className="bg-[#12121a] border border-violet-500/30 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-violet-400" />
                  <h2 className="text-white font-bold text-sm">New Signups — Last 7 Days</h2>
                  <span className="ml-auto text-xs text-violet-400 font-bold bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">{newUsers.length} new</span>
                </div>
                <div className="divide-y divide-[#2a2a3d]">
                  {newUsers.map(u => {
                    const sub = subMap[u.id] ?? {}
                    const joined = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                    return (
                      <div key={u.id} className="px-5 py-3 flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
                          {(u.email ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{u.email}</div>
                          <div className="text-[#555570] text-xs">{joined}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {(sub.plan as string) && (sub.plan as string) !== 'free' ? (
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full capitalize">{sub.plan as string}</span>
                          ) : (
                            <>
                              <span className="text-xs text-[#555570] bg-[#1a1a26] border border-[#2a2a3d] px-2 py-0.5 rounded-full">Free</span>
                              <UpsellButton
                                userId={u.id}
                                email={u.email ?? ''}
                                postsUsed={postsByUser[u.id]?.total ?? 0}
                                postsLimit={(sub.posts_limit as number) ?? 2}
                              />
                            </>
                          )}
                          <InviteButton email={u.email ?? ''} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recent posts */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <h2 className="text-white font-bold text-sm">Recent Posts (platform-wide)</h2>
              </div>
              <div className="divide-y divide-[#2a2a3d]">
                {(allPosts ?? []).slice(0, 10).map((p: Record<string, unknown>) => (
                  <div key={p.id as string} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="text-[#555570] text-xs font-mono">{(p.created_by as string)?.slice(0, 8)}…</div>
                    <div className="flex-1 text-[#c8c8d8] text-xs truncate">{(p.id as string)}</div>
                    <div className="text-[#8888a8] text-xs shrink-0">{(p.word_count as number)?.toLocaleString()} words</div>
                    <div className="text-[#555570] text-xs shrink-0">
                      {new Date(p.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── APPROVALS ── */}
        {tab === 'approvals' && (
          <div className="space-y-6">
            {!pendingApprovals?.length ? (
              <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-16 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-emerald-400 text-sm font-semibold">All caught up</p>
                <p className="text-[#8888a8] text-xs mt-1">No pending signup approvals</p>
              </div>
            ) : (
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-violet-400" />
                  <h2 className="text-white font-bold text-sm">Pending Approvals</h2>
                  <span className="ml-auto text-xs text-violet-400 font-bold bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">{pendingCount} pending</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2a2a3d]">
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-5 py-3">Email</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Agency Name</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Signed Up</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pendingApprovals ?? []).map((approval: Record<string, unknown>, i: number) => {
                        const userId = approval.user_id as string
                        const email = approval.email as string
                        const createdAt = approval.created_at as string
                        const meta = userMetadataMap[userId] ?? { agency_name: null, full_name: null }
                        return (
                          <tr key={userId} className={`${i % 2 === 0 ? '' : 'bg-[#0d0d14]'} hover:bg-[#1a1a26]/50 transition-colors`}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
                                  {email.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-white text-sm font-medium truncate">{email}</div>
                                  {meta.full_name && <div className="text-[#555570] text-xs">{meta.full_name}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="text-[#8888a8] text-sm">{meta.agency_name ?? '—'}</span>
                            </td>
                            <td className="px-4 py-3 text-[#555570] text-xs">
                              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </td>
                            <td className="px-4 py-3">
                              <ApprovalActions userId={userId} email={email} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="space-y-6">
            <DirectInviteForm />
            <UserTable users={adminUsers} />
          </div>
        )}

        {/* ── CLIENTS ── */}
        {tab === 'clients' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[#8888a8] text-sm">{allClients?.length ?? 0} clients across {authUsers.length} users</p>
            </div>
            {!(allClients?.length) ? (
              <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-16 text-center">
                <Building2 className="w-8 h-8 text-[#2a2a3d] mx-auto mb-3" />
                <p className="text-[#8888a8] text-sm">No clients yet</p>
              </div>
            ) : (
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2a2a3d]">
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-5 py-3">Client</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Owner</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Posts</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Published</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Words</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Last Post</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">WP</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {(allClients ?? []).map((c: Record<string, unknown>, i: number) => {
                        const cid = c.id as string
                        const stats = clientPostStats[cid] ?? { total: 0, published: 0, words: 0, lastPost: null }
                        const hasWp = !!(c.wp_url && c.wp_username && c.wp_app_password)
                        const ownerEmail = userEmailMap[c.created_by as string] ?? '—'
                        return (
                          <tr key={cid} className={`${i % 2 === 0 ? '' : 'bg-[#0d0d14]'} hover:bg-[#1a1a26]/50 transition-colors`}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                {c.logo_url ? (
                                  <img src={c.logo_url as string} alt={c.name as string} className="w-7 h-7 rounded-lg object-contain bg-white/5 border border-[#2a2a3d] p-0.5 shrink-0" />
                                ) : (
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                                    style={{ background: (c.primary_color as string) ?? '#6d28d9' }}>
                                    {(c.name as string).charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="text-white text-sm font-medium truncate">{c.name as string}</div>
                                  {c.industry ? <div className="text-[#555570] text-xs">{c.industry as string}</div> : null}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="text-[#8888a8] text-xs truncate max-w-[160px] block">{ownerEmail}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-white font-semibold text-sm">{stats.total}</span>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className={`text-sm font-semibold ${stats.published > 0 ? 'text-emerald-400' : 'text-[#555570]'}`}>{stats.published}</span>
                            </td>
                            <td className="px-4 py-3 text-[#8888a8] text-sm hidden lg:table-cell">
                              {stats.words >= 1000 ? `${(stats.words / 1000).toFixed(1)}k` : stats.words}
                            </td>
                            <td className="px-4 py-3 text-[#555570] text-xs hidden lg:table-cell">
                              {stats.lastPost ? new Date(stats.lastPost).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border w-fit ${
                                hasWp
                                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                  : 'text-[#555570] bg-[#1a1a26] border-[#2a2a3d]'
                              }`}>
                                <Wifi className="w-2.5 h-2.5" />
                                {hasWp ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <a href={`/clients/${cid}`}
                                className="text-xs text-violet-400 hover:text-violet-300 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                                Manage →
                              </a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {tab === 'integrations' && (
          <AdminIntegrationsPanel
            clients={(allClients ?? []).map((c: Record<string, unknown>) => ({
              id: c.id as string,
              name: c.name as string,
              ayrshare_profile_key: (c.ayrshare_profile_key as string | null) ?? null,
            }))}
          />
        )}

        {/* ── LEADS ── */}
        {tab === 'leads' && (
          <div className="space-y-5">
            {/* Stage summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#12121a] border border-orange-500/20 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                  <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wide">Waitlisted</span>
                </div>
                <div className="text-orange-400 text-2xl font-black">{leadCounts.waitlisted}</div>
                <div className="text-[#555570] text-xs mt-0.5">not yet signed up</div>
              </div>
              <div className="bg-[#12121a] border border-violet-500/20 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                  <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wide">Free Account</span>
                </div>
                <div className="text-violet-400 text-2xl font-black">{leadCounts.free}</div>
                <div className="text-[#555570] text-xs mt-0.5">signed up, not paying</div>
              </div>
              <div className="bg-[#12121a] border border-emerald-500/20 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wide">Paying</span>
                </div>
                <div className="text-emerald-400 text-2xl font-black">{leadCounts.paying}</div>
                <div className="text-[#555570] text-xs mt-0.5">active subscription</div>
              </div>
            </div>

            {/* Invite form */}
            <DirectInviteForm />

            {/* Combined leads table */}
            {!leads.length ? (
              <div className="bg-[#12121a] border border-[#2a2a3d] border-dashed rounded-2xl py-16 text-center">
                <Mail className="w-8 h-8 text-[#2a2a3d] mx-auto mb-3" />
                <p className="text-[#8888a8] text-sm">No leads yet</p>
              </div>
            ) : (
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2a2a3d]">
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-5 py-3">Stage</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Contact</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Agency</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Source</th>
                        <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, i) => {
                        const statusConfig = {
                          waitlisted: { label: 'Waitlisted', dot: 'bg-orange-400', badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                          free:       { label: 'Free Account', dot: 'bg-violet-400', badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                          paying:     { label: lead.plan ? lead.plan.replace('_', ' ') : 'Paying', dot: 'bg-emerald-400', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                        }[lead.status]
                        return (
                          <tr key={lead.email} className={`${i % 2 === 0 ? '' : 'bg-[#0d0d14]'} hover:bg-[#1a1a26]/50 transition-colors`}>
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusConfig.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-white text-sm font-medium">{lead.email}</div>
                              {lead.full_name && <div className="text-[#555570] text-xs mt-0.5">{lead.full_name}</div>}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="text-[#8888a8] text-sm">{lead.agency_name ?? '—'}</span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                lead.source === 'waitlist'
                                  ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                                  : 'text-[#8888a8] bg-[#1a1a26] border-[#2a2a3d]'
                              }`}>
                                {lead.source === 'waitlist' ? 'Waitlist' : 'Direct'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#555570] text-xs hidden sm:table-cell">
                              {new Date(lead.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {lead.status === 'waitlisted' && (
                                  <WaitlistActions email={lead.email} agencyName={lead.agency_name} />
                                )}
                                {lead.status === 'free' && (() => {
                                  const u = authEmailMap.get(lead.email)
                                  if (!u) return null
                                  const sub = subMap[u.id] ?? {}
                                  return (
                                    <UpsellButton
                                      userId={u.id}
                                      email={lead.email}
                                      postsUsed={postsByUser[u.id]?.total ?? 0}
                                      postsLimit={(sub.posts_limit as number) ?? 2}
                                    />
                                  )
                                })()}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── USAGE & APIs ── */}
        {tab === 'usage' && (
          <div className="space-y-8">

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Est. API Cost / mo', value: `$${estCostMonth.toFixed(2)}`, icon: <Cpu className="w-4 h-4 text-violet-400" />, sub: `$${estCostTotal.toFixed(2)} all time`, color: 'text-violet-400' },
                { label: 'Posts This Month', value: postsThisMonth.length, icon: <FileText className="w-4 h-4 text-cyan-400" />, sub: `${(allPosts?.length ?? 0)} all time`, color: 'text-white' },
                { label: 'Words This Month', value: `${(totalWordsThisMonth / 1000).toFixed(1)}k`, icon: <BarChart2 className="w-4 h-4 text-yellow-400" />, sub: `${(totalWords / 1000).toFixed(0)}k all time`, color: 'text-white' },
                { label: 'Avg Post Length', value: `${avgWordsPerPost.toLocaleString()}`, icon: <FileText className="w-4 h-4 text-orange-400" />, sub: 'words per post', color: 'text-white' },
                { label: 'WP Publish Rate', value: `${wpPublishRate}%`, icon: <Globe className="w-4 h-4 text-emerald-400" />, sub: `${publishedPostsCount} published`, color: wpPublishRate >= 50 ? 'text-emerald-400' : 'text-yellow-400' },
                { label: 'Autoblog Success', value: `${autoblogSuccessRate}%`, icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, sub: `${completedAutoblog}/${totalAutoblogJobs} jobs`, color: autoblogSuccessRate >= 80 ? 'text-emerald-400' : 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[#8888a8] text-xs mb-1">{s.icon} {s.label}</div>
                  <div className={`font-bold text-xl leading-none ${s.color}`}>{s.value}</div>
                  <div className="text-[#555570] text-xs mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-[#3a3a5a] text-xs">Cost estimate: ~$0.035/post based on Claude Sonnet 4 pricing ($3/M input + $15/M output tokens, ~1,000 in / ~2,500 out per generation). Actual costs may vary.</p>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
                <BarChart data={wordsChartData} label="Words generated — last 30 days" />
              </div>
              <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
                <BarChart data={postsChartData} label="Posts generated — last 30 days" />
              </div>
            </div>

            {/* Per-plan usage breakdown */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                <Server className="w-4 h-4 text-violet-400" />
                <h2 className="text-white font-bold text-sm">Usage by Plan</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a3d]">
                      {['Plan', 'Users', 'Total Posts', 'Avg Posts/User', 'Total Words', 'Est. API Cost', 'Avg Words/User'].map(h => (
                        <th key={h} className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(['agency_max', 'agency', 'growth', 'starter', 'free'] as const).map(plan => {
                      const d = planUsage[plan]
                      if (!d) return null
                      const avgPosts = d.users > 0 ? (d.posts / d.users).toFixed(1) : '0'
                      const avgWords = d.users > 0 ? Math.round(d.words / d.users).toLocaleString() : '0'
                      const cost = (d.posts * EST_COST).toFixed(2)
                      const planLabel = plan.replace('_', ' ')
                      const planColor = plan === 'free' ? 'text-[#555570]' : plan === 'starter' ? 'text-blue-400' : plan === 'growth' ? 'text-violet-400' : plan === 'agency' ? 'text-cyan-400' : 'text-emerald-400'
                      return (
                        <tr key={plan} className="border-b border-[#1a1a26] hover:bg-[#1a1a26]/50 transition-colors">
                          <td className="px-5 py-3"><span className={`capitalize font-semibold text-sm ${planColor}`}>{planLabel}</span></td>
                          <td className="px-5 py-3 text-white text-sm font-bold">{d.users}</td>
                          <td className="px-5 py-3 text-white text-sm">{d.posts.toLocaleString()}</td>
                          <td className="px-5 py-3 text-[#8888a8] text-sm">{avgPosts}</td>
                          <td className="px-5 py-3 text-[#8888a8] text-sm">{(d.words / 1000).toFixed(0)}k</td>
                          <td className="px-5 py-3 text-violet-400 text-sm font-semibold">${cost}</td>
                          <td className="px-5 py-3 text-[#8888a8] text-sm">{avgWords}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API feature breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Zap className="w-5 h-5 text-violet-400" />, bg: 'bg-violet-600/10 border-violet-500/20',
                  label: 'AI Generations', value: (allPosts?.length ?? 0).toLocaleString(),
                  sub1: `${postsThisMonth.length} this month`, sub2: `~${(totalWords / 1000).toFixed(0)}k words total`,
                },
                {
                  icon: <Globe className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-600/10 border-emerald-500/20',
                  label: 'WP Publishes', value: publishedPostsCount.toLocaleString(),
                  sub1: `${draftPostsCount} as draft`, sub2: `${wpPublishRate}% publish rate`,
                },
                {
                  icon: <Activity className="w-5 h-5 text-cyan-400" />, bg: 'bg-cyan-600/10 border-cyan-500/20',
                  label: 'Autoblog Completed', value: completedAutoblog.toLocaleString(),
                  sub1: `${pendingAutoblog} in queue`, sub2: `${autoblogSuccessRate}% success rate`,
                },
                {
                  icon: <AlertTriangle className="w-5 h-5 text-red-400" />, bg: 'bg-red-600/10 border-red-500/20',
                  label: 'Autoblog Failed', value: (failedJobs?.length ?? 0).toLocaleString(),
                  sub1: `${totalAutoblogJobs} total jobs`, sub2: failedJobs?.length ? 'See Health tab' : 'All clean ✓',
                },
              ].map(c => (
                <div key={c.label} className={`rounded-2xl border p-5 ${c.bg}`}>
                  <div className="mb-3">{c.icon}</div>
                  <div className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1">{c.label}</div>
                  <div className="text-white text-3xl font-black mb-2">{c.value}</div>
                  <div className="text-[#555570] text-xs">{c.sub1}</div>
                  <div className="text-[#555570] text-xs">{c.sub2}</div>
                </div>
              ))}
            </div>

            {/* Top Users by API Usage */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                <h2 className="text-white font-bold text-sm">Top Users by API Usage</h2>
                <span className="ml-auto text-xs text-[#555570]">Sorted by posts this month</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a3d]">
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-5 py-3">User</th>
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Plan</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Posts/mo</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden sm:table-cell">All Posts</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Words/mo</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">WP Published</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Autoblog</th>
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Est. Cost</th>
                      <th className="px-4 py-3 hidden xl:table-cell" />
                    </tr>
                  </thead>
                  <tbody>
                    {userUsageRanked.slice(0, 30).map((u, i) => {
                      const limitPct = u.posts_limit > 0 ? Math.min((u.posts_this_month / u.posts_limit) * 100, 100) : 0
                      const limitColor = limitPct >= 90 ? 'bg-red-500' : limitPct >= 70 ? 'bg-yellow-500' : 'bg-violet-500'
                      const ab = autoblogByUser[u.id]
                      const wordsThisMonthForUser = postsThisMonth
                        .filter((p: Record<string, unknown>) => p.created_by === u.id)
                        .reduce((s: number, p: Record<string, unknown>) => s + ((p.word_count as number) ?? 0), 0)
                      const wpPubForUser = (allPosts ?? []).filter((p: Record<string, unknown>) => p.created_by === u.id && p.wp_status === 'publish').length
                      const estCostUser = (u.total_posts * EST_COST).toFixed(2)
                      return (
                        <tr key={u.id} className={`${i % 2 === 0 ? '' : 'bg-[#0d0d14]'} hover:bg-[#1a1a26]/50 transition-colors`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
                                {u.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-white text-xs font-medium truncate max-w-[160px]">{u.email}</div>
                                {u.agency_name && <div className="text-[#555570] text-xs">{u.agency_name}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${
                              !u.plan || u.plan_status !== 'active' ? 'text-[#555570] bg-[#1a1a26] border-[#2a2a3d]' :
                              u.plan === 'starter' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                              u.plan === 'growth' ? 'text-violet-400 bg-violet-500/10 border-violet-500/20' :
                              u.plan === 'agency' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                              'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            }`}>{u.plan && u.plan_status === 'active' ? u.plan.replace('_', ' ') : 'free'}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="text-white font-bold text-sm">{u.posts_this_month}</div>
                            <div className="w-full h-1 bg-[#1a1a26] rounded-full mt-1 overflow-hidden max-w-[48px] ml-auto">
                              <div className={`h-full rounded-full ${limitColor}`} style={{ width: `${limitPct}%` }} />
                            </div>
                            <div className="text-[#555570] text-xs">{u.posts_this_month}/{u.posts_limit}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-[#8888a8] text-sm hidden sm:table-cell">{u.total_posts}</td>
                          <td className="px-4 py-3 text-right text-[#8888a8] text-sm hidden md:table-cell">{(wordsThisMonthForUser / 1000).toFixed(1)}k</td>
                          <td className="px-4 py-3 text-right hidden lg:table-cell">
                            <span className={wpPubForUser > 0 ? 'text-emerald-400 text-sm font-semibold' : 'text-[#555570] text-sm'}>{wpPubForUser}</span>
                          </td>
                          <td className="px-4 py-3 text-right hidden lg:table-cell">
                            {ab ? (
                              <div>
                                <span className="text-white text-sm font-semibold">{ab.completed}</span>
                                {ab.failed > 0 && <span className="text-red-400 text-xs ml-1">({ab.failed} fail)</span>}
                              </div>
                            ) : <span className="text-[#555570] text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3 text-violet-400 text-xs font-semibold hidden xl:table-cell">${estCostUser}</td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            <a href={`/admin?tab=users`} className="text-xs text-[#555570] hover:text-violet-400 transition-colors">View →</a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Clients by Content Output */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-white font-bold text-sm">Top Clients by Content Output</h2>
                <span className="ml-auto text-xs text-[#555570]">{topClientsByOutput.length} active clients</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a3d]">
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-5 py-3">Client</th>
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Owner</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3">Posts</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Published</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Pub Rate</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Words</th>
                      <th className="text-right text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Avg Length</th>
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Last Active</th>
                      <th className="text-left text-[#8888a8] text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden xl:table-cell">WP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClientsByOutput.map((c, i) => {
                      const pubRate = c.stats.total > 0 ? Math.round((c.stats.published / c.stats.total) * 100) : 0
                      const avgLen = c.stats.total > 0 ? Math.round(c.stats.words / c.stats.total) : 0
                      const hasWp = !!(c.wp_url && c.wp_username && c.wp_app_password)
                      const ownerEmail = userEmailMap[c.created_by] ?? '—'
                      return (
                        <tr key={c.id} className={`${i % 2 === 0 ? '' : 'bg-[#0d0d14]'} hover:bg-[#1a1a26]/50 transition-colors`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              {c.logo_url ? (
                                <img src={c.logo_url} alt={c.name} className="w-7 h-7 rounded-lg object-contain bg-white/5 border border-[#2a2a3d] p-0.5 shrink-0" />
                              ) : (
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                                  style={{ background: c.primary_color ?? '#6d28d9' }}>
                                  {c.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-white text-sm font-medium truncate max-w-[140px]">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-[#8888a8] text-xs truncate max-w-[140px] block">{ownerEmail}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-white font-bold text-sm">{c.stats.total}</td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell">
                            <span className={c.stats.published > 0 ? 'text-emerald-400 font-semibold text-sm' : 'text-[#555570] text-sm'}>{c.stats.published}</span>
                          </td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-12 h-1.5 bg-[#2a2a3d] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${pubRate >= 80 ? 'bg-emerald-500' : pubRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pubRate}%` }} />
                              </div>
                              <span className="text-[#8888a8] text-xs w-8 text-right">{pubRate}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-[#8888a8] text-sm hidden lg:table-cell">
                            {c.stats.words >= 1000 ? `${(c.stats.words / 1000).toFixed(1)}k` : c.stats.words}
                          </td>
                          <td className="px-4 py-3 text-right text-[#8888a8] text-sm hidden lg:table-cell">{avgLen.toLocaleString()} w</td>
                          <td className="px-4 py-3 text-[#555570] text-xs hidden xl:table-cell">
                            {c.stats.lastPost ? new Date(c.stats.lastPost).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${hasWp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-[#555570] bg-[#1a1a26] border-[#2a2a3d]'}`}>
                              {hasWp ? '✓ Connected' : 'No WP'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {topClientsByOutput.length === 0 && (
                  <div className="py-12 text-center">
                    <Building2 className="w-8 h-8 text-[#2a2a3d] mx-auto mb-3" />
                    <p className="text-[#8888a8] text-sm">No client posts yet</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ── HEALTH ── */}
        {tab === 'health' && (
          <div className="space-y-6">
            {/* Platform health stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Failed Autoblog Jobs', value: failedJobs?.length ?? 0, color: (failedJobs?.length ?? 0) > 0 ? 'text-red-400' : 'text-emerald-400' },
                { label: 'Total Posts', value: (allPosts?.length ?? 0).toLocaleString(), color: 'text-white' },
                { label: 'Active Users (30d)', value: authUsers.filter(u => u.last_sign_in_at && u.last_sign_in_at >= thirtyDaysAgo).length, color: 'text-emerald-400' },
                { label: 'Posts This Month', value: postsThisMonth.length, color: 'text-white' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-3">
                  <div className="text-[#8888a8] text-xs mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Failed jobs */}
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="text-white font-bold text-sm">Failed Autoblog Jobs</h2>
                <span className="text-xs text-[#8888a8] ml-auto">Last 50 failures</span>
              </div>
              {!failedJobs?.length ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <p className="text-emerald-400 text-sm font-semibold">No failed jobs</p>
                  <p className="text-[#555570] text-xs mt-1">All autoblog jobs are running cleanly</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2a2a3d]">
                  {failedJobs.map((job: Record<string, unknown>) => (
                    <div key={job.id as string} className="px-5 py-4 flex items-start gap-4">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{job.topic as string}</div>
                        {!!job.error_message && (
                          <div className="text-red-400 text-xs mt-1 font-mono leading-relaxed">{String(job.error_message)}</div>
                        )}
                      </div>
                      <div className="text-[#555570] text-xs shrink-0">
                        {new Date(job.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* ── DISCORD ── */}
        {tab === 'discord' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-white font-bold text-lg mb-1">Discord Announcements</h2>
              <p className="text-[#8888a8] text-sm">Post release notes directly to the #🎉changelog channel on the Bloggy Discord server.</p>
            </div>
            <DiscordReleaseForm />
          </div>
        )}
      </main>
    </div>
  )
}
