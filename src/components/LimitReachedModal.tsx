'use client'

import { X, Zap, CheckCircle, ArrowRight } from 'lucide-react'

type PlanKey = 'free' | 'starter' | 'growth' | 'agency' | 'agency_max'

const PLAN_LABELS: Record<PlanKey, string> = {
  free: 'Free',
  starter: 'Starter',
  growth: 'Growth',
  agency: 'Agency',
  agency_max: 'Agency Max',
}

const NEXT_PLAN: Record<PlanKey, PlanKey | null> = {
  free: 'starter',
  starter: 'growth',
  growth: 'agency',
  agency: 'agency_max',
  agency_max: null,
}

const PLAN_DETAILS: Record<PlanKey, { price: number; sites: number; postsPerSite: number; features: string[] }> = {
  free: { price: 0, sites: 2, postsPerSite: 1, features: ['2 client sites', '1 post per client/mo'] },
  starter: {
    price: 49, sites: 5, postsPerSite: 5,
    features: ['5 client sites', '5 posts per client/mo', 'AI blog generation', 'SEO meta output', 'WordPress publish', 'Per-client brand voice'],
  },
  growth: {
    price: 99, sites: 15, postsPerSite: 4,
    features: ['15 client sites', '60 posts/mo total', 'Everything in Freelancer Starter', 'AI hero images', 'Data tables & charts', 'Autoblog scheduler', 'Social repurposing', 'YouTube & URL to blog'],
  },
  agency: {
    price: 149, sites: 40, postsPerSite: 4,
    features: ['40 client sites', '175 posts/mo total', 'Everything in Growth', 'LocalFalcon grid rankings', 'White-label client portal', 'Client reports'],
  },
  agency_max: {
    price: 299, sites: 150, postsPerSite: 3,
    features: ['Up to 150 client sites', '500 posts/mo total', 'Everything in Agency', 'White-label domain', 'Custom integrations', '24/7 support'],
  },
}

export default function LimitReachedModal({
  currentPlan,
  clientName,
  onClose,
}: {
  currentPlan: PlanKey
  clientName?: string | null
  onClose: () => void
}) {
  const nextPlanKey = NEXT_PLAN[currentPlan]
  const nextPlan = nextPlanKey ? PLAN_DETAILS[nextPlanKey] : null
  const nextPlanLabel = nextPlanKey ? PLAN_LABELS[nextPlanKey] : null
  const currentLabel = PLAN_LABELS[currentPlan]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-[#12121a] border border-violet-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#555570] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Monthly limit reached</p>
              <p className="text-[#8888a8] text-xs">
                {clientName
                  ? `${clientName} has used all posts for this month on your ${currentLabel} plan.`
                  : `You've used all posts for this month on your ${currentLabel} plan.`}
              </p>
            </div>
          </div>

          {nextPlan && nextPlanKey && nextPlanLabel ? (
            <>
              {/* Upgrade section */}
              <div className="bg-gradient-to-br from-[#1a1226] to-[#12121a] border border-violet-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 uppercase tracking-wider">
                      {nextPlanLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold text-xl">${nextPlan.price}</span>
                    <span className="text-[#8888a8] text-xs">/mo</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {nextPlan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[#c8c8d8] text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {currentPlan === 'free' && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-xs font-bold">Early access: 50% off for 1 year</p>
                    <p className="text-yellow-200/60 text-xs mt-0.5">Use code <strong className="text-yellow-300">EARLY50</strong> at checkout — limited spots remaining</p>
                  </div>
                </div>
              )}
              <a
                href={currentPlan === 'free' ? '/billing?coupon=sn28Uv8i' : '/billing'}
                className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors"
              >
                <Zap className="w-4 h-4" />
                Upgrade to {nextPlanLabel}
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[#555570] text-xs text-center mt-2">Cancel anytime · No contracts</p>
            </>
          ) : (
            /* Already on top plan */
            <div className="text-center py-4">
              <p className="text-[#8888a8] text-sm mb-4">You're already on our highest plan. Your limits reset at the start of next month.</p>
              <a href="/billing" className="text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                View billing <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-3 w-full text-[#555570] hover:text-[#8888a8] text-xs transition-colors py-1"
          >
            Maybe later — limits reset monthly
          </button>
        </div>
      </div>
    </div>
  )
}
