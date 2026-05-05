// Ayrshare multi-tenant social posting API
// Docs: https://docs.ayrshare.com
// Each Bloggy client gets one Ayrshare "profile" — stores their connected social accounts

const BASE = 'https://app.ayrshare.com/api'

function headers(profileKey?: string): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${process.env.AYRSHARE_API_KEY ?? ''}`,
    'Content-Type': 'application/json',
  }
  if (profileKey) h['Profile-Key'] = profileKey
  return h
}

export type AyrshareProfile = {
  profileKey: string
  title: string
  activeSocialAccounts: string[]
}

export type PostResult = {
  status: 'success' | 'error'
  id?: string
  errors?: Record<string, string>
  postIds?: Record<string, string>
}

// Create a new Ayrshare profile for a client
export async function createProfile(clientName: string): Promise<string> {
  const res = await fetch(`${BASE}/profiles`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ title: clientName }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? data.error ?? 'Failed to create social profile')
  return data.profileKey as string
}

// Generate a Social Connect URL the client visits to link their accounts
export async function generateConnectUrl(profileKey: string): Promise<string> {
  const res = await fetch(`${BASE}/profiles/generateJWT`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ profileKey }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? 'Failed to generate connect URL')
  // Ayrshare returns the full redirect URL the client visits
  return (data.url ?? data.jwt_url ?? `https://app.ayrshare.com/social-connect?token=${data.jwt}`) as string
}

// Get which social platforms are connected for a profile
export async function getConnectedPlatforms(profileKey: string): Promise<string[]> {
  const res = await fetch(`${BASE}/user`, { headers: headers(profileKey) })
  if (!res.ok) return []
  const data = await res.json()
  return (data.activeSocialAccounts ?? []) as string[]
}

// Post text (and optional media) to one or more platforms
export async function postToSocial(
  profileKey: string,
  text: string,
  platforms: string[],
  mediaUrls?: string[],
): Promise<PostResult> {
  const body: Record<string, unknown> = { post: text, platforms }
  if (mediaUrls?.length) body.mediaUrls = mediaUrls

  const res = await fetch(`${BASE}/post`, {
    method: 'POST',
    headers: headers(profileKey),
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) return { status: 'error', errors: { general: data.message ?? 'Post failed' } }
  return { status: data.status ?? 'success', postIds: data.postIds, id: data.id }
}
