import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'eric@bloggy.online' || user?.email === 'eric@boommedia.us'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { version, title, features, notes } = await req.json()
  if (!version || !title || !features?.length) {
    return NextResponse.json({ error: 'version, title, and features are required' }, { status: 400 })
  }

  const webhook = process.env.DISCORD_CHANGELOG_WEBHOOK
  if (!webhook) {
    return NextResponse.json({ error: 'DISCORD_CHANGELOG_WEBHOOK not configured' }, { status: 500 })
  }

  const featureLines = (features as string[]).map((f: string) => `✅ ${f}`).join('\n')
  const description = notes
    ? `${featureLines}\n\n${notes}`
    : featureLines

  const payload = {
    embeds: [{
      title: `🎉 Bloggy ${version} — ${title}`,
      description,
      color: 0x7c3aed,
      fields: [
        {
          name: '🌐 App',
          value: '[bloggy.online](https://bloggy.online)',
          inline: true,
        },
        {
          name: '📊 Feature Tracker',
          value: 'See <#1496957837681885258>',
          inline: true,
        },
      ],
      footer: { text: 'Bloggy • AI Blogging for Agencies' },
      timestamp: new Date().toISOString(),
    }],
  }

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Discord error: ${text}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
