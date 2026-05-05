export function markdownToHTML(md: string): string {
  const lines = md.split('\n')
  const output: string[] = []
  let listBuffer: string[] = []
  let tableLines: string[] = []

  function flushList() {
    if (!listBuffer.length) return
    output.push('<ul style="padding-left:1.5rem;margin:0.75rem 0;">')
    listBuffer.forEach(item => output.push(`<li style="margin:0.3rem 0;">${inlineFormat(item)}</li>`))
    output.push('</ul>')
    listBuffer = []
  }

  function flushTable() {
    if (!tableLines.length) return
    const rows = tableLines.filter(l => !l.match(/^\|[-\s|]+\|$/))
    if (rows.length < 1) { tableLines = []; return }
    const parseRow = (line: string) => line.split('|').slice(1, -1).map(c => c.trim())
    const headers = parseRow(rows[0])
    const body = rows.slice(1)
    output.push('<table style="width:100%;border-collapse:collapse;margin:1.25rem 0;">')
    output.push('<thead><tr>')
    headers.forEach(h => output.push(`<th style="text-align:left;padding:8px 12px;background:#f3f4f6;border:1px solid #e5e7eb;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;">${h}</th>`))
    output.push('</tr></thead><tbody>')
    body.forEach((row, ri) => {
      const bg = ri % 2 === 0 ? '#fff' : '#f9fafb'
      output.push(`<tr style="background:${bg};">`)
      parseRow(row).forEach(cell => output.push(`<td style="padding:8px 12px;border:1px solid #e5e7eb;">${inlineFormat(cell)}</td>`))
      output.push('</tr>')
    })
    output.push('</tbody></table>')
    tableLines = []
  }

  for (const line of lines) {
    if (line.trim().startsWith('|')) {
      flushList()
      tableLines.push(line)
      continue
    } else {
      flushTable()
    }

    if (line.startsWith('# ')) {
      flushList()
      output.push(`<h1 style="font-size:1.9rem;font-weight:800;margin:0 0 0.5rem;">${line.slice(2)}</h1>`)
    } else if (line.startsWith('## ')) {
      flushList()
      output.push(`<h2 style="font-size:1.35rem;font-weight:700;margin:1.75rem 0 0.5rem;">${line.slice(3)}</h2>`)
    } else if (line.startsWith('### ')) {
      flushList()
      output.push(`<h3 style="font-size:1.1rem;font-weight:700;margin:1.25rem 0 0.4rem;">${line.slice(4)}</h3>`)
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2))
    } else if (line.trim() === '') {
      flushList()
      output.push('')
    } else {
      flushList()
      output.push(`<p style="margin:0.75rem 0;line-height:1.7;">${inlineFormat(line)}</p>`)
    }
  }

  flushList()
  flushTable()

  return output.join('\n')
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}
