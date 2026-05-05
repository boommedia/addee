'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Loader2, ChevronDown, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Message = { role: 'user' | 'assistant'; content: string }

type UserContext = { plan: string; postsUsed: number; postsLimit: number }

const UPSELL_SIGNALS = [
  'upgrade', 'growth plan', 'agency plan', 'agency max', 'starter plan',
  'higher plan', 'paid plan', 'rankings history', 'add-on', 'billing',
]

function hasUpsellSignal(text: string) {
  const lower = text.toLowerCase()
  return UPSELL_SIGNALS.some(kw => lower.includes(kw))
}

const GREETING = "Hey! 👋 I'm Bloggy's AI assistant. Ask me anything — features, pricing, how to set things up, or troubleshooting."

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [userContext, setUserContext] = useState<UserContext | null>(null)
  const [showUpgradeCta, setShowUpgradeCta] = useState(false)
  const [unread, setUnread] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadContext() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const [{ data: sub }, { count }] = await Promise.all([
          supabase.from('subscriptions').select('plan, status, posts_limit').eq('user_id', user.id).single(),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', monthStart),
        ])
        if (sub) {
          setUserContext({
            plan: sub.status === 'active' ? sub.plan : 'free',
            postsUsed: count ?? 0,
            postsLimit: sub.posts_limit ?? 2,
          })
        }
      } catch { /* ignore — context is optional */ }
    }
    loadContext()
  }, [])

  useEffect(() => {
    if (open) {
      setUnread(false)
      if (messages.length === 0) {
        setMessages([{ role: 'assistant', content: GREETING }])
      }
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    setInput('')
    setShowUpgradeCta(false)

    const history: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, userContext }),
      })

      if (!res.ok || !res.body) throw new Error('Request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullText }
          return updated
        })
      }

      if (hasUpsellSignal(fullText)) setShowUpgradeCta(true)
      if (!open) setUnread(true)
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: "Sorry, something went wrong. Please try again or reach out on Discord.",
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, messages, userContext, open])

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-[4.5rem] right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[560px] flex flex-col bg-[#12121a] border border-[#2a2a3d] rounded-2xl shadow-2xl shadow-black/60 z-[200] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3d] bg-[#0d0d15] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold leading-none">Bloggy Assistant</div>
                <div className="text-emerald-400 text-[11px] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#555570] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2a2a3d]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1
              const isStreamingPlaceholder = streaming && isLast && m.role === 'assistant' && !m.content
              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-sm'
                        : 'bg-[#1a1a26] text-[#e8e8f0] border border-[#2a2a3d] rounded-bl-sm'
                    }`}
                  >
                    {isStreamingPlaceholder ? (
                      <span className="inline-flex items-center gap-1 py-0.5">
                        {[0, 150, 300].map(delay => (
                          <span
                            key={delay}
                            className="w-1.5 h-1.5 bg-[#8888a8] rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </span>
                    ) : m.content}
                  </div>
                </div>
              )
            })}

            {/* Upgrade CTA — shown when AI mentions a plan */}
            {showUpgradeCta && (
              <div className="flex justify-start">
                <a
                  href="/billing"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 bg-violet-600/15 border border-violet-500/30 px-3 py-2 rounded-xl hover:bg-violet-600/25 transition-colors"
                >
                  View Plans & Pricing <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Handoff strip */}
          <div className="px-4 py-2 border-t border-[#1a1a26] flex items-center justify-between shrink-0">
            <span className="text-[#555570] text-xs">Need a human?</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open('https://discord.gg/9avYXden', '_blank', 'noopener,noreferrer')}
                className="text-[#8888a8] hover:text-violet-400 text-xs transition-colors"
              >
                Discord
              </button>
              <span className="text-[#3a3a5a] text-xs">·</span>
              <button
                onClick={() => { navigator.clipboard?.writeText('eric@boommedia.us'); window.location.href = 'mailto:eric@boommedia.us' }}
                title="eric@boommedia.us"
                className="text-[#8888a8] hover:text-violet-400 text-xs transition-colors"
              >
                Email us
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#2a2a3d] flex items-center gap-2 shrink-0 bg-[#0d0d15]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask anything about Bloggy…"
              disabled={streaming}
              className="flex-1 bg-[#1a1a26] border border-[#2a2a3d] text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-violet-500 placeholder:text-[#444460] transition-colors disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors disabled:opacity-40 shrink-0"
            >
              {streaming
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-4 right-4 sm:right-6 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50 flex items-center justify-center transition-all z-[200] hover:scale-105 active:scale-95"
      >
        {open ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {unread && !open && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#0a0a0f]" />
        )}
      </button>
    </>
  )
}
