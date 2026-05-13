import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import YouTubeToBlogClient from './YouTubeToBlogClient'

export const metadata = {
  title: 'YouTube to Blog',
  description: 'Turn any YouTube video into a full blog post using the transcript. Paste a YouTube URL and Bloggy does the rest.',
  robots: { index: false, follow: false },
}

export default async function YouTubeToBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: clients } = user
    ? await supabase.from('clients').select('id, name, brand_voice').eq('created_by', user.id).order('name')
    : { data: [] }

  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0]">
      <AppNav active="/tools" />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-red-600/15 border border-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-sm font-black">▶</span>
            </div>
            <h1 className="text-2xl font-bold text-white">YouTube to Blog</h1>
          </div>
          <p className="text-[#8888a8] text-sm ml-10">Paste a YouTube video URL — Bloggy extracts the transcript and turns it into a structured, SEO-optimized blog post.</p>
        </div>
        <YouTubeToBlogClient clients={clients ?? []} />
      </main>
    </div>
  )
}
