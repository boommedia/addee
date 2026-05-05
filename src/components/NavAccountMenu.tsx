'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, FileText, BarChart2, CreditCard, Settings, LogOut, HelpCircle } from 'lucide-react'

type Props = {
  email: string
  planLabel: string
  planStyle: string
  postsLeft: number
  postsLimit: number
  nearLimit: boolean
  signOutAction: () => Promise<void>
}

export default function NavAccountMenu({ email, planLabel, planStyle, postsLeft, postsLimit, nearLimit, signOutAction }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold transition-colors ${nearLimit ? 'bg-red-500/15 border-red-500/30 text-red-400' : planStyle}`}
      >
        <span className="capitalize">{planLabel}</span>
        <span className="opacity-50">·</span>
        <span className={nearLimit ? '' : 'opacity-70'}>{postsLeft}/{postsLimit} posts</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#12121a] border border-[#2a2a3d] rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-[#2a2a3d]">
            <p className="text-[#8888a8] text-xs truncate">{email}</p>
          </div>
          <div className="py-1">
            {[
              { href: '/posts',   icon: <FileText className="w-3.5 h-3.5" />,     label: 'Post History' },
              { href: '/account', icon: <BarChart2 className="w-3.5 h-3.5" />,   label: 'Usage' },
              { href: '/billing', icon: <CreditCard className="w-3.5 h-3.5" />,  label: 'Billing' },
              { href: '/settings',icon: <Settings className="w-3.5 h-3.5" />,    label: 'Settings' },
              { href: '/help',    icon: <HelpCircle className="w-3.5 h-3.5" />,  label: 'Help & Tutorials' },
            ].map(({ href, icon, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#c8c8d8] hover:text-white hover:bg-[#1a1a26] transition-colors"
              >
                <span className="text-[#8888a8]">{icon}</span>
                {label}
              </a>
            ))}
          </div>
          <div className="border-t border-[#2a2a3d] py-1">
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#8888a8] hover:text-red-400 hover:bg-[#1a1a26] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
