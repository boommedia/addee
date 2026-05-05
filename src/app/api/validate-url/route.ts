import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url')
  if (!raw) return NextResponse.json({ ok: false, error: 'No URL provided' }, { status: 400 })

  let url = raw.trim()
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid URL format' })
  }

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Bloggy/1.0)' },
    })
    if (res.ok || (res.status >= 300 && res.status < 500)) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, error: `Site returned ${res.status}` })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Could not reach site'
    if (msg.includes('timeout') || msg.includes('abort')) {
      return NextResponse.json({ ok: false, error: 'Site took too long to respond' })
    }
    return NextResponse.json({ ok: false, error: 'Could not reach this website' })
  }
}
