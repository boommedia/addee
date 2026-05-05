import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Bloggy',
  description: 'Sign in to your Bloggy account to generate, publish, and manage SEO blog posts for all your clients.',
  alternates: { canonical: 'https://bloggy.online/login' },
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
