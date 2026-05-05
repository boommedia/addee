import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ReportTemplate } from '@/lib/pdf/report-template'
import { renderToStream } from '@react-pdf/renderer'
import { format, parse } from 'date-fns'

/**
 * POST /api/reports/pdf
 * Generate and download/save PDF report for a client
 *
 * Body:
 *   - clientId: UUID
 *   - month: ISO date string (e.g., "2026-04-01")
 *   - save: boolean (if true, save to storage; if false, download)
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clientId, month, save } = await request.json()

  if (!clientId || !month) {
    return NextResponse.json({ error: 'clientId and month required' }, { status: 400 })
  }

  try {
    // Get client and report data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name, website, logo_url, primary_color')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { data: report, error: reportError } = await supabase
      .from('monthly_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('client_id', clientId)
      .eq('year_month', month.split('T')[0])
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: 'Report not found. Generate report first.' }, { status: 404 })
    }

    // Format month for display
    const monthDate = parse(month, 'yyyy-MM-dd', new Date())
    const monthLabel = format(monthDate, 'MMMM yyyy')

    // Create PDF document using React.createElement
    const pdfDoc = React.createElement(ReportTemplate, {
      clientName: client.name,
      logoUrl: client.logo_url || undefined,
      primaryColor: client.primary_color || '#6d28d9',
      month: monthLabel,
      postsCount: report.posts_count,
      postsWordCount: report.posts_word_count,
      gscImpressions: report.gsc_impressions,
      gscClicks: report.gsc_clicks,
      gscCtr: report.gsc_ctr,
      gscAvgPosition: report.gsc_avg_position,
      impressionsDelta: report.impressions_delta,
      clicksDelta: report.clicks_delta,
      ctrDelta: report.ctr_delta,
      positionDelta: report.position_delta,
    } as any)

    // Render to stream
    const stream = await renderToStream(pdfDoc as any)

    // Convert stream to buffer
    const chunks: Buffer[] = []
    await new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', resolve)
      stream.on('error', reject)
    })
    const pdfBuffer = Buffer.concat(chunks)

    if (save) {
      // Save to Supabase Storage
      const fileName = `reports/${clientId}/${month}-seo-report.pdf`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return NextResponse.json({ error: 'Failed to save PDF' }, { status: 500 })
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Update report record with PDF URL
      await supabase
        .from('monthly_reports')
        .update({ pdf_url: urlData.publicUrl })
        .eq('id', report.id)

      return NextResponse.json({
        success: true,
        pdfUrl: urlData.publicUrl,
      })
    } else {
      // Return PDF as download
      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="seo-report-${month}.pdf"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    }
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    )
  }
}
