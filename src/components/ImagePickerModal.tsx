'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface Image {
  id: string
  image_url: string
  file_name: string
}

interface ImagePickerModalProps {
  clientId: string
  onSelect: (imageUrl: string) => void
  onClose: () => void
}

export default function ImagePickerModal({ clientId, onSelect, onClose }: ImagePickerModalProps) {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [clientId])

  async function fetchImages() {
    try {
      const res = await fetch(`/api/client-images?clientId=${clientId}`)
      const data = await res.json()
      if (res.ok) {
        setImages(data.images)
      }
    } catch (err) {
      console.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  function handleSelect() {
    const selected = images.find(img => img.id === selectedId)
    if (selected) {
      onSelect(selected.image_url)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a3d]">
          <h2 className="text-white font-bold text-lg">Select an image</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2a2a3d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8888a8]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-[#8888a8] text-center py-8">Loading images...</p>
          ) : images.length === 0 ? (
            <p className="text-[#8888a8] text-center py-8">No images found. Upload some first.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map(image => (
                <button
                  key={image.id}
                  onClick={() => setSelectedId(image.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedId === image.id
                      ? 'border-violet-500 ring-2 ring-violet-500'
                      : 'border-[#2a2a3d] hover:border-violet-500/50'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                  {selectedId === image.id && (
                    <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[#2a2a3d]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#2a2a3d] hover:bg-[#3a3a4d] text-white rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedId || loading}
            className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Select image
          </button>
        </div>
      </div>
    </div>
  )
}
