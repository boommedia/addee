import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDay3NudgeEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Find users who signed up between 2.5 and 3.5 days ago (window to avoid duplicates)
  const now = Date.now()
  const windowStart = new Date(now - 3.5 * 24 * 60 * 60 * 1000).toISOString()
  const windowEnd   = new Date(now - 2.5 * 24 * 60 * 60 * 1000).toISOString()

  const { data: { users = [] } } = await admin.auth.admin.listUsers({ perPage: 1000 })

  const targets = users.filter(u =>
    u.created_at >= windowStart &&
    u.created_at <= windowEnd &&
    u.email_confirmed_at &&           // confirmed account only
    !(u.user_metadata?.day3_nudge_sent) // not already sent
  )

  let sent = 0
  let skipped = 0

  for (const user of targets) {
    const email = user.email
    if (!email) { skipped++; continue }

    // Check if they've already generated at least one post
    const { count } = await admin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)

    if ((count ?? 0) > 0) {
      // Already active — mark as sent so we don't check again, but don't email
      await admin.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, day3_nudge_sent: true },
      })
      skipped++
      continue
    }

    const firstName = (user.user_metadata?.full_name as string) ?? null
    await sendDay3NudgeEmail(email, firstName)

    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, day3_nudge_sent: true },
    })

    sent++
  }

  return NextResponse.json({ ok: true, sent, skipped, checked: targets.length })
}
