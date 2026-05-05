import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing & Plans — Bloggy',
  description: 'Manage your Bloggy subscription, upgrade your plan, add power-up add-ons, apply promo codes, and view your monthly usage.',
  robots: { index: false, follow: false },
}

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
