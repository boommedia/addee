import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { email, agencyName } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  if (!resend) return NextResponse.json({ error: 'Email not configured' }, { status: 500 })

  // Generate a Supabase invite link — creates the account + returns a one-time URL
  const admin = createAdminClient()
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${BASE_URL}/reset-password`,
    },
  })

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 })
  }

  const inviteUrl = linkData.properties.action_link

  const greeting = agencyName ? `Hey${agencyName ? ' ' + agencyName.split(' ')[0] : ''}` : 'Hey'

  await resend.emails.send({
    from: 'Eric at Bloggy <eric@bloggy.online>',
    to: email,
    subject: "Your Bloggy account is ready — early access inside",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#0a0a0f;color:#e8e8f0;border-radius:16px;">
        <div style="margin-bottom:28px;">
          <div style="width:40px;height:40px;border-radius:10px;background:#7c3aed;display:inline-flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:20px;font-weight:900;line-height:1;">B</span>
          </div>
        </div>

        <h1 style="font-size:22px;font-weight:700;color:white;margin:0 0 12px;">
          ${greeting} — your account is live.
        </h1>
        <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 20px;">
          I personally added you to Bloggy as an early-access member. You're getting in before we open to the public — which means you lock in <strong style="color:white;">50% off for a full year</strong> the moment you upgrade.
        </p>

        <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 28px;">
          Set your password to activate your account. Takes 30 seconds.
        </p>

        <a href="${inviteUrl}" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:32px;">
          Activate My Account →
        </a>

        <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="color:#a78bfa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 14px;">What you can do starting today</p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:flex-start;gap:10px;">
              <span style="color:#7c3aed;font-size:16px;line-height:1.2;margin-top:1px;">→</span>
              <div>
                <span style="color:white;font-size:13px;font-weight:600;">Generate a full SEO blog post in under 30 seconds</span>
                <p style="color:#555570;font-size:12px;margin:2px 0 0;">1,500+ words, meta title, meta description, structured headings</p>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:10px;">
              <span style="color:#7c3aed;font-size:16px;line-height:1.2;margin-top:1px;">→</span>
              <div>
                <span style="color:white;font-size:13px;font-weight:600;">Publish straight to WordPress — one click</span>
                <p style="color:#555570;font-size:12px;margin:2px 0 0;">No copy-paste. Connects to any WP site in seconds.</p>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:10px;">
              <span style="color:#7c3aed;font-size:16px;line-height:1.2;margin-top:1px;">→</span>
              <div>
                <span style="color:white;font-size:13px;font-weight:600;">Automate a full month of content for every client</span>
                <p style="color:#555570;font-size:12px;margin:2px 0 0;">Schedule posts, repurpose for social, track rankings.</p>
              </div>
            </div>
          </div>
        </div>

        <div style="background:#1a1226;border:1px solid #7c3aed44;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
          <p style="color:#a78bfa;font-size:13px;font-weight:600;margin:0 0 4px;">Early access: 50% off for 12 months</p>
          <p style="color:#555570;font-size:12px;margin:0;">Upgrade anytime after you activate — discount is applied automatically. First 20 members only.</p>
        </div>

        <p style="color:#555570;font-size:12px;margin:0;">This invite link expires in 24 hours. Questions? Just reply — I'm personally onboarding every early member.</p>
        <p style="color:#555570;font-size:12px;margin:6px 0 0;">— Eric, Boom Media</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
