'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'

type ApprovalItem = {
  id: string
  topic: string
  status: string
  scheduled_for: string
  post_id: string
  client_id: string
  client_name: string
  post_title?: string
  post_content?: string
}

type Props = {
  items: ApprovalItem[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onReschedule: (id: string, date: string) => Promise<void>
}

export default function AutoblogApprovalDashboard({
  items,
  onApprove,
  onReject,
  onReschedule,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#1a1a24] transition-colors text-left"
          >
            <div className="flex-1">
              <div className="font-semibold text-white text-sm mb-1">{item.topic}</div>
              <div className="text-xs text-[#8888a8]">{item.client_name}</div>
            </div>
            <div className="text-xs text-[#555570]">{new Date(item.scheduled_for).toLocaleDateString()}</div>
          </button>

          {expandedId === item.id && (
            <div className="px-5 py-4 border-t border-[#2a2a3d] bg-[#0a0900]/60 space-y-4">
              {item.post_title && (
                <div>
                  <div className="text-xs text-[#8888a8] font-medium uppercase tracking-wide mb-2">Post Title</div>
                  <div className="text-white text-sm">{item.post_title}</div>
                </div>
              )}

              {item.post_content && (
                <div>
                  <div className="text-xs text-[#8888a8] font-medium uppercase tracking-wide mb-2">Preview</div>
                  <div className="text-[#e8e8f0] text-sm line-clamp-4">{item.post_content}</div>
                </div>
              )}

              {rescheduleId === item.id ? (
                <div className="space-y-3 pt-2">
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-[#1a1a26] border border-[#2a2a3d] rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (rescheduleDate) {
                          await onReschedule(item.id, rescheduleDate)
                          setRescheduleId(null)
                          setRescheduleDate('')
                        }
                      }}
                      className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setRescheduleId(null)
                        setRescheduleDate('')
                      }}
                      className="flex-1 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onApprove(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => setRescheduleId(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
