import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { markdownToHTML } from '@/lib/markdownToHTML'
import { sendAutoblogFailureEmail } from '@/lib/email'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TONE_LABELS: Record<string, string> = {
  professional: 'professional and authoritative',
  conversational: 'conversational and approachable',
  educational: 'educational and informative',
  persuasive: 'persuasive and compelling',
  casual: 'casual and friendly',
}

const LENGTH_TARGETS: Record<string, string> = {
  short: 'approximately 400-600 words',
  medium: 'approximately 800-1,200 words',
  long: 'approximately 1,500-2,500 words',
}

export async function GET(request: Request) {
  // Verify this is a legitimate Vercel cron request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all pending topics due for generation (limit 10 per run to stay within timeout)
  const { data: topics, error } = await supabase
    .from('topic_queue')
    .select('*, clients(id, name, brand_voice, industry, wp_url, wp_username, wp_app_password, schedule_tone, schedule_length)')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Cron fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!topics?.length) {
    return NextResponse.json({ processed: 0, message: 'No topics due' })
  }

  const results: { id: string; topic: string; status: string; error?: string }[] = []

  for (const item of topics) {
    const client = Array.isArray(item.clients) ? item.clients[0] : item.clients
    if (!client) {
      await supabase.from('topic_queue').update({ status: 'failed', error_message: 'Client not found' }).eq('id', item.id)
      results.push({ id: item.id, topic: item.topic, status: 'failed', error: 'Client not found' })
      continue
    }

    // Check per-client monthly limit before generating
    const { data: sub } = await supabase.from('subscriptions').select('posts_limit, sites_limit').eq('user_id', item.created_by).single()
    const postsLimit = sub?.posts_limit ?? 2
    const perClientLimit = Math.floor(postsLimit / Math.max(1, sub?.sites_limit ?? 2))
    const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { count: clientPostsUsed } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', item.created_by).eq('client_id', client.id).gte('created_at', periodStart)
    if ((clientPostsUsed ?? 0) >= perClientLimit) {
      await supabase.from('topic_queue').update({ status: 'skipped', error_message: `Client post limit reached (${perClientLimit}/month)` }).eq('id', item.id)
      results.push({ id: item.id, topic: item.topic, status: 'skipped', error: `Client limit reached` })
      continue
    }

    // Mark as generating
    await supabase.from('topic_queue').update({ status: 'generating' }).eq('id', item.id)

    try {
      const tone = client.schedule_tone ?? 'professional'
      const length = client.schedule_length ?? 'medium'
      const toneLabel = TONE_LABELS[tone] ?? tone
      const lengthTarget = LENGTH_TARGETS[length] ?? LENGTH_TARGETS.medium
      const brandVoiceSection = client.brand_voice ? `\n\nClient brand voice: ${client.brand_voice}` : ''

      const systemPrompt = `You are an expert SEO blog writer for a digital marketing agency. You write high-quality, engaging blog posts that rank well in search engines.

Your blog posts always:
- Start with a compelling H1 title on the first line
- Include a strong introduction that hooks the reader
- Use H2 and H3 subheadings to structure content clearly
- Include relevant examples, statistics, or actionable tips
- End with a clear conclusion and call-to-action
- Are optimized for SEO without keyword stuffing
- Use markdown formatting (# for H1, ## for H2, ### for H3, **bold**, *italic*, - for bullet lists)${brandVoiceSection}

After the blog post, output a JSON metadata block in this exact format:
[SEO_META]
{"metaTitle":"...","metaDescription":"...","focusKeyword":"..."}
[/SEO_META]

Respond with only the blog post in markdown followed by the SEO_META block. No preamble or commentary.`

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `Write a ${toneLabel} blog post that is ${lengthTarget}.\n\nTopic: ${item.topic}` }],
      })

      const rawContent = response.content[0].type === 'text' ? response.content[0].text : ''
      const seoMatch = rawContent.match(/\[SEO_META\]\s*([\s\S]*?)\s*\[\/SEO_META\]/)
      let seoMeta = { metaTitle: '', metaDescription: '', focusKeyword: '' }
      if (seoMatch) {
        try { seoMeta = JSON.parse(seoMatch[1]) } catch {}
      }

      const content = rawContent.replace(/\[SEO_META\][\s\S]*?\[\/SEO_META\]/g, '').trim()
      const titleMatch = content.match(/^#\s+(.+)/m)
      const title = titleMatch ? titleMatch[1] : item.topic.slice(0, 80)
      const wordCount = content.split(/\s+/).length

      // Save post to DB
      const { data: post } = await supabase
        .from('posts')
        .insert({
          client_id: client.id,
          title,
          content,
          prompt: item.topic,
          tone,
          length,
          word_count: wordCount,
        })
        .select()
        .single()

      let wpPostUrl: string | null = null
      let wpStatus: string | null = null

      // Auto-publish to WordPress if credentials exist
      if (client.wp_url && client.wp_username && client.wp_app_password) {
        try {
          const wpBase = client.wp_url.replace(/\/$/, '')
          const credentials = Buffer.from(`${client.wp_username}:${client.wp_app_password}`).toString('base64')
          const htmlContent = markdownToHTML(content)

          const wpResponse = await fetch(`${wpBase}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${credentials}`,
            },
            body: JSON.stringify({ title, content: htmlContent, status: 'draft', format: 'standard' }),
          })

          if (wpResponse.ok) {
            const wpPost = await wpResponse.json()
            wpPostUrl = wpPost.link
            wpStatus = 'draft'

            if (post) {
              await supabase.from('posts').update({
                wp_post_id: wpPost.id,
                wp_post_url: wpPost.link,
                wp_status: 'draft',
                published_at: new Date().toISOString(),
              }).eq('id', post.id)
            }
          }
        } catch (wpErr) {
          console.error('WP publish failed for topic', item.id, wpErr)
        }
      }

      // Mark topic as published
      await supabase.from('topic_queue').update({
        status: 'published',
        post_id: post?.id ?? null,
      }).eq('id', item.id)

      results.push({ id: item.id, topic: item.topic, status: 'published' })

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      await supabase.from('topic_queue').update({ status: 'failed', error_message: message }).eq('id', item.id)
      results.push({ id: item.id, topic: item.topic, status: 'failed', error: message })
    }
  }

  // Email failure alert if any jobs failed
  const failed = results.filter(r => r.status === 'failed')
  if (failed.length > 0) {
    const failureData = failed.map(f => {
      const item = topics.find(t => t.id === f.id)
      const client = item ? (Array.isArray(item.clients) ? item.clients[0] : item.clients) : null
      return { topic: f.topic, clientName: client?.name ?? 'Unknown client', error: f.error ?? 'Unknown error' }
    })
    sendAutoblogFailureEmail('eric@boommedia.us', failureData).catch(() => {})
  }

  return NextResponse.json({ processed: results.length, results })
}
