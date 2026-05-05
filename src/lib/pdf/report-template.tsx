import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register fonts if needed
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX5c-fRnLP9vqzJa747.ttf',
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 3,
  },
  monthLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  metricsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  metricDelta: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 3,
    borderRadius: 3,
    marginTop: 3,
  },
  deltaPositive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  deltaNegative: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  deltaNeural: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    width: '60%',
    fontSize: 11,
    color: '#374151',
  },
  value: {
    width: '40%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 8,
    color: '#d1d5db',
    marginTop: 10,
    fontStyle: 'italic',
  },
})

interface ReportTemplateProps {
  clientName: string
  logoUrl?: string
  primaryColor?: string
  month: string // "April 2026"
  postsCount: number
  postsWordCount: number
  gscImpressions: number
  gscClicks: number
  gscCtr: number
  gscAvgPosition: number
  impressionsDelta: number | null
  clicksDelta: number | null
  ctrDelta: number | null
  positionDelta: number | null
}

const deltaColor = (value: number | null) => {
  if (value === null || value === undefined) return styles.deltaNeural
  if (value > 0) return styles.deltaPositive
  if (value < 0) return styles.deltaNegative
  return styles.deltaNeural
}

const deltaText = (value: number | null) => {
  if (value === null || value === undefined) return '—'
  const symbol = value > 0 ? '+' : ''
  return `${symbol}${value}`
}

export function ReportTemplate({
  clientName,
  logoUrl,
  primaryColor = '#6d28d9',
  month,
  postsCount,
  postsWordCount,
  gscImpressions,
  gscClicks,
  gscCtr,
  gscAvgPosition,
  impressionsDelta,
  clicksDelta,
  ctrDelta,
  positionDelta,
}: ReportTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoUrl && <Image style={styles.logo} src={logoUrl} />}
          <Text style={styles.title}>Monthly SEO Report</Text>
          <Text style={styles.subtitle}>{clientName}</Text>
          <Text style={styles.monthLabel}>{month}</Text>
        </View>

        {/* Content Published */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Published</Text>
          <View style={styles.metricsGrid}>
            <View
              style={{
                ...styles.metricCard,
                borderLeftColor: primaryColor || '#6d28d9',
              }}
            >
              <Text style={styles.metricLabel}>Posts Published</Text>
              <Text style={styles.metricValue}>{postsCount}</Text>
            </View>
            <View
              style={{
                ...styles.metricCard,
                borderLeftColor: primaryColor || '#6d28d9',
              }}
            >
              <Text style={styles.metricLabel}>Total Words</Text>
              <Text style={styles.metricValue}>{postsWordCount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Search Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Performance</Text>
          <View style={styles.metricsGrid}>
            <View
              style={{
                ...styles.metricCard,
                borderLeftColor: primaryColor || '#6d28d9',
              }}
            >
              <Text style={styles.metricLabel}>Impressions</Text>
              <Text style={styles.metricValue}>{gscImpressions.toLocaleString()}</Text>
              {impressionsDelta !== null && (
                <Text style={{ ...styles.metricDelta, ...deltaColor(impressionsDelta) }}>
                  {deltaText(impressionsDelta)}
                </Text>
              )}
            </View>
            <View
              style={{
                ...styles.metricCard,
                borderLeftColor: primaryColor || '#6d28d9',
              }}
            >
              <Text style={styles.metricLabel}>Clicks</Text>
              <Text style={styles.metricValue}>{gscClicks.toLocaleString()}</Text>
              {clicksDelta !== null && (
                <Text style={{ ...styles.metricDelta, ...deltaColor(clicksDelta) }}>
                  {deltaText(clicksDelta)}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.metricsGrid}>
            <View
              style={{
                ...styles.metricCard,
                borderLeftColor: primaryColor || '#6d28d9',
              }}
            >
              <Text style={styles.metricLabel}>Avg CTR</Text>
              <Text style={styles.metricValue}>{(gscCtr * 100).toFixed(2)}%</Text>
              {ctrDelta !== null && (
                <Text style={{ ...styles.metricDelta, ...deltaColor(ctrDelta) }}>
                  {(ctrDelta > 0 ? '+' : '') + (ctrDelta * 100).toFixed(2)}%
                </Text>
              )}
            </View>
            <View
              style={{
                ...styles.metricCard,
                borderLeftColor: primaryColor || '#6d28d9',
              }}
            >
              <Text style={styles.metricLabel}>Avg Position</Text>
              <Text style={styles.metricValue}>{gscAvgPosition.toFixed(1)}</Text>
              {positionDelta !== null && (
                <Text style={{ ...styles.metricDelta, ...deltaColor(-positionDelta) }}>
                  {(-positionDelta > 0 ? '+' : '') + (-positionDelta).toFixed(1)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Report generated by Bloggy • {new Date().toLocaleDateString()}</Text>
          <Text style={styles.footerNote}>
            Data sourced from Google Search Console. Deltas compared to prior month.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
