import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  const { email, agency, sites } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('waitlist')
    .upsert({ email, agency_name: agency || null, sites_managed: sites || null }, { onConflict: 'email' })

  if (error) {
    console.error('Waitlist insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Notify eric@boommedia.us of new signup
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Bloggy <notifications@bloggy.online>',
        to: 'eric@boommedia.us',
        subject: `New waitlist signup: ${agency || email}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0f;color:#e8e8f0;border-radius:12px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
              <div style="width:28px;height:28px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;color:white;">B</div>
              <span style="font-weight:700;color:white;">Bloggy — New Waitlist Signup</span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#8888a8;font-size:13px;width:120px;">Email</td><td style="padding:8px 0;color:white;font-size:13px;">${email}</td></tr>
              ${agency ? `<tr><td style="padding:8px 0;color:#8888a8;font-size:13px;">Agency</td><td style="padding:8px 0;color:white;font-size:13px;">${agency}</td></tr>` : ''}
              ${sites ? `<tr><td style="padding:8px 0;color:#8888a8;font-size:13px;">Sites managed</td><td style="padding:8px 0;color:white;font-size:13px;">${sites}</td></tr>` : ''}
            </table>
            <p style="margin-top:24px;font-size:12px;color:#8888a8;">View all signups in your <a href="https://supabase.com" style="color:#a78bfa;">Supabase dashboard</a> → waitlist table.</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Resend notification failed:', emailErr)
      // Don't fail the signup if email fails
    }
  }

  return NextResponse.json({ success: true })
}
