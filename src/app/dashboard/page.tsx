import AppNav from '@/components/AppNav'

import Logo from '@/components/Logo'

import { createClient } from '@/lib/supabase/server'

import { logout } from '@/app/auth/actions'

import GenerateForm from '@/components/GenerateForm'

import OnboardingChecklist from '@/components/OnboardingChecklist'

import DashboardStats from '@/components/DashboardStats'

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

  return (

    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#060d1a' }}>

      <AppNav active="/dashboard" />

      <main className="max-w-6xl mx-auto px-6 py-10" id="generate">

        <div className="mb-8">

          <h1 className="text-2xl font-bold text-white mb-1">Generate AD Creative</h1>

          <p className="text-sm" style={{ color: '#7a90b8' }}>Enter a campaign brief → AdDee writes 3 platform-ready AD variations in your brand voice.</p>

        </div>

        <DashboardStats
          postsThisMonth={postsThisMonth ?? 0}
          postsLimit={sub?.posts_limit ?? 2}
          wordsThisMonth={wordsThisMonth}
          activeClients={clients?.length ?? 0}
          lastPostTitle={lastPost?.[0]?.title ?? null}
          lastPostDate={lastPost?.[0]?.created_at ?? null}
        />

        <OnboardingChecklist steps={onboardingSteps} />

        <GenerateForm

          clients={clients ?? []}

          preselectedClientId={preselectedClientId}

          prefilledPrompt={prefilledPrompt}

          prefilledTone={prefilledTone}

          prefilledLength={prefilledLength}

          prefilledKeywords={prefilledKeywords}

          currentPlan={currentPlan as 'free' | 'starter' | 'growth' | 'agency' | 'agency_max'}

        />

      </main>

    </div>

  )

}


