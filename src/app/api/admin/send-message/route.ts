import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = 'Eric at Bloggy <eric@bloggy.online>'
const BASE_URL = 'https://bloggy.online'

function base(content: string) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#0a0a0f;color:#e8e8f0;border-radius:16px;"><div style="margin-bottom:32px;"><img src="${BASE_URL}/logo.png" alt="Bloggy" style="height:32px;width:auto;" /></div>${content}<div style="margin-top:40px;padding-top:24px;border-top:1px solid #2a2a3d;"><p style="color:#555570;font-size:12px;margin:0;">© 2026 Boom Media · <a href="${BASE_URL}" style="color:#555570;">bloggy.online</a></p></div></div>`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { to, subject, body } = await request.json() as { to: string; subject: string; body: string }
  if (!to || !subject || !body) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!resend) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const paragraphs = body
    .split('\n')
    .map(line =>
      line.trim()
        ? `<p style="color:#c8c8d8;font-size:15px;line-height:1.7;margin:0 0 14px;">${line}</p>`
        : '<p style="margin:0 0 14px;">&nbsp;</p>'
    )
    .join('')

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: base(paragraphs),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Email send failed'
    console.error('Admin send-message error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
