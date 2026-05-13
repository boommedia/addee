'use client'

import { useState } from 'react'
import { Sparkles, Download, Copy, RefreshCw, ImageIcon, ExternalLink, CheckCircle } from 'lucide-react'

const PLATFORMS = [
  { id: 'instagram_post',  label: 'Instagram Post',  size: '1080×1080', icon: '📸', canvaUrl: 'https://www.canva.com/create/instagram-posts/' },
  { id: 'instagram_story', label: 'IG Story',        size: '1080×1920', icon: '📱', canvaUrl: 'https://www.canva.com/create/instagram-stories/' },
  { id: 'tiktok',          label: 'TikTok',           size: '1080×1920', icon: '🎵', canvaUrl: 'https://www.canva.com/create/tiktok-videos/' },
  { id: 'linkedin',        label: 'LinkedIn',         size: '1200×627',  icon: '💼', canvaUrl: 'https://www.canva.com/create/linkedin-posts/' },
  { id: 'facebook',        label: 'Facebook',         size: '1200×630',  icon: '👍', canvaUrl: 'https://www.canva.com/create/facebook-posts/' },
  { id: 'google_display',  label: 'Google Ads',       size: '300×250',   icon: '🎯', canvaUrl: 'https://www.canva.com/create/display-ads/' },
  { id: 'youtube',         label: 'YouTube',          size: '1280×720',  icon: '▶️', canvaUrl: 'https://www.canva.com/create/youtube-thumbnails/' },
]

const STYLES = [
  { id: 'none',            label: 'Default'      },
  { id: 'photo_studio',    label: 'Studio'       },
  { id: 'golden_hour',     label: 'Golden Hour'  },
  { id: 'dramatic_light',  label: 'Dramatic'     },
  { id: 'bw',              label: 'B&W'          },
  { id: 'vibrant_colors',  label: 'Vibrant'      },
  { id: 'minimalist',      label: 'Minimal'      },
]

type FireflyOutput = {
  seed: number
  image: { id: string; presignedUrl: string }
}

export default function DesignStudio({
  initialCopy = '',
  initialPlatform = 'instagram_post',
  initialPrompt = '',
}: {
  initialCopy?: string
  initialPlatform?: string
  initialPrompt?: string
}) {
  const [platform, setPlatform] = useState(initialPlatform)
  const [copy, setCopy] = useState(initialCopy)
  const [imagePrompt, setImagePrompt] = useState(initialPrompt)
  const [style, setStyle] = useState('none')
  const [images, setImages] = useState<FireflyOutput[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const selectedPlatform = PLATFORMS.find(p => p.id === platform) ?? PLATFORMS[0]

  async function generateImages() {
    if (!imagePrompt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/firefly/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, platform, style }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setImages(data.outputs ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  async function copyCopy() {
    await navigator.clipboard.writeText(copy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isCredentialError = error?.includes('not configured') || error?.includes('credentials')

  return (
    <div>
      {/* Platform selector */}
      <div className="flex gap-2 flex-wrap mb-8">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all"
            style={{
              background: platform === p.id ? 'rgba(202,138,4,0.15)' : 'rgba(20,18,0,0.6)',
              borderColor: platform === p.id ? '#ca8a04' : '#2a2200',
              color: platform === p.id ? '#fbbf24' : '#b8a870',
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
            <span className="text-xs" style={{ color: platform === p.id ? '#ca8a04' : '#7a6a40' }}>{p.size}</span>
          </button>
        ))}
      </div>

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── CANVA PANEL ── */}
        <div className="rounded-2xl border p-5 flex flex-col gap-4" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>C</div>
              <h2 className="font-bold text-white">Canva Design</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
              Template Engine
            </span>
          </div>

          {/* Ad copy input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#b8a870' }}>Ad Copy</label>
              {copy && (
                <button onClick={copyCopy} className="flex items-center gap-1 text-xs transition-colors" style={{ color: '#b8a870' }}>
                  {copied ? <CheckCircle className="w-3 h-3 text-[#84cc16]" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              )}
            </div>
            <textarea
              value={copy}
              onChange={e => setCopy(e.target.value)}
              rows={6}
              placeholder="Paste your AI-generated ad copy here, or generate it from the Generate page first…"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white resize-none focus:outline-none transition-colors"
              style={{ background: '#0a0900', border: '1px solid #2a2200', color: '#dde4f0' }}
            />
          </div>

          {/* Canva CTA */}
          <div className="rounded-xl p-4 border flex flex-col items-center text-center gap-3 flex-1 justify-center" style={{ background: 'rgba(124,58,237,0.07)', borderColor: 'rgba(168,85,247,0.2)' }}>
            <div className="text-3xl">{selectedPlatform.icon}</div>
            <div>
              <p className="text-white font-semibold text-sm mb-1">{selectedPlatform.label} — {selectedPlatform.size}</p>
              <p className="text-sm" style={{ color: '#b8a870' }}>
                Open a platform-matched Canva template. Paste your copy above, then click to design.
              </p>
            </div>
            <a
              href={selectedPlatform.canvaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
            >
              <ExternalLink className="w-4 h-4" />
              Open in Canva
            </a>
            <p className="text-xs" style={{ color: '#7a6a40' }}>
              Canva Connect API integration coming — will auto-inject copy into templates
            </p>
          </div>
        </div>

        {/* ── ADOBE FIREFLY PANEL ── */}
        <div className="rounded-2xl border p-5 flex flex-col gap-4" style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.3)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}>A</div>
              <h2 className="font-bold text-white">Adobe Firefly</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              AI Images
            </span>
          </div>

          {/* Prompt input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#b8a870' }}>Image Prompt</label>
            <textarea
              value={imagePrompt}
              onChange={e => setImagePrompt(e.target.value)}
              rows={3}
              placeholder={`Describe the visual for your ${selectedPlatform.label} ad. E.g. "Confident professional woman at modern desk, bright natural light, clean minimal office background, product in foreground"`}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white resize-none focus:outline-none"
              style={{ background: '#0a0900', border: '1px solid #2a2200', color: '#dde4f0' }}
            />
          </div>

          {/* Style chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#b8a870' }}>Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className="px-3 py-1 rounded-lg text-xs font-medium border transition-all"
                  style={{
                    background: style === s.id ? 'rgba(239,68,68,0.15)' : 'rgba(20,18,0,0.6)',
                    borderColor: style === s.id ? 'rgba(239,68,68,0.5)' : '#2a2200',
                    color: style === s.id ? '#f87171' : '#b8a870',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generateImages}
            disabled={loading || !imagePrompt.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)', boxShadow: images.length ? 'none' : '0 4px 16px rgba(220,38,38,0.3)' }}
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating 4 images…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate 4 Images — {selectedPlatform.size}</>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-lg px-3 py-2.5 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              {isCredentialError ? (
                <span>Add <code className="font-mono text-xs bg-red-900/30 px-1 py-0.5 rounded">ADOBE_FIREFLY_CLIENT_ID</code> and <code className="font-mono text-xs bg-red-900/30 px-1 py-0.5 rounded">ADOBE_FIREFLY_CLIENT_SECRET</code> to your Vercel environment variables to activate image generation.</span>
              ) : error}
            </div>
          )}

          {/* Image results grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                <div key={img.seed ?? i} className="relative group rounded-xl overflow-hidden bg-[#141200]" style={{ aspectRatio: platform.includes('story') || platform === 'tiktok' ? '9/16' : platform === 'youtube' ? '16/9' : '1/1' }}>
                  <img src={img.image.presignedUrl} alt={`Generated variation ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <a
                      href={img.image.presignedUrl}
                      download={`firefly-${platform}-v${i + 1}.jpg`}
                      className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(220,38,38,0.85)' }}
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                  <div className="absolute top-2 left-2 text-xs font-bold text-white px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    V{i + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="rounded-xl border border-dashed flex flex-col items-center justify-center py-10 gap-2" style={{ borderColor: '#2a2200' }}>
              <ImageIcon className="w-8 h-8" style={{ color: '#7a6a40' }} />
              <p className="text-sm" style={{ color: '#7a6a40' }}>AI-generated images will appear here</p>
              <p className="text-xs" style={{ color: '#7a6a40' }}>{selectedPlatform.size} · {selectedPlatform.label} format</p>
            </div>
          )}
        </div>
      </div>

      {/* Tip bar */}
      <div className="mt-6 rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(202,138,4,0.06)', border: '1px solid rgba(202,138,4,0.15)' }}>
        <Sparkles className="w-4 h-4 shrink-0" style={{ color: '#ca8a04' }} />
        <p className="text-xs" style={{ color: '#b8a870' }}>
          <strong style={{ color: '#ca8a04' }}>Workflow tip:</strong> Generate your ad copy on the{' '}
          <a href="/dashboard" className="underline hover:text-white transition-colors">Generate page</a>, then click{' '}
          <strong style={{ color: '#dde4f0' }}>"Design in Studio"</strong> to send copy + platform directly here. Firefly generates background images; use Canva to add text and brand elements.
        </p>
      </div>
    </div>
  )
}
