import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, created_by, clients(name)')
    .eq('approval_token', token)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const userId = post.created_by

  // Check if this is the first free image generation for this user
  const { count: imageGenCount } = await supabase
    .from('approval_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', 'image')

  const isFreeGeneration = (imageGenCount ?? 0) === 0

  if (!isFreeGeneration) {
    // Check user credits
    const { data: credits } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    const balance = credits?.balance ?? 0
    if (balance < 1) {
      return NextResponse.json(
        { error: 'Not enough credits. Please purchase more credits to generate images.' },
        { status: 402 }
      )
    }

    // Deduct 1 credit
    await supabase
      .from('user_credits')
      .update({ balance: balance - 1 })
      .eq('user_id', userId)
  }

  try {
    // Call Claude to generate image prompt from title
    const promptRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `Create a detailed, visually-specific image prompt for a blog post hero image. The post is titled: "${post.title}".

Generate a professional, engaging prompt suitable for Unsplash or stock photo search. Focus on composition, mood, and visual elements. Keep it to 1-2 sentences.`,
          },
        ],
      }),
    })

    if (!promptRes.ok) throw new Error('Failed to generate image prompt')
    const promptData: any = await promptRes.json()
    const imagePrompt = promptData.content[0].text

    // Search Unsplash for the image
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imagePrompt)}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      { headers: { 'Accept-Version': 'v1' } }
    )

    if (!unsplashRes.ok) throw new Error('Failed to fetch image')
    const unsplashData: any = await unsplashRes.json()

    if (!unsplashData.results?.length) throw new Error('No images found')

    const imageUrl = unsplashData.results[0].urls.regular
    const attribution = `Photo by ${unsplashData.results[0].user.name} on Unsplash`

    // Update post with new image
    await supabase
      .from('posts')
      .update({ image_url: imageUrl })
      .eq('id', post.id)

    // Log generation
    await supabase
      .from('approval_generations')
      .insert({
        user_id: userId,
        post_id: post.id,
        type: 'image',
        is_free: isFreeGeneration,
      })

    return NextResponse.json({ success: true, imageUrl, attribution })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
}
