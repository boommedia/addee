import AppNav from '@/components/AppNav'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import {
  Zap, Globe, Calendar, BarChart2, Image, Link2, Video, FileText,
  Users, ArrowRight, CheckCircle, Star, TrendingUp, Clock, Target,
  Sparkles, MessageCircle, BookOpen, AlertCircle,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-violet-400" />,
    title: 'AI Blog Generation',
    description: 'Write for all clients in one place. Apply brand voice once, generate instantly. Save 8 hours/week.',
    href: '/dashboard',
    cta: 'Generate now',
    color: 'border-violet-500/20 hover:border-violet-500/40',
    glow: 'bg-violet-500/5',
  },
  {
    icon: <Globe className="w-5 h-5 text-emerald-400" />,
    title: 'Multi-Platform Publishing',
    description: 'Publish to WordPress, Shopify, Webflow without switching logins. One click. All clients.',
    href: '/clients',
    cta: 'Connect a site',
    color: 'border-emerald-500/20 hover:border-emerald-500/40',
    glow: 'bg-emerald-500/5',
  },
  {
    icon: <Calendar className="w-5 h-5 text-cyan-400" />,
    title: 'Autoblog Scheduler',
    description: 'Queue topics per client. Bloggy generates & publishes automatically. Never miss a deadline.',
    href: '/autoblog',
    cta: 'Set up autoblog',
    color: 'border-cyan-500/20 hover:border-cyan-500/40',
    glow: 'bg-cyan-500/5',
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-pink-400" />,
    title: 'Analytics Dashboard',
    description: 'Track content quality, client health, keyword coverage, and keyword rankings. LocalFalcon grid data for Agency+ only.',
    href: '/analytics',
    cta: 'View analytics',
    color: 'border-pink-500/20 hover:border-pink-500/40',
    glow: 'bg-pink-500/5',
  },
  {
    icon: <Image className="w-5 h-5 text-yellow-400" />,
    title: 'AI Hero Images',
    description: 'Auto-generate on-brand featured images for every post without leaving the app.',
    href: '/dashboard',
    cta: 'Try it',
    color: 'border-yellow-500/20 hover:border-yellow-500/40',
    glow: 'bg-yellow-500/5',
  },
  {
    icon: <Video className="w-5 h-5 text-red-400" />,
    title: 'YouTube → Blog',
    description: 'Paste a YouTube URL and convert the transcript into a full blog post automatically.',
    href: '/dashboard',
    cta: 'Convert a video',
    color: 'border-red-500/20 hover:border-red-500/40',
    glow: 'bg-red-500/5',
  },
  {
    icon: <Link2 className="w-5 h-5 text-blue-400" />,
    title: 'URL to Blog',
    description: 'Turn any article, landing page, or product page into fresh blog content instantly.',
    href: '/dashboard',
    cta: 'Convert a URL',
    color: 'border-blue-500/20 hover:border-blue-500/40',
    glow: 'bg-blue-500/5',
  },
  {
    icon: <Target className="w-5 h-5 text-orange-400" />,
    title: 'SEO Meta Output',
    description: 'Every post comes with focus keyword, meta title, and meta description ready to go.',
    href: '/dashboard',
    cta: 'Generate a post',
    color: 'border-orange-500/20 hover:border-orange-500/40',
    glow: 'bg-orange-500/5',
  },
]

const PLAN_UPGRADE_FEATURES = [
  '60 posts/month (Growth) or more',
  'Up to 15-40 client sites',
  'Autoblog autopilot',
  'AI hero images',
  'YouTube & URL to blog',
  'Content calendar',
  'Client reports',
  'Keyword rankings (all users)',
  'LocalFalcon grid data (Agency+ only)',
]

const ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'feature',
    title: '🎉 Social Media Publishing is Live!',
    description: 'Publish directly to GMB, LinkedIn, Medium, and Dev.to from Bloggy. Connect your accounts and expand your content reach.',
    cta: 'Learn more',
    ctaHref: '/posts',
  },
  {
    id: 2,
    type: 'tip',
    title: '💡 Pro Tip: Use Autoblog for Consistent Output',
    description: 'Queue topics once and let Bloggy publish daily. Perfect for maintaining SEO momentum across all your clients.',
    cta: 'Set it up',
    ctaHref: '/autoblog',
  },
]

const FEATURE_TIERS = [
  {
    name: 'Freelancer Starter',
    price: '$49/mo',
    posts: '20 posts/mo',
    features: [
      'Up to 5 client sites',
      'AI blog generation',
      'WordPress & Shopify publishing',
      'Per-client brand voice',
      'Basic keyword rankings',
      'SEO meta output',
    ],
    locked: [
      'Autoblog scheduler',
      'AI hero images',
      'Team collaboration',
      'Client reports',
    ],
  },
  {
    name: 'Growth',
    price: '$99/mo',
    posts: '60 posts/mo',
    features: [
      'Up to 15 client sites',
      'Everything in Freelancer Starter',
      'Autoblog scheduler',
      'AI hero images',
      'Team collaboration (1 user)',
      'URL & YouTube to blog',
      'Content repurposing',
      'Advanced keyword research',
    ],
    locked: [
      'LocalFalcon grid rankings',
      'White-label reports',
      'Approval workflows',
    ],
  },
  {
    name: 'Agency',
    price: '$149/mo',
    posts: '175 posts/mo',
    features: [
      'Up to 40 client sites',
      'Everything in Growth',
      'LocalFalcon grid rankings',
      'White-label client portal',
      'Scheduled monthly reports',
      'Team up to 5 users',
      'Advanced analytics',
      'Approval workflows',
    ],
    locked: [
      'White-label domain',
      'Custom integrations',
    ],
  },
  {
    name: 'Agency Max',
    price: '$299/mo',
    posts: '500 posts/mo',
    features: [
      'Up to 150 client sites',
      'Everything in Agency',
      'White-label domain',
      'Custom integrations',
      'API access',
      'Unlimited team members',
      'Priority 24/7 support',
      'Dedicated account manager',
    ],
    locked: [],
  },
]

const RESOURCES = [
  {
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
    title: 'Join the Community',
    description: 'Chat with other Bloggy users, get tips, and stay updated.',
    cta: 'Discord Community',
    href: 'https://discord.gg/9avYXden',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    title: 'Help & Guides',
    description: 'Learn how to get the most out of Bloggy with our docs.',
    cta: 'View Docs',
    href: '/help',
  },
  {
    icon: <AlertCircle className="w-5 h-5 text-orange-400" />,
    title: 'Need Support?',
    description: 'Have a question? We\'re here to help your success.',
    cta: 'Contact Us',
    href: 'mailto:support@bloggy.online',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [
    { data: sub },
    { count: totalPosts },
    { count: postsThisMonth },
    { data: clients },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from('subscriptions').select('plan, status, posts_limit').eq('user_id', user.id).single(),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user.id).gte('created_at', monthStart),
    supabase.from('clients').select('id, name').eq('created_by', user.id).order('name'),
    supabase.from('posts').select('id, title, created_at, wp_status, clients(name)').eq('created_by', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  const plan = sub?.plan ?? 'free'
  const isActive = sub?.status === 'active'
  const displayPlan = isActive ? plan : 'free'
  const postsLimit = sub?.posts_limit ?? 2
  const postsLeft = Math.max(0, postsLimit - (postsThisMonth ?? 0))
  const isFreeOrStarter = displayPlan === 'free' || displayPlan === 'starter'

  const firstName = user.email?.split('@')[0] ?? 'there'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <AppNav active="/home" />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121a] via-[#1a1226] to-[#0a0a0f] border border-[#2a2a3d] px-8 py-12 sm:px-12">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-600/5 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400 uppercase tracking-wider">
                {displayPlan.replace('_', ' ')} plan
              </span>
              {!isActive && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                  No active subscription
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Welcome back, <span className="text-violet-400">{firstName}</span> 👋
            </h1>
            <p className="text-[#8888a8] text-base max-w-xl mb-8">
              Manage client blogs across WordPress, Shopify, Webflow. Generate posts, track rankings, deliver reports — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/dashboard"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
                <Zap className="w-4 h-4" /> Generate a post
              </a>
              <a href="/clients"
                className="inline-flex items-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
                <Users className="w-4 h-4" /> Manage clients
              </a>
              <a href="/analytics"
                className="inline-flex items-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] text-[#8888a8] hover:text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
                <BarChart2 className="w-4 h-4" /> Analytics
              </a>
            </div>
          </div>
        </div>

        {/* Announcements */}
        {ANNOUNCEMENTS.length > 0 && (
          <div className="space-y-3">
            {ANNOUNCEMENTS.map(announcement => (
              <div key={announcement.id} className={`rounded-2xl border p-4 ${announcement.type === 'feature' ? 'bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-violet-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">{announcement.title}</h3>
                    <p className="text-[#8888a8] text-xs mb-3">{announcement.description}</p>
                    <a href={announcement.ctaHref} className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                      {announcement.cta} <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Posts', value: totalPosts ?? 0, icon: <FileText className="w-4 h-4 text-violet-400" />, sub: 'all time' },
            { label: 'This Month', value: postsThisMonth ?? 0, icon: <TrendingUp className="w-4 h-4 text-cyan-400" />, sub: `${postsLeft} left in quota` },
            { label: 'Clients', value: (clients ?? []).length, icon: <Users className="w-4 h-4 text-pink-400" />, sub: 'active profiles' },
            { label: 'Posts / Limit', value: `${postsThisMonth ?? 0}/${postsLimit}`, icon: <Clock className="w-4 h-4 text-orange-400" />, sub: displayPlan.replace('_', ' ') },
          ].map(stat => (
            <div key={stat.label} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl px-4 py-4">
              <div className="flex items-center gap-2 text-[#8888a8] text-xs mb-2">{stat.icon}{stat.label}</div>
              <div className="text-white font-bold text-2xl mb-1">{stat.value}</div>
              <div className="text-[#555570] text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div>
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl mb-1">One Dashboard. Every Platform.</h2>
            <p className="text-[#8888a8] text-sm">Manage all your client blogs — WordPress, Shopify, Webflow — in one place. Generate, publish, track, and scale.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <a
                key={f.title}
                href={f.href}
                className={`group bg-[#12121a] border rounded-2xl p-5 transition-all duration-200 ${f.color} ${f.glow} block`}
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-[#8888a8] text-xs leading-relaxed mb-4">{f.description}</p>
                <span className="text-xs font-semibold text-violet-400 group-hover:text-violet-300 flex items-center gap-1 transition-colors">
                  {f.cta} <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Feature Tiers Matrix */}
        <div>
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl mb-1">Plans for Every Stage. Scale as You Grow.</h2>
            <p className="text-[#8888a8] text-sm">Start with 2-5 clients. Grow to 40+. No lock-in. Upgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {FEATURE_TIERS.map(tier => (
              <div key={tier.name} className={`rounded-2xl border p-6 ${displayPlan.toLowerCase() === tier.name.toLowerCase() ? 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/30' : 'bg-[#12121a] border-[#2a2a3d]'}`}>
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                  <div className="text-violet-400 text-sm font-semibold mt-1">{tier.price}</div>
                  <div className="text-[#8888a8] text-xs mt-1">{tier.posts}</div>
                </div>
                <div className="space-y-3">
                  {tier.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#c8c8d8] text-sm">{feature}</span>
                    </div>
                  ))}
                  {tier.locked.length > 0 && (
                    <>
                      <div className="border-t border-[#2a2a3d] my-3" />
                      {tier.locked.map(feature => (
                        <div key={feature} className="flex items-start gap-2 opacity-50">
                          <AlertCircle className="w-4 h-4 text-[#555570] shrink-0 mt-0.5" />
                          <span className="text-[#8888a8] text-sm">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                {(() => {
                  const tierHierarchy = { starter: 1, growth: 2, agency: 3, 'agency max': 4 }
                  const currentLevel = tierHierarchy[displayPlan.toLowerCase() as keyof typeof tierHierarchy] ?? 0
                  const tierLevel = tierHierarchy[tier.name.toLowerCase() as keyof typeof tierHierarchy] ?? 0

                  if (tierLevel === currentLevel) {
                    return <div className="block w-full mt-6 py-2 px-4 rounded-lg bg-[#2a2a3d] text-[#8888a8] text-sm font-semibold text-center">Current Plan</div>
                  }

                  return (
                    <a href="/billing" className="block w-full mt-6 py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold text-center transition-colors">
                      {tierLevel > currentLevel ? 'Upgrade' : 'Downgrade'}
                    </a>
                  )
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Recent posts + Upgrade CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Recent posts */}
          <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Recent Posts
              </h2>
              <a href="/posts" className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                View all →
              </a>
            </div>
            {(recentPosts ?? []).length === 0 ? (
              <div className="text-center py-10">
                <FileText className="w-10 h-10 text-[#2a2a3d] mx-auto mb-3" />
                <p className="text-[#8888a8] text-sm mb-3">No posts yet.</p>
                <a href="/dashboard" className="text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">Generate your first post →</a>
              </div>
            ) : (
              <div className="space-y-0">
                {(recentPosts ?? []).map(post => {
                  const clientName = (Array.isArray(post.clients) ? post.clients[0] : post.clients)?.name
                  const isLive = post.wp_status === 'publish'
                  const isPending = post.wp_status === 'pending'
                  const statusColors = isLive
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : isPending
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-[#8888a8] bg-[#1a1a26] border-[#2a2a3d]'
                  const statusLabel = isLive ? 'Live' : isPending ? 'Pending Approval' : 'Draft'
                  return (
                    <div key={post.id} className="flex items-center gap-3 py-3 border-b border-[#1a1a26] last:border-0">
                      <div className="flex-1 min-w-0">
                        <a href={`/posts/${post.id}`} className="text-white hover:text-violet-300 text-sm font-medium truncate block transition-colors">
                          {post.title || 'Untitled'}
                        </a>
                        {clientName && <span className="text-violet-400 text-xs">{clientName}</span>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${statusColors}`}>
                        {statusLabel}
                      </span>
                      <span className="text-[#555570] text-xs shrink-0">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Upgrade CTA */}
          {isFreeOrStarter && (
            <div className="bg-gradient-to-br from-[#1a1226] to-[#12121a] border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-violet-400" />
                  <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">Upgrade to Growth</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Scale your content output</h3>
                <p className="text-[#8888a8] text-sm mb-5">
                  Unlock more posts, more clients, and powerful automation tools.
                </p>
                <div className="space-y-2 mb-6">
                  {PLAN_UPGRADE_FEATURES.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-[#c8c8d8]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <a href="/billing"
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors">
                  <Zap className="w-4 h-4" /> Upgrade plan
                </a>
                <p className="text-[#555570] text-xs text-center mt-3">Starting at $49/mo · Cancel anytime</p>
              </div>
            </div>
          )}

          {/* If already on a good plan, show quick actions instead */}
          {!isFreeOrStarter && (
            <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6">
              <h2 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" /> Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/dashboard', label: 'Generate a new post', icon: <Zap className="w-4 h-4 text-violet-400" /> },
                  { href: '/clients', label: 'Add a client', icon: <Users className="w-4 h-4 text-pink-400" /> },
                  { href: '/autoblog', label: 'Queue autoblog topics', icon: <Calendar className="w-4 h-4 text-cyan-400" /> },
                  { href: '/analytics', label: 'View analytics', icon: <BarChart2 className="w-4 h-4 text-emerald-400" /> },
                  { href: '/calendar', label: 'Open content calendar', icon: <Calendar className="w-4 h-4 text-blue-400" /> },
                ].map(action => (
                  <a key={action.href} href={action.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a26] hover:bg-[#2a2a3d] border border-[#2a2a3d] hover:border-[#3a3a50] transition-colors group">
                    {action.icon}
                    <span className="text-[#c8c8d8] group-hover:text-white text-sm font-medium transition-colors">{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#555570] group-hover:text-violet-400 ml-auto transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resources / Help Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl mb-1">Get Help & Connect</h2>
            <p className="text-[#8888a8] text-sm">We're here to support you and your team every step of the way.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RESOURCES.map(resource => (
              <a key={resource.href} href={resource.href} target={resource.href.startsWith('http') ? '_blank' : undefined} rel={resource.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 hover:border-[#3a3a50] transition-all group">
                <div className="mb-4">{resource.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-violet-300 transition-colors">{resource.title}</h3>
                <p className="text-[#8888a8] text-xs mb-4 leading-relaxed">{resource.description}</p>
                <span className="text-xs font-semibold text-violet-400 group-hover:text-violet-300 flex items-center gap-1 transition-colors">
                  {resource.cta} <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
