import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { Globe } from 'lucide-react'
import UrlToBlogClient from './UrlToBlogClient'

export const metadata = {
  title: 'URL to Blog',
  description: 'Turn any webpage or article into a unique, SEO-optimized blog post. Paste a URL and Bloggy rewrites it.',
  robots: { index: false, follow: false },
}

export default async function UrlToBlogPage() {
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
            <div className="w-8 h-8 rounded-lg bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">URL to Blog</h1>
          </div>
          <p className="text-[#8888a8] text-sm ml-10">Paste any webpage URL — Bloggy fetches the content and rewrites it as a unique, SEO-optimized blog post.</p>
        </div>
        <UrlToBlogClient clients={clients ?? []} />
      </main>
    </div>
  )
}
