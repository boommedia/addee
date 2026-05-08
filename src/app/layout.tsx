import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

const GA_ID = 'G-ADDEE123456'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Addee — AI Ad Creatives & Social Content Generator',
    template: '%s',
  },
  description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice. Ready to publish across Instagram, LinkedIn, TikTok, Google Ads, and more.',
  keywords: ['AI ad generator', 'social media content', 'ad creative tools', 'Instagram ads', 'LinkedIn ads', 'TikTok ads', 'Google Ads generator'],
  metadataBase: new URL('https://addee.online'),
  alternates: { canonical: 'https://addee.online' },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Addee — AI Ad Creatives & Social Content Generator',
    description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice.',
    url: 'https://addee.online',
    siteName: 'Addee',
    images: [{ url: 'https://addee.online/og-image.png', width: 1200, height: 630, alt: 'Addee — AI Ad Creatives' }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Addee — AI Ad Creatives & Social Content Generator',
    description: 'Generate AI-powered ad creatives and social media posts in your brand\'s voice.',
    site: '@AddeeAI',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Addee',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://addee.online',
          description: 'AI ad creatives and social media post generation tool. Generate ready-to-publish ads in your brand\'s voice.',
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Boom Media',
          url: 'https://addee.online',
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'eric@boommedia.us',
            contactType: 'customer support',
          },
        })}} />
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
              gtag('config', 'AW-18109945240');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}

