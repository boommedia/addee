import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { token } = await searchParams

  if (!token) {
    return <JoinError message="Invalid or missing invite link." />
  }

  // Look up invitation
  const { data: inv } = await serviceSupabase
    .from('team_invitations')
    .select('id, owner_user_id, email, accepted_at, created_at')
    .eq('token', token)
    .single()

  if (!inv) {
    return <JoinError message="This invite link is invalid or has expired." />
  }

  if (inv.accepted_at) {
    return <JoinError message="This invite has already been accepted." />
  }

  // Check if invite is older than 7 days
  const age = Date.now() - new Date(inv.created_at).getTime()
  if (age > 7 * 24 * 60 * 60 * 1000) {
    return <JoinError message="This invite link has expired. Ask the workspace owner to resend it." />
  }

  // Check if user is logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to signup (invited users likely have no account yet)
    redirect(`/signup?redirect=/join?token=${token}&email=${encodeURIComponent(inv.email)}`)
  }

  // Accept the invitation
  await serviceSupabase.from('team_invitations').update({
    accepted_at: new Date().toISOString(),
    accepted_by_user_id: user.id,
  }).eq('id', inv.id)

  // Create team membership
  await serviceSupabase.from('team_members').upsert({
    owner_user_id: inv.owner_user_id,
    member_user_id: user.id,
    role: 'member',
  }, { onConflict: 'owner_user_id,member_user_id' })

  return (
    <div className="min-h-screen bg-[#0a0900] flex items-center justify-center px-6">
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-white font-bold text-xl mb-2">You're in!</h1>
        <p className="text-[#8888a8] text-sm mb-6">You've joined the Bloggy workspace. You can now generate posts and manage clients.</p>
        <a
          href="/dashboard"
          className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Go to Dashboard →
        </a>
      </div>
    </div>
  )
}

function JoinError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#0a0900] flex items-center justify-center px-6">
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-6 h-6 text-red-400" />
        </div>
        <h1 className="text-white font-bold text-xl mb-2">Invalid Invite</h1>
        <p className="text-[#8888a8] text-sm mb-6">{message}</p>
        <a href="/" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">Back to home</a>
      </div>
    </div>
  )
}
