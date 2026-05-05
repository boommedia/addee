'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, Lock } from 'lucide-react'

interface Image {
  id: string
  image_url: string
  file_name: string
  uploaded_at: string
}

interface Usage {
  current: number
  limit: number
  tier: string
}

export default function MediaLibrary({ clientId }: { clientId: string }) {
  const [images, setImages] = useState<Image[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [clientId])

  async function fetchImages() {
    try {
      setLoading(true)
      const res = await fetch(`/api/client-images?clientId=${clientId}`)
      const data = await res.json()
      if (res.ok) {
        setImages(data.images)
        setUsage(data.usage)
        setError(null)
      } else {
        setError(data.error || 'Failed to load images')
      }
    } catch (err) {
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(files: FileList) {
    if (!files.length) return

    setUploading(true)
    setError(null)

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('clientId', clientId)

        const res = await fetch('/api/client-images/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()
        if (res.ok) {
          setImages([data, ...images])
          setUsage(prev => prev ? { ...prev, current: prev.current + 1 } : null)
        } else {
          setError(data.error || 'Upload failed')
        }
      } catch (err) {
        setError('Upload failed')
      }
    }

    setUploading(false)
  }

  async function deleteImage(imageId: string) {
    try {
      const res = await fetch(`/api/client-images?imageId=${imageId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setImages(images.filter(img => img.id !== imageId))
        setUsage(prev => prev ? { ...prev, current: prev.current - 1 } : null)
      } else {
        setError('Failed to delete image')
      }
    } catch (err) {
      setError('Failed to delete image')
    }
  }

  const isAtLimit = usage && usage.current >= usage.limit

  return (
    <div className="space-y-6">
      {/* Usage stats */}
      {usage && (
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider">Media Usage</p>
              <p className="text-white text-lg font-bold mt-1">
                {usage.current} <span className="text-[#8888a8] text-sm font-normal">/ {usage.limit} images</span>
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{Math.round((usage.current / usage.limit) * 100)}%</span>
            </div>
          </div>
          {usage.tier !== 'free' && (
            <p className="text-[#8888a8] text-xs mt-3">{usage.tier.charAt(0).toUpperCase() + usage.tier.slice(1)} plan</p>
          )}
        </div>
      )}

      {/* Upload area */}
      {!isAtLimit && (
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-[#2a2a3d] hover:border-violet-500/50'
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            setDragActive(false)
            handleUpload(e.dataTransfer.files)
          }}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => handleUpload(e.target.files!)}
            className="hidden"
            id="media-input"
            disabled={uploading}
          />
          <label htmlFor="media-input" className="cursor-pointer">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-violet-400" />
              </div>
            </div>
            <p className="text-white font-semibold text-sm mb-1">
              {uploading ? 'Uploading...' : 'Drop images or click to browse'}
            </p>
            <p className="text-[#8888a8] text-xs">PNG, JPG, GIF up to 5MB each</p>
          </label>
        </div>
      )}

      {isAtLimit && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-300 text-sm font-semibold">Image limit reached</p>
            <p className="text-[#8888a8] text-xs mt-1">Delete images or upgrade your plan to add more</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Images grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#8888a8] text-sm">Loading images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#8888a8] text-sm">No images yet. Upload your first image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map(image => (
            <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500 transition-colors">
              <img
                src={image.image_url}
                alt={image.file_name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deleteImage(image.id)}
                className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{image.file_name}</p>
                <p className="text-[#8888a8] text-xs mt-0.5">
                  {new Date(image.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
