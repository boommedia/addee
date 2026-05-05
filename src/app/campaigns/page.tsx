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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ad Campaigns</h1>
            <p className="text-foreground/60 mt-2">Create and manage your ad campaigns</p>
          </div>
          <Link
            href="/campaigns/new"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
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
                className="block p-6 border border-foreground/10 rounded-lg hover:border-primary/30 hover:bg-foreground/5 transition"
              >
                <h2 className="text-xl font-semibold text-foreground">{campaign.name}</h2>
                <p className="text-foreground/60 mt-2">{campaign.description}</p>
                <div className="flex gap-6 mt-4 text-sm text-foreground/70">
                  <span><strong className="text-foreground">Brand:</strong> {campaign.brands?.name}</span>
                  <span><strong className="text-foreground">Platforms:</strong> {JSON.stringify(campaign.platforms).replace(/"/g, '')}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-foreground/60 mb-4">No campaigns yet. Create your first one!</p>
            <Link
              href="/campaigns/new"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Create Campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
