import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart2, Sparkles, TrendingUp, Users, FileText, Zap, ArrowUpRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics — AdDee',
  description: 'Track your ad creative output, brand activity, and performance metrics.',
  robots: { index: false, follow: false },
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isAdmin = user?.email === 'eric@boommedia.us'

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString()

  const [
    { data: clients },
    { data: sub },
    { count: postsThisMonth },
    { count: postsLastMonth },
    { data: wordData },
    { data: recentPosts },
    { data: allPosts },
  ] = await Promise.all([
    isAdmin
      ? supabase.from('clients').select('id, name').order('name')
      : supabase.from('clients').select('id, name').eq('created_by', user.id).order('name'),

    supabase.from('subscriptions').select('plan, status, posts_limit').eq('user_id', user.id).single(),

    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', monthStart),

    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', lastMonthStart).lt('created_at', monthStart),

    supabase.from('posts').select('word_count').eq('created_by', user.id).gte('created_at', monthStart),

    supabase.from('posts').select('title, created_at, client_id').eq('created_by', user.id).order('created_at', { ascending: false }).limit(5),

    supabase.from('posts').select('word_count, created_at').eq('created_by', user.id),
  ])

  const wordsThisMonth = wordData?.reduce((s, p) => s + (p.word_count ?? 0), 0) ?? 0
  const totalWords = allPosts?.reduce((s, p) => s + (p.word_count ?? 0), 0) ?? 0
  const postsLimit = sub?.posts_limit ?? 2
  const currentPlan = (sub?.status === 'active' ? sub?.plan : 'free') ?? 'free'
  const thisMonthCount = postsThisMonth ?? 0
  const lastMonthCount = postsLastMonth ?? 0
  const monthDelta = lastMonthCount > 0 ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100) : null

  const now = new Date()
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const clientMap = Object.fromEntries((clients ?? []).map(c => [c.id, c.name]))

  const COMING_SOON = [
    { icon: TrendingUp, title: 'CTR & Impressions', desc: 'Connect Meta, LinkedIn, and Google Ads to pull click-through rate and impression data per ad.' },
    { icon: BarChart2, title: 'ROAS Tracker', desc: 'Return on ad spend per campaign. See which creatives drive revenue vs. burn budget.' },
    { icon: Zap, title: 'Top Performing Creatives', desc: 'Automatically surface your highest-performing ad variations ranked by CTR and conversions.' },
    { icon: Users, title: 'Audience Insights', desc: 'Age, location, and device breakdown from connected ad platform accounts.' },
    { icon: FileText, title: 'Monthly Performance Reports', desc: 'Auto-generated PDF reports per brand, ready to send to clients each month.' },
  ]

  return (
    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#0a0900', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/analytics" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#84cc16' }}>Analytics</h1>
          <p style={{ color: '#b8a870' }}>Your ad creative output for {monthLabel}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl p-5 border" style={{ background: 'rgba(202,138,4,0.08)', borderColor: 'rgba(202,138,4,0.3)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7a6a40' }}>ADs This Month</div>
            <div className="text-3xl font-black" style={{ color: '#ca8a04' }}>{thisMonthCount}</div>
            <div className="text-sm mt-1" style={{ color: '#b8a870' }}>of {postsLimit} limit</div>
            {monthDelta !== null && (
              <div className={`text-xs mt-2 font-semibold flex items-center gap-1 ${monthDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <ArrowUpRight className={`w-3 h-3 ${monthDelta < 0 ? 'rotate-180' : ''}`} />
                {monthDelta >= 0 ? '+' : ''}{monthDelta}% vs last month
              </div>
            )}
          </div>

          <div className="rounded-xl p-5 border" style={{ background: 'rgba(132,204,22,0.06)', borderColor: 'rgba(132,204,22,0.25)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7a6a40' }}>Words Generated</div>
            <div className="text-3xl font-black" style={{ color: '#84cc16' }}>{wordsThisMonth.toLocaleString()}</div>
            <div className="text-sm mt-1" style={{ color: '#b8a870' }}>this month</div>
            <div className="text-xs mt-2" style={{ color: '#7a6a40' }}>{(totalWords / 1000).toFixed(1)}k all time</div>
          </div>

          <div className="rounded-xl p-5 border" style={{ background: 'rgba(202,138,4,0.08)', borderColor: 'rgba(202,138,4,0.3)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7a6a40' }}>Active Brands</div>
            <div className="text-3xl font-black" style={{ color: '#ca8a04' }}>{clients?.length ?? 0}</div>
            <div className="text-sm mt-1" style={{ color: '#b8a870' }}>on {currentPlan} plan</div>
          </div>

          <div className="rounded-xl p-5 border" style={{ background: 'rgba(132,204,22,0.06)', borderColor: 'rgba(132,204,22,0.25)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7a6a40' }}>Plan Usage</div>
            <div className="text-3xl font-black" style={{ color: '#84cc16' }}>
              {postsLimit > 0 ? Math.round((thisMonthCount / postsLimit) * 100) : 0}%
            </div>
            <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'rgba(132,204,22,0.15)' }}>
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${Math.min(100, postsLimit > 0 ? (thisMonthCount / postsLimit) * 100 : 0)}%`, background: '#84cc16' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Recent ADs */}
          <div className="rounded-2xl border" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(202,138,4,0.2)' }}>
              <h2 className="font-bold text-sm" style={{ color: '#dde4f0' }}>Recent ADs</h2>
              <a href="/brands" className="text-xs font-semibold" style={{ color: '#ca8a04' }}>View all →</a>
            </div>
            {recentPosts && recentPosts.length > 0 ? (
              <ul className="divide-y" style={{ borderColor: 'rgba(202,138,4,0.1)' }}>
                {recentPosts.map((p: any, i: number) => (
                  <li key={i} className="px-5 py-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium leading-snug" style={{ color: '#dde4f0' }}>{p.title || 'Untitled AD'}</div>
                      {p.client_id && clientMap[p.client_id] && (
                        <div className="text-xs mt-0.5" style={{ color: '#7a6a40' }}>{clientMap[p.client_id]}</div>
                      )}
                    </div>
                    <div className="text-xs shrink-0 mt-0.5" style={{ color: '#7a6a40' }}>
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm" style={{ color: '#7a6a40' }}>No ADs generated yet this month.</p>
                <a href="/dashboard" className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-lg" style={{ background: 'rgba(202,138,4,0.15)', color: '#ca8a04' }}>
                  Generate your first AD →
                </a>
              </div>
            )}
          </div>

          {/* Per-brand breakdown */}
          <div className="rounded-2xl border" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(202,138,4,0.2)' }}>
              <h2 className="font-bold text-sm" style={{ color: '#dde4f0' }}>Brands</h2>
            </div>
            {clients && clients.length > 0 ? (
              <ul className="divide-y" style={{ borderColor: 'rgba(202,138,4,0.1)' }}>
                {clients.map((c: any) => (
                  <li key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: 'linear-gradient(135deg, #ca8a04, #84cc16)' }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm" style={{ color: '#dde4f0' }}>{c.name}</span>
                    </div>
                    <a href={`/clients/${c.id}`} className="text-xs font-semibold" style={{ color: '#ca8a04' }}>View →</a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm" style={{ color: '#7a6a40' }}>No brands yet.</p>
                <a href="/brands/new" className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-lg" style={{ background: 'rgba(202,138,4,0.15)', color: '#ca8a04' }}>
                  Add your first brand →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2" style={{ color: '#dde4f0' }}>Coming Soon</h2>
          <p className="text-sm mb-6" style={{ color: '#b8a870' }}>Connect your ad platforms to unlock performance analytics — CTR, impressions, ROAS, and more.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMING_SOON.map((item) => (
            <div key={item.title} className="rounded-xl border p-5 relative" style={{ background: 'rgba(20,18,0,0.4)', borderColor: 'rgba(202,138,4,0.18)' }}>
              <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(132,204,22,0.12)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.25)' }}>
                Coming Soon
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 opacity-60" style={{ background: 'linear-gradient(135deg, #ca8a04, #84cc16)' }}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: '#dde4f0' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#b8a870' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
