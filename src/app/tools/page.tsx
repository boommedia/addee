import AppNav from '@/components/AppNav'

export const metadata = {
  title: 'All Tools — Bloggy',
  description: 'Every Bloggy feature in one place — AI blog generator, WordPress publisher, AutoBlog scheduler, keyword research, content calendar, rankings tracker, and more.',
  robots: { index: false, follow: false },
}

import {
  Zap, Globe, Share2, Clock, Search, List, BarChart2,
  TrendingUp, Send, CalendarDays, Link2, PieChart, FileText,
  Users, Settings, CreditCard, BookOpen, Repeat, ClipboardList,
  Server, Zap as ZapPlus,
} from 'lucide-react'

type Tool = {
  icon: React.ReactNode
  name: string
  description: string
  href: string
  status: 'live' | 'beta' | 'soon'
  badge?: string
}

const CATEGORIES: { label: string; tools: Tool[] }[] = [
  {
    label: 'Content Creation',
    tools: [
      {
        icon: <Zap className="w-5 h-5 text-violet-400" />,
        name: 'AI Blog Generator',
        description: 'Generate long-form SEO blog posts from a topic, brief, or keywords in seconds.',
        href: '/dashboard',
        status: 'live',
        badge: 'Core',
      },
      {
        icon: <Globe className="w-5 h-5 text-cyan-400" />,
        name: 'URL to Blog',
        description: 'Paste any webpage URL and Bloggy rewrites it into a unique, optimized post.',
        href: '/tools/url-to-blog',
        status: 'live',
      },
      {
        icon: <Zap className="w-5 h-5 text-red-400" />,
        name: 'YouTube to Blog',
        description: 'Turn any YouTube video into a full blog post using the transcript.',
        href: '/tools/youtube-to-blog',
        status: 'live',
      },
      {
        icon: <Share2 className="w-5 h-5 text-pink-400" />,
        name: 'Content Repurposer',
        description: 'Repurpose any blog post into LinkedIn, Twitter, Instagram, TikTok, and more.',
        href: '/tools/repurpose',
        status: 'live',
      },
      {
        icon: <Clock className="w-5 h-5 text-emerald-400" />,
        name: 'AutoBlog',
        description: 'Queue topics and let Bloggy auto-generate and publish posts on a schedule.',
        href: '/autoblog',
        status: 'live',
        badge: 'Automated',
      },
      {
        icon: <Repeat className="w-5 h-5 text-orange-400" />,
        name: 'Bulk Scheduler',
        description: 'Upload a list of topics and schedule them to auto-publish over weeks.',
        href: '/autoblog',
        status: 'live',
      },
    ],
  },
  {
    label: 'SEO & Keyword Research',
    tools: [
      {
        icon: <Search className="w-5 h-5 text-yellow-400" />,
        name: 'Keyword Research',
        description: 'AI-powered keyword discovery — volume, difficulty, intent, and content briefs.',
        href: '/keywords',
        status: 'live',
      },
      {
        icon: <List className="w-5 h-5 text-blue-400" />,
        name: 'Keyword Lists',
        description: 'Save and organize keyword collections per client for reuse across posts.',
        href: '/keywords',
        status: 'live',
      },
      {
        icon: <TrendingUp className="w-5 h-5 text-violet-400" />,
        name: 'Rankings Tracker',
        description: 'Basic rankings (GSC + DataForSEO) included for all users. LocalFalcon grid rankings exclusive to Agency+ plans.',
        href: '/analytics',
        status: 'live',
        badge: 'Agency+',
      },
      {
        icon: <BarChart2 className="w-5 h-5 text-emerald-400" />,
        name: 'Competitor Gap Analysis',
        description: 'Find keywords competitors rank for that your clients don\'t — then generate content.',
        href: '/tools/competitor-analysis',
        status: 'live',
      },
      {
        icon: <ClipboardList className="w-5 h-5 text-emerald-400" />,
        name: 'Content Brief Generator',
        description: 'Generate a full content brief with outline, SEO meta, keywords, audience, and competitor insights.',
        href: '/tools/brief',
        status: 'live',
      },
    ],
  },
  {
    label: 'Publishing & Automation',
    tools: [
      {
        icon: <Send className="w-5 h-5 text-cyan-400" />,
        name: 'WordPress Publisher',
        description: 'Publish directly to WordPress with featured images, categories, tags, and SEO meta.',
        href: '/posts',
        status: 'live',
      },
      {
        icon: <CalendarDays className="w-5 h-5 text-violet-400" />,
        name: 'Content Calendar',
        description: 'Visual calendar of scheduled and published posts across all clients.',
        href: '/calendar',
        status: 'live',
      },
      {
        icon: <Link2 className="w-5 h-5 text-pink-400" />,
        name: 'Internal Link Suggester',
        description: 'AI suggests the best internal linking opportunities from your published post library.',
        href: '/tools/internal-links',
        status: 'live',
      },
    ],
  },
  {
    label: 'Analytics & Reports',
    tools: [
      {
        icon: <PieChart className="w-5 h-5 text-yellow-400" />,
        name: 'Post Analytics',
        description: 'Word counts, quality scores, publish rates, and content production trends.',
        href: '/analytics',
        status: 'live',
      },
      {
        icon: <FileText className="w-5 h-5 text-orange-400" />,
        name: 'Client Reports',
        description: 'Shareable public report showing all posts published for a client — white-labeled.',
        href: '/clients',
        status: 'live',
      },
      {
        icon: <TrendingUp className="w-5 h-5 text-violet-400" />,
        name: 'Rankings History',
        description: 'Historical rank snapshots, position change arrows, and sparkline trend charts.',
        href: '/analytics',
        status: 'live',
      },
    ],
  },
  {
    label: 'Client & Team Management',
    tools: [
      {
        icon: <Users className="w-5 h-5 text-cyan-400" />,
        name: 'Client Manager',
        description: 'Add clients with brand voice, keywords, WordPress credentials, and logo.',
        href: '/clients',
        status: 'live',
      },
      {
        icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
        name: 'Team Collaboration',
        description: 'Invite team members to your workspace so they can generate posts for clients.',
        href: '/settings',
        status: 'live',
      },
      {
        icon: <Settings className="w-5 h-5 text-[#8888a8]" />,
        name: 'White Label',
        description: 'Replace Bloggy branding with your agency name — Agency Max plan.',
        href: '/settings',
        status: 'live',
      },
      {
        icon: <CreditCard className="w-5 h-5 text-violet-400" />,
        name: 'Billing & Add-ons',
        description: 'Manage your plan, apply coupons, and subscribe to power-up add-ons.',
        href: '/billing',
        status: 'live',
      },
    ],
  },
  {
    label: 'Coming Soon Add-ons',
    tools: [
      {
        icon: <Globe className="w-5 h-5 text-emerald-400" />,
        name: 'Multi-Site Management',
        description: 'Manage unlimited WordPress sites from Bloggy dashboard with bulk operations.',
        href: '#',
        status: 'soon',
      },
      {
        icon: <BarChart2 className="w-5 h-5 text-violet-400" />,
        name: 'AI Content Analyzer',
        description: 'Deep content analysis with tone detection, readability scoring, and SEO grading.',
        href: '#',
        status: 'soon',
      },
      {
        icon: <Share2 className="w-5 h-5 text-pink-400" />,
        name: 'Social Auto-Pilot',
        description: 'Automatically repurpose and schedule posts across all your social media platforms.',
        href: '#',
        status: 'soon',
      },
      {
        icon: <BookOpen className="w-5 h-5 text-yellow-400" />,
        name: 'Content Training',
        description: 'Train AI on your brand voice, competitors, and writing style for personalized content.',
        href: '#',
        status: 'soon',
      },
    ],
  },
]

const STATUS_STYLES = {
  live:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  beta:  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  soon:  'text-[#555570] bg-[#1a1a26] border-[#2a2a3d]',
}

const STATUS_LABELS = { live: 'Live', beta: 'Beta', soon: 'Coming Soon' }

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/tools" />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">All Tools</h1>
          <p className="text-[#8888a8] text-sm">Every feature in Bloggy — find it here and jump straight in.</p>
        </div>

        <div className="space-y-10">
          {CATEGORIES.map(cat => (
            <div key={cat.label}>
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-500 rounded-full inline-block" />
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.tools.map(tool => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    className="group bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500/40 rounded-xl p-4 flex flex-col gap-3 transition-all hover:bg-[#16161f]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] flex items-center justify-center shrink-0">
                        {tool.icon}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[tool.status]}`}>
                          {STATUS_LABELS[tool.status]}
                        </span>
                        {tool.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border text-violet-400 bg-violet-500/10 border-violet-500/20">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm mb-1 group-hover:text-violet-300 transition-colors">{tool.name}</div>
                      <p className="text-[#8888a8] text-xs leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="text-violet-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open <span>→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
