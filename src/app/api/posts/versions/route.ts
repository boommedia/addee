import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const { data: versions } = await supabase
    .from('post_versions')
    .select('id, label, content, word_count, created_at')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ versions: versions ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, content, label } = await request.json()
  if (!postId || !content) return NextResponse.json({ error: 'postId and content required' }, { status: 400 })

  // Verify post ownership
  const { data: post } = await supabase.from('posts').select('id').eq('id', postId).eq('created_by', user.id).single()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const wordCount = content.split(/\s+/).filter(Boolean).length

  const { data: version, error } = await supabase
    .from('post_versions')
    .insert({ post_id: postId, user_id: user.id, content, word_count: wordCount, label: label || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ version })
}
