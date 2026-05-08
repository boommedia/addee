import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

  const { email, agency, brands } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('waitlist')
    .upsert({ email, agency_name: agency || null, brands_managed: brands || null }, { onConflict: 'email' })

  if (error) {
    console.error('Waitlist insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: 'Addee <notifications@addee.online>',
        to: 'eric@boommedia.us',
        subject: `New Addee waitlist signup: ${agency || email}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060d1a;color:#dde4f0;border-radius:12px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
              <div style="width:28px;height:28px;background:linear-gradient(135deg,#0066FF,#00FF00);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;color:white;">A</div>
              <span style="font-weight:700;color:white;">Addee — New Waitlist Signup</span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#7a90b8;font-size:13px;width:120px;">Email</td><td style="padding:8px 0;color:white;font-size:13px;">${email}</td></tr>
              ${agency ? `<tr><td style="padding:8px 0;color:#7a90b8;font-size:13px;">Agency</td><td style="padding:8px 0;color:white;font-size:13px;">${agency}</td></tr>` : ''}
              ${brands ? `<tr><td style="padding:8px 0;color:#7a90b8;font-size:13px;">Brands managed</td><td style="padding:8px 0;color:white;font-size:13px;">${brands}</td></tr>` : ''}
            </table>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Resend notification failed:', emailErr)
    }
  }

  return NextResponse.json({ success: true })
}
