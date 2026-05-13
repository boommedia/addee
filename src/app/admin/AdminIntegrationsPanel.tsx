'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, ExternalLink, Trash2 } from 'lucide-react'

type ClientInfo = {
  id: string
  name: string
  ayrshare_profile_key: string | null
}

type DirectIntegration = {
  platform: string
  name: string | null
  token_expires_at: string | null
}

type Props = {
  clients: ClientInfo[]
}

const PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', abbr: 'in', bg: 'bg-[#0a66c2]' },
  { id: 'gmb', label: 'Google Business', abbr: 'G', bg: 'bg-white text-gray-900 border' },
  { id: 'facebook', label: 'Facebook', abbr: 'f', bg: 'bg-[#1877f2]' },
  { id: 'instagram', label: 'Instagram', abbr: 'IG', bg: 'bg-gradient-to-r from-[#f09433] via-[#bc1888] to-[#405de6]' },
  { id: 'medium', label: 'Medium', abbr: 'M', bg: 'bg-black' },
  { id: 'devto', label: 'Dev.to', abbr: 'D', bg: 'bg-[#0f172a]' },
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

export default function AdminIntegrationsPanel({ clients }: Props) {
  const [selectedClientId, setSelectedClientId] = useState(
    clients.length > 0 ? clients[0].id : ''
  )
  const [directIntegrations, setDirectIntegrations] = useState<DirectIntegration[]>([])
  const [ayrshareIntegrations, setAyrshareIntegrations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<string | null>(null)

  // Fetch integrations when client changes
  useEffect(() => {
    if (!selectedClientId) return

    setLoading(true)
    fetch(`/api/admin/client-integrations?clientId=${selectedClientId}`)
      .then(r => r.json())
      .then(data => {
        if (data.direct) setDirectIntegrations(data.direct)
        if (data.ayrshare) setAyrshareIntegrations(data.ayrshare)
      })
      .catch(err => {
        console.error('Failed to fetch integrations:', err)
        setDirectIntegrations([])
        setAyrshareIntegrations([])
      })
      .finally(() => setLoading(false))
  }, [selectedClientId])

  // Calculate health summary
  const allConnections = [
    ...directIntegrations.map(d => ({ platform: d.platform, expiresAt: d.token_expires_at })),
    ...ayrshareIntegrations.map(p => ({ platform: p, expiresAt: null })),
  ]
  const activeCount = allConnections.filter(c => getTokenStatus(c.expiresAt) === 'connected').length
  const expiringCount = allConnections.filter(c => getTokenStatus(c.expiresAt) === 'expiring').length
  const expiredCount = allConnections.filter(c => getTokenStatus(c.expiresAt) === 'expired').length

  const isDirectPlatform = (platformId: string): boolean => {
    return ['linkedin', 'gmb'].includes(platformId)
  }

  const isAyrshare = (platformId: string): boolean => {
    return ['facebook', 'instagram'].includes(platformId)
  }

  const getConnectionStatus = (platformId: string) => {
    if (isDirectPlatform(platformId)) {
      return directIntegrations.find(d => d.platform === platformId)
    }
    if (isAyrshare(platformId)) {
      return ayrshareIntegrations.includes(platformId) ? { connected: true } : null
    }
    return null
  }

  const handleConnect = useCallback(
    async (platformId: string) => {
      setConnectingPlatform(platformId)

      if (isDirectPlatform(platformId)) {
        try {
          const authEndpoint =
            platformId === 'linkedin' ? '/api/social/linkedin/auth' : '/api/social/gmb/auth'
          const res = await fetch(`${authEndpoint}?clientId=${selectedClientId}`)
          if (!res.ok) {
            console.error('Auth endpoint failed:', res.status)
            setConnectingPlatform(null)
            return
          }

          const data = await res.json()
          if (!data.url) {
            console.error('No auth URL received')
            setConnectingPlatform(null)
            return
          }

          const popup = window.open(data.url, '_blank', 'width=600,height=700')
          if (!popup) {
            console.error('Popup blocked')
            setConnectingPlatform(null)
            return
          }

          const messageType =
            platformId === 'linkedin' ? 'linkedin_oauth' : 'gmb_oauth'

          const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === messageType) {
              window.removeEventListener('message', handleMessage)
              if (event.data.status === 'success') {
                fetch(`/api/social/client-integrations?clientId=${selectedClientId}`)
                  .then(r => r.json())
                  .then(d => {
                    if (d.direct) setDirectIntegrations(d.direct)
                  })
              }
              if (popup && !popup.closed) popup.close()
            }
          }

          window.addEventListener('message', handleMessage)

          const pollTimer = setInterval(() => {
            if (popup?.closed) {
              clearInterval(pollTimer)
              window.removeEventListener('message', handleMessage)
              setTimeout(() => {
                fetch(`/api/social/client-integrations?clientId=${selectedClientId}`)
                  .then(r => r.json())
                  .then(d => {
                    if (d.direct) setDirectIntegrations(d.direct)
                  })
              }, 500)
            }
          }, 500)
        } catch (err) {
          console.error('Connect error:', err)
        }
      } else if (isAyrshare(platformId)) {
        try {
          const res = await fetch(`/api/social/connect?clientId=${selectedClientId}`)
          if (!res.ok) {
            console.error('Connect endpoint failed')
            setConnectingPlatform(null)
            return
          }

          const data = await res.json()
          if (!data.connectUrl) {
            console.error('No connect URL received')
            setConnectingPlatform(null)
            return
          }

          const popup = window.open(data.connectUrl, '_blank', 'width=600,height=700')
          if (!popup) {
            console.error('Popup blocked')
            setConnectingPlatform(null)
            return
          }

          const pollTimer = setInterval(async () => {
            if (popup?.closed) {
              clearInterval(pollTimer)
              setTimeout(async () => {
                try {
                  const res = await fetch(`/api/social/profiles?clientId=${selectedClientId}`)
                  const data = await res.json()
                  setAyrshareIntegrations(data.platforms ?? [])
                } catch (err) {
                  console.error('Failed to refresh Ayrshare platforms')
                }
              }, 500)
            }
          }, 500)
        } catch (err) {
          console.error('Ayrshare connect error:', err)
        }
      }

      setConnectingPlatform(null)
    },
    [selectedClientId]
  )

  const handleDisconnect = useCallback(
    async (platformId: string) => {
      setDisconnectingPlatform(platformId)

      if (isDirectPlatform(platformId)) {
        try {
          const res = await fetch(
            `/api/social/client-integrations?clientId=${selectedClientId}&platform=${platformId}`,
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
    [selectedClientId, directIntegrations]
  )

  return (
    <div className="space-y-6">
      {/* Client Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-white">Select Client:</label>
        <select
          value={selectedClientId}
          onChange={e => setSelectedClientId(e.target.value)}
          className="bg-[#141200] border border-[#2a2200] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ca8a04]"
        >
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Health Summary */}
      {!loading && (
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
      )}

      {/* Platform Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#ca8a04] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map(platform => {
            const connection = getConnectionStatus(platform.id)
            const isConnected = !!connection
            let statusColor = 'text-[#7a6a40] bg-[#1c1800] border-[#2a2200]'
            let statusText = 'Not connected'

            if (isConnected) {
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
                    {isConnected && (
                      <p className="text-[#7a6a40] text-xs mt-0.5 truncate">
                        {(connection as any).name || 'Connected'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`mb-4 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-center ${statusColor}`}>
                  {isConnected && isDirectPlatform(platform.id)
                    ? formatExpiryText((connection as any).token_expires_at) || 'Connected'
                    : statusText}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={disconnectingPlatform === platform.id}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
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
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
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
      )}
    </div>
  )
}
