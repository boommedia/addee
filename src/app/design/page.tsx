import AppNav from '@/components/AppNav'
import DesignStudio from '@/components/DesignStudio'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Design Studio — AdDee',
  description: 'Create visual ad creatives with DALL-E 3 AI image generation and Canva templates.',
  robots: { index: false, follow: false },
}

export default async function DesignPage({
  searchParams,
}: {
  searchParams: Promise<{ copy?: string; platform?: string; prompt?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { copy, platform, prompt } = await searchParams

  return (
    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#0a0900', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/design" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#ca8a04' }}>Design Studio</h1>
          <p style={{ color: '#b8a870' }}>
            Generate AI background images with DALL-E 3 · Design your ad in Canva · Adobe Express integration coming soon
          </p>
        </div>

        <DesignStudio
          initialCopy={copy ?? ''}
          initialPlatform={platform ?? 'instagram_post'}
          initialPrompt={prompt ?? ''}
        />
      </main>
    </div>
  )
}
