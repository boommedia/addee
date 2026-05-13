'use client'

type ChartData = {
  title: string
  type: string
  labels: string[]
  values: number[]
  unit?: string
}

type Props = { content: string }

export default function BlogPreview({ content }: Props) {
  const elements: React.ReactNode[] = []

  // Split out [CHART]...[/CHART] blocks first
  const segments = content.split(/(\[CHART\][\s\S]*?\[\/CHART\])/g)

  segments.forEach((segment, segIdx) => {
    const chartMatch = segment.match(/\[CHART\]\s*([\s\S]*?)\s*\[\/CHART\]/)
    if (chartMatch) {
      try {
        const data: ChartData = JSON.parse(chartMatch[1])
        elements.push(<ChartBlock key={`chart-${segIdx}`} data={data} />)
      } catch {
        // malformed chart data — skip silently
      }
      return
    }

    // Render the text segment line by line
    const lines = segment.split('\n')
    let listBuffer: string[] = []
    let tableLines: string[] = []

    function flushList() {
      if (!listBuffer.length) return
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-3 text-[#c8c8d8] text-sm">
          {listBuffer.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ul>
      )
      listBuffer = []
    }

    function flushTable() {
      if (!tableLines.length) return
      const rows = tableLines.filter(l => !l.match(/^\|[-\s|]+\|$/))
      if (rows.length < 1) { tableLines = []; return }

      const parseRow = (line: string) =>
        line.split('|').slice(1, -1).map(c => c.trim())

      const headers = parseRow(rows[0])
      const body = rows.slice(1)

      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="text-left px-3 py-2 bg-[#1a1a26] text-[#8888a8] text-xs font-semibold uppercase tracking-wider border border-[#2a2a3d]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-[#0a0900]' : 'bg-[#0f0f16]'}>
                  {parseRow(row).map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-[#c8c8d8] border border-[#2a2a3d]"
                      dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableLines = []
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Markdown table row
      if (line.trim().startsWith('|')) {
        flushList()
        tableLines.push(line)
        continue
      } else {
        flushTable()
      }

      if (line.startsWith('# ')) {
        flushList()
        elements.push(<h1 key={`${segIdx}-${i}`} className="text-xl font-bold text-white mt-2 mb-3 leading-tight">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        flushList()
        elements.push(<h2 key={`${segIdx}-${i}`} className="text-base font-bold text-white mt-6 mb-2">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        flushList()
        elements.push(<h3 key={`${segIdx}-${i}`} className="text-sm font-bold text-[#e8e8f0] mt-4 mb-1.5">{line.slice(4)}</h3>)
      } else if (line.startsWith('> ')) {
        flushList()
        elements.push(
          <div key={`${segIdx}-${i}`} className="border-l-4 border-violet-500 bg-violet-500/10 rounded-r-xl px-4 py-3 my-3">
            <p className="text-violet-200 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />
          </div>
        )
      } else if (line.startsWith('- ')) {
        listBuffer.push(line.slice(2))
      } else if (line.trim() === '') {
        flushList()
        elements.push(<div key={`${segIdx}-${i}`} className="h-2" />)
      } else {
        flushList()
        elements.push(
          <p key={`${segIdx}-${i}`} className="text-[#c8c8d8] text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
          />
        )
      }
    }

    flushList()
    flushTable()
  })

  return <div>{elements}</div>
}

function ChartBlock({ data }: { data: ChartData }) {
  if (!data.values?.length) return null
  const max = Math.max(...data.values, 1)

  return (
    <div className="bg-[#0f0f16] border border-[#2a2a3d] rounded-xl p-5 my-4">
      <div className="text-white text-sm font-bold mb-4">{data.title}</div>
      <div className="space-y-3">
        {data.labels.map((label, i) => {
          const pct = Math.round((data.values[i] / max) * 100)
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="text-[#8888a8] text-xs w-28 shrink-0 text-right leading-tight">{label}</div>
              <div className="flex-1 bg-[#1a1a26] rounded-full h-5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${pct}%` }}
                >
                  {pct > 20 && (
                    <span className="text-white text-xs font-semibold">
                      {data.values[i]}{data.unit ?? ''}
                    </span>
                  )}
                </div>
              </div>
              {pct <= 20 && (
                <span className="text-[#8888a8] text-xs w-10 shrink-0">
                  {data.values[i]}{data.unit ?? ''}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">$1</a>')
}
