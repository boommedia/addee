import AppNav from '@/components/AppNav'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { ChevronRight, Sparkles, RefreshCw, Layers, Film, Copy, Lock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Generate — AdDee',
  description: 'AI ad creative generator. Create ready-to-publish ad creatives for your brands in seconds.',
  robots: { index: false, follow: false },
}

export default async function HomePage({

  searchParams,

}: {

  searchParams: Promise<{ client?: string; prompt?: string; tone?: string; length?: string; keywords?: string }>

}) {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = user?.email === 'eric@boommedia.us'

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [{ data: clients }, { data: sub }, { count: postsThisMonth }, { data: wordData }, { data: lastPost }] = await Promise.all([

    isAdmin
      ? supabase.from('clients').select('id, name, brand_voice, wp_url, contact_email').order('name')
      : supabase.from('clients').select('id, name, brand_voice, wp_url, contact_email').eq('created_by', user!.id).order('name'),

    supabase.from('subscriptions').select('plan, status, posts_limit, sites_limit').eq('user_id', user!.id).single(),

    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user!.id).gte('created_at', monthStart),

    supabase.from('posts').select('word_count').eq('created_by', user!.id).gte('created_at', monthStart),

    supabase.from('posts').select('title, created_at').eq('created_by', user!.id).order('created_at', { ascending: false }).limit(1),

  ])

  const wordsThisMonth = wordData?.reduce((s, p) => s + (p.word_count ?? 0), 0) ?? 0

  const currentPlan = (sub?.status === 'active' ? sub?.plan : 'free') ?? 'free'

  const { client: preselectedClientId, prompt: prefilledPrompt, tone: prefilledTone, length: prefilledLength, keywords: prefilledKeywords } = await searchParams

  // Onboarding checks

  const hasClients = (clients?.length ?? 0) > 0

  const hasWP = clients?.some(c => c.wp_url) ?? false

  const { count: postCount } = await supabase

    .from('posts')

    .select('*', { count: 'exact', head: true })

    .eq('created_by', user!.id)

  const clientIds = (clients ?? []).map(c => c.id)

  const { count: topicCount } = clientIds.length > 0 ? await supabase

    .from('topic_queue')

    .select('*', { count: 'exact', head: true })

    .in('client_id', clientIds) : { count: 0 }

  const hasPost = (postCount ?? 0) > 0

  const hasTopics = (topicCount ?? 0) > 0

  const onboardingSteps = [

    { id: 'brand', label: 'Add your first brand', description: 'Create a brand profile with name, voice guidelines, and target audience.', href: '/brands', done: hasClients },

    { id: 'campaign', label: 'Create a campaign brief', description: 'Set up your first campaign with platform, format, and messaging goals.', href: '/campaigns', done: hasWP },

    { id: 'ad', label: 'Generate your first AD', description: 'Enter a brief and let AdDee write 3 variations instantly.', href: '#generate', done: hasPost },

    { id: 'publish', label: 'Connect a platform', description: 'Link Instagram, LinkedIn, TikTok or Google Ads to publish directly.', href: '/connectors', done: hasTopics },

  ]

  const services = [
    { id: 'formats', icon: Sparkles, title: 'Choose Format & Platform', desc: 'Select platform (Instagram, TikTok, LinkedIn, Google Ads) and format (single image, carousel, video script)', href: '#generate', available: true },
    { id: 'remix', icon: RefreshCw, title: 'Remix a Winning Ad', desc: 'Paste an existing high-converting ad and remix it for your brand', href: '#remix', available: true },
    { id: 'variants', icon: Layers, title: 'Generate A/B Variants', desc: 'Create conservative + aggressive versions to test what resonates', href: '#variants', available: true },
    { id: 'scripts', icon: Film, title: 'Video Scripts', desc: 'Generate TikTok, Reels, and YouTube Shorts scripts with hooks and CTAs', href: '#scripts', available: true },
    { id: 'copy', icon: Copy, title: 'Copy Variations', desc: 'Short (150 chars) + Long (300 chars) + Caption styles for different needs', href: '#copy', available: true },
  ]

  const addons = [
    { icon: Sparkles, title: 'Video Preview Mockups', desc: 'See how generated copy looks on video templates', comingSoon: true },
    { icon: Sparkles, title: 'Hashtag & Keyword Suggestions', desc: 'Auto-generate trending hashtags and keywords for each ad', comingSoon: true },
    { icon: Sparkles, title: 'Image Brief Generation', desc: 'Get AI-generated image descriptions and design requirements', comingSoon: true },
    { icon: Film, title: 'Actual Video Generation', desc: 'Auto-create videos with voiceover and animations (Runway, Synthesia)', comingSoon: true },
    { icon: Sparkles, title: 'AI Image Generation', desc: 'Generate custom images with DALL-E or Midjourney integration', comingSoon: true },
    { icon: Sparkles, title: 'Direct Platform Publishing', desc: 'Publish ADs directly to Instagram, TikTok, LinkedIn, Google Ads', comingSoon: true },
    { icon: Sparkles, title: 'Performance Analytics', desc: 'Track impressions, clicks, CTR, and ROI across platforms', comingSoon: true },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <AppNav active="/dashboard" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0066FF' }}>Generate Your First AD</h1>
          <p className="text-lg text-gray-600">Pick a format and let AdDee create 3 platform-ready variations in your brand voice</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-3xl font-bold" style={{ color: '#0066FF' }}>{postsThisMonth ?? 0}/{sub?.posts_limit ?? 2}</div>
            <div className="text-sm text-gray-600 mt-1">ADs this month</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-3xl font-bold" style={{ color: '#0066FF' }}>{clients?.length ?? 0}</div>
            <div className="text-sm text-gray-600 mt-1">Brands</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-3xl font-bold" style={{ color: '#0066FF' }}>{wordsThisMonth}</div>
            <div className="text-sm text-gray-600 mt-1">Words generated</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-3xl font-bold" style={{ color: lastPost?.[0]?.title ? '#00FF00' : '#999' }}>
              {lastPost?.[0]?.title ? '✓' : '—'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Last AD created</div>
          </div>
        </div>

        {/* Available Services */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1f2937' }}>Available Services</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <Link key={service.id} href={service.href} className="block group">
                <div className="bg-white border-2 rounded-lg p-5 hover:shadow-lg transition" style={{ borderColor: '#0066FF' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0066FF, #0055FF)' }}>
                        <service.icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:" style={{ color: '#0066FF' }}>{service.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{service.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition mt-1" size={24} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon Addons */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1f2937' }}>Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 relative">
                <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
                  Coming Soon
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center opacity-50" style={{ background: 'linear-gradient(135deg, #0066FF, #0055FF)' }}>
                    <addon.icon className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{addon.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{addon.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )

}


