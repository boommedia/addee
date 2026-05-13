import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Globe, ExternalLink, FileText, BarChart2, CheckCircle } from 'lucide-react'
import PrintButton from './PrintButton'
import AppNav from '@/components/AppNav'

export default async function ClientReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  async function fetchPosts(gte?: string) {
    const base = supabase
      .from('posts')
      .select('id, title, word_count, wp_post_url, wp_status, created_at, seo_meta')
      .eq('client_id', id)
      .order('created_at', { ascending: false })

    const query = gte ? base.gte('created_at', gte) : base
    const { data, error } = await query

    if (error) {
      const fallback = supabase
        .from('posts')
        .select('id, title, word_count, wp_post_url, wp_status, created_at')
        .eq('client_id', id)
        .order('created_at', { ascending: false })
      const { data: d2 } = gte ? await fallback.gte('created_at', gte) : await fallback
      return d2 ?? []
    }
    return data ?? []
  }

  const [allPosts, monthPosts] = await Promise.all([fetchPosts(), fetchPosts(monthStart)])

  const totalWords = allPosts.reduce((s, p) => s + (p.word_count ?? 0), 0)
  const monthWords = monthPosts.reduce((s, p) => s + (p.word_count ?? 0), 0)
  const publishedTotal = allPosts.filter(p => p.wp_status === 'publish').length
  const publishedMonth = monthPosts.filter(p => p.wp_status === 'publish').length

  const now = new Date()
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0] print:bg-white print:text-gray-900">
      {/* Nav bar — hidden on print */}
      <div className="print:hidden">
        <AppNav active="/clients" />
      </div>

      {/* Print bar — hidden on print */}
      <div className="print:hidden flex items-center justify-between px-8 py-3 border-b border-[#2a2a3d] bg-[#0a0900]">
        <a href="/clients" className="text-sm text-[#8888a8] hover:text-white transition-colors">← Back to Clients</a>
        <PrintButton />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-[#2a2a3d] print:border-gray-200">
          <div className="flex items-center gap-4">
            {client.logo_url ? (
              <img src={client.logo_url} alt={client.name} className="w-12 h-12 rounded-xl object-contain bg-white/5 border border-[#2a2a3d] p-1 print:border-gray-200" />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg print:hidden"
                style={{ background: client.primary_color ?? '#6d28d9' }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#555570] mb-1 print:text-gray-400">Content Report</p>
              <h1 className="text-3xl font-black text-white print:text-gray-900">{client.name}</h1>
              {client.website && (
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-[#8888a8] mt-1 hover:text-cyan-400 transition-colors print:text-gray-400">
                  <Globe className="w-3 h-3" />
                  {client.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#555570] print:text-gray-400">Generated</p>
            <p className="text-sm font-semibold text-[#e8e8f0] print:text-gray-700">
              {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-xs text-[#555570] mt-1 print:text-gray-400">Prepared by Bloggy</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Posts This Month', value: monthPosts.length, color: 'text-violet-400', icon: <FileText className="w-4 h-4" /> },
            { label: 'Published This Month', value: publishedMonth, color: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4" /> },
            { label: 'Total Posts All Time', value: allPosts.length, color: 'text-cyan-400', icon: <BarChart2 className="w-4 h-4" /> },
            { label: 'Words This Month', value: monthWords.toLocaleString(), color: 'text-violet-300', icon: <FileText className="w-4 h-4" /> },
          ].map(s => (
            <div key={s.label} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 print:bg-gray-50 print:border-gray-200">
              <div className={`flex items-center gap-1.5 text-xs mb-1 ${s.color} print:text-gray-500`}>
                {s.icon}
                {s.label}
              </div>
              <p className={`text-2xl font-black ${s.color} print:text-gray-900`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* This month's posts */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#555570] mb-4 print:text-gray-400">
            {monthLabel} — Posts Generated
          </h2>
          {!monthPosts.length ? (
            <p className="text-[#8888a8] text-sm bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-6 text-center print:bg-gray-50 print:border-gray-200 print:text-gray-400">
              No posts generated this month.
            </p>
          ) : (
            <div className="border border-[#2a2a3d] rounded-xl overflow-hidden print:border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#12121a] border-b border-[#2a2a3d] print:bg-gray-50 print:border-gray-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#555570] uppercase tracking-wider print:text-gray-500">Title</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#555570] uppercase tracking-wider print:text-gray-500">Words</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#555570] uppercase tracking-wider print:text-gray-500">Status</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#555570] uppercase tracking-wider print:text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {monthPosts.map((p, i) => (
                    <tr key={p.id} className={`border-b border-[#2a2a3d] last:border-0 print:border-gray-100 ${i % 2 === 0 ? 'bg-[#0a0900] print:bg-white' : 'bg-[#12121a] print:bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#e8e8f0] leading-snug print:text-gray-900">{p.title}</div>
                        {(p as any).seo_meta?.focusKeyword && (
                          <div className="text-xs text-violet-400 mt-0.5 print:text-violet-600">🔑 {(p as any).seo_meta.focusKeyword}</div>
                        )}
                        {p.wp_post_url && (
                          <a href={p.wp_post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 mt-0.5 print:text-blue-500">
                            {p.wp_post_url.replace(/^https?:\/\//, '').slice(0, 60)}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#8888a8] text-xs print:text-gray-600">{(p.word_count ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.wp_status === 'publish'
                            ? 'bg-emerald-500/15 text-emerald-400 print:bg-emerald-100 print:text-emerald-700'
                            : p.wp_post_url
                            ? 'bg-yellow-500/15 text-yellow-400 print:bg-yellow-100 print:text-yellow-700'
                            : 'bg-[#1a1a26] text-[#8888a8] print:bg-gray-100 print:text-gray-500'
                        }`}>
                          {p.wp_status === 'publish' ? 'Live' : p.wp_post_url ? 'Draft' : 'Not published'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#555570] text-xs print:text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All-time summary */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-6 print:bg-gray-50 print:border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#555570] mb-5 print:text-gray-400">All-Time Summary</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-white print:text-gray-900">{allPosts.length}</p>
              <p className="text-xs text-[#8888a8] mt-1 print:text-gray-500">Total Posts</p>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-400 print:text-emerald-700">{publishedTotal}</p>
              <p className="text-xs text-[#8888a8] mt-1 print:text-gray-500">Published Live</p>
            </div>
            <div>
              <p className="text-3xl font-black text-violet-400 print:text-violet-700">{(totalWords / 1000).toFixed(1)}k</p>
              <p className="text-xs text-[#8888a8] mt-1 print:text-gray-500">Words Written</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#555570] mt-8 print:text-gray-300">Generated by Bloggy · bloggy.online</p>
      </div>

      <style>{`
        @media print {
          @page { margin: 1cm; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
