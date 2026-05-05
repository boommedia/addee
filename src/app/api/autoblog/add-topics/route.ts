import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, topics } = await request.json()
  if (!clientId) return NextResponse.json({ error: 'Client is required' }, { status: 400 })
  if (!Array.isArray(topics) || topics.length === 0) return NextResponse.json({ error: 'No topics provided' }, { status: 400 })

  const now = new Date()
  const rows = topics.map((topic: string, i: number) => {
    const scheduled = new Date(now)
    scheduled.setDate(scheduled.getDate() + i + 1)
    return { client_id: clientId, topic, status: 'pending', scheduled_for: scheduled.toISOString() }
  })

  const { error } = await supabase.from('topic_queue').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ added: rows.length })
}
