'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle, X, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

type Step = {
  id: string
  label: string
  description: string
  href: string
  done: boolean
}

const DISMISSED_KEY = 'bloggy_onboarding_dismissed'

export default function OnboardingChecklist({ steps }: { steps: Step[] }) {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true'
    setDismissed(isDismissed)
    setMounted(true)

    // Fire welcome email on first visit
    if (!isDismissed) {
      fetch('/api/email/welcome', { method: 'POST' }).catch(() => {})
    }
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  const completed = steps.filter(s => s.done).length
  const allDone = completed === steps.length

  if (!mounted || dismissed || allDone) return null

  return (
    <div className="bg-[#12121a] border border-violet-500/30 rounded-2xl p-5 mb-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-white font-semibold text-sm">Get started with Bloggy</h2>
          <p className="text-[#8888a8] text-xs mt-0.5">{completed} of {steps.length} steps complete</p>
        </div>
        <button
          onClick={dismiss}
          className="text-[#8888a8] hover:text-white transition-colors shrink-0 mt-0.5"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-1 bg-[#2a2a3d] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${(completed / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {steps.map(step => (
          <a
            key={step.id}
            href={step.done ? undefined : step.href}
            className={clsx(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors group',
              step.done
                ? 'opacity-50 cursor-default'
                : 'hover:bg-[#1a1a26] cursor-pointer'
            )}
          >
            {step.done
              ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              : <Circle className="w-4 h-4 text-[#2a2a3d] group-hover:text-violet-400 shrink-0 transition-colors" />
            }
            <div className="flex-1 min-w-0">
              <div className={clsx('text-sm font-medium', step.done ? 'text-[#8888a8] line-through' : 'text-white')}>
                {step.label}
              </div>
              {!step.done && (
                <div className="text-[#8888a8] text-xs">{step.description}</div>
              )}
            </div>
            {!step.done && <ChevronRight className="w-3.5 h-3.5 text-[#8888a8] group-hover:text-violet-400 shrink-0 transition-colors" />}
          </a>
        ))}
      </div>
    </div>
  )
}
