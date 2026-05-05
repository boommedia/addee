import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function fetchPageText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Bloggy/1.0)' },
    signal: AbortSignal.timeout(10000),
  })
  const html = await res.text()
  // Strip HTML tags and collapse whitespace
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000)
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
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  let sourceText: string
  try {
    sourceText = await fetchPageText(url)
  } catch {
    return NextResponse.json({ error: 'Could not fetch that URL. Make sure it is publicly accessible.' }, { status: 422 })
  }

  if (sourceText.length < 200) {
    return NextResponse.json({ error: 'Not enough content found at that URL.' }, { status: 422 })
  }

  const brandVoiceSection = brandVoice ? `\nClient brand voice: ${brandVoice}` : ''

  const prompt = `You are an expert SEO blog writer. Based on the source content below, write an original, high-quality blog post in a ${tone} tone.

Rules:
- Do NOT copy the source — rewrite with your own structure and fresh perspective
- Start with a compelling H1 title on the first line (# Title)
- Use H2/H3 subheadings, bullet points, and bold text
- 800–1,200 words
- End with a clear conclusion and call-to-action
- Optimized for SEO${brandVoiceSection}

After the post, output:
[SEO_META]
{"metaTitle":"...","metaDescription":"...","focusKeyword":"..."}
[/SEO_META]

Source content from ${url}:
${sourceText}`

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
  const title = titleMatch ? titleMatch[1] : url
  const wordCount = content.split(/\s+/).length

  const { data: post } = await supabase
    .from('posts')
    .insert({ client_id: clientId || null, title, content, prompt: `URL: ${url}`, tone, length: 'medium', word_count: wordCount, created_by: user.id })
    .select()
    .single()

  return NextResponse.json({ content, title, wordCount, seoMeta, imageUrl: null, postId: post?.id ?? null })
}
