import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function generateAdContent(
  brand: any,
  campaign: any,
  platform: string,
  format: string
): Promise<string> {
  const prompt = `You are an expert ad copywriter specializing in creating compelling social media and digital advertisements.

Brand Information:
- Name: ${brand.name}
- Industry: ${brand.industry}
- Voice: ${brand.brand_voice}
- Tone Examples: ${brand.tone_examples}
- Visual Style: ${brand.visual_style}

Campaign Details:
- Product: ${campaign.product_name}
- Target Audience: ${campaign.target_audience}
- Goals: ${campaign.goals}
- Description: ${campaign.description}

Please generate 3 variations of ${format} ads for ${platform} that:
1. Match the brand voice and tone examples provided
2. Appeal to the target audience
3. Drive toward the campaign goals
4. Are ready to publish with minimal edits

Format your response as JSON with this structure:
{
  "variations": [
    {
      "headline": "...",
      "body": "...",
      "cta": "..."
    },
    ...
  ]
}

Only output valid JSON, no other text.`

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return content.text
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, platform, format } = body

    if (!campaignId || !platform || !format) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*, brands(*)')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    const generatedContent = await generateAdContent(
      campaign.brands,
      campaign,
      platform,
      format
    )

    const variations = JSON.parse(generatedContent)

    const insertData = variations.variations.map((v: any) => ({
      campaign_id: campaignId,
      brand_id: campaign.brand_id,
      platform,
      format,
      headline: v.headline,
      body_text: v.body,
      cta_text: v.cta,
      status: 'draft',
    }))

    const { data: ads, error: insertError } = await supabase
      .from('ad_drafts')
      .insert(insertData)
      .select()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      ads,
      count: ads?.length || 0,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ads' },
      { status: 500 }
    )
  }
}
