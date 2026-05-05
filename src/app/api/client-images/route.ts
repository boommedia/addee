import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = request.nextUrl.searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
    }

    // Verify client belongs to user
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('created_by', user.id)
      .single()

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Fetch images
    const { data: images, error } = await supabase
      .from('client_images')
      .select('*')
      .eq('client_id', clientId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }

    // Get plan limit
    const PLAN_LIMITS: Record<string, number> = {
      free: 10,
      pro: 50,
      agency: 100,
    }
    const tier = 'free'
    const limit = PLAN_LIMITS.free

    return NextResponse.json({
      images: images || [],
      usage: {
        current: images?.length ?? 0,
        limit,
        tier,
      },
    })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const imageId = request.nextUrl.searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json({ error: 'Missing imageId' }, { status: 400 })
    }

    // Fetch image to verify ownership
    const { data: image } = await supabase
      .from('client_images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single()

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from storage
    const fileName = image.image_url.split('/').pop()
    if (fileName) {
      await supabase.storage.from('client-images').remove([`${image.client_id}/${fileName}`])
    }

    // Delete from database
    const { error } = await supabase
      .from('client_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
