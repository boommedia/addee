import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  if (email.toLowerCase() === user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'You cannot invite yourself' }, { status: 400 })
  }

  const { data: inv, error } = await serviceSupabase
    .from('team_invitations')
    .upsert({ owner_user_id: user.id, email: email.toLowerCase() }, { onConflict: 'owner_user_id,email' })
    .select('id, token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join?token=${inv.token}`

  if (resend) {
    await resend.emails.send({
      from: 'Eric at Addee <eric@boommedia.us>',
      to: email,
      subject: `You've been invited to join an Addee workspace`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 32px;background:#060d1a;color:#dde4f0;border-radius:16px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
            <div style="width:28px;height:28px;background:linear-gradient(135deg,#0066FF,#00FF00);border-radius:6px;font-weight:900;font-size:12px;color:white;display:flex;align-items:center;justify-content:center;">A</div>
            <span style="font-weight:700;font-size:18px;color:white;">Addee</span>
          </div>
          <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">You've been invited!</h1>
          <p style="color:#7a90b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
            <strong style="color:white;">${user.email}</strong> has invited you to collaborate on their Addee workspace — AI-powered ad creatives for agencies.
          </p>
          <a href="${joinUrl}" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#0055FF);color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
            Accept Invitation →
          </a>
          <p style="color:#7a90b8;font-size:12px;margin:0;">This link expires after 7 days. If you didn't expect this, you can ignore it.</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ id: inv.id })
}
