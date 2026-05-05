import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Bloggy's AI assistant — a friendly, knowledgeable support agent for Bloggy (bloggy.online), an AI blog automation platform built for digital marketing agencies.

## What Bloggy Does
Bloggy helps agencies generate, optimize, and publish SEO blog posts to WordPress for all their clients — at scale. Key value: automated WordPress publishing, per-client brand voice, bulk scheduling, and the AutoBlog set-and-forget scheduler.

## Features & Where to Find Them
- **AI Blog Generator** (/dashboard): Generate long-form SEO posts from a topic, URL, or YouTube video
- **AutoBlog** (/autoblog): Queue topics, set a publish schedule, Bloggy runs on autopilot
- **Bulk Scheduler** (/autoblog): Upload a CSV of topics and schedule them weeks out
- **Keyword Research** (/keywords): AI-powered keyword discovery — volume, difficulty, intent, content briefs
- **Keyword Lists** (/keywords): Save keyword collections per client for reuse
- **WordPress Publisher** (/posts): Direct publish with featured images, categories, tags, SEO meta
- **Content Calendar** (/calendar): Visual calendar of all scheduled/published posts across clients
- **Internal Link Suggester** (/posts): AI surfaces best internal linking opportunities
- **Content Repurposer** (/posts): Turn any post into LinkedIn, Twitter, Instagram, TikTok, GMB, Pinterest content
- **Client Manager** (/clients): Per-client brand voice, WordPress credentials, logo, target keywords
- **Team Collaboration** (/settings): Invite team members to your workspace
- **Rankings History Pro** (add-on — /analytics): Weekly automated rank tracking, trend charts, delta indicators
- **Analytics** (/analytics): Post analytics, word counts, quality scores, publish rates
- **All Tools Overview** (/tools): Every feature in one place
- **Help & Tutorials** (/help): Step-by-step guides for every feature

## Pricing Plans
- **Starter** — $49/mo: 5 client sites, 20 posts/mo, AI generation, SEO meta, WordPress publish, brand voice. 7-day free trial.
- **Growth** — $99/mo: 10 sites, 40 posts/mo — everything in Starter plus AI hero images, AutoBlog scheduler, social repurposing, URL-to-blog, YouTube-to-blog
- **Agency** — $199/mo: 20 sites, 80 posts/mo — everything in Growth plus internal links, content calendar, client reports
- **Agency Max** — $299/mo: 40 sites, 160 posts/mo — everything in Agency plus priority support
- **Rankings History Pro add-on** — $19/mo: works with any paid plan, weekly rank snapshots, trend charts
- All paid plans: upgrade/downgrade anytime, prorate billing, cancel anytime

## Upsell Guidance (mention naturally, never pushy)
- User manages many clients → suggest Agency or Agency Max
- User wants automation → AutoBlog is on Growth+
- User wants rank tracking → Rankings History Pro add-on
- User wants social media content → social repurposing is on Growth+
- User wants to add team members → any paid plan supports it
- User is near their post limit → upgrade to next tier

## Handoff
If a user wants to talk to a human or needs urgent account help:
- Discord community (fastest): https://discord.gg/9avYXden
- Email support: eric@boommedia.us

## Tone & Style
- Friendly, direct, concise — under 120 words unless the user needs a step-by-step walkthrough
- Answer the question first, then offer the upsell if naturally relevant
- Use plain text only — no markdown headers or bullet formatting in responses (this is a chat interface)`

export async function POST(req: NextRequest) {
  // Soft auth — include user context if available, but don't gate the chat
  let contextNote = ''
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { messages: _msgs, userContext } = await req.clone().json()
      if (userContext) {
        contextNote = `\n\n[Current user context: Plan = ${userContext.plan ?? 'free'}, Posts used this month = ${userContext.postsUsed ?? 0} / ${userContext.postsLimit ?? 2}]`
      }
    }
  } catch { /* proceed without context */ }

  const { messages } = await req.json()
  const trimmedMessages = (messages as Array<{ role: string; content: string }>).slice(-12)

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  // Stream in background — don't await so we return the Response immediately
  ;(async () => {
    try {
      const stream = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT + contextNote,
        messages: trimmedMessages as Array<{ role: 'user' | 'assistant'; content: string }>,
        stream: true,
      })

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta' &&
          event.delta.text
        ) {
          await writer.write(encoder.encode(event.delta.text))
        }
      }
    } catch (err) {
      console.error('[chat] stream error:', err)
      await writer.write(encoder.encode('Sorry, I ran into an error. Please try again.'))
    } finally {
      await writer.close().catch(() => {})
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
