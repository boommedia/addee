import AppNav from '@/components/AppNav'
import { Share2 } from 'lucide-react'
import RepurposeClient from './RepurposeClient'

export const metadata = {
  title: 'Content Repurposer',
  description: 'Repurpose any blog post into LinkedIn, X/Twitter, Instagram, TikTok, Facebook, Pinterest, and more.',
  robots: { index: false, follow: false },
}

export default function RepurposePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/tools" />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-pink-600/15 border border-pink-500/20 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-pink-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Content Repurposer</h1>
          </div>
          <p className="text-[#8888a8] text-sm ml-10">Paste any blog post and repurpose it into 9 social media formats — LinkedIn, X, Instagram, TikTok, Facebook, Pinterest, Threads, Google Business, and YouTube.</p>
        </div>
        <RepurposeClient />
      </main>
    </div>
  )
}
