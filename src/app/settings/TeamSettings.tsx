'use client'

import { useState } from 'react'
import { UserPlus, Mail, CheckCircle, Clock, Trash2, Loader2, Users } from 'lucide-react'

type Invitation = { id: string; email: string; accepted_at: string | null; created_at: string }
type Member = { id: string; role: string; created_at: string; member_user_id: string }

export default function TeamSettings({
  ownerEmail,
  invitations,
  members,
}: {
  ownerEmail: string
  invitations: Invitation[]
  members: Member[]
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [localInvitations, setLocalInvitations] = useState(invitations)
  const [revoking, setRevoking] = useState<string | null>(null)

  async function handleInvite() {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send invite')
      setSent(email.trim())
      setEmail('')
      setLocalInvitations(prev => [{ id: data.id, email: email.trim(), accepted_at: null, created_at: new Date().toISOString() }, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleRevoke(id: string) {
    setRevoking(id)
    await fetch('/api/team/revoke', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setLocalInvitations(prev => prev.filter(i => i.id !== id))
    setRevoking(null)
  }

  const pending = localInvitations.filter(i => !i.accepted_at)
  const accepted = localInvitations.filter(i => i.accepted_at)

  return (
    <div className="flex flex-col gap-6">
      {/* Team section */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Team Members</h2>
        </div>

        {/* Owner row */}
        <div className="flex items-center justify-between py-3" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 text-xs font-bold">
              {ownerEmail[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-sm" style={{ color: '#dde4f0' }}>{ownerEmail}</div>
              <div className="text-xs" style={{ color: '#b8a870' }}>Owner</div>
            </div>
          </div>
          <span className="text-xs bg-violet-600/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">Owner</span>
        </div>

        {/* Active members */}
        {members.map(m => (
          <div key={m.id} className="flex items-center justify-between py-3" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-600/30 flex items-center justify-center text-cyan-300 text-xs font-bold">M</div>
              <div>
                <div className="text-sm text-xs font-mono opacity-60" style={{ color: '#dde4f0' }}>{m.member_user_id.slice(0, 8)}…</div>
                <div className="text-xs capitalize" style={{ color: '#b8a870' }}>{m.role}</div>
              </div>
            </div>
            <span className="text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">Active</span>
          </div>
        ))}

        {/* Pending invitations */}
        {pending.map(inv => (
          <div key={inv.id} className="flex items-center justify-between py-3" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(202,138,4,0.1)' }}>
                <Clock className="w-3.5 h-3.5" style={{ color: '#b8a870' }} />
              </div>
              <div>
                <div className="text-sm" style={{ color: '#dde4f0' }}>{inv.email}</div>
                <div className="text-xs" style={{ color: '#b8a870' }}>Invite pending</div>
              </div>
            </div>
            <button
              onClick={() => handleRevoke(inv.id)}
              disabled={revoking === inv.id}
              className="transition-colors"
              style={{ color: '#b8a870' }}
              title="Revoke invite"
            >
              {revoking === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        ))}

        {members.length === 0 && pending.length === 0 && (
          <p className="text-xs py-3" style={{ color: '#b8a870' }}>No team members yet. Invite someone below.</p>
        )}
      </div>

      {/* Invite form */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Invite Team Member</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: '#b8a870' }}>They'll receive an email with a link to join your Bloggy workspace. Team members can create and manage posts and clients.</p>

        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInvite()}
            placeholder="colleague@agency.com"
            className="flex-1 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors" style={{ background: 'rgba(10,9,0,0.8)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid', color: '#dde4f0' }}
          />
          <button
            onClick={handleInvite}
            disabled={loading || !email.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Send Invite
          </button>
        </div>

        {sent && (
          <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Invite sent to {sent}
          </div>
        )}
        {error && (
          <p className="mt-3 text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* Accepted history */}
      {accepted.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: '#dde4f0' }}>Accepted Invites</h2>
          <div className="flex flex-col gap-2">
            {accepted.map(inv => (
              <div key={inv.id} className="flex items-center justify-between text-sm">
                <span style={{ color: '#dde4f0' }}>{inv.email}</span>
                <span className="text-xs" style={{ color: '#b8a870' }}>
                  Joined {new Date(inv.accepted_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
