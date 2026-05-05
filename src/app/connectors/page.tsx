import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trash2, Plus, TrendingUp, Search, CheckCircle, ArrowRight } from 'lucide-react'
import WebhookSettings from '@/app/settings/WebhookSettings'
import { googleIndexingConfigured } from '@/lib/google-indexing'

export const metadata = {
  title: 'Connectors',
  description: 'Connect Google services and set up webhooks.',
  robots: { index: false, follow: false },
}

export default async function ConnectorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: gscTokens } = await supabase
    .from('gsc_tokens')
    .select('site_url')
    .eq('user_id', user.id)

  const indexingConfigured = googleIndexingConfigured()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/connectors" />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Connectors</h1>
          <p className="text-[#8888a8] text-sm">Connect Google services and set up webhooks for your account.</p>
        </div>

        {/* Google Search Console */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-white font-semibold text-sm">Google Search Console</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            <p className="text-[#8888a8] text-sm">Connect GSC to see real impressions, clicks, CTR, and rankings for your clients' sites directly in Bloggy Analytics.</p>

            {gscTokens && gscTokens.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {gscTokens.map(token => (
                    <div key={token.site_url} className="flex items-center justify-between bg-[#0a0a0f]/60 border border-[#2a2a3d] rounded-lg p-3">
                      <div className="text-sm text-white">{token.site_url}</div>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Connected
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="/api/gsc/oauth"
                  className="inline-flex items-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Site
                </a>
              </div>
            ) : (
              <a
                href="/api/gsc/oauth"
                className="inline-flex items-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Connect Google Search Console
              </a>
            )}
            <p className="text-[#555570] text-xs">Requires <code className="text-[#8888a8]">GOOGLE_CLIENT_ID</code> and <code className="text-[#8888a8]">GOOGLE_CLIENT_SECRET</code> env vars (Google Cloud OAuth 2.0 credentials).</p>
          </div>
        </div>

        {/* Per-Client Integrations */}
        <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold text-sm mb-2">Per-Client Integrations</h3>
          <p className="text-[#8888a8] text-sm mb-3">Google Business Profile and LinkedIn are managed per-client to support multiple locations and pages. To connect these platforms:</p>
          <ol className="space-y-2 text-[#8888a8] text-sm">
            <li className="flex gap-3">
              <span className="shrink-0">1.</span>
              <span>Go to <strong className="text-white">Clients</strong> → select a client</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0">2.</span>
              <span>Click the <strong className="text-white">Integrations</strong> tab</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0">3.</span>
              <span>Click <strong className="text-white">Connect</strong> for Google Business or LinkedIn</span>
            </li>
          </ol>
        </div>

        {/* Google Indexing API */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#2a2a3d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Google Indexing API</h2>
            </div>
            {indexingConfigured ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Configured
              </span>
            ) : (
              <span className="text-xs text-[#8888a8]">Not configured</span>
            )}
          </div>
          <div className="px-5 py-4 space-y-4">
            <p className="text-[#8888a8] text-sm leading-relaxed">
              Automatically notify Google to index new posts the moment they are published to WordPress.
              Set up a Google Cloud service account and add the credentials as environment variables.
            </p>
            <ol className="space-y-2 text-sm text-[#b0b0c8]">
              {[
                'Go to console.cloud.google.com → create a new project (e.g. "Bloggy Indexing")',
                'Enable the "Web Search Indexing API" in APIs & Services → Library',
                'Go to IAM & Admin → Service Accounts → Create Service Account',
                'After creating, open the account → Keys → Add Key → JSON → download the file',
                'In Vercel Dashboard → bloggy project → Settings → Environment Variables, add:',
                'For each client site, go to Google Search Console → Settings → Users and permissions → Add user → paste the service account email → set role to Owner',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#1e1e2e] border border-[#2a2a3d] text-[10px] flex items-center justify-center text-[#8888a8] font-mono">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="bg-[#0e0e18] border border-[#2a2a3d] rounded-xl p-4 font-mono text-xs space-y-1 text-[#b0b0c8]">
              <div><span className="text-violet-400">GOOGLE_SERVICE_ACCOUNT_EMAIL</span> = your-sa@your-project.iam.gserviceaccount.com</div>
              <div><span className="text-violet-400">GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</span> = -----BEGIN PRIVATE KEY-----\n...</div>
            </div>
            <p className="text-[#555570] text-xs">
              Tip: copy the <code className="text-[#8888a8]">private_key</code> value from the downloaded JSON file exactly as-is → Vercel handles the multi-line string correctly.
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mb-6">
          <h3 className="text-white font-semibold text-sm mb-3">Coming Soon</h3>
          <div className="space-y-2">
            {[
              { name: 'Medium', desc: 'Publish directly to your Medium publication' },
              { name: 'Dev.to', desc: 'Sync and publish to Dev.to communities' },
            ].map(p => (
              <div key={p.name} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-sm">{p.name}</div>
                  <div className="text-xs text-[#8888a8] mt-1">{p.desc}</div>
                </div>
                <span className="text-xs font-semibold text-[#555570] bg-[#0a0a0f] px-3 py-1.5 rounded-lg">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks & Zapier */}
        <WebhookSettings />
      </main>
    </div>
  )
}
