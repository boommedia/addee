# Monthly SEO Reports

Complete system for generating and emailing client SEO reports automatically.

## Setup

### 1. Database Migration

Run the migration to create the `monthly_reports` table:

```bash
npx supabase migration up add-monthly-reports.sql
```

Or manually execute `supabase/sql/add-monthly-reports.sql` in your Supabase console.

### 2. Environment Variables

Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxx...
RESEND_FROM_EMAIL=reports@yourdomain.com
CRON_SECRET=your-secret-token-here
SUPABASE_SERVICE_ROLE_KEY=xxx...
```

### 3. Supabase Storage

Create a `documents` bucket in Supabase Storage for storing PDFs:

```
Storage → Create bucket
  Name: documents
  Public: Yes (so PDFs are downloadable)
```

## API Endpoints

All endpoints require authenticated user (except `/api/cron/monthly-reports` which requires auth token).

### 1. Generate Report Data

**POST** `/api/reports/generate`

Aggregates posts and GSC data for a month, creates/updates `monthly_reports` record.

```json
{
  "clientId": "uuid",
  "month": "2026-04-01"  // optional, defaults to current month
}
```

Response:
```json
{
  "success": true,
  "data": {
    "client": { "name": "Client Name", "website": "example.com" },
    "report": {
      "postsCount": 4,
      "postsWordCount": 8500,
      "gscImpressions": 12450,
      "gscClicks": 387,
      "gscCtr": 0.0311,
      "gscAvgPosition": 5.2,
      "impressionsDelta": 1200,
      "clicksDelta": 45,
      ...
    },
    "month": "2026-04-01"
  }
}
```

### 2. Generate PDF

**POST** `/api/reports/pdf`

Renders report data to professional PDF. Can save to storage or return as download.

```json
{
  "clientId": "uuid",
  "month": "2026-04-01",
  "save": true  // if true, saves to Supabase Storage and updates report.pdf_url
}
```

Response (if `save: true`):
```json
{
  "success": true,
  "pdfUrl": "https://storage.url/reports/..."
}
```

### 3. Send Email

**POST** `/api/reports/email`

Sends branded HTML email with summary + PDF download link.

```json
{
  "clientId": "uuid",
  "month": "2026-04-01",
  "recipientEmail": "client@example.com"  // optional, defaults to user email
}
```

Response:
```json
{
  "success": true,
  "messageId": "email-id",
  "sentTo": "client@example.com"
}
```

### 4. Monthly Cron Job

**GET** `/api/cron/monthly-reports?auth=CRON_SECRET`

Automatically:
1. Finds all users/clients with GSC data
2. Generates reports for current month (if not already done)
3. Generates PDFs
4. Sends emails

**Setup with external cron service** (e.g., EasyCron, Cron-job.org):

```
URL: https://bloggy.online/api/cron/monthly-reports?auth=your-secret-token
Frequency: Monthly, on 1st at 9:00 AM (UTC)
```

## Client Brand Assets

Reports are branded with client logo and primary color. Set these in the `clients` table:

```sql
UPDATE clients 
SET 
  logo_url = 'https://...',
  primary_color = '#6d28d9'
WHERE id = 'client-uuid';
```

Logo URL can be any publicly accessible image (S3, CDN, etc).

## Report Data Included

- **Content Published**: Posts count, total words written
- **Search Performance**: Impressions, clicks, avg CTR, avg position
- **Month-over-Month Comparison**: Delta for each metric (highlighted in green/red)
- **Client Branding**: Logo, primary color theme

## Manual Workflow

To manually generate and email a report:

```bash
# 1. Generate report data
curl -X POST https://bloggy.online/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"clientId": "xxx", "month": "2026-04-01"}'

# 2. Generate PDF
curl -X POST https://bloggy.online/api/reports/pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"clientId": "xxx", "month": "2026-04-01", "save": true}'

# 3. Send email
curl -X POST https://bloggy.online/api/reports/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"clientId": "xxx", "month": "2026-04-01"}'
```

## Troubleshooting

**"Report not found"** — Call `/api/reports/generate` first to create the report record.

**"PDF not generated"** — Call `/api/reports/pdf` with `save: true` before emailing.

**"Email service not configured"** — Ensure `RESEND_API_KEY` is set in `.env.local`.

**No GSC data** — Verify client has GSC connected and data synced via `/api/gsc/sync`.

## Next Steps

- [ ] Add admin UI to manually trigger reports
- [ ] Track report email opens/clicks
- [ ] Add DataForSEO integration for ranking movements
- [ ] Schedule reports (weekly, bi-weekly option)
