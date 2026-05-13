'use client'

import { Search } from 'lucide-react'

export default function NavSearchButton() {
  function open() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  }

  return (
    <button
      onClick={open}
      className="hidden md:flex items-center gap-2 text-[#555570] hover:text-white bg-[#12121a] hover:bg-[#1a1a26] border border-[#2a2a3d] rounded-lg px-3 py-1.5 text-xs transition-colors"
      title="Open command palette"
    >
      <Search className="w-3.5 h-3.5" />
      <span>Search</span>
      <kbd className="font-mono text-[10px] bg-[#0a0900] border border-[#2a2a3d] rounded px-1">⌘K</kbd>
    </button>
  )
}
