import { FileText, Users, BarChart2, TrendingUp } from 'lucide-react'

type Props = {
  postsThisMonth: number
  postsLimit: number
  wordsThisMonth: number
  activeClients: number
  lastPostTitle: string | null
  lastPostDate: string | null
}

export default function DashboardStats({
  postsThisMonth, postsLimit, wordsThisMonth, activeClients, lastPostTitle, lastPostDate,
}: Props) {
  const pct = postsLimit > 0 ? Math.min((postsThisMonth / postsLimit) * 100, 100) : 0
  const barColor = pct >= 90 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#8b5cf6'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {/* Posts this month */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Posts</span>
        </div>
        <div className="text-2xl font-black text-white">{postsThisMonth}</div>
        <div className="text-[#555570] text-xs mt-0.5">of {postsLimit} this month</div>
        <div className="mt-2 h-1 bg-[#2a2a3d] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
        </div>
      </div>

      {/* Words */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Words</span>
        </div>
        <div className="text-2xl font-black text-white">{wordsThisMonth >= 1000 ? `${(wordsThisMonth / 1000).toFixed(1)}k` : wordsThisMonth.toLocaleString()}</div>
        <div className="text-[#555570] text-xs mt-0.5">written this month</div>
      </div>

      {/* Clients */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Clients</span>
        </div>
        <div className="text-2xl font-black text-white">{activeClients}</div>
        <div className="text-[#555570] text-xs mt-0.5">active client sites</div>
      </div>

      {/* Last post */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Last Post</span>
        </div>
        {lastPostTitle ? (
          <>
            <div className="text-white text-xs font-semibold leading-snug line-clamp-2">{lastPostTitle}</div>
            <div className="text-[#555570] text-xs mt-1">
              {lastPostDate ? new Date(lastPostDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
            </div>
          </>
        ) : (
          <div className="text-[#555570] text-xs">No posts yet</div>
        )}
      </div>
    </div>
  )
}
