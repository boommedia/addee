import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { startOfMonth } from 'date-fns'

/**
 * GET /api/cron/monthly-reports
 * Triggered monthly (via external cron service) to generate and email reports
 *
 * Query params:
 *   - auth: secret token for verification (should match CRON_SECRET env var)
 */
export async function GET(request: Request) {
  // Verify cron secret
  const { searchParams } = new URL(request.url)
  const authToken = searchParams.get('auth')

  if (!authToken || authToken !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    // Get all users with clients that have GSC data
    const { data: reports, error: reportsError } = await supabase
      .from('gsc_data')
      .select('user_id, client_id, site_url')

    if (reportsError) {
      console.error('Error fetching GSC data:', reportsError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!reports || reports.length === 0) {
      return NextResponse.json({ message: 'No clients with GSC data found' })
    }

    const currentMonth = startOfMonth(new Date())
    const monthStr = currentMonth.toISOString().split('T')[0]
    const results = []

    // Process each user/client combination
    const processed = new Set<string>()

    for (const entry of reports) {
      const key = `${entry.user_id}-${entry.client_id}`
      if (processed.has(key)) continue
      processed.add(key)

      const { user_id, client_id, site_url } = entry

      // Check if report already exists for this month
      const { data: existingReport } = await supabase
        .from('monthly_reports')
        .select('id')
        .eq('user_id', user_id)
        .eq('client_id', client_id)
        .eq('year_month', monthStr)
        .single()

      if (existingReport) {
        results.push({ clientId: client_id, status: 'already_exists' })
        continue
      }

      try {
        // Call the report generation endpoint
        const generateRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://bloggy.online'}/api/reports/generate`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Use service role key for backend access
              'x-supabase-auth': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              clientId: client_id,
              month: monthStr,
            }),
          }
        )

        if (!generateRes.ok) {
          console.error(`Generate failed for ${client_id}:`, await generateRes.text())
          results.push({ clientId: client_id, status: 'generate_failed' })
          continue
        }

        // Generate PDF
        const pdfRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://bloggy.online'}/api/reports/pdf`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-supabase-auth': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              clientId: client_id,
              month: monthStr,
              save: true,
            }),
          }
        )

        if (!pdfRes.ok) {
          console.error(`PDF generation failed for ${client_id}:`, await pdfRes.text())
          results.push({ clientId: client_id, status: 'pdf_failed' })
          continue
        }

        // Get the generated report record to access cached user_email
        const { data: generatedReport } = await supabase
          .from('monthly_reports')
          .select('user_email')
          .eq('user_id', user_id)
          .eq('client_id', client_id)
          .eq('year_month', monthStr)
          .single()

        if (!generatedReport?.user_email) {
          console.error(`User email not found for ${client_id}`)
          results.push({ clientId: client_id, status: 'email_not_found' })
          continue
        }

        const userEmail = generatedReport.user_email

        // Send email
        const emailRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://bloggy.online'}/api/reports/email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-supabase-auth': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              clientId: client_id,
              month: monthStr,
              recipientEmail: userEmail,
            }),
          }
        )

        if (!emailRes.ok) {
          console.error(`Email send failed for ${client_id}:`, await emailRes.text())
          results.push({ clientId: client_id, status: 'email_failed' })
          continue
        }

        results.push({ clientId: client_id, status: 'success' })
      } catch (error) {
        console.error(`Error processing ${client_id}:`, error)
        results.push({ clientId: client_id, status: 'error', error: String(error) })
      }
    }

    return NextResponse.json({
      success: true,
      month: monthStr,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
