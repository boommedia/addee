import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FIREFLY_API = 'https://firefly-api.adobe.io'
const ADOBE_IMS = 'https://ims-na1.adobelogin.com'

const SIZE_MAP: Record<string, { width: number; height: number }> = {
  instagram_post:  { width: 1024, height: 1024 },
  instagram_story: { width: 576,  height: 1024 },
  tiktok:          { width: 576,  height: 1024 },
  linkedin:        { width: 1024, height: 512  },
  facebook:        { width: 1024, height: 512  },
  google_display:  { width: 1024, height: 768  },
  youtube:         { width: 1280, height: 720  },
}

async function getFireflyToken(): Promise<string> {
  const clientId = process.env.ADOBE_FIREFLY_CLIENT_ID
  const clientSecret = process.env.ADOBE_FIREFLY_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('Adobe Firefly credentials not configured. Add ADOBE_FIREFLY_CLIENT_ID and ADOBE_FIREFLY_CLIENT_SECRET to your environment variables.')
  }
  const res = await fetch(`${ADOBE_IMS}/ims/token/v3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'openid,AdobeID,firefly_api',
    }),
  })
  if (!res.ok) throw new Error(`Adobe auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { prompt, platform = 'instagram_post', style = 'none' } = await req.json()
    if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

    const token = await getFireflyToken()
    const clientId = process.env.ADOBE_FIREFLY_CLIENT_ID!
    const size = SIZE_MAP[platform] ?? { width: 1024, height: 1024 }

    const body: Record<string, unknown> = {
      prompt: prompt.trim(),
      contentClass: 'photo',
      numVariations: 4,
      size,
    }
    if (style && style !== 'none') {
      body.styles = { presets: [style], strength: 60 }
    }

    const res = await fetch(`${FIREFLY_API}/v3/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clientId,
        Authorization: `Bearer ${token}`,
        'x-accept-mimetype': 'image/webp,image/jpeg,image/*',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Firefly API ${res.status}: ${errText}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
