import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BrandsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen p-8" style={{ background: '#060d1a', color: '#dde4f0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/brands" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#00FF00' }}>Your Brands</h1>
            <p className="mt-2" style={{ color: '#7a90b8' }}>Manage your brand profiles and voice guidelines</p>
          </div>
          <Link
            href="/brands/new"
            className="px-6 py-3 rounded-lg transition hover:opacity-90"
            style={{ background: '#0066FF', color: 'white' }}
          >
            New Brand
          </Link>
        </div>

        {brands && brands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand: any) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="block p-6 rounded-lg border transition hover:border-blue-400"
                style={{ background: 'rgba(11,22,40,0.6)', borderColor: 'rgba(0,102,255,0.3)' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {brand.logo_url && (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <h2 className="text-xl font-semibold flex-1" style={{ color: '#dde4f0' }}>{brand.name}</h2>
                </div>
                <p className="text-sm" style={{ color: '#7a90b8' }}>{brand.industry}</p>
                <p className="text-sm mt-3 font-medium" style={{ color: '#0066FF' }}>Tone: {brand.tone_examples ? '✓ Configured' : 'Not set'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="mb-4" style={{ color: '#7a90b8' }}>No brands yet. Create your first brand profile!</p>
            <Link
              href="/brands/new"
              className="inline-block px-6 py-3 rounded-lg transition hover:opacity-90"
              style={{ background: '#0066FF', color: 'white' }}
            >
              Create Brand
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
