'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Globe, ChevronDown, ChevronUp, CheckCircle2, Image, Search } from 'lucide-react'

type Client = {
  id: string
  name: string
  industry: string | null
  website: string | null
  brand_voice: string | null
  wp_url: string | null
  wp_username: string | null
  wp_app_password: string | null
  logo_url: string | null
  primary_color: string | null
  brand_guidelines: string | null
  target_keywords: string | null
  contact_email: string | null
}

type Props = {
  client?: Client
  trigger?: React.ReactNode
}

export default function ClientForm({ client, trigger }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showWP, setShowWP] = useState(!!client?.wp_url)
  const [showBrand, setShowBrand] = useState(!!(client?.logo_url || client?.brand_guidelines || client?.target_keywords))
  const [contactEmail, setContactEmail] = useState(client?.contact_email ?? '')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    try {
      const form = e.currentTarget
      const body: Record<string, string | null> = {}
      new FormData(form).forEach((val, key) => {
        body[key] = val as string || null
      })
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await res.json()
      if (!res.ok || result?.error) {
        setSaveError(result?.error ?? 'Failed to save')
        setSaving(false)
        return
      }
      setOpen(false)
      router.refresh()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const hasWP = !!client?.wp_url

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger ?? (
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#12121a] border border-[#2a2a3d] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3d] sticky top-0 bg-[#12121a] z-10">
              <h2 className="text-white font-bold">{client ? 'Edit Client' : 'Add Client'}</h2>
              <button onClick={() => setOpen(false)} className="text-[#8888a8] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              {client && <input type="hidden" name="id" value={client.id} />}

              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Client Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  required
                  defaultValue={client?.name}
                  placeholder="Acme Plumbing Co."
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Client Contact Email</label>
                <input
                  name="contact_email"
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-[#8888a8] text-xs mt-1">Used for weekly content digest emails sent to your client.</p>
              </div>

              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Industry</label>
                <input
                  name="industry"
                  defaultValue={client?.industry ?? ''}
                  placeholder="e.g. Home Services, Legal, Healthcare"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Website</label>
                <input
                  name="website"
                  type="url"
                  defaultValue={client?.website ?? ''}
                  placeholder="https://example.com"
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Brand Voice</label>
                <textarea
                  name="brand_voice"
                  rows={3}
                  defaultValue={client?.brand_voice ?? ''}
                  placeholder="e.g. Professional and trustworthy. Avoid jargon. Speak directly to homeowners aged 35-65."
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
                <p className="text-[#8888a8] text-xs mt-1">Injected into every blog generation for this client.</p>
              </div>

              {/* WordPress Section */}
              <div className="border border-[#2a2a3d] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowWP(!showWP)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1a1a26] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#8888a8]" />
                    <span className="text-sm font-semibold text-white">WordPress Connection</span>
                    {hasWP && (
                      <span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Credentials saved
                      </span>
                    )}
                  </div>
                  {showWP ? <ChevronUp className="w-4 h-4 text-[#8888a8]" /> : <ChevronDown className="w-4 h-4 text-[#8888a8]" />}
                </button>

                {showWP && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[#2a2a3d]">
                    <p className="text-[#8888a8] text-xs pt-3 leading-relaxed">
                      Connect this client's WordPress site to publish directly from Bloggy.
                      In WordPress go to <strong className="text-white">Users → Profile → Application Passwords</strong> to generate a key.
                    </p>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
                        WordPress Site URL
                      </label>
                      <input
                        name="wp_url"
                        type="url"
                        defaultValue={client?.wp_url ?? ''}
                        placeholder="https://clientsite.com"
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
                        WordPress Username
                      </label>
                      <input
                        name="wp_username"
                        defaultValue={client?.wp_username ?? ''}
                        placeholder="admin"
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Application Password
                      </label>
                      <input
                        name="wp_app_password"
                        type="password"
                        defaultValue={client?.wp_app_password ?? ''}
                        placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors font-mono"
                      />
                      <p className="text-[#8888a8] text-xs mt-1">Stored securely. Never shared or exported.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Assets Section */}
              <div className="border border-[#2a2a3d] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowBrand(!showBrand)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1a1a26] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Image className="w-4 h-4 text-[#8888a8]" />
                    <span className="text-sm font-semibold text-white">Brand Assets</span>
                    {(client?.logo_url || client?.primary_color) && (
                      <span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Added
                      </span>
                    )}
                  </div>
                  {showBrand ? <ChevronUp className="w-4 h-4 text-[#8888a8]" /> : <ChevronDown className="w-4 h-4 text-[#8888a8]" />}
                </button>

                {showBrand && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[#2a2a3d]">
                    <p className="text-[#8888a8] text-xs pt-3 leading-relaxed">
                      Used to maintain visual and content consistency across all posts for this client.
                    </p>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Logo URL</label>
                      <input
                        name="logo_url"
                        type="url"
                        defaultValue={client?.logo_url ?? ''}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                      <p className="text-[#8888a8] text-xs mt-1">Paste a direct link to the client's logo image.</p>
                    </div>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Primary Brand Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          name="primary_color"
                          type="color"
                          defaultValue={client?.primary_color ?? '#6d28d9'}
                          className="w-10 h-10 rounded-lg border border-[#2a2a3d] bg-[#0a0a0f] cursor-pointer p-1"
                        />
                        <input
                          name="primary_color_hex"
                          defaultValue={client?.primary_color ?? '#6d28d9'}
                          placeholder="#6d28d9"
                          className="flex-1 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Search className="w-3 h-3" /> Target Keywords
                      </label>
                      <input
                        name="target_keywords"
                        defaultValue={client?.target_keywords ?? ''}
                        placeholder="e.g. plumber sydney, emergency plumbing, blocked drains"
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
                      />
                      <p className="text-[#8888a8] text-xs mt-1">Comma-separated. Pre-filled into every post for this client.</p>
                    </div>

                    <div>
                      <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">Additional Brand Guidelines</label>
                      <textarea
                        name="brand_guidelines"
                        rows={3}
                        defaultValue={client?.brand_guidelines ?? ''}
                        placeholder="e.g. Always mention 24/7 availability. Never use the word 'cheap'. Reference service areas: Sydney CBD, North Shore, Inner West."
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {saveError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {saveError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-[#1a1a26] hover:bg-[#2a2a3d] text-[#8888a8] hover:text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  {saving ? 'Saving...' : client ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
