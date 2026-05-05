import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { userId, action } = await request.json()
  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Update approval status
  const statusUpdate = action === 'approve'
    ? { status: 'approved', approved_at: new Date().toISOString() }
    : { status: 'rejected', rejected_at: new Date().toISOString() }

  const { data: approval, error: updateError } = await admin
    .from('user_approvals')
    .update(statusUpdate)
    .eq('user_id', userId)
    .select('email')
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Send approval email
  if (action === 'approve' && resend && approval) {
    await resend.emails.send({
      from: 'Eric at Bloggy <eric@bloggy.online>',
      to: approval.email,
      subject: 'Welcome to Bloggy — your account is approved',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#0a0a0f;color:#e8e8f0;border-radius:16px;">
          <div style="margin-bottom:28px;">
            <div style="width:40px;height:40px;border-radius:10px;background:#7c3aed;display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:20px;font-weight:900;line-height:1;">B</span>
            </div>
          </div>

          <h1 style="font-size:22px;font-weight:700;color:white;margin:0 0 12px;">
            You're in — welcome to Bloggy.
          </h1>
          <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 28px;">
            Your account has been approved. Log in now and start generating AI blog posts for your clients.
          </p>

          <a href="https://bloggy.online/home" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:32px;">
            Go to Bloggy →
          </a>

          <p style="color:#555570;font-size:12px;margin:0;">Questions? Just reply — I'm here to help.</p>
          <p style="color:#555570;font-size:12px;margin:6px 0 0;">— Eric, Boom Media</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
