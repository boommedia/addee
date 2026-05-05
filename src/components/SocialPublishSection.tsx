'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, ExternalLink, CheckCircle, XCircle, Share2, Send, Link2, Image } from 'lucide-react'
import ImagePickerModal from './ImagePickerModal'

type Platform = {
  id: string
  label: string
  abbr: string
  bg: string
  textDark?: boolean
  postEndpoint: string
  authEndpoint: string
  oauthMessageType: string
}

const DIRECT_PLATFORMS: Platform[] = [
  {
    id: 'gmb',
    label: 'Google Business',
    abbr: 'G',
    bg: 'bg-white',
    textDark: true,
    postEndpoint: '/api/social/gmb/post',
    authEndpoint: '/api/social/gmb/auth',
    oauthMessageType: 'gmb_oauth',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    abbr: 'in',
    bg: 'bg-[#0a66c2]',
    postEndpoint: '/api/social/linkedin/post',
    authEndpoint: '/api/social/linkedin/auth',
    oauthMessageType: 'linkedin_oauth',
  },
]

const BLOG_PLATFORMS = [
  { id: 'medium', label: 'Medium',  abbr: 'M', bg: 'bg-black' },
  { id: 'devto',  label: 'Dev.to',  abbr: 'D', bg: 'bg-[#0f172a]' },
]

type PublishState = 'idle' | 'loading' | 'ok' | 'error'

type ConnectedPlatform = {
  platform: string
  name: string
}

type Props = {
  clientId: string
  platform: string
  text: string
  title: string
  content: string
  wpPostUrl?: string | null
}

export default function SocialPublishSection({ clientId, platform, text, title, content, wpPostUrl }: Props) {
  const [addonActive, setAddonActive] = useState<boolean | null>(null)
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([])
  const [connectLoading, setConnectLoading] = useState(false)
  const [publishState, setPublishState] = useState<PublishState>('idle')
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishUrl, setPublishUrl] = useState<string | null>(null)
  const [mediumConnected, setMediumConnected] = useState(false)
  const [devtoConnected, setDevtoConnected] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showImagePicker, setShowImagePicker] = useState(false)

  const directConfig = DIRECT_PLATFORMS.find(p => p.id === platform)
  const isDirectPlatform = !!directConfig
  const isBlogPlatform = BLOG_PLATFORMS.some(p => p.id === platform)

  const refreshConnections = useCallback(() => {
    if (!clientId || !isDirectPlatform) return
    fetch(`/api/social/client-integrations?clientId=${clientId}`)
      .then(r => r.json())
      .then(d => setConnectedPlatforms(d.platforms ?? []))
      .catch(() => {})
  }, [clientId, isDirectPlatform])

  useEffect(() => {
    fetch('/api/social/addon-status')
      .then(r => r.json())
      .then(d => setAddonActive(d.active ?? false))
      .catch(() => setAddonActive(false))
  }, [])

  useEffect(() => {
    refreshConnections()
  }, [refreshConnections])

  useEffect(() => {
    if (!isBlogPlatform) return
    fetch('/api/social/addon-status')
      .then(r => r.json())
      .then(d => {
        setMediumConnected(d.mediumConnected ?? false)
        setDevtoConnected(d.devtoConnected ?? false)
      })
      .catch(() => {})
  }, [isBlogPlatform])

  async function handleConnect() {
    if (!directConfig) return
    setConnectLoading(true)
    try {
      const res = await fetch(`${directConfig.authEndpoint}?clientId=${clientId}`)
      if (!res.ok) {
        console.error('Auth endpoint failed:', res.status, res.statusText)
        return
      }
      const data = await res.json()
      if (!data.url) {
        console.error('No auth URL received:', data)
        return
      }

      const popup = window.open(data.url, '_blank', 'width=600,height=700')
      if (!popup) {
        console.error('Popup blocked by browser')
        return
      }

      const handleMessage = (event: MessageEvent) => {
        console.log('Message received:', event.data)
        if (event.data?.type === directConfig.oauthMessageType) {
          console.log('OAuth message received, status:', event.data.status)
          window.removeEventListener('message', handleMessage)
          if (event.data.status === 'success') {
            console.log('OAuth success, refreshing connections')
            refreshConnections()
          } else {
            console.error('OAuth failed:', event.data.detail)
          }
          if (popup && !popup.closed) popup.close()
        }
      }
      window.addEventListener('message', handleMessage)

      // Fallback: poll for popup close and refresh after delay
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer)
          window.removeEventListener('message', handleMessage)
          console.log('Popup closed, refreshing connections')
          setTimeout(() => refreshConnections(), 500)
        }
      }, 500)
    } catch (err) {
      console.error('Connect error:', err)
    } finally {
      setConnectLoading(false)
    }
  }

  async function handlePublish() {
    setPublishState('loading')
    setPublishError(null)
    setPublishUrl(null)

    try {
      if (isDirectPlatform && directConfig) {
        const res = await fetch(directConfig.postEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId, text, url: wpPostUrl ?? undefined, imageUrl: selectedImage ?? undefined }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Post failed')
        setPublishState('ok')
      } else if (platform === 'medium') {
        const res = await fetch('/api/social/medium', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, canonicalUrl: wpPostUrl ?? undefined }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Medium publish failed')
        setPublishState('ok')
        setPublishUrl(data.url)
      } else if (platform === 'devto') {
        const res = await fetch('/api/social/devto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, canonicalUrl: wpPostUrl ?? undefined }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Dev.to publish failed')
        setPublishState('ok')
        setPublishUrl(data.url)
      }
    } catch (err) {
      setPublishState('error')
      setPublishError(err instanceof Error ? err.message : 'Publish failed')
    }
  }

  if (addonActive === null) return null

  if (!addonActive) {
    return (
      <div className="mt-3 bg-violet-500/8 border border-violet-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <Share2 className="w-4 h-4 text-violet-400 shrink-0" />
        <div className="flex-1">
          <p className="text-violet-300 text-xs font-semibold">Publish directly to social — Social Autopilot add-on</p>
          <p className="text-[#555570] text-xs mt-0.5">Post to Google Business, LinkedIn, Medium & more. $29/mo add-on.</p>
        </div>
        <a href="/billing" className="text-xs font-bold text-violet-400 hover:text-violet-300 whitespace-nowrap transition-colors">
          Add $29/mo →
        </a>
      </div>
    )
  }

  // GMB / LinkedIn direct OAuth platforms
  if (isDirectPlatform && directConfig) {
    const integration = connectedPlatforms.find(p => p.platform === platform)
    const isConnected = !!integration

    if (!isConnected) {
      return (
        <div className="mt-3 bg-[#0d0d16] border border-[#2a2a3d] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Link2 className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-semibold">Connect {directConfig.label}</p>
            <p className="text-[#555570] text-xs mt-0.5">
              Authorize this client&apos;s {directConfig.label} account to enable one-click posting
            </p>
          </div>
          <button
            onClick={handleConnect}
            disabled={connectLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            {connectLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
            Connect
          </button>
        </div>
      )
    }

    return (
      <div className="mt-3 border border-[#2a2a3d] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0d0d16] border-b border-[#2a2a3d] flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${directConfig.bg} ${directConfig.textDark ? 'text-[#4285f4]' : 'text-white'}`}>
            {directConfig.abbr}
          </div>
          <span className="text-white text-xs font-semibold">Publish to {directConfig.label}</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {integration.name ?? 'Connected'}
          </span>
        </div>
        <div className="px-4 py-3 bg-[#12121a] space-y-3">
          {selectedImage && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#2a2a3d]">
              <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-500 rounded flex items-center justify-center text-white text-xs"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowImagePicker(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 px-3 py-2 rounded-lg transition-colors"
            >
              <Image className="w-3.5 h-3.5" /> Add image
            </button>
            {publishState === 'ok' ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">Posted successfully!</span>
                {publishUrl && (
                  <a href={publishUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>
                )}
              </div>
            ) : publishState === 'error' ? (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <XCircle className="w-4 h-4" />
                <span className="text-xs">{publishError}</span>
                <button onClick={() => setPublishState('idle')} className="text-[#555570] hover:text-white text-xs ml-auto">Retry</button>
              </div>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishState === 'loading'}
                className="flex items-center gap-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors ml-auto"
              >
                {publishState === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {publishState === 'loading' ? 'Posting…' : 'Publish Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Medium / Dev.to blog publishing
  if (platform === 'medium' || platform === 'devto') {
    const platformConfig = BLOG_PLATFORMS.find(p => p.id === platform)!
    const isConnectedBlog = platform === 'medium' ? mediumConnected : devtoConnected
    const settingsHref = `/settings?tab=integrations`

    return (
      <div className="mt-3 border border-[#2a2a3d] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0d0d16] border-b border-[#2a2a3d] flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${platformConfig.bg} text-white`}>
            {platformConfig.abbr}
          </div>
          <span className="text-white text-xs font-semibold">Publish full post to {platformConfig.label}</span>
          {isConnectedBlog && (
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Connected
            </span>
          )}
        </div>
        <div className="px-4 py-3 bg-[#12121a]">
          {!isConnectedBlog ? (
            <div className="flex items-center gap-3">
              <p className="text-[#8888a8] text-xs flex-1">
                Add your {platformConfig.label} {platform === 'medium' ? 'integration token' : 'API key'} in Settings to enable publishing.
              </p>
              <a href={settingsHref} className="text-xs font-bold text-violet-400 hover:text-violet-300 whitespace-nowrap transition-colors">
                Connect →
              </a>
            </div>
          ) : publishState === 'ok' ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Published!</span>
              {publishUrl && (
                <a href={publishUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> View on {platformConfig.label}
                </a>
              )}
            </div>
          ) : publishState === 'error' ? (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              <span className="text-xs">{publishError}</span>
              <button onClick={() => setPublishState('idle')} className="text-[#555570] hover:text-white text-xs ml-auto">Retry</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-[#555570] text-xs flex-1">Publishes the full blog post{wpPostUrl ? ' with canonical URL set to your WordPress post' : ''}.</p>
              <button
                onClick={handlePublish}
                disabled={publishState === 'loading'}
                className="flex items-center gap-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors shrink-0"
              >
                {publishState === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {publishState === 'loading' ? 'Publishing…' : `Publish to ${platformConfig.label}`}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {showImagePicker && (
        <ImagePickerModal
          clientId={clientId}
          onSelect={url => setSelectedImage(url)}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </>
  )
}
