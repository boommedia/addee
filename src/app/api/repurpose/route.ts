import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, title, platform } = await request.json()
  if (!content || !platform) return NextResponse.json({ error: 'Missing content or platform' }, { status: 400 })

  const snippet = content.slice(0, 3000)

  const prompts: Record<string, string> = {
    linkedin: `You are a LinkedIn content expert. Repurpose the following blog post into a high-performing LinkedIn post.

Format:
- Hook (1-2 lines that stop the scroll)
- 3-5 key insights as short paragraphs or bullet points
- A clear call-to-action at the end
- 3-5 relevant hashtags at the bottom
- Total length: 150-300 words
- Use line breaks for readability
- Write in first person as a thought leader sharing expertise

Blog title: ${title}

Blog content:
${snippet}`,

    twitter: `You are a Twitter/X content expert. Repurpose the following blog post into an engaging Twitter/X thread.

Format:
- Tweet 1: Hook tweet that makes people want to read more (max 280 chars)
- Tweets 2-6: One key insight per tweet, numbered (e.g. "2/7")
- Final tweet: Summary + link placeholder [link]
- Each tweet max 280 characters
- Use line breaks between tweets with "---"

Blog title: ${title}

Blog content:
${snippet}`,

    facebook: `You are a Facebook content expert. Repurpose the following blog post into an engaging Facebook post.

Format:
- Conversational opening that resonates with small business owners
- 2-3 key takeaways in plain language
- Question to encourage comments
- Call-to-action
- Total length: 100-200 words
- Friendly, approachable tone

Blog title: ${title}

Blog content:
${snippet}`,

    instagram: `You are an Instagram content expert. Repurpose the following blog post into a high-engagement Instagram caption.

Format:
- Hook line (first 1-2 lines must be compelling — this is what shows before "more")
- Main body: 3-5 short paragraphs sharing key insights in a visual, story-driven way
- Line break before CTA
- Strong call-to-action (save this, share with someone who needs it, link in bio)
- One blank line
- 20-25 highly relevant hashtags (mix of niche and broad)
- Total caption: under 2,200 characters
- Conversational, inspiring tone — like a friend sharing advice

Blog title: ${title}

Blog content:
${snippet}`,

    threads: `You are a Threads content expert. Repurpose the following blog post into a Threads post that sparks conversation.

Format:
- 1-3 sentences max (500 character limit)
- Raw, conversational tone — feels like a genuine thought, not marketing
- Controversial or thought-provoking angle if possible
- End with an implicit or explicit question to drive replies
- No hashtags (they don't work well on Threads)
- Read as if a smart person just had a realization and typed it out

Blog title: ${title}

Blog content:
${snippet}`,

    tiktok: `You are a TikTok content strategist. Repurpose the following blog post into TikTok content.

Output these sections clearly labeled:

HOOK (first 3 seconds, must stop scroll — max 150 characters):
[write hook here]

VIDEO SCRIPT OUTLINE (3-5 talking points in order, one sentence each):
1.
2.
3.
4.
5.

CAPTION (under 300 chars, casual and punchy):
[write caption here]

HASHTAGS (12-15 relevant TikTok hashtags, mix of niche + trending):
[write hashtags here]

VIDEO CONCEPT (1 sentence describing the visual/format — talking head, text overlay, POV, etc.):
[write concept here]

Blog title: ${title}

Blog content:
${snippet}`,

    gmb: `You are a Google Business profile content expert specializing in local SEO. Repurpose the following blog post into a Google Business post.

Format:
- Headline: (direct, relevant to the service, max 58 chars)
- Body: (2-3 short sentences max 1,500 chars total — conversational, locally relevant, mention the business type/service)
- Call-to-action type: Choose one: Learn more / Call now / Book / Sign up / Order online
- No hashtags
- Focus on the customer benefit and local relevance
- Professional but approachable

Blog title: ${title}

Blog content:
${snippet}`,

    pinterest: `You are a Pinterest SEO expert. Repurpose the following blog post into a Pinterest pin.

Output these sections clearly labeled:

PIN TITLE (max 100 chars, keyword-rich, curiosity-driven):
[write title here]

PIN DESCRIPTION (max 500 chars, 2-3 sentences, include what they'll learn or discover, weave in keywords naturally):
[write description here]

KEYWORDS TO TARGET (10-15 Pinterest search keywords, comma-separated):
[write keywords here]

BOARD SUGGESTION (one relevant board name):
[write board name here]

Blog title: ${title}

Blog content:
${snippet}`,

    youtube: `You are a YouTube SEO expert. Repurpose the following blog post into a full YouTube video package.

Output these sections clearly labeled:

VIDEO TITLE (max 70 chars, keyword-rich, compelling — use numbers or "how to" if relevant):
[write title here]

DESCRIPTION (first 3 lines are shown without clicking — make them the hook):
[write full description here — include: hook, what the video covers as 4-5 bullet points, subscribe CTA, timestamps placeholder section, links section placeholder, 5-8 hashtags at end]

TAGS (25+ comma-separated YouTube tags from broad to specific):
[write tags here]

THUMBNAIL TEXT SUGGESTION (max 4 words that would work on a thumbnail):
[write here]

Blog title: ${title}

Blog content:
${snippet}`,
  }

  const systemPrompt = prompts[platform]
  if (!systemPrompt) return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: systemPrompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ text })
}
