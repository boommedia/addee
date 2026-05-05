'use client'

import { useState } from 'react'

const VIEWS = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '📄', label: 'Posts' },
  { icon: '👥', label: 'Clients' },
  { icon: '📅', label: 'Autoblog' },
  { icon: '🔑', label: 'Keywords' },
  { icon: '⚙️', label: 'Settings' },
]

function DashboardView() {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-white font-bold text-sm">Generate Blog Post</div>
          <div className="text-[#555570] text-xs mt-0.5">AI-powered SEO content in under 30 seconds</div>
        </div>
        <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg px-3 py-1.5 text-xs text-[#8888a8]">Boom Media · Agency</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4">
            <div className="text-[#555570] text-xs mb-2">Topic / Prompt</div>
            <div className="text-[#c8c8d8] text-sm">10 Local SEO Strategies for Small Businesses in 2025</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Client', val: 'Acme Roofing', color: 'text-violet-400' },
              { label: 'Tone', val: 'Professional', color: 'text-cyan-400' },
              { label: 'Length', val: 'Long (~2000w)', color: 'text-emerald-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5">
                <div className="text-[#555570] text-xs">{label}</div>
                <div className={`${color} text-xs font-semibold mt-0.5`}>{val}</div>
              </div>
            ))}
          </div>
          <div className="bg-violet-600 rounded-xl py-2.5 text-center text-white text-sm font-bold">⚡ Generate Post</div>
        </div>
        <div className="space-y-2">
          <div className="text-[#555570] text-xs font-semibold uppercase tracking-wider mb-2">Recent Posts</div>
          {[
            { title: 'How to Choose a Roofing Contractor', status: 'Live', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
            { title: 'Signs Your Roof Needs Replacement', status: 'Draft', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' },
            { title: 'Metal Roofing vs Asphalt Shingles', status: 'Live', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
          ].map(({ title, status, color }) => (
            <div key={title} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="text-[#c8c8d8] text-xs truncate">{title}</div>
              <span className={`text-xs border px-1.5 py-0.5 rounded-full shrink-0 ${color}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PostsView() {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-white font-bold text-sm">Post History</div>
          <div className="text-[#555570] text-xs mt-0.5">13 posts across all clients</div>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg px-3 py-1.5 text-xs text-[#8888a8]">All Clients ▾</div>
          <div className="bg-violet-600 rounded-lg px-3 py-1.5 text-xs text-white font-semibold">+ Generate</div>
        </div>
      </div>
      <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_70px_80px] gap-2 px-4 py-2 border-b border-[#2a2a3d]">
          {['Title', 'Client', 'Words', 'Status'].map(h => (
            <div key={h} className="text-[#555570] text-[10px] font-semibold uppercase tracking-wider">{h}</div>
          ))}
        </div>
        {[
          { title: 'Best HVAC Tips for South Florida Homes', client: 'HVAC Pro', words: '1,847', status: 'Live', sc: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { title: 'How to Choose a Local Plumber', client: 'Acme Co', words: '1,423', status: 'Draft', sc: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
          { title: 'Signs Your AC Unit Needs Replacement', client: 'HVAC Pro', words: '2,104', status: 'Live', sc: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { title: '5 Kitchen Remodel Trends for 2025', client: 'Bay Build', words: '1,651', status: 'Local', sc: 'text-[#8888a8] bg-[#1a1a26] border-[#2a2a3d]' },
          { title: 'Top 10 Roofing Materials Compared', client: 'Roof King', words: '2,290', status: 'Live', sc: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        ].map(({ title, client, words, status, sc }, i) => (
          <div key={title} className={`grid grid-cols-[1fr_80px_70px_80px] gap-2 px-4 py-2.5 items-center ${i % 2 === 1 ? 'bg-[#0d0d14]' : ''} hover:bg-[#1a1a26]/40 transition-colors`}>
            <div className="text-[#c8c8d8] text-xs truncate font-medium">{title}</div>
            <div className="text-[#555570] text-xs truncate">{client}</div>
            <div className="text-[#8888a8] text-xs">{words}</div>
            <span className={`text-[10px] border px-1.5 py-0.5 rounded-full w-fit ${sc}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClientsView() {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-white font-bold text-sm">Client Management</div>
          <div className="text-[#555570] text-xs mt-0.5">4 active clients</div>
        </div>
        <div className="bg-violet-600 rounded-lg px-3 py-1.5 text-xs text-white font-semibold">+ Add Client</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Acme Roofing', industry: 'Home Services', posts: 4, limit: 5, wp: true, color: '#6d28d9', words: '8.2k' },
          { name: 'Bay Dental', industry: 'Healthcare', posts: 3, limit: 5, wp: true, color: '#0891b2', words: '5.1k' },
          { name: 'FitLife Gym', industry: 'Fitness', posts: 5, limit: 5, wp: false, color: '#059669', words: '9.4k' },
          { name: 'LMN Law Firm', industry: 'Legal', posts: 2, limit: 5, wp: true, color: '#7c3aed', words: '3.8k' },
        ].map(({ name, industry, posts, limit, wp, color, words }) => {
          const pct = (posts / limit) * 100
          return (
            <div key={name} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3 hover:border-violet-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: color }}>{name[0]}</div>
                <div className="min-w-0">
                  <div className="text-white text-xs font-bold truncate">{name}</div>
                  <div className="text-[#555570] text-[10px]">{industry}</div>
                </div>
                <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${wp ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10'}`}>
                  {wp ? 'WP ✓' : 'WP —'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#555570] text-[10px]">Posts this month</span>
                <span className="text-[#8888a8] text-[10px]">{posts}/{limit}</span>
              </div>
              <div className="h-1 bg-[#1a1a26] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-1.5 mt-2.5">
                <div className="flex-1 bg-[#1a1a26] border border-[#2a2a3d] rounded-md py-1 text-center text-[9px] text-[#8888a8]">Manage</div>
                <div className="flex-1 bg-violet-600/20 border border-violet-500/20 rounded-md py-1 text-center text-[9px] text-violet-400">Generate →</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AutoblogView() {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-white font-bold text-sm">Autoblog Scheduler</div>
          <div className="text-[#555570] text-xs mt-0.5">Set it and forget it — posts on autopilot</div>
        </div>
        <span className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">● Running</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[#c8c8d8] text-xs font-bold">Acme Roofing</div>
            <div className="text-violet-400 text-[10px] bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">4/week</div>
          </div>
          <div className="space-y-1.5">
            {[
              { topic: 'Roof repair vs replacement cost guide', done: false },
              { topic: 'How long does installation take?', done: false },
              { topic: 'Best materials for Florida weather', done: true },
              { topic: 'Emergency roof repair steps', done: true },
            ].map(({ topic, done }) => (
              <div key={topic} className="flex items-center gap-2 py-1.5 border-b border-[#1a1a26] last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${done ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 text-[10px] text-[#c8c8d8] truncate">{topic}</div>
                <span className={`text-[9px] shrink-0 ${done ? 'text-emerald-400' : 'text-yellow-400'}`}>{done ? '✓ Done' : 'Queued'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[#c8c8d8] text-xs font-bold">Bay Dental</div>
            <div className="text-cyan-400 text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">2/week</div>
          </div>
          <div className="space-y-1.5">
            {[
              { topic: 'How often should you visit the dentist?', done: false },
              { topic: 'Teeth whitening options compared', done: false },
              { topic: 'Signs you need a root canal', done: true },
              { topic: 'Invisalign vs braces for adults', done: true },
            ].map(({ topic, done }) => (
              <div key={topic} className="flex items-center gap-2 py-1.5 border-b border-[#1a1a26] last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${done ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 text-[10px] text-[#c8c8d8] truncate">{topic}</div>
                <span className={`text-[9px] shrink-0 ${done ? 'text-emerald-400' : 'text-yellow-400'}`}>{done ? '✓ Done' : 'Queued'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3 flex items-center justify-between">
        <div className="text-[#8888a8] text-xs">Next publish: <span className="text-white font-semibold">Tomorrow at 9:00 AM</span></div>
        <div className="text-cyan-400 text-xs">View calendar →</div>
      </div>
    </div>
  )
}

function KeywordsView() {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-white font-bold text-sm">Keyword Rankings</div>
          <div className="text-[#555570] text-xs mt-0.5">Track SEO performance per client</div>
        </div>
        <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg px-3 py-1.5 text-xs text-[#8888a8]">Acme Roofing ▾</div>
      </div>
      <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl overflow-hidden mb-3">
        <div className="grid grid-cols-[1fr_60px_60px_80px] gap-2 px-4 py-2 border-b border-[#2a2a3d]">
          {['Keyword', 'Rank', 'Change', 'Volume'].map(h => (
            <div key={h} className="text-[#555570] text-[10px] font-semibold uppercase tracking-wider">{h}</div>
          ))}
        </div>
        {[
          { kw: 'roofing contractor miami', rank: 4, change: +2, vol: '2.4k' },
          { kw: 'roof repair south florida', rank: 7, change: +5, vol: '1.1k' },
          { kw: 'metal roofing cost florida', rank: 12, change: -1, vol: '880' },
          { kw: 'best roofing materials 2025', rank: 18, change: +8, vol: '590' },
          { kw: 'emergency roof repair near me', rank: 3, change: +1, vol: '3.2k' },
        ].map(({ kw, rank, change, vol }, i) => (
          <div key={kw} className={`grid grid-cols-[1fr_60px_60px_80px] gap-2 px-4 py-2.5 items-center ${i % 2 === 1 ? 'bg-[#0d0d14]' : ''}`}>
            <div className="text-[#c8c8d8] text-xs truncate">{kw}</div>
            <div className={`text-xs font-bold ${rank <= 5 ? 'text-emerald-400' : rank <= 10 ? 'text-yellow-400' : 'text-[#8888a8]'}`}>#{rank}</div>
            <div className={`text-xs font-semibold ${change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-[#555570]'}`}>
              {change > 0 ? `↑${change}` : change < 0 ? `↓${Math.abs(change)}` : '—'}
            </div>
            <div className="text-[#8888a8] text-xs">{vol}/mo</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Top 3 Rankings', val: '2', color: 'text-emerald-400' },
          { label: 'Avg. Position', val: '8.8', color: 'text-cyan-400' },
          { label: 'Keywords Tracked', val: '5', color: 'text-violet-400' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-2.5 text-center">
            <div className={`${color} text-sm font-black`}>{val}</div>
            <div className="text-[#555570] text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="p-6 h-full">
      <div className="mb-5">
        <div className="text-white font-bold text-sm">Account Settings</div>
        <div className="text-[#555570] text-xs mt-0.5">Manage your plan, billing, and preferences</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="bg-[#0a0a0f] border border-violet-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[#8888a8] text-[10px] font-semibold uppercase tracking-wider">Current Plan</div>
              <span className="text-violet-400 text-[10px] bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full font-bold">Agency</span>
            </div>
            <div className="text-white font-black text-lg">$199<span className="text-[#555570] text-xs font-normal">/mo</span></div>
            <div className="space-y-1 mt-2">
              {['20 client sites', '100 posts/month', 'AI hero images', 'SmartCrawl SEO'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-[10px] text-[#8888a8]">
                  <span className="text-emerald-400">✓</span>{f}
                </div>
              ))}
            </div>
            <div className="mt-3 bg-violet-600/20 border border-violet-500/20 rounded-lg py-1.5 text-center text-violet-400 text-[10px] font-semibold">Upgrade to Agency Max →</div>
          </div>
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3">
            <div className="text-[#8888a8] text-[10px] font-semibold uppercase tracking-wider mb-2">Usage This Month</div>
            <div className="space-y-2">
              {[
                { label: 'Posts generated', used: 67, limit: 100 },
                { label: 'Client sites', used: 14, limit: 20 },
              ].map(({ label, used, limit }) => {
                const pct = (used / limit) * 100
                return (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#555570] text-[10px]">{label}</span>
                      <span className="text-[#8888a8] text-[10px]">{used}/{limit}</span>
                    </div>
                    <div className="h-1 bg-[#1a1a26] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 80 ? 'bg-yellow-400' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3">
            <div className="text-[#8888a8] text-[10px] font-semibold uppercase tracking-wider mb-3">Profile</div>
            <div className="space-y-2">
              {[
                { label: 'Agency', val: 'Boom Media' },
                { label: 'Email', val: 'eric@boommedia.us' },
                { label: 'Plan', val: 'Agency · Active' },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1a1a26] last:border-0">
                  <span className="text-[#555570] text-[10px]">{label}</span>
                  <span className="text-[#c8c8d8] text-[10px] font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-3">
            <div className="text-[#8888a8] text-[10px] font-semibold uppercase tracking-wider mb-2">Billing</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#c8c8d8] text-[10px]">Next billing date</div>
                <div className="text-white text-xs font-semibold mt-0.5">May 1, 2025</div>
              </div>
              <div className="bg-[#1a1a26] border border-[#2a2a3d] rounded-lg px-2.5 py-1.5 text-[10px] text-[#8888a8]">Manage →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const VIEW_COMPONENTS = [DashboardView, PostsView, ClientsView, AutoblogView, KeywordsView, SettingsView]

export default function DashboardMockup() {
  const [active, setActive] = useState(0)
  const ActiveView = VIEW_COMPONENTS[active]

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-8 bg-violet-600/5 rounded-3xl blur-3xl pointer-events-none" />
      <div className="relative bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10">
        {/* Browser bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a3d] bg-[#0d0d14]">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#3a1a1a]" />
            <div className="w-3 h-3 rounded-full bg-[#3a3a1a]" />
            <div className="w-3 h-3 rounded-full bg-[#1a3a1a]" />
          </div>
          <div className="flex-1 bg-[#1a1a26] rounded-md px-3 py-1.5 text-[#555570] text-xs font-mono">
            bloggy.online/{['dashboard', 'posts', 'clients', 'autoblog', 'keywords', 'settings'][active]}
          </div>
        </div>

        {/* App shell */}
        <div className="flex" style={{ minHeight: '420px' }}>
          {/* Left nav */}
          <div className="w-14 border-r border-[#2a2a3d] bg-[#0d0d14] flex flex-col items-center pt-4 gap-1.5 shrink-0">
            {VIEWS.map(({ icon, label }, i) => (
              <button
                key={label}
                onClick={() => setActive(i)}
                title={label}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${
                  active === i
                    ? 'bg-violet-600/25 border border-violet-500/40 shadow-sm shadow-violet-500/20'
                    : 'hover:bg-[#1a1a26] border border-transparent'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Main content — animated swap */}
          <div className="flex-1 overflow-hidden relative">
            <div key={active} className="animate-in fade-in duration-200">
              <ActiveView />
            </div>
          </div>
        </div>

        {/* Active tab label pill */}
        <div className="border-t border-[#2a2a3d] bg-[#0d0d14] px-4 py-2 flex items-center gap-2">
          {VIEWS.map(({ label }, i) => (
            <button
              key={label}
              onClick={() => setActive(i)}
              className={`text-[10px] px-2.5 py-1 rounded-full transition-colors font-semibold ${
                active === i
                  ? 'bg-violet-600/20 border border-violet-500/30 text-violet-300'
                  : 'text-[#555570] hover:text-[#8888a8]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-px left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </div>
  )
}
