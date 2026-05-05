import AppNav from '@/components/AppNav'

import Logo from '@/components/Logo'

import { createClient } from '@/lib/supabase/server'

import { logout } from '@/app/auth/actions'

import ClientList from '@/components/ClientList'

import ClientForm from '@/components/ClientForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Clients — Bloggy',
  description: 'Manage all your client sites, brand voice settings, WordPress credentials, and target keywords from one dashboard.',
  robots: { index: false, follow: false },
}

export default async function ClientsPage() {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [

    { data: clients },

    { data: sub },

    { data: monthPosts },

  ] = await Promise.all([

    supabase

      .from('clients')

      .select('id, name, industry, website, brand_voice, wp_url, wp_username, wp_app_password, logo_url, primary_color, brand_guidelines, target_keywords, contact_email, created_at')

      .eq('created_by', user!.id)

      .order('name'),

    supabase.from('subscriptions').select('posts_limit, sites_limit').eq('user_id', user!.id).single(),

    supabase.from('posts').select('client_id').eq('created_by', user!.id).gte('created_at', periodStart),

  ])

  const postsLimit = sub?.posts_limit ?? 2

  const sitesLimit = sub?.sites_limit ?? 2

  const perClientLimit = Math.floor(postsLimit / Math.max(1, sitesLimit))

  // Count posts per client this month

  const postCountByClient: Record<string, number> = {}

  for (const post of monthPosts ?? []) {

    if (post.client_id) postCountByClient[post.client_id] = (postCountByClient[post.client_id] ?? 0) + 1

  }

  return (

    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">

      <AppNav active="/clients" />

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-2xl font-bold text-white mb-1">Clients</h1>

            <p className="text-[#8888a8] text-sm">Manage client profiles and brand voice settings.</p>

          </div>

          <ClientForm />

        </div>

        <ClientList clients={clients ?? []} postCountByClient={postCountByClient} perClientLimit={perClientLimit} />

      </main>

    </div>

  )

}

