import AppNav from '@/components/AppNav'

import Logo from '@/components/Logo'

import { createClient } from '@/lib/supabase/server'

import { logout } from '@/app/auth/actions'

import { redirect } from 'next/navigation'

import TeamSettings from './TeamSettings'

import WhiteLabelSettings from './WhiteLabelSettings'

import WebhookSettings from './WebhookSettings'

import { FileText, BarChart2, CreditCard, ChevronRight, Search, CheckCircle, TrendingUp, Link2 } from 'lucide-react'

import { googleIndexingConfigured } from '@/lib/google-indexing'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Settings — AdDee',
  description: 'Manage account settings, team members, white-label branding, and Google Indexing API configuration.',
  robots: { index: false, follow: false },
}

export default async function SettingsPage() {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: invitations } = await supabase

    .from('team_invitations')

    .select('id, email, accepted_at, created_at')

    .eq('owner_user_id', user.id)

    .order('created_at', { ascending: false })

  const { data: members } = await supabase

    .from('team_members')

    .select('id, role, created_at, member_user_id')

    .eq('owner_user_id', user.id)

    .order('created_at', { ascending: false })

  const { data: sub } = await supabase

    .from('subscriptions')

    .select('plan')

    .eq('user_id', user.id)

    .single()

  const whiteLabelName = (user.user_metadata?.white_label_name as string) ?? ''

  const isPlanEligible = sub?.plan === 'agency_max'

  const indexingConfigured = googleIndexingConfigured()

  return (
    <div className="min-h-screen" style={{ background: '#0a0900', color: '#dde4f0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/settings" />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#84cc16' }}>Settings</h1>
          <p className="text-sm" style={{ color: '#b8a870' }}>Manage your team and account preferences.</p>
        </div>
        <div className="space-y-6">
          {/* Quick links */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
            <div className="px-5 py-3" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>
              <h2 className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Account</h2>
            </div>
            <div style={{ borderColor: 'rgba(202,138,4,0.2)' }} className="divide-y">

              {[

                { href: '/posts',   icon: <FileText className="w-4 h-4 text-violet-400" />,  label: 'Post History',  desc: 'View all generated posts' },

                { href: '/account', icon: <BarChart2 className="w-4 h-4 text-cyan-400" />,   label: 'Usage',         desc: 'Monitor posts and words used this month' },

                { href: '/connectors', icon: <Link2 className="w-4 h-4 text-pink-400" />, label: 'Connectors', desc: 'Connect social platforms and APIs' },

                { href: '/billing', icon: <CreditCard className="w-4 h-4 text-emerald-400" />, label: 'Billing',     desc: 'Manage your plan and subscription' },

              ].map(({ href, icon, label, desc }) => (

                <a key={href} href={href} className="flex items-center gap-4 px-5 py-4 transition-colors group" style={{ background: 'transparent' }}>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(202,138,4,0.1)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: '#dde4f0' }}>{label}</div>
                    <div className="text-xs" style={{ color: '#b8a870' }}>{desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-colors shrink-0" style={{ color: '#b8a870' }} />

                </a>

              ))}

            </div>

          </div>

          <TeamSettings

            ownerEmail={user.email ?? ''}

            invitations={invitations ?? []}

            members={members ?? []}

          />

          <WhiteLabelSettings

            currentName={whiteLabelName}

            isPlanEligible={isPlanEligible}

          />

          <WebhookSettings />

          {/* Google Search Console */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Google Search Console</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm" style={{ color: '#b8a870' }}>Connect GSC to see real impressions, clicks, CTR, and rankings for your clients' sites directly in AdDee Analytics.</p>
              <a
                href="/api/gsc/oauth"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors" style={{ color: 'white', background: '#ca8a04', border: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Connect Google Search Console
              </a>
              <p className="text-xs" style={{ color: '#b8a870' }}>Requires <code style={{ color: '#b8a870' }}>GOOGLE_CLIENT_ID</code> and <code style={{ color: '#b8a870' }}>GOOGLE_CLIENT_SECRET</code> env vars (Google Cloud OAuth 2.0 credentials).</p>
            </div>
          </div>

          {/* Google Indexing API */}

          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid' }}>

            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottomColor: 'rgba(202,138,4,0.2)', borderBottom: '1px solid' }}>

              <div className="flex items-center gap-2">

                <Search className="w-4 h-4 text-blue-400" />

                <h2 className="font-semibold text-sm" style={{ color: '#dde4f0' }}>Google Indexing API</h2>

              </div>

              {indexingConfigured ? (

                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">

                  <CheckCircle className="w-3.5 h-3.5" /> Configured

                </span>

              ) : (

                <span className="text-xs" style={{ color: '#b8a870' }}>Not configured</span>

              )}

            </div>

            <div className="px-5 py-4 space-y-4">

              <p className="text-sm leading-relaxed" style={{ color: '#b8a870' }}>

                Automatically notify Google to index new posts the moment they are published to WordPress.

                Set up a Google Cloud service account and add the credentials as environment variables.

              </p>

              <ol className="space-y-2 text-sm" style={{ color: '#dde4f0' }}>

                {[

                  'Go to console.cloud.google.com â create a new project (e.g. "Bloggy Indexing")',

                  'Enable the "Web Search Indexing API" in APIs & Services â Library',

                  'Go to IAM & Admin â Service Accounts â Create Service Account',

                  'After creating, open the account â Keys â Add Key â JSON â download the file',

                  'In Vercel Dashboard â bloggy project â Settings â Environment Variables, add:',

                  'For each client site, go to Google Search Console â Settings â Users and permissions â Add user â paste the service account email â set role to Owner',

                ].map((step, i) => (

                  <li key={i} className="flex gap-3">

                    <span className="shrink-0 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono" style={{ background: 'rgba(202,138,4,0.1)', borderColor: 'rgba(202,138,4,0.3)', border: '1px solid', color: '#b8a870' }}>{i + 1}</span>

                    <span>{step}</span>

                  </li>

                ))}

              </ol>

              <div className="rounded-xl p-4 font-mono text-xs space-y-1" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(202,138,4,0.2)', border: '1px solid', color: '#dde4f0' }}>

                <div><span className="text-violet-400">GOOGLE_SERVICE_ACCOUNT_EMAIL</span> = your-sa@your-project.iam.gserviceaccount.com</div>

                <div><span className="text-violet-400">GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</span> = -----BEGIN PRIVATE KEY-----\n...</div>

              </div>

              <p className="text-xs" style={{ color: '#b8a870' }}>

                Tip: copy the <code style={{ color: '#b8a870' }}>private_key</code> value from the downloaded JSON file exactly as-is â Vercel handles the multi-line string correctly.

              </p>

            </div>

          </div>

        </div>

      </main>

    </div>

  )

}

