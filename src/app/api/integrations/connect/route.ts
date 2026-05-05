import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const platform = formData.get('platform') as string
  if (!platform) return NextResponse.json({ error: 'Platform required' }, { status: 400 })

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://bloggy.online').replace(/\/$/, '')

  // Platform-specific redirect URIs
  const redirectMap: Record<string, string> = {
    linkedin: `${appUrl}/api/integrations/linkedin/callback`,
    gmb: `${appUrl}/api/integrations/gmb/callback`,
    medium: `${appUrl}/settings/integrations?tab=medium`,
    devto: `${appUrl}/settings/integrations?tab=devto`,
  }

  const redirectUri = redirectMap[platform]
  if (!redirectUri) {
    return NextResponse.json({ error: 'Unknown platform' }, { status: 400 })
  }

  // For manual token platforms, return a message
  if (platform === 'medium' || platform === 'devto') {
    return NextResponse.json({
      message: `Manual setup required for ${platform}. Please provide your API token.`,
      manualSetup: true,
    })
  }

  // For OAuth platforms, return connect URL (would be generated via OAuth flow)
  // This is a placeholder - actual OAuth would be handled by individual platform handlers
  return NextResponse.json({
    connectUrl: `${appUrl}/api/integrations/${platform}/auth`,
  })
}
