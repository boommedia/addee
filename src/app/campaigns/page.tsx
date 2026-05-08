import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, brands(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen p-8" style={{ background: '#060d1a', color: '#dde4f0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/campaigns" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#00FF00' }}>Ad Campaigns</h1>
            <p className="mt-2" style={{ color: '#7a90b8' }}>Create and manage your ad campaigns</p>
          </div>
          <Link
            href="/campaigns/new"
            className="px-6 py-3 rounded-lg transition hover:opacity-90"
            style={{ background: '#0066FF', color: 'white' }}
          >
            New Campaign
          </Link>
        </div>

        {campaigns && campaigns.length > 0 ? (
          <div className="grid gap-4">
            {campaigns.map((campaign: any) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="block p-6 rounded-lg border transition hover:border-blue-400"
                style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)' }}
              >
                <h2 className="text-xl font-semibold" style={{ color: '#dde4f0' }}>{campaign.name}</h2>
                <p className="mt-2" style={{ color: '#7a90b8' }}>{campaign.description}</p>
                <div className="flex gap-6 mt-4 text-sm" style={{ color: '#7a90b8' }}>
                  <span><strong style={{ color: '#dde4f0' }}>Brand:</strong> {campaign.brands?.name}</span>
                  <span><strong style={{ color: '#dde4f0' }}>Platforms:</strong> {JSON.stringify(campaign.platforms).replace(/"/g, '')}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="mb-4" style={{ color: '#7a90b8' }}>No campaigns yet. Create your first one!</p>
            <Link
              href="/campaigns/new"
              className="inline-block px-6 py-3 rounded-lg transition hover:opacity-90"
              style={{ background: '#0066FF', color: 'white' }}
            >
              Create Campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
