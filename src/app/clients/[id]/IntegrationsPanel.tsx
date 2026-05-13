'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, ExternalLink, Trash2, Link2, Zap, TrendingUp, Search, CheckCircle } from 'lucide-react'
import { googleIndexingConfigured } from '@/lib/google-indexing'

type DirectIntegration = {
  platform: string
  platform_account_name: string | null
  token_expires_at: string | null
}

type Platform = {
  id: string
  label: string
  abbr: string
  bg: string
  color: string
  status?: 'available' | 'coming_soon'
}

type Props = {
  clientId: string
  userId: string
  initialDirect: DirectIntegration[]
  initialAyrshare: string[]
  initialBlogPlatforms: { platform: string }[]
  wpUrl?: string | null
  wpUsername?: string | null
  wpAppPassword?: string | null
}

const PLATFORMS: Platform[] = [
  { id: 'wordpress', label: 'WordPress', abbr: 'WP', bg: 'bg-[#0073aa]', color: 'text-[#0073aa]' },
  { id: 'linkedin', label: 'LinkedIn', abbr: 'in', bg: 'bg-[#0a66c2]', color: 'text-[#0a66c2]' },
  { id: 'gmb', label: 'Google Business', abbr: 'G', bg: 'bg-white text-gray-900 border', color: 'text-white' },
  { id: 'facebook', label: 'Facebook', abbr: 'f', bg: 'bg-[#1877f2]', color: 'text-[#1877f2]', status: 'coming_soon' },
  { id: 'instagram', label: 'Instagram', abbr: 'IG', bg: 'bg-gradient-to-r from-[#f09433] via-[#bc1888] to-[#405de6]', color: 'text-white', status: 'coming_soon' },
  { id: 'medium', label: 'Medium', abbr: 'M', bg: 'bg-black', color: 'text-black', status: 'coming_soon' },
  { id: 'devto', label: 'Dev.to', abbr: 'D', bg: 'bg-[#0f172a]', color: 'text-[#0f172a]', status: 'coming_soon' },
  { id: 'substack', label: 'Substack', abbr: 'SS', bg: 'bg-[#FF6D3B]', color: 'text-[#FF6D3B]', status: 'coming_soon' },
  { id: 'ghost', label: 'Ghost', abbr: 'G', bg: 'bg-[#15212B]', color: 'text-[#15212B]', status: 'coming_soon' },
  { id: 'hashnode', label: 'Hashnode', abbr: 'H', bg: 'bg-[#2D3748]', color: 'text-[#2D3748]', status: 'coming_soon' },
  { id: 'microblog', label: 'Micro.blog', abbr: 'μ', bg: 'bg-[#4B8AC8]', color: 'text-[#4B8AC8]', status: 'coming_soon' },
  { id: 'beehiiv', label: 'Beehiiv', abbr: 'B', bg: 'bg-[#F4D04D]', color: 'text-gray-900', status: 'coming_soon' },
]

function getTokenStatus(expiresAt: string | null): 'connected' | 'expiring' | 'expired' {
  if (!expiresAt) return 'connected'
  const expiresDate = new Date(expiresAt)
  const now = new Date()
  const daysUntilExpiry = (expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 7) return 'expiring'
  return 'connected'
}

function formatExpiryText(expiresAt: string | null): string {
  if (!expiresAt) return ''
  const expiresDate = new Date(expiresAt)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'Expired'
  if (daysUntilExpiry === 0) return 'Expires today'
  if (daysUntilExpiry === 1) return 'Expires tomorrow'
  return `Expires in ${daysUntilExpiry}d`
}

export default function IntegrationsPanel({
  clientId,
  userId,
  initialDirect,
  initialAyrshare,
  initialBlogPlatforms,
  wpUrl,
  wpUsername,
  wpAppPassword,
}: Props) {
  const [directIntegrations, setDirectIntegrations] = useState(initialDirect)
  const [ayrshareIntegrations, setAyrshareIntegrations] = useState(initialAyrshare)
  const [blogPlatforms, setBlogPlatforms] = useState(initialBlogPlatforms)
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<string | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)

  // Calculate health summary
  const allConnections = [
    ...directIntegrations.map(d => ({ platform: d.platform, expiresAt: d.token_expires_at })),
    ...ayrshareIntegrations.map(p => ({ platform: p, expiresAt: null })),
  ]
  const activeCount = allConnections.filter(c => getTokenStatus(c.expiresAt) === 'connected').length
  const expiringCount = allConnections.filter(c => getTokenStatus(c.expiresAt) === 'expiring').length
  const expiredCount = allConnections.filter(c => getTokenStatus(c.expiresAt) === 'expired').length

  const isWordPress = (platformId: string): boolean => {
    return platformId === 'wordpress'
  }

  const isDirectPlatform = (platformId: string): boolean => {
    return ['linkedin', 'gmb'].includes(platformId)
  }

  const isAyrshare = (platformId: string): boolean => {
    return ['facebook', 'instagram'].includes(platformId)
  }

  const isBlogPlatform = (platformId: string): boolean => {
    return ['medium', 'devto', 'substack', 'ghost', 'hashnode', 'microblog', 'beehiiv'].includes(platformId)
  }

  const getConnectionStatus = (platformId: string) => {
    if (isWordPress(platformId)) {
      const hasWp = !!(wpUrl && wpUsername && wpAppPassword)
      return hasWp ? { connected: true, url: wpUrl } : null
    }
    if (isDirectPlatform(platformId)) {
      return directIntegrations.find(d => d.platform === platformId)
    }
    if (isAyrshare(platformId)) {
      return ayrshareIntegrations.includes(platformId) ? { connected: true } : null
    }
    if (isBlogPlatform(platformId)) {
      return blogPlatforms.find(b => b.platform === platformId)
    }
    return null
  }

  const handleConnect = useCallback(
    async (platformId: string) => {
      if (isBlogPlatform(platformId)) {
        window.location.href = '/settings?tab=integrations'
        return
      }

      setConnectingPlatform(platformId)

      if (isDirectPlatform(platformId)) {
        try {
          const authEndpoint =
            platformId === 'linkedin' ? '/api/social/linkedin/auth' : '/api/social/gmb/auth'
          const res = await fetch(`${authEndpoint}?clientId=${clientId}`)
          if (!res.ok) {
            console.error('Auth endpoint failed:', res.status)
            return
          }

          const data = await res.json()
          if (!data.url) {
            console.error('No auth URL received')
            return
          }

          const popup = window.open(data.url, '_blank', 'width=600,height=700')
          if (!popup) {
            console.error('Popup blocked')
            return
          }

          const channelName = platformId === 'linkedin' ? 'linkedin_oauth' : 'gmb_oauth'
          const channel = new BroadcastChannel(channelName)

          const cleanup = () => {
            channel.close()
            setConnectingPlatform(null)
          }

          channel.onmessage = (event) => {
            if (event.data?.status === 'success') {
              setConnectError(null)
              fetch(`/api/social/client-integrations?clientId=${clientId}`)
                .then(r => r.json())
                .then(d => {
                  if (d.platforms) {
                    setDirectIntegrations(d.platforms.filter((p: any) => isDirectPlatform(p.platform)))
                  }
                })
            } else if (event.data?.status === 'error') {
              setConnectError(event.data.detail ?? 'Connection failed')
            }
            try { popup.close() } catch {}
            cleanup()
          }

          // Fallback: close channel after 5 min
          const timeout = setTimeout(cleanup, 300000)
          return // setConnectingPlatform handled by cleanup
        } catch (err) {
          console.error('Connect error:', err)
        }
      } else if (isAyrshare(platformId)) {
        try {
          const res = await fetch(`/api/social/connect?clientId=${clientId}`)
          if (!res.ok) {
            console.error('Connect endpoint failed')
            return
          }

          const data = await res.json()
          if (!data.connectUrl) {
            console.error('No connect URL received')
            return
          }

          const popup = window.open(data.connectUrl, '_blank', 'width=600,height=700')
          if (!popup) {
            console.error('Popup blocked')
            return
          }

          let pollTimer = setInterval(async () => {
            try {
              if (popup?.closed) {
                clearInterval(pollTimer)
                // Refresh Ayrshare platforms
                setTimeout(async () => {
                  try {
                    const res = await fetch(`/api/social/profiles?clientId=${clientId}`)
                    const data = await res.json()
                    setAyrshareIntegrations(data.platforms ?? [])
                  } catch (err) {
                    console.error('Failed to refresh Ayrshare platforms')
                  }
                }, 500)
              }
            } catch {
              // COOP policy may prevent checking popup.closed
            }
          }, 500)

          // Fallback timeout in case popup can't be detected
          setTimeout(() => {
            if (pollTimer) {
              clearInterval(pollTimer)
            }
          }, 10000)
        } catch (err) {
          console.error('Ayrshare connect error:', err)
        }
      }

      setConnectingPlatform(null)
    },
    [clientId]
  )

  const handleDisconnect = useCallback(
    async (platformId: string) => {
      setDisconnectingPlatform(platformId)

      if (isDirectPlatform(platformId)) {
        try {
          const res = await fetch(
            `/api/social/client-integrations?clientId=${clientId}&platform=${platformId}`,
            { method: 'DELETE' }
          )
          if (res.ok) {
            setDirectIntegrations(directIntegrations.filter(d => d.platform !== platformId))
          }
        } catch (err) {
          console.error('Disconnect error:', err)
        }
      }

      setDisconnectingPlatform(null)
    },
    [clientId, directIntegrations]
  )


  return (
    <div className="space-y-6">
      {/* Health Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141200] border border-[#2a2200] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[#7a6a40] text-xs font-medium">Active</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-white">{activeCount}</div>
        </div>

        <div className="bg-[#141200] border border-[#2a2200] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-[#7a6a40] text-xs font-medium">Expiring</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-white">{expiringCount}</div>
        </div>

        <div className="bg-[#141200] border border-[#2a2200] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[#7a6a40] text-xs font-medium">Expired</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-white">{expiredCount}</div>
        </div>
      </div>

      {connectError && (
        <div className="bg-red-950/30 border border-red-500/30 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
          <p className="text-red-400 text-sm">{connectError}</p>
          <button onClick={() => setConnectError(null)} className="text-red-400 hover:text-red-300 text-xs shrink-0">✕</button>
        </div>
      )}

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map(platform => {
          const connection = getConnectionStatus(platform.id)
          const isConnected = !!connection
          let statusColor = 'text-[#7a6a40] bg-[#1c1800] border-[#2a2200]'
          let statusText = 'Not connected'

          if (isConnected && !isBlogPlatform(platform.id)) {
            const tokenStatus = isDirectPlatform(platform.id)
              ? getTokenStatus((connection as any).token_expires_at)
              : 'connected'

            if (tokenStatus === 'expired') {
              statusColor = 'text-red-400 bg-red-500/10 border-red-500/20'
              statusText = 'Expired'
            } else if (tokenStatus === 'expiring') {
              statusColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20'
              statusText = formatExpiryText((connection as any).token_expires_at)
            } else {
              statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              statusText = '● Connected'
            }
          }

          return (
            <div
              key={platform.id}
              className="bg-[#141200] border border-[#2a2200] rounded-2xl p-4 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${platform.bg}`}
                >
                  {platform.abbr}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-semibold">{platform.label}</h3>
                  {isConnected && !isBlogPlatform(platform.id) && (
                    <p className="text-[#7a6a40] text-xs mt-0.5 truncate">
                      {(connection as any).platform_account_name || 'Connected'}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {!isBlogPlatform(platform.id) && (
                <div className={`mb-4 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-center ${
                  platform.status === 'coming_soon'
                    ? 'text-[#7a6a40] bg-[#1c1800] border-[#2a2200]'
                    : statusColor
                }`}>
                  {platform.status === 'coming_soon'
                    ? 'Coming Soon'
                    : isConnected && isDirectPlatform(platform.id)
                    ? formatExpiryText((connection as any).token_expires_at) || 'Connected'
                    : statusText}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto flex gap-2">
                {platform.status === 'coming_soon' ? (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#7a6a40] bg-[#1c1800] border border-[#2a2200] px-3 py-2 rounded-lg"
                  >
                    Coming Soon
                  </button>
                ) : isWordPress(platform.id) ? (
                  <a
                    href={`/clients/${clientId}?tab=settings`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#ca8a04] bg-[rgba(202,138,4,0.1)] hover:bg-[rgba(202,138,4,0.2)] border border-[rgba(202,138,4,0.2)] px-3 py-2 rounded-lg transition-colors"
                  >
                    <Link2 className="w-3 h-3" />
                    Configure
                  </a>
                ) : isBlogPlatform(platform.id) ? (
                  <a
                    href="/settings?tab=integrations"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#ca8a04] bg-[rgba(202,138,4,0.1)] hover:bg-[rgba(202,138,4,0.2)] border border-[rgba(202,138,4,0.2)] px-3 py-2 rounded-lg transition-colors"
                  >
                    <Link2 className="w-3 h-3" />
                    Set up
                  </a>
                ) : isConnected ? (
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    disabled={disconnectingPlatform === platform.id}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {disconnectingPlatform === platform.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={connectingPlatform === platform.id}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {connectingPlatform === platform.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
                    )}
                    Connect
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Webhooks & Zapier */}
      <div className="bg-[#141200] border border-[#2a2200] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#2a2200] flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-white font-semibold text-sm">Webhooks & Zapier</h2>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-[#b8a870] text-sm">
            Send HTTP POST events to any URL when posts are created or published. Works with <strong className="text-[#dde4f0]">Zapier</strong>, Make, n8n, Slack, or any custom endpoint.
          </p>
          <a
            href={`/clients/${clientId}#webhooks`}
            className="inline-flex items-center gap-2 bg-[#1c1800] hover:bg-[#2a2200] border border-[#2a2200] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Zap className="w-4 h-4" />
            Configure Webhooks
          </a>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
            <p className="text-amber-300/80 text-xs">
              <strong className="text-amber-300">Zapier tip:</strong> Create a Zap with trigger "Webhooks by Zapier" → "Catch Hook". Copy the URL from step 1. Events include post title, content, word count, client ID, and timestamp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
