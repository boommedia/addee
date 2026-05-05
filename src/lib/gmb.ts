// Google Business Profile (GBP) API client
// Docs: https://developers.google.com/my-business/reference/rest
// OAuth scope: https://www.googleapis.com/auth/business.manage

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const ACCOUNT_API = 'https://mybusinessaccountmanagement.googleapis.com/v1'
const BIZ_API = 'https://mybusinessbusinessinformation.googleapis.com/v1'
const POSTS_API = 'https://mybusiness.googleapis.com/v4'

export type GmbLocation = {
  name: string   // e.g. "accounts/123/locations/456"
  title: string  // business display name
}

export type GmbAccount = {
  name: string        // e.g. "accounts/123"
  accountName: string
  locations?: GmbLocation[]
}

export function buildAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/business.manage',
    access_type: 'offline',
    prompt: 'consent',  // force refresh_token every time
    state,
  })
  return `${AUTH_URL}?${params}`
}

export async function exchangeCode(code: string, redirectUri: string) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description ?? 'Google token exchange failed')
  return data as { access_token: string; refresh_token?: string; expires_in: number }
}

export async function refreshToken(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error('Google token refresh failed')
  return data as { access_token: string; expires_in: number }
}

export async function listAccountsAndLocations(accessToken: string): Promise<GmbAccount[]> {
  const accRes = await fetch(`${ACCOUNT_API}/accounts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const accData = await accRes.json()
  if (!accRes.ok) {
    console.error('[GMB API] Accounts fetch failed:', accData)
    throw new Error(accData.error?.message ?? `Accounts API failed: ${accRes.status}`)
  }
  const accounts: GmbAccount[] = accData.accounts ?? []
  console.log('[GMB API] Found accounts:', accounts.length)

  // Fetch locations for each account
  await Promise.all(accounts.map(async (account) => {
    const locRes = await fetch(
      `${BIZ_API}/${account.name}/locations?readMask=name,title`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const locData = await locRes.json()
    if (!locRes.ok) {
      console.error('[GMB API] Locations fetch failed for', account.name, ':', locData)
    }
    account.locations = locData.locations ?? []
  }))

  return accounts
}

export async function createPost(
  locationName: string,
  text: string,
  accessToken: string,
  ctaUrl?: string
) {
  const body: Record<string, unknown> = {
    languageCode: 'en-US',
    summary: text.slice(0, 1500), // GBP posts max 1500 chars
    topicType: 'STANDARD',
  }
  if (ctaUrl) {
    body.callToAction = { actionType: 'LEARN_MORE', url: ctaUrl }
  }

  const res = await fetch(`${POSTS_API}/${locationName}/localPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'GBP post failed')
  return data as { name: string; state: string }
}
