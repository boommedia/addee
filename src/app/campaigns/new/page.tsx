'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', formats: ['Feed Post', 'Story', 'Reel', 'Carousel'] },
  { id: 'linkedin', name: 'LinkedIn', formats: ['Post', 'Document Ad'] },
  { id: 'tiktok', name: 'TikTok', formats: ['Video Script', 'Hook + Body'] },
  { id: 'google_ads', name: 'Google Ads', formats: ['Search Ad', 'Display Ad'] },
  { id: 'meta', name: 'Meta', formats: ['Feed Ad', 'Story Ad', 'Reel Ad'] },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const supabase = createClient()

  const [brands, setBrands] = useState<any[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand_id: '',
    product_name: '',
    target_audience: '',
    goals: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadBrands() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)

      setBrands(data || [])
    }

    loadBrands()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('campaigns').insert({
        name: formData.name,
        description: formData.description,
        brand_id: formData.brand_id,
        product_name: formData.product_name,
        target_audience: formData.target_audience,
        goals: formData.goals,
        platforms: selectedPlatforms,
        status: 'draft',
      })

      if (error) throw error

      router.push('/campaigns')
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Create New Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-foreground font-semibold mb-2">Brand *</label>
            <select
              required
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Campaign Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="e.g., Spring Product Launch"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="Campaign overview and brief..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Product/Service Name *</label>
            <input
              type="text"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="What are you promoting?"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Target Audience</label>
            <input
              type="text"
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="e.g., SaaS founders, age 25-40"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2">Campaign Goals</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:border-primary outline-none"
              placeholder="e.g., Increase signups, build awareness, drive sales"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-3">Platforms *</label>
            <div className="space-y-2">
              {PLATFORMS.map((platform) => (
                <label key={platform.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id])
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform.id))
                      }
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground">{platform.name}</span>
                  <span className="text-foreground/50 text-sm">({platform.formats.join(', ')})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || selectedPlatforms.length === 0}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
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
