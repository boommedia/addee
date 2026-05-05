import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/features',
        '/pricing',
        '/about',
        '/support',
        '/blog',
        '/terms',
        '/privacy',
      ],
      disallow: [
        '/admin',
        '/dashboard',
        '/home',
        '/account',
        '/api',
        '/auth',
        '/clients',
      ],
    },
    sitemap: 'https://bloggy.online/sitemap.xml',
  }
}
