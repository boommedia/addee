import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const REWRITE_INSTRUCTIONS: Record<string, string> = {
  improve:     'Improve the overall quality, flow, and engagement of this blog post. Fix any awkward phrasing, weak transitions, or repetitive language. Keep the same structure and length.',
  shorten:     'Shorten this blog post by ~30% without losing key information. Remove fluff and redundancy.',
  lengthen:    'Expand this blog post by ~40% with more examples, data, and detail. Keep the same tone and structure.',
  more_seo:    'Rewrite this blog post to better optimize for SEO. Improve keyword density, heading structure, and meta-ready copy without keyword stuffing.',
  simpler:     'Rewrite this blog post in simpler language (Flesch reading ease 70+). Shorter sentences, active voice, less jargon.',
  professional:'Rewrite this blog post in a professional, authoritative tone suitable for B2B audiences.',
  conversational: 'Rewrite this blog post in a conversational, friendly tone that feels like advice from a trusted expert.',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, instruction = 'improve', customInstruction } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const systemMsg = customInstruction?.trim()
    ? `${customInstruction}. Return only the rewritten blog post in markdown. No preamble.`
    : REWRITE_INSTRUCTIONS[instruction]
      ? `${REWRITE_INSTRUCTIONS[instruction]} Return only the rewritten blog post in markdown. No preamble.`
      : 'Improve this blog post. Return only the rewritten blog post in markdown.'

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          messages: [
            { role: 'user', content: `${systemMsg}\n\n---\n\n${content}` },
          ],
        })
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        controller.enqueue(encoder.encode(`\n[ERROR]${err instanceof Error ? err.message : 'Failed'}`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Accel-Buffering': 'no' },
  })
}
