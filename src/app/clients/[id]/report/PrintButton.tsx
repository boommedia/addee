'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 text-xs font-semibold bg-[#ca8a04] hover:bg-[#fbbf24] text-white px-4 py-2 rounded-lg transition-colors"
    >
      <Printer className="w-3.5 h-3.5" />
      Print / Save PDF
    </button>
  )
}
