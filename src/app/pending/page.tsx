import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Account Under Review — Bloggy',
  robots: 'noindex,nofollow',
}

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // If user is approved, send them to home
  const { data: approval } = await supabase
    .from('user_approvals')
    .select('status')
    .eq('user_id', user.id)
    .single()

  if (approval?.status === 'approved' || user.email === 'eric@boommedia.us') {
    redirect('/home')
  }

  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <Logo className="h-12 mx-auto mb-6" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Account under review</h1>

        <p className="text-[#8888a8] text-sm leading-relaxed mb-8">
          We manually review every agency signup. You'll receive an email at <strong className="text-white">{user.email}</strong> once you're approved — usually within 24 hours.
        </p>

        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-6 mb-8">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[#8888a8] text-xs">Checking your application…</p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-[#8888a8] hover:text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
