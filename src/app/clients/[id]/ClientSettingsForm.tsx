'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertClient } from '@/app/clients/actions'
import { Loader2, Check, Save } from 'lucide-react'

type Client = {
  id: string
  name: string
  industry: string | null
  website: string | null
  brand_voice: string | null
  contact_email: string | null
  wp_url: string | null
  wp_username: string | null
  wp_app_password: string | null
  logo_url: string | null
  primary_color: string | null
  brand_guidelines: string | null
  target_keywords: string | null
}

const input = 'w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors'
const label = 'block text-[#8888a8] text-xs font-semibold uppercase tracking-wide mb-1.5'

export default function ClientSettingsForm({ client }: { client: Client }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('id', client.id)
    startTransition(async () => {
      const result = await upsertClient(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
        <h2 className="text-white font-bold text-sm mb-5">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Client Name *</label>
            <input name="name" defaultValue={client.name} required className={input} />
          </div>
          <div>
            <label className={label}>Industry</label>
            <input name="industry" defaultValue={client.industry ?? ''} className={input} placeholder="e.g. Real Estate, Healthcare" />
          </div>
          <div>
            <label className={label}>Website</label>
            <input name="website" defaultValue={client.website ?? ''} className={input} placeholder="https://example.com" />
          </div>
          <div>
            <label className={label}>Contact Email</label>
            <input name="contact_email" type="email" defaultValue={client.contact_email ?? ''} className={input} placeholder="client@example.com" />
          </div>
        </div>
      </div>

      {/* Brand & Voice */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
        <h2 className="text-white font-bold text-sm mb-5">Brand & Voice</h2>
        <div className="space-y-4">
          <div>
            <label className={label}>Brand Voice</label>
            <textarea name="brand_voice" defaultValue={client.brand_voice ?? ''} rows={3}
              className={`${input} resize-none`} placeholder="Describe the brand's tone and writing style…" />
          </div>
          <div>
            <label className={label}>Target Keywords</label>
            <input name="target_keywords" defaultValue={client.target_keywords ?? ''} className={input} placeholder="keyword1, keyword2, keyword3" />
          </div>
          <div>
            <label className={label}>Brand Guidelines</label>
            <textarea name="brand_guidelines" defaultValue={client.brand_guidelines ?? ''} rows={3}
              className={`${input} resize-none`} placeholder="Tone rules, topics to avoid, style notes…" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Logo URL</label>
              <input name="logo_url" defaultValue={client.logo_url ?? ''} className={input} placeholder="https://…" />
            </div>
            <div>
              <label className={label}>Primary Color</label>
              <div className="flex gap-3 items-center">
                <input type="color" name="primary_color" defaultValue={client.primary_color ?? '#6d28d9'}
                  className="w-10 h-9 rounded-lg border border-[#2a2a3d] bg-[#0a0900] cursor-pointer p-0.5" />
                <span className="text-[#555570] text-xs">{client.primary_color ?? '#6d28d9'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WordPress */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
        <h2 className="text-white font-bold text-sm mb-1">WordPress Connection</h2>
        <p className="text-[#555570] text-xs mb-5">Used for one-click publishing directly to this client's WordPress site.</p>
        <div className="space-y-4">
          <div>
            <label className={label}>WordPress Site URL</label>
            <input name="wp_url" defaultValue={client.wp_url ?? ''} className={input} placeholder="https://clientsite.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>WordPress Username</label>
              <input name="wp_username" defaultValue={client.wp_username ?? ''} className={input} placeholder="admin" />
            </div>
            <div>
              <label className={label}>Application Password</label>
              <input name="wp_app_password" type="password" defaultValue={client.wp_app_password ?? ''} className={input} placeholder="xxxx xxxx xxxx xxxx" />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
            <Check className="w-4 h-4" /> Saved!
          </span>
        )}
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-colors">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
