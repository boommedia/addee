import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function expectedToken(): string {
  const password = process.env.INVESTOR_PAGE_PASSWORD ?? ''
  const secret = process.env.INVESTOR_PAGE_SECRET ?? ''
  return createHmac('sha256', secret).update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const password = (formData.get('password') as string ?? '').trim()

  const expected = process.env.INVESTOR_PAGE_PASSWORD ?? ''
  const correct = password.length > 0 && password === expected

  if (!correct) {
    const url = new URL('/investors', req.url)
    url.searchParams.set('error', '1')
    return NextResponse.redirect(url, 303)
  }

  const token = expectedToken()
  const url = new URL('/investors', req.url)
  const res = NextResponse.redirect(url, 303)
  res.cookies.set('investor_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return res
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('investor_auth')?.value
  const valid = token === expectedToken()
  return NextResponse.json({ authenticated: valid })
}
