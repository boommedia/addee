// LinkedIn OAuth + REST API client
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
// OAuth scopes: w_organization_social r_organization_social openid profile

const AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const API_BASE = 'https://api.linkedin.com'

export type LinkedInPage = {
  urn: string    // e.g. "urn:li:organization:123456"
  name: string   // company display name
  vanityName?: string
}

export function buildAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: redirectUri,
    state,
    scope: 'w_member_social openid profile',
  })
  return `${AUTH_URL}?${params}`
}

export async function exchangeCode(code: string, redirectUri: string) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description ?? 'LinkedIn token exchange failed')
  return data as { access_token: string; refresh_token?: string; expires_in: number }
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error('LinkedIn token refresh failed')
  return data as { access_token: string; expires_in: number }
}

export async function getPersonUrn(accessToken: string): Promise<string> {
  const res = await fetch(`${API_BASE}/v2/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Failed to fetch LinkedIn profile')
  return `urn:li:person:${data.id}`
}

export async function getMemberProfile(accessToken: string): Promise<LinkedInPage> {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Failed to fetch LinkedIn profile')
  return {
    urn: `urn:li:person:${data.sub}`,
    name: data.name ?? data.given_name ?? 'LinkedIn User',
  }
}

export async function createPost(
  authorUrn: string,
  text: string,
  accessToken: string,
  url?: string
) {
  const shareContent: Record<string, unknown> = {
    shareCommentary: { text: text.slice(0, 3000) },
    shareMediaCategory: url ? 'ARTICLE' : 'NONE',
  }

  if (url) {
    shareContent.media = [{ status: 'READY', originalUrl: url }]
  }

  const body = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': shareContent,
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const res = await fetch(`${API_BASE}/v2/ugcPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? `LinkedIn post failed (${res.status})`)
  }

  const location = res.headers.get('x-restli-id') ?? res.headers.get('location') ?? null
  return { postUrn: location }
}
