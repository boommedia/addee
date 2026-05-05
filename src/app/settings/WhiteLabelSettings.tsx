'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Check } from 'lucide-react'

export default function WhiteLabelSettings({
  currentName,
  isPlanEligible,
}: {
  currentName: string
  isPlanEligible: boolean
}) {
  const [name, setName] = useState(currentName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({
      data: { white_label_name: name.trim() || null },
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-bold text-base">White Label</h2>
        {!isPlanEligible && (
          <span className="text-xs font-bold text-[#8888a8] bg-[#1a1a26] border border-[#2a2a3d] px-2.5 py-1 rounded-full">
            Agency Max
          </span>
        )}
      </div>
      <p className="text-[#8888a8] text-sm mb-5 leading-relaxed">
        Replace "Bloggy" in your dashboard with your own agency name. Your team sees your brand, not ours.
      </p>

      {!isPlanEligible ? (
        <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl px-4 py-3 text-center">
          <p className="text-violet-300 text-sm font-semibold mb-1">Available on Agency Max</p>
          <p className="text-violet-400 text-xs mb-3">Upgrade to remove Bloggy branding and use your own agency name throughout the dashboard.</p>
          <a href="/billing" className="inline-block text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg transition-colors">
            Upgrade Plan →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
              Custom Agency Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Boom Media Content Suite"
              className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#8888a8] focus:outline-none focus:border-violet-500 transition-colors"
            />
            <p className="text-[#8888a8] text-xs mt-1">Leave blank to restore the default "Bloggy" name.</p>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : null}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Name'}
          </button>
        </div>
      )}
    </div>
  )
}
