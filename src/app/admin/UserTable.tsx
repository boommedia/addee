'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Search, ChevronDown, Loader2, Check, X, KeyRound, Trash2,
  ShieldOff, ShieldCheck, Mail, User, MessageSquare, Send,
} from 'lucide-react'
import clsx from 'clsx'

type AdminUser = {
  id: string
  email: string
  full_name: string | null
  agency_name: string | null
  created_at: string
  last_sign_in_at: string | null
  plan: string | null
  plan_status: string | null
  posts_limit: number
  sites_limit: number
  posts_this_month: number
  total_posts: number
  total_words: number
  banned?: boolean
  clients_count: number
}

const PLAN_COLORS: Record<string, string> = {
  starter:    'bg-yellow-600/15 border-yellow-600/30 text-yellow-400',
  growth:     'bg-[#ca8a04]/15 border-[#ca8a04]/30 text-[#ca8a04]',
  agency:     'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  agency_max: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  free:       'bg-[#1c1800] border-[#2a2200] text-[#b8a870]',
}

const PLANS = ['free', 'starter', 'growth', 'agency', 'agency_max', 'internal']

const MESSAGE_TEMPLATES = [
  {
    id: 'checkin',
    label: 'Check in',
    subject: "Checking in — how's Bloggy working for you?",
    body: `Hi,\n\nJust wanted to check in and see how things are going with Bloggy.\n\nAre you getting the results you were hoping for? If there's anything I can help with — setting up WordPress publishing, building out your client list, or anything else — just reply and I'll help directly.\n\nThanks for being part of the early community.\n\n— Eric`,
  },
  {
    id: 'feature',
    label: 'New feature',
    subject: "New in Bloggy — you're going to like this",
    body: `Hi,\n\nI wanted to let you know about something new we just shipped in Bloggy:\n\n[DESCRIBE FEATURE HERE]\n\nYou can try it right now at bloggy.online.\n\nAs always, reply if you have any feedback — I read everything.\n\n— Eric`,
  },
  {
    id: 'upgrade',
    label: 'Upgrade nudge',
    subject: 'Upgrade Bloggy — 50% off for early members',
    body: `Hi,\n\nYou've been using Bloggy on the free plan and I wanted to reach out personally.\n\nFor a limited time, we're offering 50% off for the first year to early members. With a paid plan you can handle more client sites, schedule posts automatically, and push directly to WordPress.\n\nUpgrade here: https://bloggy.online/billing?coupon=EARLY50\n\nLet me know if you have any questions.\n\n— Eric`,
  },
  {
    id: 'custom',
    label: 'Custom',
    subject: '',
    body: '',
  },
]

function ProfileDrawer({ user, onClose, onDone }: {
  user: AdminUser
  onClose: () => void
  onDone: () => void
}) {
  const [tab, setTab] = useState<'profile' | 'message'>('profile')

  // Plan editing
  const [editingPlan, setEditingPlan] = useState(false)
  const [newPlan, setNewPlan] = useState(user.plan ?? 'free')
  const [planSaving, setPlanSaving] = useState(false)

  // User actions
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionDone, setActionDone] = useState<string | null>(null)

  // Messaging
  const [template, setTemplate] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const plan = user.plan ?? 'free'
  const isActive = user.plan_status === 'active'
  const usagePct = user.posts_limit > 0 ? Math.min((user.posts_this_month / user.posts_limit) * 100, 100) : 0

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function selectTemplate(id: string) {
    const t = MESSAGE_TEMPLATES.find(t => t.id === id)
    if (!t) return
    setTemplate(id)
    if (t.subject) setSubject(t.subject)
    if (t.body) setBody(t.body)
  }

  async function handleSetPlan() {
    if (!newPlan) return
    setPlanSaving(true)
    const res = await fetch('/api/admin/set-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, plan: newPlan }),
    })
    setPlanSaving(false)
    if (res.ok) {
      setEditingPlan(false)
      setTimeout(onDone, 600)
    } else {
      const data = await res.json()
      alert(data.error ?? 'Failed to set plan')
    }
  }

  async function runAction(action: string) {
    if (action === 'delete' && !confirm(`Permanently delete ${user.email}? This cannot be undone.`)) return
    setActionLoading(action)
    const res = await fetch('/api/admin/user-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, action }),
    })
    setActionLoading(null)
    if (!res.ok) {
      const data = await res.json()
      alert(data.error ?? 'Action failed')
      return
    }
    setActionDone(action)
    setTimeout(onDone, 800)
  }

  async function handleSendMessage() {
    if (!subject.trim() || !body.trim()) return
    setSending(true)
    setSendError(null)
    try {
      const res = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: user.email, subject: subject.trim(), body: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error ?? 'Failed to send')
      } else {
        setSent(true)
        setTimeout(() => { setSent(false); setSubject(''); setBody(''); setTemplate(null) }, 3500)
      }
    } catch {
      setSendError('Something went wrong — try again')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-[#0a0900] border-l border-[#2a2200] z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-[#2a2200] shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#ca8a04]/20 border border-[#ca8a04]/30 flex items-center justify-center text-[#fbbf24] text-lg font-black shrink-0">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {user.full_name && <div className="text-white font-bold text-sm leading-tight">{user.full_name}</div>}
            {user.agency_name && <div className="text-[#b8a870] text-xs">{user.agency_name}</div>}
            <div className="text-[#7a6a40] text-xs truncate">{user.email}</div>
            <div className="text-[#7a6a40] text-xs font-mono mt-0.5">{user.id.slice(0, 12)}…</div>
          </div>
          <button onClick={onClose} className="text-[#7a6a40] hover:text-white p-1.5 rounded-lg hover:bg-[#2a2200] transition-colors shrink-0 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2a2200] shrink-0">
          {(['profile', 'message'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold capitalize transition-colors ${
                tab === t ? 'text-white border-b-2 border-[#ca8a04]' : 'text-[#b8a870] hover:text-white'
              }`}
            >
              {t === 'profile' ? <User className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
              {t === 'message' ? 'Send Message' : 'Profile'}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <div className="p-5 space-y-5">

              {/* Plan + account info */}
              <div className="bg-[#141200] border border-[#2a2200] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize font-semibold ${PLAN_COLORS[plan] ?? PLAN_COLORS.free}`}>
                      {plan.replace('_', ' ')}
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active subscription" />}
                    {user.banned && <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">suspended</span>}
                  </div>
                  {!editingPlan && (
                    <button
                      onClick={() => { setEditingPlan(true); setNewPlan(plan) }}
                      className="text-xs text-[#b8a870] hover:text-white bg-[#1c1800] hover:bg-[#2a2200] border border-[#2a2200] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      Change plan <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {editingPlan && (
                  <div className="flex items-center gap-2">
                    <select
                      value={newPlan}
                      onChange={e => setNewPlan(e.target.value)}
                      autoFocus
                      className="flex-1 bg-[#0a0900] border border-[#ca8a04]/40 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                    >
                      {PLANS.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                    </select>
                    <button onClick={handleSetPlan} disabled={planSaving}
                      className="p-1.5 rounded-lg bg-[#ca8a04] hover:bg-[#fbbf24] disabled:opacity-40 text-white transition-colors">
                      {planSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    </button>
                    <button onClick={() => setEditingPlan(false)} className="p-1.5 rounded-lg hover:bg-[#2a2200] text-[#b8a870] transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs pt-1">
                  {[
                    { label: 'Status', value: user.plan_status ?? 'none', color: isActive ? 'text-emerald-400' : 'text-[#7a6a40]' },
                    { label: 'Sites limit', value: `${user.sites_limit} max`, color: 'text-[#c8c8d8]' },
                    { label: 'Joined', value: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), color: 'text-[#c8c8d8]' },
                    { label: 'Last active', value: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never', color: 'text-[#c8c8d8]' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-[#7a6a40] mb-0.5">{item.label}</div>
                      <div className={`font-medium ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage stats */}
              <div>
                <div className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider mb-3">Usage</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: 'Posts this month',
                      value: `${user.posts_this_month} / ${user.posts_limit}`,
                      sub: `${Math.round(usagePct)}% of limit`,
                      color: usagePct >= 90 ? 'text-red-400' : usagePct >= 70 ? 'text-yellow-400' : 'text-white',
                    },
                    { label: 'Total posts', value: user.total_posts.toLocaleString(), sub: 'all time', color: 'text-white' },
                    { label: 'Words generated', value: `${(user.total_words / 1000).toFixed(1)}k`, sub: 'all time', color: 'text-white' },
                    { label: 'Client sites', value: user.clients_count.toString(), sub: `of ${user.sites_limit} max`, color: 'text-white' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#141200] border border-[#2a2200] rounded-xl p-3">
                      <div className="text-[#7a6a40] text-xs mb-1">{s.label}</div>
                      <div className={`font-black text-xl leading-none mb-0.5 ${s.color}`}>{s.value}</div>
                      <div className="text-[#7a6a40] text-xs">{s.sub}</div>
                    </div>
                  ))}
                </div>
                {usagePct > 0 && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-[#2a2200] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-[#ca8a04]'}`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                    <div className="text-[#7a6a40] text-xs mt-1 text-right">{user.posts_this_month}/{user.posts_limit} posts this month</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div>
                <div className="text-[#b8a870] text-xs font-semibold uppercase tracking-wider mb-3">Actions</div>
                <div className="flex flex-col gap-2">
                  {[
                    { action: 'reset-password', icon: <KeyRound className="w-3.5 h-3.5" />, label: 'Send Password Reset Email', cls: 'text-white hover:bg-[#2a2200]' },
                    user.banned
                      ? { action: 'unsuspend', icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Unsuspend Account', cls: 'text-emerald-400 hover:bg-emerald-500/5' }
                      : { action: 'suspend', icon: <ShieldOff className="w-3.5 h-3.5" />, label: 'Suspend Account', cls: 'text-yellow-400 hover:bg-yellow-500/5' },
                    { action: 'delete', icon: <Trash2 className="w-3.5 h-3.5" />, label: 'Permanently Delete User', cls: 'text-red-400 hover:bg-red-500/5' },
                  ].map(item => (
                    <button
                      key={item.action}
                      onClick={() => runAction(item.action)}
                      disabled={!!actionLoading}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm bg-[#141200] border border-[#2a2200] ${item.cls} transition-colors disabled:opacity-50`}
                    >
                      {actionLoading === item.action ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : item.icon}
                      {item.label}
                      {actionDone === item.action && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGE TAB ── */}
          {tab === 'message' && (
            <div className="p-5 space-y-4">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-white font-bold text-sm">Email sent!</div>
                  <div className="text-[#7a6a40] text-xs mt-1">Delivered to {user.email}</div>
                </div>
              ) : (
                <>
                  {/* To */}
                  <div>
                    <div className="text-[#7a6a40] text-xs mb-1.5">To</div>
                    <div className="bg-[#141200] border border-[#2a2200] rounded-xl px-3 py-2.5 text-[#b8a870] text-sm flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      {user.email}
                    </div>
                  </div>

                  {/* Quick templates */}
                  <div>
                    <div className="text-[#7a6a40] text-xs mb-2">Quick templates</div>
                    <div className="flex flex-wrap gap-2">
                      {MESSAGE_TEMPLATES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => selectTemplate(t.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                            template === t.id
                              ? 'bg-[#ca8a04]/20 border-[#ca8a04]/40 text-[#fbbf24]'
                              : 'bg-[#141200] border-[#2a2200] text-[#b8a870] hover:text-white hover:border-[#3a3a5a]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <div className="text-[#7a6a40] text-xs mb-1.5">Subject</div>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Email subject…"
                      className="w-full bg-[#141200] border border-[#2a2200] focus:border-[#ca8a04] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#7a6a40] outline-none transition-colors"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <div className="text-[#7a6a40] text-xs mb-1.5">Message</div>
                    <textarea
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      rows={11}
                      placeholder="Write your message…"
                      className="w-full bg-[#141200] border border-[#2a2200] focus:border-[#ca8a04] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#7a6a40] outline-none resize-none transition-colors leading-relaxed"
                    />
                  </div>

                  {sendError && (
                    <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{sendError}</div>
                  )}

                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !subject.trim() || !body.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-[#ca8a04] hover:bg-[#fbbf24] disabled:opacity-40 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? 'Sending…' : 'Send Email'}
                  </button>

                  <p className="text-[#7a6a40] text-xs text-center">Sent from eric@bloggy.online via Resend</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function UserTable({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'joined' | 'posts' | 'activity'>('joined')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const filtered = useMemo(() => {
    let list = users
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.email.toLowerCase().includes(q) ||
        (u.full_name ?? '').toLowerCase().includes(q) ||
        (u.agency_name ?? '').toLowerCase().includes(q)
      )
    }
    if (planFilter !== 'all') list = list.filter(u => (u.plan ?? 'free') === planFilter)
    if (sortBy === 'posts') list = [...list].sort((a, b) => b.total_posts - a.total_posts)
    else if (sortBy === 'activity') list = [...list].sort((a, b) => (b.last_sign_in_at ?? '').localeCompare(a.last_sign_in_at ?? ''))
    else list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at))
    return list
  }, [users, search, planFilter, sortBy])

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a6a40]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email, name, agency…"
            className="w-full bg-[#141200] border border-[#2a2200] rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-[#7a6a40] focus:outline-none focus:border-[#ca8a04] transition-colors"
          />
        </div>
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="bg-[#141200] border border-[#2a2200] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ca8a04] transition-colors"
        >
          <option value="all">All plans</option>
          {PLANS.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'joined' | 'posts' | 'activity')}
          className="bg-[#141200] border border-[#2a2200] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ca8a04] transition-colors"
        >
          <option value="joined">Sort: Newest</option>
          <option value="posts">Sort: Most posts</option>
          <option value="activity">Sort: Last active</option>
        </select>
        <span className="text-[#7a6a40] text-xs">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-[#141200] border border-[#2a2200] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2200]">
                <th className="text-left px-5 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider">Posts / mo</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Total</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Words</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Sites</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Last Active</th>
                <th className="text-left px-4 py-3 text-[#b8a870] text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const plan = user.plan ?? 'free'
                const usagePct = user.posts_limit > 0 ? Math.min((user.posts_this_month / user.posts_limit) * 100, 100) : 0

                return (
                  <tr
                    key={user.id}
                    className={clsx(
                      'border-b border-[#1c1800] hover:bg-[#1c1800] transition-colors cursor-pointer',
                      i % 2 === 0 ? '' : 'bg-[#0a0900]',
                      user.banned && 'opacity-50'
                    )}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#ca8a04]/20 border border-[#ca8a04]/30 flex items-center justify-center text-[#fbbf24] text-xs font-bold shrink-0">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{user.email}</div>
                          {(user.full_name || user.agency_name) && (
                            <div className="text-[#7a6a40] text-xs mt-0.5">
                              {[user.full_name, user.agency_name].filter(Boolean).join(' · ')}
                            </div>
                          )}
                        </div>
                        {user.banned && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">suspended</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-semibold ${PLAN_COLORS[plan] ?? PLAN_COLORS.free}`}>
                        {plan.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-[#2a2200] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-[#ca8a04]'}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                        <span className="text-[#c8c8d8] text-xs">{user.posts_this_month}/{user.posts_limit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#c8c8d8] text-sm hidden sm:table-cell">{user.total_posts.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[#c8c8d8] text-sm hidden md:table-cell">{(user.total_words / 1000).toFixed(1)}k</td>
                    <td className="px-4 py-3 text-[#c8c8d8] text-sm hidden lg:table-cell">{user.clients_count}</td>
                    <td className="px-4 py-3 text-[#b8a870] text-xs hidden lg:table-cell">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#7a6a40] text-xs hidden xl:table-cell">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-xs text-[#7a6a40] hover:text-[#ca8a04] bg-[#1c1800] hover:bg-[#2a2200] border border-[#2a2200] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-[#7a6a40] text-sm">No users match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <ProfileDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDone={() => { setSelectedUser(null); window.location.reload() }}
        />
      )}
    </div>
  )
}
