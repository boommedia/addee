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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Brands</h1>
            <p className="text-foreground/60 mt-2">Manage your brand profiles and voice guidelines</p>
          </div>
          <Link
            href="/brands/new"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
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
                className="block p-6 border border-foreground/10 rounded-lg hover:border-primary/30 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  {brand.logo_url && (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-foreground flex-1">{brand.name}</h2>
                </div>
                <p className="text-foreground/60 text-sm">{brand.industry}</p>
                <p className="text-primary text-sm mt-3 font-medium">Tone: {brand.tone_examples ? '✓ Configured' : 'Not set'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-foreground/60 mb-4">No brands yet. Create your first brand profile!</p>
            <Link
              href="/brands/new"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Create Brand
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
