'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export default function CopyShareLink({ clientId }: { clientId: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}/r/${clientId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      title="Copy shareable report link"
      className="flex items-center gap-1.5 text-xs text-[#8888a8] hover:text-white bg-[#12121a] hover:bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}
