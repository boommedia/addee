import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const serviceSupabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  // Don't invite yourself
  if (email.toLowerCase() === user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'You cannot invite yourself' }, { status: 400 })
  }

  // Upsert invitation (replace existing pending invite for same email)
  const { data: inv, error } = await serviceSupabase
    .from('team_invitations')
    .upsert({ owner_user_id: user.id, email: email.toLowerCase() }, { onConflict: 'owner_user_id,email' })
    .select('id, token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join?token=${inv.token}`

  if (resend) {
    await resend.emails.send({
      from: 'Eric at Bloggy <eric@bloggy.online>',
      to: email,
      subject: `You've been invited to join a Bloggy workspace`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 32px;background:#0a0a0f;color:#e8e8f0;border-radius:16px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
            <div style="width:28px;height:28px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:6px;font-weight:900;font-size:12px;color:white;display:flex;align-items:center;justify-content:center;">B</div>
            <span style="font-weight:700;font-size:18px;color:white;">Bloggy</span>
          </div>
          <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">You've been invited!</h1>
          <p style="color:#8888a8;font-size:15px;line-height:1.6;margin:0 0 24px;">
            <strong style="color:white;">${user.email}</strong> has invited you to collaborate on their Bloggy workspace — AI-powered SEO blog generation for agencies.
          </p>
          <a href="${joinUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
            Accept Invitation →
          </a>
          <p style="color:#8888a8;font-size:12px;margin:0;">This link expires after 7 days. If you didn't expect this, you can ignore it.</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ id: inv.id })
}
