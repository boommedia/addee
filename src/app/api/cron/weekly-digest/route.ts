import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWeeklyClientDigestEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Get all clients that have a contact email set and had posts this week
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, contact_email')
    .not('contact_email', 'is', null)

  if (!clients?.length) return NextResponse.json({ sent: 0, skipped: 'no clients with contact_email' })

  let sent = 0

  for (const client of clients) {
    if (!client.contact_email) continue

    const { data: posts } = await supabase
      .from('posts')
      .select('title, wp_post_url, word_count, created_at, wp_status')
      .eq('client_id', client.id)
      .eq('wp_status', 'publish')
      .gte('created_at', weekAgo)
      .order('created_at', { ascending: false })

    if (!posts?.length) continue

    try {
      await sendWeeklyClientDigestEmail(
        client.contact_email,
        client.name,
        posts.map(p => ({
          title: p.title,
          url: p.wp_post_url ?? null,
          wordCount: p.word_count ?? 0,
          publishedAt: p.created_at,
          status: p.wp_status,
        }))
      )
      sent++
    } catch (err) {
      console.error(`Weekly digest failed for client ${client.id}:`, err)
    }
  }

  return NextResponse.json({ sent })
}
