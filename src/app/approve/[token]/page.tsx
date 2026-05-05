import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import BlogPreview from '@/components/BlogPreview'
import ApprovalActions from './ApprovalActions'

export default async function ApprovalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, image_url, approval_status, client_feedback, clients(name)')
    .eq('approval_token', token)
    .single()

  if (!post || !post.content) notFound()

  const clientName = (Array.isArray(post.clients) ? post.clients[0] : post.clients as { name: string } | null)?.name ?? null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Header */}
      <header className="border-b border-[#2a2a3d] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-lg tracking-tight">Bloggy</span>
            <span className="text-[#555570] text-sm">by Boom Media</span>
          </div>
          {clientName && (
            <span className="text-xs text-[#8888a8] bg-[#12121a] border border-[#2a2a3d] px-3 py-1 rounded-full">
              {clientName}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Approval card */}
        <div className="bg-[#12121a] border border-violet-500/30 rounded-2xl p-6 mb-8">
          <p className="text-[#8888a8] text-sm mb-1">Blog post ready for your review</p>
          <h1 className="text-white text-xl font-bold mb-5">{post.title ?? 'Untitled Post'}</h1>
          <ApprovalActions
            token={token}
            postId={post.id}
            initialStatus={post.approval_status as 'pending_approval' | 'approved' | 'revision_requested'}
            initialFeedback={post.client_feedback ?? null}
            initialImageUrl={post.image_url ?? null}
          />
        </div>

        {/* Featured image */}
        {post.image_url && (
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden mb-8">
            <img src={post.image_url} alt={post.title ?? 'Featured image'} className="w-full h-64 object-cover" />
          </div>
        )}

        {/* Post content */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
          <div className="px-8 py-8 max-w-none">
            <BlogPreview content={post.content} />
          </div>
        </div>

        <p className="text-center text-[#555570] text-xs mt-8">
          Powered by <a href="https://bloggy.online" className="text-[#555570] hover:text-[#8888a8] transition-colors">Bloggy</a> · Boom Media
        </p>
      </main>
    </div>
  )
}
