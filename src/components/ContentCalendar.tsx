'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Loader2 } from 'lucide-react'
import clsx from 'clsx'

type Topic = {
  id: string
  topic: string
  status: string
  scheduled_for: string | null
  client_id: string
  clients: { name: string } | { name: string }[] | null
}

type Post = {
  id: string
  title: string
  created_at: string
  clients: { name: string } | { name: string }[] | null
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
  generating: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  published: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  failed: 'bg-red-500/20 border-red-500/40 text-red-300',
}

function getClientName(clients: Topic['clients']): string {
  if (!clients) return ''
  if (Array.isArray(clients)) return clients[0]?.name ?? ''
  return clients.name
}

export default function ContentCalendar({ topics, recentPosts }: { topics: Topic[]; recentPosts: Post[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)) }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)) }

  // Index events by day
  const eventsByDay: Record<number, { type: 'scheduled' | 'published'; label: string; status?: string; client: string }[]> = {}

  for (const t of topics) {
    if (!t.scheduled_for) continue
    const d = new Date(t.scheduled_for)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push({ type: 'scheduled', label: t.topic, status: t.status, client: getClientName(t.clients) })
    }
  }

  for (const p of recentPosts) {
    const d = new Date(p.created_at)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push({ type: 'published', label: p.title, client: getClientName(p.clients) })
    }
  }

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 text-[#8888a8] hover:text-white hover:bg-[#1a1a26] rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-white font-bold text-base">{monthName}</h2>
        <button onClick={nextMonth} className="p-2 text-[#8888a8] hover:text-white hover:bg-[#1a1a26] rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[#2a2a3d]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[#8888a8] text-xs font-semibold py-2.5">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const events = day ? (eventsByDay[day] ?? []) : []
            const isSelected = day === selected
            return (
              <div
                key={i}
                onClick={() => day && setSelected(isSelected ? null : day)}
                className={clsx(
                  'min-h-[80px] p-2 border-b border-r border-[#2a2a3d] last:border-r-0 transition-colors',
                  day ? 'cursor-pointer hover:bg-[#1a1a26]' : 'bg-[#0d0d14]',
                  isSelected && 'bg-[#1a1a26]',
                )}
              >
                {day && (
                  <>
                    <div className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1',
                      isToday(day) ? 'bg-violet-600 text-white' : 'text-[#8888a8]'
                    )}>
                      {day}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {events.slice(0, 2).map((e, j) => (
                        <div key={j} className={clsx('text-[9px] px-1.5 py-0.5 rounded border truncate', STATUS_COLOR[e.status ?? 'published'])}>
                          {e.label}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[9px] text-[#8888a8] px-1">+{events.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selected && eventsByDay[selected]?.length > 0 && (
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-3">
            {new Date(year, month, selected).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>
          <div className="flex flex-col gap-2">
            {eventsByDay[selected].map((e, i) => (
              <div key={i} className="flex items-start gap-3">
                {e.type === 'published'
                  ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  : e.status === 'generating'
                  ? <Loader2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5 animate-spin" />
                  : <Clock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{e.label}</div>
                  {e.client && <div className="text-[#8888a8] text-xs">{e.client}</div>}
                </div>
                <span className={clsx('text-xs px-2 py-0.5 rounded-full border capitalize', STATUS_COLOR[e.status ?? 'published'])}>
                  {e.type === 'published' ? 'Published' : e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { label: 'Scheduled', color: 'bg-violet-500/20 border-violet-500/40 text-violet-300' },
          { label: 'Generating', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
          { label: 'Published', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
          { label: 'Failed', color: 'bg-red-500/20 border-red-500/40 text-red-300' },
        ].map(({ label, color }) => (
          <div key={label} className={clsx('text-xs px-2 py-0.5 rounded border', color)}>{label}</div>
        ))}
      </div>
    </div>
  )
}
