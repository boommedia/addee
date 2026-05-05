import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'
import BriefClient from './BriefClient'

export const metadata = {
  title: 'Content Brief Generator',
  description: 'Generate a comprehensive content brief with SEO metadata, outline, keywords, and competitor insights.',
  robots: { index: false, follow: false },
}

export default async function BriefPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: clients } = user
    ? await supabase.from('clients').select('id, name').eq('created_by', user.id).order('name')
    : { data: [] }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/tools" />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Content Brief Generator</h1>
          </div>
          <p className="text-[#8888a8] text-sm ml-10">
            Generate a full content brief — outline, SEO metadata, keywords, target audience, competitor insights, and more.
            Then click "Generate Blog Post" to write it instantly.
          </p>
        </div>
        <BriefClient clients={clients ?? []} />
      </main>
    </div>
  )
}
