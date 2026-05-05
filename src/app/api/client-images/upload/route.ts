import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const PLAN_LIMITS = {
  free: 10,
  pro: 50,
  agency: 100,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string

    if (!file || !clientId) {
      return NextResponse.json({ error: 'Missing file or clientId' }, { status: 400 })
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

    // Check plan limits (default to free for now)
    const tier = 'free' as keyof typeof PLAN_LIMITS
    const limit = PLAN_LIMITS[tier]

    const { count } = await supabase
      .from('client_images')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)

    if ((count ?? 0) >= limit) {
      return NextResponse.json(
        { error: `Image limit reached (${limit} for ${tier} plan)` },
        { status: 403 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const fileName = `${clientId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('client-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('client-images')
      .getPublicUrl(fileName)

    // Save to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('client_images')
      .insert({
        user_id: user.id,
        client_id: clientId,
        image_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file on DB error
      await supabase.storage.from('client-images').remove([fileName])
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
    }

    return NextResponse.json(imageRecord)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
