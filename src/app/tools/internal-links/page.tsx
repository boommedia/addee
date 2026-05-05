import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { Link2 } from 'lucide-react'
import InternalLinksClient from './InternalLinksClient'

export const metadata = {
  title: 'Internal Link Suggester',
  description: 'Find the best internal linking opportunities from your published post library using AI.',
  robots: { index: false, follow: false },
}

export default async function InternalLinksPage() {
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
            <div className="w-8 h-8 rounded-lg bg-pink-600/15 border border-pink-500/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-pink-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Internal Link Suggester</h1>
          </div>
          <p className="text-[#8888a8] text-sm ml-10">Paste a blog post and Bloggy scans your published library to suggest the best internal linking opportunities — with ideal anchor text.</p>
        </div>
        <InternalLinksClient clients={clients ?? []} />
      </main>
    </div>
  )
}
