import Logo from '@/components/Logo'

export const metadata = {
  title: 'Terms of Service',
  description: "Bloggy's Terms of Service — usage policies, content ownership rights, subscription terms, and account rules for Bloggy AI blog automation by Boom Media.",
  alternates: { canonical: 'https://bloggy.online/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Terms of Service',
    description: "Bloggy's Terms of Service — usage policies, content ownership rights, and subscription terms.",
    url: 'https://bloggy.online/terms',
    type: 'website',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Bloggy Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggy Terms of Service',
    description: "Bloggy's Terms of Service — usage policies, content ownership rights, and subscription terms.",
    images: ['https://bloggy.online/og-image.png'],
    site: '@GetBloggy',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <nav className="border-b border-[#2a2a3d] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/"><Logo /></a>
          <a href="/login" className="text-[#8888a8] hover:text-white text-sm transition-colors">Sign in</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-[#8888a8] text-sm mb-10">Last updated: April 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-[#c8c8d8] text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Bloggy ("the Service"), operated by Boom Media, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Description of Service</h2>
            <p>Bloggy is an AI-powered blog automation platform that allows digital marketing agencies and their users to generate, optimize, and publish blog content to WordPress sites. Features include AI content generation, SEO optimization, autoblogging scheduling, and multi-client management.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use. You must be at least 18 years old to use the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Generate spam, misleading, or deceptive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to reverse engineer or circumvent platform limits</li>
              <li>Resell or sublicense access without written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Content Ownership</h2>
            <p>Content you generate using the Service is yours. You retain full ownership of all blog posts, titles, and metadata produced through your account. Boom Media does not claim any rights over your generated content.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Subscriptions and Billing</h2>
            <p>Paid plans are billed monthly. All payments are processed securely through Stripe. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled on a case-by-case basis — contact us within 7 days of a charge if you believe an error has occurred.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Plan Limits</h2>
            <p>Each plan includes a monthly post limit and a maximum number of client sites. Limits reset on the first day of each billing cycle. Unused posts do not roll over. Exceeding limits will prevent new post generation until the next cycle or an upgrade is made.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Service Availability</h2>
            <p>We aim for high availability but do not guarantee uninterrupted access. We may perform maintenance, updates, or experience outages beyond our control. We are not liable for any losses resulting from downtime.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may cancel your account at any time through the billing portal. Upon cancellation, your data is retained for 30 days before deletion.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Boom Media is not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed the amount paid by you in the 3 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">11. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance. We will notify users of material changes by email.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">12. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:support@bloggy.online" className="text-violet-400 hover:text-violet-300">support@bloggy.online</a>.</p>
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
