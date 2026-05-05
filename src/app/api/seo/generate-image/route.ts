import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { title, focusKeyword, metaDescription } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create a descriptive prompt for the image
    const prompt = `Generate a professional blog post featured image for: "${title}"${focusKeyword ? ` (focus keyword: ${focusKeyword})` : ''}${metaDescription ? `. Summary: ${metaDescription.substring(0, 100)}` : ''}. High-quality, modern, relevant to the topic. No text on image.`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    if (!response.data || !response.data[0] || !response.data[0].url) {
      throw new Error('No image URL in response')
    }

    const imageUrl = response.data[0].url

    // Return single image in array format for consistency with UI
    const images = [
      {
        url: imageUrl,
        thumb: imageUrl,
        alt: title,
        photographer: 'DALL-E 3',
      },
    ]

    return NextResponse.json({ images })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error generating images:', errorMessage, error)
    return NextResponse.json({ error: `Failed to generate: ${errorMessage}` }, { status: 500 })
  }
}
