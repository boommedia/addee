import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendMonthlyDigestEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const monthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString()
  const monthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Get all active subscribers
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, plan, posts_limit')
    .eq('status', 'active')

  if (!subs?.length) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const sub of subs) {
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(sub.user_id)
      const email = authUser.user?.email
      if (!email) continue

      const [
        { data: monthPosts },
        { data: allPosts },
        { data: clients },
      ] = await Promise.all([
        supabase.from('posts').select('word_count, client_id').eq('created_by', sub.user_id).gte('created_at', monthStart).lte('created_at', monthEnd),
        supabase.from('posts').select('id').eq('created_by', sub.user_id),
        supabase.from('clients').select('id, name'),
      ])

      const postsThisMonth = monthPosts?.length ?? 0
      if (postsThisMonth === 0) continue // skip users with no activity

      const wordsThisMonth = monthPosts?.reduce((sum, p) => sum + (p.word_count ?? 0), 0) ?? 0

      // Count posts per client
      const clientPostCounts: Record<string, number> = {}
      for (const p of monthPosts ?? []) {
        if (p.client_id) clientPostCounts[p.client_id] = (clientPostCounts[p.client_id] ?? 0) + 1
      }
      const topClients = (clients ?? [])
        .map(c => ({ name: c.name, posts: clientPostCounts[c.id] ?? 0 }))
        .filter(c => c.posts > 0)
        .sort((a, b) => b.posts - a.posts)
        .slice(0, 5)

      await sendMonthlyDigestEmail(email, {
        plan: sub.plan,
        postsThisMonth,
        postsLimit: sub.posts_limit,
        wordsThisMonth,
        totalPosts: allPosts?.length ?? 0,
        topClients,
      })

      sent++
    } catch (err) {
      console.error(`Digest failed for ${sub.user_id}:`, err)
    }
  }

  return NextResponse.json({ sent })
}
