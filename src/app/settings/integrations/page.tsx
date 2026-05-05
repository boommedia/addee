import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Trash2, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Integrations',
  description: 'Connect social platforms and content publishing APIs.',
  robots: { index: false, follow: false },
}

export default async function IntegrationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: userIntegrations } = await supabase
    .from('user_integrations')
    .select('platform, account_name')
    .eq('user_id', user.id)

  const platforms = [
    { platform: 'linkedin', name: 'LinkedIn' },
    { platform: 'gmb', name: 'Google Business Profile' },
    { platform: 'medium', name: 'Medium' },
    { platform: 'devto', name: 'Dev.to' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/settings" />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Integrations</h1>
          <p className="text-[#8888a8] text-sm">Connect social platforms and content publishing APIs to expand Bloggy capabilities.</p>
        </div>

        <div className="space-y-4">
          {platforms.map(p => {
            const connected = userIntegrations?.some(ui => ui.platform === p.platform)
            const accountName = userIntegrations?.find(ui => ui.platform === p.platform)?.account_name
            return (
              <div key={p.platform} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">{p.name}</div>
                  {connected ? (
                    <div className="text-xs text-emerald-400">
                      {accountName ? `Connected as ${accountName}` : 'Connected'}
                    </div>
                  ) : (
                    <div className="text-xs text-[#8888a8]">Not connected</div>
                  )}
                </div>
                <div className="flex gap-2">
                  {connected ? (
                    <form action={`/api/integrations/disconnect`} method="POST">
                      <input type="hidden" name="platform" value={p.platform} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        Disconnect
                      </button>
                    </form>
                  ) : (
                    <form action={`/api/integrations/connect`} method="POST">
                      <input type="hidden" name="platform" value={p.platform} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" />
                        Connect
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
