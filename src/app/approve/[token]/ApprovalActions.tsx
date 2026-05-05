'use client'

import { useState } from 'react'
import { CheckCircle, MessageSquare, Loader2, ThumbsUp, RefreshCw, Image as ImageIcon, Wand2 } from 'lucide-react'

type Status = 'pending_approval' | 'approved' | 'revision_requested'

export default function ApprovalActions({ token, postId, initialStatus, initialFeedback, initialImageUrl }: {
  token: string
  postId: string
  initialStatus: Status
  initialFeedback: string | null
  initialImageUrl: string | null
}) {
  const [status, setStatus] = useState<Status>(initialStatus)
  const [feedback, setFeedback] = useState(initialFeedback ?? '')
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [regeneratingContent, setRegeneratingContent] = useState(false)

  async function submit(action: 'approved' | 'revision_requested') {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/approve/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback: feedback.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setStatus(action)
      setShowFeedbackForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function generateImage() {
    setGeneratingImage(true)
    setError(null)
    try {
      const res = await fetch(`/api/approve/${token}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate image')
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setGeneratingImage(false)
    }
  }

  async function regenerateContent() {
    setRegeneratingContent(true)
    setError(null)
    try {
      const res = await fetch(`/api/approve/${token}/regenerate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to regenerate content')
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate content')
    } finally {
      setRegeneratingContent(false)
    }
  }

  if (status === 'approved') {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <p className="text-emerald-400 font-semibold text-lg">Post Approved</p>
        <p className="text-[#8888a8] text-sm text-center">
          Thank you! We'll publish this post for you shortly.
        </p>
      </div>
    )
  }

  if (status === 'revision_requested') {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-14 h-14 rounded-full bg-violet-500/15 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-violet-400" />
        </div>
        <p className="text-violet-400 font-semibold text-lg">Revisions Requested</p>
        <p className="text-[#8888a8] text-sm text-center">
          Got it! We'll revise this post and send you an updated version.
        </p>
        {feedback && (
          <div className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 mt-2">
            <p className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-2">Your Feedback</p>
            <p className="text-[#c8c8d8] text-sm leading-relaxed">{feedback}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Enhancement buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={generateImage}
          disabled={generatingImage}
          className="flex items-center justify-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 text-blue-300 font-semibold text-xs px-3 py-2 rounded-lg border border-blue-500/30 transition-colors"
          title="Generate a new hero image (1st free)"
        >
          {generatingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
          New Image
        </button>
        <button
          onClick={regenerateContent}
          disabled={regeneratingContent}
          className="flex items-center justify-center gap-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 disabled:opacity-50 text-cyan-300 font-semibold text-xs px-3 py-2 rounded-lg border border-cyan-500/30 transition-colors"
          title="Regenerate content with AI (1st free)"
        >
          {regeneratingContent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          Regenerate
        </button>
      </div>

      {/* Approve/Revise buttons */}
      {!showFeedbackForm ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => submit('approved')}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
            Approve this post
          </button>
          <button
            onClick={() => setShowFeedbackForm(true)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] hover:border-violet-500/40 disabled:opacity-50 text-[#c8c8d8] font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Request revisions
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider">
            What would you like changed?
          </label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="e.g. Please make the intro shorter and add more detail about our services in section 2…"
            rows={4}
            className="w-full bg-[#0a0a0f] border border-[#2a2a3d] focus:border-violet-500 rounded-xl px-4 py-3 text-[#e8e8f0] text-sm leading-relaxed focus:outline-none transition-colors resize-none"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => submit('revision_requested')}
              disabled={loading || !feedback.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              Submit feedback
            </button>
            <button
              onClick={() => { setShowFeedbackForm(false); setFeedback('') }}
              disabled={loading}
              className="px-5 py-3 text-[#8888a8] hover:text-white bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
