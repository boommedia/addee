'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function NewBrandPage() {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    brand_voice: '',
    tone_examples: '',
    visual_style: '',
    colors: '#ef4444',
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('brands').insert({
        name: formData.name,
        industry: formData.industry,
        brand_voice: formData.brand_voice,
        tone_examples: formData.tone_examples,
        visual_style: formData.visual_style,
        colors: { primary: formData.colors },
        user_id: user.id,
      })

      if (error) throw error

      router.push('/brands')
    } catch (error) {
      console.error('Error creating brand:', error)
      alert('Failed to create brand')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Create New Brand</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-foreground font-semibold mb-2">Brand Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="e.g., SaaS, E-commerce, etc."
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Brand Voice</label>
            <textarea
              value={formData.brand_voice}
              onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="Describe your brand voice and personality..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Tone Examples</label>
            <textarea
              value={formData.tone_examples}
              onChange={(e) => setFormData({ ...formData, tone_examples: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="Paste examples of your best ad copy or social posts..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Visual Style</label>
            <textarea
              value={formData.visual_style}
              onChange={(e) => setFormData({ ...formData, visual_style: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="Describe your visual style, color scheme, fonts, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Brand'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
