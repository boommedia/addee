import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const SIZE_MAP: Record<string, '1024x1024' | '1024x1792' | '1792x1024'> = {
  instagram_post:  '1024x1024',
  instagram_story: '1024x1792',
  tiktok:          '1024x1792',
  linkedin:        '1792x1024',
  facebook:        '1024x1024',
  google_display:  '1792x1024',
  youtube:         '1792x1024',
}

const STYLE_LABELS: Record<string, string> = {
  photo_studio:   'professional photo studio lighting',
  golden_hour:    'golden hour warm sunlight',
  dramatic_light: 'dramatic cinematic lighting',
  bw:             'black and white high contrast',
  vibrant_colors: 'vibrant saturated colors',
  minimalist:     'minimalist clean white background',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { prompt, platform = 'instagram_post', style } = await req.json()
    if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your environment variables.' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const size = SIZE_MAP[platform] ?? '1024x1024'
    const styleText = style && style !== 'none' ? `${STYLE_LABELS[style] ?? style}, ` : ''
    const fullPrompt = `${styleText}${prompt.trim()}, professional advertising photography, commercial quality, high resolution`

    const [img1, img2] = await Promise.all([
      openai.images.generate({ model: 'dall-e-3', prompt: fullPrompt, size, quality: 'standard', n: 1 }),
      openai.images.generate({ model: 'dall-e-3', prompt: fullPrompt, size, quality: 'standard', n: 1 }),
    ])

    const outputs = [img1.data[0], img2.data[0]].map((img, i) => ({
      seed: i,
      image: { id: `dalle-${Date.now()}-${i}`, url: img.url },
    }))

    return NextResponse.json({ outputs })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    console.error('Design generate error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
