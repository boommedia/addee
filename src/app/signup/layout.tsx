import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start Free — 7-Day Trial',
  description: 'Start your free 7-day Bloggy trial. No credit card required. Generate AI blog posts, publish to WordPress, and scale content for all your clients from day one.',
  keywords: ['Bloggy free trial', 'sign up Bloggy', 'AI blog automation trial', 'blog automation software signup'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://bloggy.online/signup' },
  openGraph: {
    title: 'Start Your Free Bloggy Trial — AI Blog Automation for Agencies',
    description: 'No credit card required. 7-day free trial. Generate, optimize, and publish SEO blog posts for all your clients.',
    url: 'https://bloggy.online/signup',
    type: 'website',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Start Free with Bloggy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start Your Free Bloggy Trial',
    description: 'No credit card required. 7-day free trial. Generate, optimize, and publish SEO blog posts for all your clients.',
    images: ['https://bloggy.online/og-image.png'],
    site: '@GetBloggy',
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
