import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateMonthlyReportData } from '@/lib/reports'
import { startOfMonth } from 'date-fns'

/**
 * POST /api/reports/generate
 * Generate monthly report data for a client
 *
 * Body:
 *   - clientId: UUID
 *   - month: ISO date string (e.g., "2026-04-01") or omit for current month
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clientId, month } = await request.json()

  if (!clientId) {
    return NextResponse.json({ error: 'clientId required' }, { status: 400 })
  }

  // Get client to verify ownership and get site_url
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, name, website, logo_url, primary_color')
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  if (!client.website) {
    return NextResponse.json({ error: 'Client has no website URL configured' }, { status: 400 })
  }

  // Normalize site_url (ensure it's a valid domain for GSC)
  const siteUrl = client.website.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Parse month or use current month
  const reportMonth = month ? startOfMonth(new Date(month)) : startOfMonth(new Date())

  try {
    const reportData = await generateMonthlyReportData(user.id, clientId, siteUrl, reportMonth)

    // Check if report already exists for this month
    const { data: existingReport } = await supabase
      .from('monthly_reports')
      .select('id')
      .eq('user_id', user.id)
      .eq('client_id', clientId)
      .eq('year_month', reportMonth.toISOString().split('T')[0])
      .single()

    // Upsert report record (don't update if already sent)
    const reportRecord = {
      user_id: user.id,
      user_email: user.email,
      client_id: clientId,
      year_month: reportMonth.toISOString().split('T')[0],
      posts_count: reportData.postsCount,
      posts_word_count: reportData.postsWordCount,
      gsc_impressions: reportData.gscImpressions,
      gsc_clicks: reportData.gscClicks,
      gsc_ctr: reportData.gscCtr,
      gsc_avg_position: reportData.gscAvgPosition,
      impressions_delta: reportData.impressionsDelta,
      clicks_delta: reportData.clicksDelta,
      ctr_delta: reportData.ctrDelta,
      position_delta: reportData.positionDelta,
      updated_at: new Date().toISOString(),
    }

    if (existingReport) {
      await supabase
        .from('monthly_reports')
        .update(reportRecord)
        .eq('id', existingReport.id)
    } else {
      await supabase
        .from('monthly_reports')
        .insert([reportRecord])
    }

    return NextResponse.json({
      success: true,
      data: {
        client: { name: client.name, website: client.website },
        report: reportData,
        month: reportMonth.toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report', details: String(error) },
      { status: 500 }
    )
  }
}
