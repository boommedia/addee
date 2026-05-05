import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  // Fetch the YouTube watch page to extract caption track URLs
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })
  const html = await pageRes.text()

  // Extract ytInitialPlayerResponse JSON from the page
  const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/)
  if (!match) throw new Error('Could not find player data on YouTube page')

  let playerData: any
  try {
    playerData = JSON.parse(match[1])
  } catch {
    throw new Error('Failed to parse YouTube player data')
  }

  const captionTracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
  if (!captionTracks?.length) {
    throw new Error('This video does not have captions available. Try a video with auto-generated or manual subtitles.')
  }

  // Prefer English captions
  const track = captionTracks.find((t: any) =>
    t.languageCode === 'en' || t.languageCode?.startsWith('en')
  ) ?? captionTracks[0]

  const captionUrl = track.baseUrl + '&fmt=json3'
  const captionRes = await fetch(captionUrl)
  const captionData = await captionRes.json()

  const lines: string[] = (captionData.events ?? [])
    .filter((e: any) => e.segs)
    .map((e: any) => e.segs.map((s: any) => s.utf8 ?? '').join(''))
    .filter((line: string) => line.trim() && line !== '\n')

  const transcript = lines.join(' ').replace(/\s+/g, ' ').trim()
  if (!transcript) throw new Error('Transcript is empty')

  return transcript
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isInternal = user.email === 'eric@boommedia.us'
  const { url, tone = 'professional', clientId, brandVoice } = await request.json()

  if (!isInternal) {
    const { data: sub } = await supabase.from('subscriptions').select('posts_limit, sites_limit').eq('user_id', user.id).single()
    const postsLimit = sub?.posts_limit ?? 2
    const perClientLimit = Math.floor(postsLimit / Math.max(1, sub?.sites_limit ?? 2))
    const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

    if (clientId) {
      const { count } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('client_id', clientId).gte('created_at', periodStart)
      if ((count ?? 0) >= perClientLimit) {
        return NextResponse.json({ error: `This client has used all ${perClientLimit} posts for this month. Upgrade your plan for more.`, limitReached: true }, { status: 402 })
      }
    } else {
      const { count } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', periodStart)
      if ((count ?? 0) >= postsLimit) {
        return NextResponse.json({ error: `You've used all ${postsLimit} posts for this month. Upgrade your plan to generate more.`, limitReached: true }, { status: 402 })
      }
    }
  }
  if (!url) return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })

  const videoId = extractVideoId(url)
  if (!videoId) return NextResponse.json({ error: 'Invalid YouTube URL. Paste a standard youtube.com or youtu.be link.' }, { status: 400 })

  let transcript: string
  try {
    transcript = await fetchYouTubeTranscript(videoId)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch transcript' }, { status: 422 })
  }

  const brandSection = brandVoice ? `\n\nClient brand voice: ${brandVoice}` : ''

  const prompt = `You are an expert SEO blog writer. Convert the following YouTube video transcript into a high-quality, original blog post.

Guidelines:
- Write a compelling H1 title on the first line (not the video title)
- Reorganize and expand the content — do not just clean up the transcript
- Use H2 and H3 subheadings to structure the post
- Add context, examples, and depth beyond what is in the transcript
- Write in a ${tone} tone
- Optimize for SEO: include natural keyword usage, a strong intro, and a clear conclusion with CTA
- Use markdown formatting
- Target length: 800–1,400 words${brandSection}

After the post, include:
[SEO_META]
{"metaTitle":"...","metaDescription":"...","focusKeyword":"..."}
[/SEO_META]

Transcript:
${transcript.slice(0, 6000)}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawContent = response.content[0].type === 'text' ? response.content[0].text : ''

  const seoMatch = rawContent.match(/\[SEO_META\]\s*([\s\S]*?)\s*\[\/SEO_META\]/)
  let seoMeta = { metaTitle: '', metaDescription: '', focusKeyword: '' }
  if (seoMatch) {
    try { seoMeta = JSON.parse(seoMatch[1]) } catch {}
  }

  const content = rawContent.replace(/\[SEO_META\][\s\S]*?\[\/SEO_META\]/g, '').trim()
  const titleMatch = content.match(/^#\s+(.+)/m)
  const title = titleMatch ? titleMatch[1] : 'YouTube Blog Post'
  const wordCount = content.split(/\s+/).length

  const { data: post } = await supabase.from('posts').insert({
    client_id: clientId || null,
    title,
    content,
    prompt: `YouTube: ${url}`,
    tone,
    length: 'medium',
    word_count: wordCount,
    created_by: user.id,
  }).select().single()

  return NextResponse.json({ content, title, wordCount, seoMeta, imageUrl: null, postId: post?.id ?? null })
}
