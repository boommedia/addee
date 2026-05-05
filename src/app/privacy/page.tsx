import Logo from '@/components/Logo'

export const metadata = {
  title: 'Privacy Policy',
  description: "Bloggy's Privacy Policy — how we collect, store, and protect your data when using Bloggy AI blog automation software by Boom Media.",
  alternates: { canonical: 'https://bloggy.online/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy',
    description: "Bloggy's Privacy Policy — how we collect, store, and protect your data.",
    url: 'https://bloggy.online/privacy',
    type: 'website',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Bloggy Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggy Privacy Policy',
    description: "Bloggy's Privacy Policy — how we collect, store, and protect your data.",
    images: ['https://bloggy.online/og-image.png'],
    site: '@GetBloggy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <nav className="border-b border-[#2a2a3d] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/"><Logo /></a>
          <a href="/login" className="text-[#8888a8] hover:text-white text-sm transition-colors">Sign in</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-[#8888a8] text-sm mb-10">Last updated: April 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-[#c8c8d8] text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Account data:</strong> Email address, password (hashed), and profile information</li>
              <li><strong className="text-white">Client data:</strong> Client names, websites, brand voice settings, and WordPress credentials you enter</li>
              <li><strong className="text-white">Content data:</strong> Topics, prompts, and generated blog posts stored in your account</li>
              <li><strong className="text-white">Billing data:</strong> Payment information processed and stored by Stripe — we never see your full card number</li>
              <li><strong className="text-white">Usage data:</strong> Post counts, word counts, and feature usage for plan enforcement and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide and improve the Service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (usage alerts, billing receipts, plan updates)</li>
              <li>Monitor platform health and prevent abuse</li>
              <li>Respond to support requests</li>
            </ul>
            <p className="mt-3">We do not sell your data to third parties. We do not use your generated content to train AI models.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. WordPress Credentials</h2>
            <p>WordPress application passwords you provide are stored encrypted in our database and are used solely to publish posts to your specified WordPress sites. We do not access your WordPress sites for any other purpose.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Supabase</strong> — database and authentication</li>
              <li><strong className="text-white">Anthropic (Claude)</strong> — AI content generation</li>
              <li><strong className="text-white">Stripe</strong> — payment processing</li>
              <li><strong className="text-white">Resend</strong> — transactional email delivery</li>
              <li><strong className="text-white">Vercel</strong> — hosting and infrastructure</li>
            </ul>
            <p className="mt-3">Each of these services has its own privacy policy governing their handling of data.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Data Retention</h2>
            <p>We retain your data for as long as your account is active. Upon account cancellation, data is retained for 30 days before deletion. You may request immediate deletion by contacting support.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Security</h2>
            <p>We use industry-standard security measures including encryption in transit (HTTPS), encrypted storage for sensitive credentials, and role-based access controls. No method of transmission over the internet is 100% secure — we encourage you to use a strong, unique password.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your content at any time</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:support@bloggy.online" className="text-violet-400 hover:text-violet-300">support@bloggy.online</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Cookies</h2>
            <p>We use session cookies for authentication only. We do not use tracking cookies or third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy periodically. We will notify users of material changes by email. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Contact</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:support@bloggy.online" className="text-violet-400 hover:text-violet-300">support@bloggy.online</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#2a2a3d] py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4 text-xs text-[#555570]">
          <span>© 2025 Boom Media. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
