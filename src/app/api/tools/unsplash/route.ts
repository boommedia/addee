import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  if (!query?.trim()) return NextResponse.json({ error: 'Query required' }, { status: 400 })

  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return NextResponse.json({ error: 'Unsplash not configured', photos: [] })

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    )
    const data = await res.json()
    const photos = (data.results ?? []).map((p: any) => ({
      id: p.id,
      url: p.urls.regular,
      thumb: p.urls.small,
      alt: p.alt_description ?? p.description ?? query,
      credit: p.user.name,
      creditUrl: `${p.user.links.html}?utm_source=bloggy&utm_medium=referral`,
    }))
    return NextResponse.json({ photos })
  } catch {
    return NextResponse.json({ photos: [] })
  }
}
