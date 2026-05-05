import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import ChatWidget from "@/components/ChatWidget";
import CommandPalette from "@/components/CommandPalette";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

const GA_ID = 'G-WT6X97C78G'

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
    default: 'Bloggy — AI Blog Automation for Agencies',
    template: '%s',
  },
  description: 'AI blog automation software for digital marketing agencies. Generate, optimize, and publish SEO blog posts to WordPress for all your clients in minutes.',
  keywords: ['AI blog automation', 'agency blog software', 'autoblogging software', 'WordPress content automation', 'AI content generation for agencies', 'SEO blog generator'],
  metadataBase: new URL('https://bloggy.online'),
  alternates: { canonical: 'https://bloggy.online' },
  icons: {
    icon: '/bloggy-icon.png',
    apple: '/bloggy-icon.png',
  },
  openGraph: {
    title: 'Bloggy — AI Blog Automation for Agencies',
    description: 'Generate, optimize, and publish SEO blog posts to WordPress for all your clients in minutes.',
    url: 'https://bloggy.online',
    siteName: 'Bloggy',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Bloggy — AI Blog Automation for Agencies' }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggy — AI Blog Automation for Agencies',
    description: 'Generate, optimize, and publish SEO blog posts to WordPress for all your clients in minutes.',
    images: ['https://bloggy.online/og-image.png'],
    site: '@GetBloggy',
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
          name: 'Bloggy',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://bloggy.online',
          logo: 'https://bloggy.online/og-image.png',
          description: 'AI blog automation software for digital marketing agencies. Generate, optimize, and publish SEO blog posts to WordPress for all your clients in minutes.',
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: '49',
            highPrice: '299',
            priceCurrency: 'USD',
            offerCount: 4,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '47',
          },
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Boom Media',
          url: 'https://bloggy.online',
          logo: { '@type': 'ImageObject', url: 'https://bloggy.online/og-image.png' },
          sameAs: [
            'https://www.youtube.com/@GetBloggy',
            'https://discord.gg/9avYXden',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'eric@boommedia.us',
            contactType: 'customer support',
          },
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bloggy',
          url: 'https://bloggy.online',
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: 'https://bloggy.online/support#guides' },
            'query-input': 'required name=search_term_string',
          },
        })}} />
        <ToastProvider>
          {children}
          <ChatWidget />
          <CommandPalette />
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

