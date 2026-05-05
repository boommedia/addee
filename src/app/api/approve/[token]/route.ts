import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendApprovalNotificationEmail } from '@/lib/email'

const STAFF_EMAIL = 'eric@boommedia.us'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, image_url, approval_status, client_feedback, clients(name)')
    .eq('approval_token', token)
    .single()

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const clientName = (Array.isArray(post.clients) ? post.clients[0] : post.clients as { name: string } | null)?.name ?? null

  return NextResponse.json({
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.image_url,
    approvalStatus: post.approval_status,
    clientFeedback: post.client_feedback,
    clientName,
  })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, approval_status, clients(name)')
    .eq('approval_token', token)
    .single()

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (post.approval_status === 'approved') {
    return NextResponse.json({ error: 'Already approved' }, { status: 409 })
  }

  const body = await req.json()
  const action = body.action as 'approved' | 'revision_requested'
  const feedback = body.feedback as string | undefined

  if (action !== 'approved' && action !== 'revision_requested') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const { error } = await supabase
    .from('posts')
    .update({
      approval_status: action,
      client_feedback: feedback ?? null,
      approved_at: action === 'approved' ? new Date().toISOString() : null,
    })
    .eq('approval_token', token)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const clientName = (Array.isArray(post.clients) ? post.clients[0] : post.clients as { name: string } | null)?.name ?? 'Client'
  await sendApprovalNotificationEmail(STAFF_EMAIL, clientName, post.title ?? 'Untitled Post', action, feedback)

  return NextResponse.json({ success: true })
}
