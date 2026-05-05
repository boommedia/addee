import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bloggy.online'

  // Public pages (searchable)
  const publicPages = [
    '',
    'features',
    'pricing',
    'about',
    'support',
    'blog',
    'terms',
    'privacy',
    'contact',
  ]

  const publicEntries = publicPages.map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }))

  // Private/app pages (not searchable but still mapped for structure)
  const appPages = [
    'dashboard',
    'home',
    'blog',
    'analytics',
    'autoblog',
    'calendar',
    'keywords',
    'clients',
    'account',
  ]

  const appEntries = appPages.map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }))

  return [...publicEntries, ...appEntries]
}
