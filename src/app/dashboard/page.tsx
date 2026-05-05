import AppNav from '@/components/AppNav'

import Logo from '@/components/Logo'

import { createClient } from '@/lib/supabase/server'

import { logout } from '@/app/auth/actions'

import GenerateForm from '@/components/GenerateForm'

import OnboardingChecklist from '@/components/OnboardingChecklist'

import DashboardStats from '@/components/DashboardStats'

export const metadata = {
  title: 'Generate — Bloggy',
  description: 'AI blog post generator. Create SEO-optimized blog posts for your clients from topics, URLs, or YouTube videos.',
  robots: { index: false, follow: false },
}

export default async function HomePage({

  searchParams,

}: {

  searchParams: Promise<{ client?: string; prompt?: string; tone?: string; length?: string; keywords?: string }>

}) {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'

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

    { id: 'client', label: 'Add your first client', description: 'Create a client profile with name, brand voice, and industry.', href: '/clients', done: hasClients },

    { id: 'wp', label: 'Connect WordPress', description: 'Add WordPress credentials to publish posts directly.', href: '/clients', done: hasWP },

    { id: 'post', label: 'Generate your first post', description: 'Enter a topic or brief and let Bloggy write it.', href: '#generate', done: hasPost },

    { id: 'autoblog', label: 'Queue autoblog topics', description: 'Set up automated publishing for a client.', href: '/autoblog', done: hasTopics },

  ]

  return (

    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">

      <AppNav active="/dashboard" />

      <main className="max-w-6xl mx-auto px-6 py-10" id="generate">

        <div className="mb-8">

          <h1 className="text-2xl font-bold text-white mb-1">Generate Blog Post</h1>

          <p className="text-[#8888a8] text-sm">Enter a topic or brief → Bloggy will write a publish-ready SEO blog post.</p>

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


