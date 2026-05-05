'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type Props = {
  active: string
  links: { href: string; label: string }[]
  signOutAction: () => Promise<void>
}

export default function MobileNav({ active, links, signOutAction }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 text-[#8888a8] hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 bg-[#0a0a0f] border-b border-[#2a2a3d] z-40 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active === link.href
                    ? 'bg-[#1a1a26] text-white font-semibold'
                    : 'text-[#8888a8] hover:text-white hover:bg-[#1a1a26]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-[#2a2a3d] pt-2 mt-2">
              <form action={signOutAction}>
                <button type="submit" className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#8888a8] hover:text-red-400 hover:bg-[#1a1a26] transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
