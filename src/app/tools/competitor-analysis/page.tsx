import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { TrendingUp } from 'lucide-react'
import CompetitorClient from './CompetitorClient'

export const metadata = {
  title: 'Competitor Gap Analysis',
  description: 'Find keywords your competitors rank for that you don\'t — then generate targeted content to close the gap.',
  robots: { index: false, follow: false },
}

export default async function CompetitorAnalysisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: clients } = user
    ? await supabase.from('clients').select('id, name, industry, target_keywords').eq('created_by', user.id).order('name')
    : { data: [] }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/tools" />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Competitor Gap Analysis</h1>
          </div>
          <p className="text-[#8888a8] text-sm ml-10">Enter your domain and a competitor's domain to find keywords they rank for that you don't — then generate posts to close the gap.</p>
        </div>
        <CompetitorClient clients={clients ?? []} />
      </main>
    </div>
  )
}
