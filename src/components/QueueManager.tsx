'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, Trash2, RefreshCw, Clock, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, Upload } from 'lucide-react'
import { addTopics, deleteTopic, retryTopic, saveSchedule } from '@/app/autoblog/actions'

type Topic = {
  id: string
  topic: string
  status: string
  scheduled_for: string | null
  error_message: string | null
  post_id: string | null
}

type Client = {
  id: string
  name: string
  schedule_enabled: boolean
  schedule_cadence: string
  schedule_time: string
  schedule_tone: string
  schedule_length: string
  next_run_at: string | null
}

const STATUS_ICON = {
  pending: <Clock className="w-3.5 h-3.5 text-[#8888a8]" />,
  generating: <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />,
  published: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  failed: <XCircle className="w-3.5 h-3.5 text-red-400" />,
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Scheduled',
  generating: 'Generating...',
  published: 'Published',
  failed: 'Failed',
}

export default function QueueManager({ client, topics }: { client: Client; topics: Topic[] }) {
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [topicText, setTopicText] = useState('')
  const csvInputRef = useRef<HTMLInputElement>(null)

  function handleCSVImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const topics = text
        .split('\n')
        .map(line => line.split(',')[0].replace(/^["']|["']$/g, '').trim())
        .filter(Boolean)
      setTopicText(prev => (prev ? prev + '\n' : '') + topics.join('\n'))
    }
    reader.readAsText(file)
    e.target.value = ''
  }
  const [enabled, setEnabled] = useState(client.schedule_enabled)
  const [cadence, setCadence] = useState(client.schedule_cadence ?? 'weekly')
  const [time, setTime] = useState(client.schedule_time ?? '09:00')
  const [tone, setTone] = useState(client.schedule_tone ?? 'professional')
  const [length, setLength] = useState(client.schedule_length ?? 'medium')
  const [isPending, startTransition] = useTransition()
  const [schedPending, startSchedTransition] = useTransition()
  const [error, setError] = useState('')

  const pending = topics.filter(t => t.status === 'pending' || t.status === 'generating')
  const done = topics.filter(t => t.status === 'published' || t.status === 'failed')

  function handleAddTopics(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!topicText.trim()) return
    const fd = new FormData()
    fd.append('clientId', client.id)
    fd.append('topics', topicText)
    fd.append('cadence', cadence)
    fd.append('time', time)
    startTransition(async () => {
      const res = await addTopics(fd)
      if (res.error) { setError(res.error); return }
      setTopicText('')
      setAddOpen(false)
      setError('')
    })
  }

  function handleSaveSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('clientId', client.id)
    fd.append('schedule_enabled', String(enabled))
    fd.append('schedule_cadence', cadence)
    fd.append('schedule_time', time)
    fd.append('schedule_tone', tone)
    fd.append('schedule_length', length)
    startSchedTransition(async () => {
      await saveSchedule(fd)
      setScheduleOpen(false)
    })
  }

  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl overflow-hidden">
      {/* Client header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a26] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shrink-0">
            {client.name[0].toUpperCase()}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{client.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {enabled ? (
                <span className="text-xs text-emerald-400 font-medium">● Autoblogging on · {cadence}</span>
              ) : (
                <span className="text-xs text-[#8888a8]">Autoblogging off</span>
              )}
              {pending.length > 0 && (
                <span className="text-xs text-violet-400">{pending.length} queued</span>
              )}
            </div>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#8888a8]" /> : <ChevronDown className="w-4 h-4 text-[#8888a8]" />}
      </button>

      {open && (
        <div className="border-t border-[#2a2a3d] px-5 pb-5 pt-4 flex flex-col gap-4">
          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setAddOpen(o => !o); setScheduleOpen(false) }}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Topics
            </button>
            <button
              onClick={() => { setScheduleOpen(o => !o); setAddOpen(false) }}
              className="flex items-center gap-1.5 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              Schedule Settings
            </button>
          </div>

          {/* Add topics form */}
          {addOpen && (
            <form onSubmit={handleAddTopics} className="bg-[#0d0d14] border border-[#2a2a3d] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-white text-xs font-semibold">Add topics to queue</div>
                <button
                  type="button"
                  onClick={() => csvInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs text-[#8888a8] hover:text-violet-400 transition-colors"
                >
                  <Upload className="w-3 h-3" /> Import CSV
                </button>
                <input ref={csvInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSVImport} />
              </div>
              <textarea
                value={topicText}
                onChange={e => setTopicText(e.target.value)}
                placeholder={"One topic per line:\nHow to improve local SEO\nBest practices for Google Business Profile\nWhy content marketing matters"}
                rows={5}
                className="w-full bg-[#12121a] border border-[#2a2a3d] text-white placeholder-[#8888a8] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={() => setAddOpen(false)} className="text-[#8888a8] hover:text-white text-xs transition-colors px-3 py-1.5">Cancel</button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Add to Queue
                </button>
              </div>
            </form>
          )}

          {/* Schedule settings form */}
          {scheduleOpen && (
            <form onSubmit={handleSaveSchedule} className="bg-[#0d0d14] border border-[#2a2a3d] rounded-xl p-4 flex flex-col gap-3">
              <div className="text-white text-xs font-semibold mb-1">Schedule settings</div>
              <div className="flex items-center gap-3">
                <label className="text-[#8888a8] text-xs">Autoblogging</label>
                <button
                  type="button"
                  onClick={() => setEnabled(e => !e)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-violet-600' : 'bg-[#2a2a3d]'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : ''}`} />
                </button>
                <span className={`text-xs font-semibold ${enabled ? 'text-emerald-400' : 'text-[#8888a8]'}`}>{enabled ? 'On' : 'Off'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[#8888a8] text-xs">Cadence</label>
                  <select value={cadence} onChange={e => setCadence(e.target.value)} className="bg-[#12121a] border border-[#2a2a3d] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#8888a8] text-xs">Publish time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className="bg-[#12121a] border border-[#2a2a3d] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#8888a8] text-xs">Default tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)} className="bg-[#12121a] border border-[#2a2a3d] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500">
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="educational">Educational</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#8888a8] text-xs">Default length</label>
                  <select value={length} onChange={e => setLength(e.target.value)} className="bg-[#12121a] border border-[#2a2a3d] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500">
                    <option value="short">Short (400–600 words)</option>
                    <option value="medium">Medium (800–1,200 words)</option>
                    <option value="long">Long (1,500–2,500 words)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={() => setScheduleOpen(false)} className="text-[#8888a8] hover:text-white text-xs transition-colors px-3 py-1.5">Cancel</button>
                <button
                  type="submit"
                  disabled={schedPending}
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                >
                  {schedPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {/* Queue list */}
          {topics.length === 0 ? (
            <p className="text-[#8888a8] text-xs text-center py-4">No topics in queue. Add topics above to get started.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {/* Pending */}
              {pending.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1">Upcoming</div>
                  {pending.map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-[#0d0d14] border border-[#2a2a3d] rounded-lg px-3 py-2.5">
                      {STATUS_ICON[t.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.pending}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs truncate">{t.topic}</div>
                        {t.scheduled_for && (
                          <div className="text-[#8888a8] text-xs mt-0.5">
                            {new Date(t.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[#8888a8]">{STATUS_LABEL[t.status] ?? t.status}</span>
                      {t.status === 'pending' && (
                        <button
                          onClick={() => startTransition(() => deleteTopic(t.id))}
                          className="text-[#8888a8] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Completed/Failed */}
              {done.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1">History</div>
                  {done.slice(0, 10).map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-[#0d0d14] border border-[#2a2a3d] rounded-lg px-3 py-2.5">
                      {STATUS_ICON[t.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.pending}
                      <div className="flex-1 min-w-0">
                        <div className="text-[#c8c8d8] text-xs truncate">{t.topic}</div>
                        {t.error_message && (
                          <div className="text-red-400 text-xs mt-0.5 truncate">{t.error_message}</div>
                        )}
                      </div>
                      <span className={`text-xs ${t.status === 'published' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                      {t.status === 'failed' && (
                        <button
                          onClick={() => startTransition(() => retryTopic(t.id))}
                          className="text-[#8888a8] hover:text-violet-400 transition-colors"
                          title="Retry"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
