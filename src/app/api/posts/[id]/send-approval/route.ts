import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendApprovalRequestEmail } from '@/lib/email'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bloggy.online'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch post + client in one query
  const { data: post } = await supabase
    .from('posts')
    .select('id, title, client_id, clients(name, contact_email)')
    .eq('id', id)
    .eq('created_by', user.id)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const client = Array.isArray(post.clients) ? post.clients[0] : post.clients as { name: string; contact_email: string | null } | null
  if (!client?.contact_email) {
    return NextResponse.json({ error: 'This client has no contact email. Add one in the Clients page first.' }, { status: 422 })
  }

  const token = crypto.randomUUID()

  const { error } = await supabase
    .from('posts')
    .update({
      approval_status: 'pending_approval',
      approval_token: token,
      approval_sent_at: new Date().toISOString(),
      // Reset any prior feedback when re-sending
      client_feedback: null,
      approved_at: null,
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const approvalUrl = `${BASE_URL}/approve/${token}`
  await sendApprovalRequestEmail(client.contact_email, client.name, post.title ?? 'Untitled Post', approvalUrl)

  return NextResponse.json({ success: true, approvalUrl })
}
