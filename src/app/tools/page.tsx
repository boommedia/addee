import AppNav from '@/components/AppNav'
import {
  Sparkles, Palette, RefreshCw, Layers, Film, Copy,
  Send, CalendarDays, BarChart2, FileText, Users,
  Zap, TrendingUp, Link2,
} from 'lucide-react'

export const metadata = {
  title: 'Tools — AdDee',
  description: 'Every AdDee feature in one place — AI ad generator, design studio, video scripts, A/B variants, and more.',
  robots: { index: false, follow: false },
}

type Tool = {
  icon: React.ElementType
  name: string
  description: string
  href: string
  status: 'live' | 'beta' | 'soon'
  badge?: string
  color: string
}

const CATEGORIES: { label: string; tools: Tool[] }[] = [
  {
    label: 'Ad Generation',
    tools: [
      {
        icon: Sparkles,
        name: 'AI Ad Generator',
        description: 'Generate 3 platform-ready ad copy variations in your brand voice in seconds. Choose format, platform, tone, and length.',
        href: '/dashboard',
        status: 'live',
        badge: 'Core',
        color: '#ca8a04',
      },
      {
        icon: Copy,
        name: 'Copy Variations',
        description: 'Short (150 chars), long (300 chars), and caption styles — three angles on the same brief for different contexts.',
        href: '/dashboard',
        status: 'live',
        color: '#84cc16',
      },
      {
        icon: RefreshCw,
        name: 'Remix a Winning Ad',
        description: 'Paste an existing high-converting ad and remix it into your brand voice. Keep what works, make it yours.',
        href: '/dashboard#remix',
        status: 'live',
        color: '#ca8a04',
      },
      {
        icon: Layers,
        name: 'A/B Variants',
        description: 'Generate conservative + aggressive versions of the same ad to test what resonates with your audience.',
        href: '/dashboard#variants',
        status: 'live',
        color: '#84cc16',
      },
      {
        icon: Film,
        name: 'Video Scripts',
        description: 'Full TikTok, Reels, and YouTube Shorts scripts with attention hooks, body copy, and strong CTAs.',
        href: '/dashboard#scripts',
        status: 'live',
        color: '#ca8a04',
      },
    ],
  },
  {
    label: 'Design & Visuals',
    tools: [
      {
        icon: Palette,
        name: 'Design Studio',
        description: 'Generate AI background images with Adobe Firefly, then design your visual ad in Canva — ready to publish.',
        href: '/design',
        status: 'live',
        badge: 'New',
        color: '#7c3aed',
      },
      {
        icon: Sparkles,
        name: 'AI Image Generation',
        description: 'Adobe Firefly integration — generate 4 platform-sized background images from a text prompt.',
        href: '/design',
        status: 'live',
        color: '#dc2626',
      },
      {
        icon: Link2,
        name: 'Canva Templates',
        description: 'Open a platform-matched Canva template (Instagram, TikTok, LinkedIn, Google Ads) and design with your AI copy.',
        href: '/design',
        status: 'live',
        color: '#7c3aed',
      },
      {
        icon: Film,
        name: 'Video Preview Mockups',
        description: 'See how your generated copy looks on animated video templates before publishing.',
        href: '#',
        status: 'soon',
        color: '#ca8a04',
      },
    ],
  },
  {
    label: 'Publishing & Automation',
    tools: [
      {
        icon: Send,
        name: 'Platform Connectors',
        description: 'Connect Instagram, LinkedIn, TikTok, and Google Ads to publish ad creatives directly from AdDee.',
        href: '/connectors',
        status: 'soon',
        color: '#ca8a04',
      },
      {
        icon: CalendarDays,
        name: 'Ad Scheduler',
        description: 'Queue ads for specific dates and let AdDee auto-publish across connected platforms on schedule.',
        href: '#',
        status: 'soon',
        color: '#84cc16',
      },
      {
        icon: Zap,
        name: 'Bulk Generation',
        description: 'Generate 10–25 ad variations at once for A/B testing across multiple platforms in a single run.',
        href: '#',
        status: 'soon',
        badge: 'Growth+',
        color: '#ca8a04',
      },
    ],
  },
  {
    label: 'Analytics & Reports',
    tools: [
      {
        icon: BarChart2,
        name: 'Ad Analytics',
        description: 'Track your ad creative output — words generated, ADs per brand, monthly usage, and plan limits.',
        href: '/analytics',
        status: 'live',
        color: '#84cc16',
      },
      {
        icon: TrendingUp,
        name: 'Performance Tracker',
        description: 'CTR, impressions, ROAS, and conversion data pulled from connected Meta, LinkedIn, and Google Ads accounts.',
        href: '/analytics',
        status: 'soon',
        color: '#ca8a04',
      },
      {
        icon: FileText,
        name: 'Client Reports',
        description: 'Shareable PDF reports showing all ADs generated for each brand — print-ready and white-label ready.',
        href: '/clients',
        status: 'live',
        color: '#84cc16',
      },
    ],
  },
  {
    label: 'Brand & Campaign Management',
    tools: [
      {
        icon: Users,
        name: 'Brand Manager',
        description: 'Add brands with name, voice guidelines, target audience, primary color, and logo. Used in every AD generation.',
        href: '/brands',
        status: 'live',
        color: '#ca8a04',
      },
      {
        icon: Layers,
        name: 'Campaigns',
        description: 'Organize ads into campaigns with platform, format, and messaging goals. Track creative output per campaign.',
        href: '/campaigns',
        status: 'live',
        color: '#84cc16',
      },
      {
        icon: Sparkles,
        name: 'Brand Voice Training',
        description: 'Feed past ads and high-performing content to fine-tune the AI voice per brand over time.',
        href: '#',
        status: 'soon',
        badge: 'Agency+',
        color: '#ca8a04',
      },
    ],
  },
]

const STATUS_STYLES = {
  live: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  beta: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  soon: 'text-[#7a6a40] bg-[#1c1800] border-[#2a2200]',
}

const STATUS_LABELS = { live: 'Live', beta: 'Beta', soon: 'Coming Soon' }

export default function ToolsPage() {
  return (
    <div className="min-h-screen text-[#dde4f0]" style={{ background: '#0a0900', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AppNav active="/tools" />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#ca8a04' }}>All Tools</h1>
          <p className="text-sm" style={{ color: '#b8a870' }}>Every AdDee feature in one place — find it here and jump straight in.</p>
        </div>

        <div className="space-y-12">
          {CATEGORIES.map(cat => (
            <div key={cat.label}>
              <h2 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#7a6a40' }}>
                <span className="w-1 h-4 rounded-full inline-block" style={{ background: '#ca8a04' }} />
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.tools.map(tool => {
                  const Tag = tool.status === 'soon' ? 'div' : 'a'
                  return (
                    <Tag
                      key={tool.name}
                      {...(tool.status !== 'soon' ? { href: tool.href } : {})}
                      className={`group rounded-xl border p-4 flex flex-col gap-3 transition-all ${tool.status !== 'soon' ? 'hover:border-[rgba(202,138,4,0.6)] cursor-pointer' : 'opacity-70 cursor-default'}`}
                      style={{ background: 'rgba(20,18,0,0.6)', borderColor: 'rgba(202,138,4,0.2)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${tool.color}18`, border: `1px solid ${tool.color}30` }}>
                          <tool.icon className="w-4 h-4" style={{ color: tool.color }} />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[tool.status]}`}>
                            {STATUS_LABELS[tool.status]}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border" style={{ color: '#ca8a04', background: 'rgba(202,138,4,0.1)', borderColor: 'rgba(202,138,4,0.3)' }}>
                              {tool.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1 transition-colors" style={{ color: '#dde4f0' }}>{tool.name}</div>
                        <p className="text-xs leading-relaxed" style={{ color: '#b8a870' }}>{tool.description}</p>
                      </div>
                      {tool.status !== 'soon' && (
                        <div className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: '#ca8a04' }}>
                          Open <span>→</span>
                        </div>
                      )}
                    </Tag>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
