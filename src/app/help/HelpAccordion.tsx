'use client'

import { useState } from 'react'
import {
  ChevronDown, ChevronRight, Zap, Globe, Users, Send,
  Clock, Search, BarChart2, CreditCard, Settings, BookOpen,
  CalendarDays, TrendingUp, Share2, HelpCircle,
} from 'lucide-react'

type Step = { title: string; body: string }
type Section = { id: string; icon: React.ReactNode; title: string; subtitle: string; steps: Step[] }

const SECTIONS: Section[] = [
  {
    id: 'quickstart',
    icon: <Zap className="w-4 h-4 text-violet-400" />,
    title: 'Quick Start — 5 minutes to first post',
    subtitle: 'Get set up and publish your first blog post',
    steps: [
      { title: '1. Add your first client', body: 'Go to Clients → click "New Client". Enter the client name, their website URL, industry, and brand voice (e.g. "Professional and informative"). This is what Bloggy uses to match their tone.' },
      { title: '2. Add target keywords', body: 'On the client page, scroll to Settings → Target Keywords. Add comma-separated keywords (e.g. "plumber london, emergency plumber, boiler repair"). These are used for ranking checks and to guide content.' },
      { title: '3. Connect WordPress (optional)', body: 'In the client settings, enter their WordPress URL (e.g. https://clientsite.com), WordPress username, and an Application Password. Generate the app password in WP → Users → Profile → Application Passwords. Hit "Test Connection" to verify.' },
      { title: '4. Generate your first post', body: 'Go to Generate → select the client → enter a topic (e.g. "10 tips for fixing a leaky tap"). Choose tone, length, and click Generate. The post is ready in ~15 seconds.' },
      { title: '5. Publish to WordPress', body: 'Open the post → click the WordPress tab → hit Publish. The post goes live on the client\'s site instantly. You can also save as Draft first to review.' },
    ],
  },
  {
    id: 'generate',
    icon: <Zap className="w-4 h-4 text-yellow-400" />,
    title: 'Generating Blog Posts',
    subtitle: 'Topics, briefs, tone settings, and advanced options',
    steps: [
      { title: 'Generating from a topic', body: 'Go to Generate → select a client → type a topic in the Topic field. Optionally add focus keywords, choose tone (Professional, Casual, Educational, etc.) and length (Short 400-600w / Medium 800-1200w / Long 1500-2500w). Click Generate.' },
      { title: 'Generating from a URL (URL to Blog)', body: 'In Generate, click the "Import" tab → paste any webpage URL → click Generate from URL. Bloggy fetches the content and rewrites it as a unique, optimized post for your client.' },
      { title: 'Generating from a YouTube video', body: 'In the Import tab, paste a YouTube video URL. Bloggy uses the transcript to create a full blog post — great for converting video content into written SEO articles.' },
      { title: 'Using a brief instead of a topic', body: 'Toggle from "Topic" to "Brief" mode in the Generate tab to paste a detailed content brief. Bloggy follows it precisely — useful for client-provided outlines or keyword-rich briefs.' },
      { title: 'Adding a hero image', body: 'Turn on "Hero Image" in Generate settings. Bloggy generates an AI image and attaches it as the featured image when publishing to WordPress. Images are stored in Supabase.' },
      { title: 'Post limits', body: 'Your plan includes a set number of posts per month. When you\'re close to the limit, the nav shows a warning. Upgrade in Billing to increase your limit.' },
    ],
  },
  {
    id: 'wordpress',
    icon: <Send className="w-4 h-4 text-cyan-400" />,
    title: 'WordPress Publishing',
    subtitle: 'Connect sites, publish posts, manage status',
    steps: [
      { title: 'Connecting WordPress', body: 'In Clients → select client → Settings tab → enter: WP URL (e.g. https://site.com), WP Username, and Application Password. Create the app password in WP Admin → Users → Profile → scroll to "Application Passwords" → enter a name → click Add New. Copy the generated password.' },
      { title: 'Publishing a post', body: 'Open any post → click the WordPress tab (top right of the editor) → choose Publish (live) or Draft → click Publish to WordPress. The post is sent immediately with title, content, categories, tags, featured image, and SEO meta.' },
      { title: 'Scheduling a post', body: 'In the WordPress publish panel, toggle "Schedule" and pick a future date/time. The post is set as "future" in WordPress and goes live automatically at that time.' },
      { title: 'Publishing draft → live', body: 'If a post was published as a Draft, go back to the post → WordPress tab → change status to "Publish" → click Update. This updates the existing WP post (no duplicate is created).' },
      { title: 'SEO meta (SmartCrawl / Yoast)', body: 'Fill in Meta Title, Meta Description, and Focus Keyword in the SEO tab of the post editor. These are sent to WordPress as SmartCrawl meta fields (_wds_title, _wds_metadesc, _wds_focus_keywords).' },
      { title: 'Connection errors', body: 'If the test connection fails: 1) Make sure Application Passwords are enabled in WordPress (some hosts disable them). 2) Check the WP URL has no trailing slash issues. 3) Wordfence may block the Vercel IP — whitelist it or disable REST API protection temporarily.' },
    ],
  },
  {
    id: 'keywords',
    icon: <Search className="w-4 h-4 text-emerald-400" />,
    title: 'Keyword Research',
    subtitle: 'Find, score, and organize keywords for content',
    steps: [
      { title: 'Researching keywords', body: 'Go to Keywords → select a client → enter a niche or topic → click Research. Bloggy returns 20 keywords with estimated volume, difficulty, and intent. Results are saved to your history automatically.' },
      { title: 'Keyword scoring', body: 'Each keyword gets an AI score based on: search intent (informational/commercial/transactional), estimated difficulty, and relevance to the niche. Use Score to sort and pick the best opportunities.' },
      { title: 'Saving to a keyword list', body: 'Select keywords from the research results → click "Save to List". Name the list (e.g. "Client A — Q3 Targets"). Lists are per-client and can be reused when generating posts.' },
      { title: 'Competitor gap analysis', body: 'In Keywords → Competitor Gap tab → enter a competitor URL → Bloggy finds keywords the competitor ranks for that your client doesn\'t — giving you a content gap to fill.' },
      { title: 'Using keywords when generating', body: 'When generating a post, add keywords from a saved list in the Focus Keywords field. Bloggy will naturally include them in the content, headings, and meta.' },
    ],
  },
  {
    id: 'rankings',
    icon: <TrendingUp className="w-4 h-4 text-violet-400" />,
    title: 'Rankings Tracking',
    subtitle: 'Track Google positions and history for client keywords',
    steps: [
      { title: 'Setting up rankings', body: 'Rankings require a DataForSEO API account (dataforseo.com). Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD to your Vercel environment variables. Each check costs ~$0.002 per keyword.' },
      { title: 'Checking rankings', body: 'Go to Analytics → Rankings tab → click "Check Rankings". Bloggy queries Google\'s organic results for all client target keywords and returns the current position, page, and ranking URL.' },
      { title: 'Reading the results', body: 'Green = Top 3 🏆 · Yellow = Page 1 (4–10) · Orange = Page 2 (11–20) · Red = Page 3+. The Change column shows ↑ or ↓ vs your last check. The sparkline shows the trend over your last 8 checks.' },
      { title: 'History is saved automatically', body: 'Every time you click "Check Rankings", the results are saved to the database. You build history over time. Results also auto-save every Monday morning via a cron job — no clicks needed.' },
      { title: 'Target keywords per client', body: 'Rankings are pulled from the Target Keywords field in each client\'s settings. Go to Clients → select client → Settings → Target Keywords. Add comma-separated keywords. They\'ll appear in rankings on next check.' },
    ],
  },
  {
    id: 'autoblog',
    icon: <Clock className="w-4 h-4 text-orange-400" />,
    title: 'AutoBlog — Automated Publishing',
    subtitle: 'Queue topics and let Bloggy publish on autopilot',
    steps: [
      { title: 'What AutoBlog does', body: 'AutoBlog lets you queue topics for each client and set a schedule. Every hour, Bloggy checks the queue and generates + publishes any topics that are due. Perfect for agencies needing consistent content without manual work.' },
      { title: 'Adding topics to the queue', body: 'Go to AutoBlog → select a client → type topics (one per line) in the Topic Queue → set a scheduled date/time for each → click Queue. Topics are added to the publishing schedule.' },
      { title: 'Bulk scheduling', body: 'Click "Bulk Schedule" to upload a list of topics with dates all at once. Bloggy spreads them out automatically over your chosen timeframe — useful for planning a month of content in one go.' },
      { title: 'Monitoring the queue', body: 'The AutoBlog page shows all queued, published, and failed topics. Failed topics show the error message so you can fix and retry. Success shows the WordPress post URL.' },
      { title: 'WordPress is required', body: 'AutoBlog publishes directly to WordPress. Make sure the client has a connected WordPress site in their settings before queueing topics. Posts without a WP connection will fail.' },
    ],
  },
  {
    id: 'analytics',
    icon: <BarChart2 className="w-4 h-4 text-blue-400" />,
    title: 'Analytics',
    subtitle: 'Post quality, production volume, and SEO performance',
    steps: [
      { title: 'Overview tab', body: 'Shows total posts, words written, average quality score, and publish rate across all clients. The bar chart shows daily post production. Filter by client using the dropdown.' },
      { title: 'Quality tab', body: 'Scores each post on structure, keyword density, readability, and SEO completeness. Posts scoring below 70 are flagged for review. Use this to identify which clients need content improvements.' },
      { title: 'Rankings tab', body: 'Google SERP rankings for all client target keywords. Shows rank, page, search volume, position change, and trend sparkline. Requires DataForSEO credentials.' },
      { title: 'Local Rankings tab', body: 'Local pack rankings powered by Local Falcon. Shows ARP (Average Rank Position), ATRP, and SoLV (Share of Local Voice). For clients with local SEO campaigns.' },
      { title: 'Client Reports', body: 'Each client has a shareable public report page (/r/[clientId]) showing all published posts, titles, dates, and WordPress links. Share the URL with the client — no login needed.' },
    ],
  },
  {
    id: 'calendar',
    icon: <CalendarDays className="w-4 h-4 text-pink-400" />,
    title: 'Content Calendar',
    subtitle: 'See and manage your full publishing schedule',
    steps: [
      { title: 'What the calendar shows', body: 'The calendar shows all AutoBlog-scheduled topics and recently published posts across all clients in a monthly grid. Color-coded by status: scheduled (violet), published (green), failed (red).' },
      { title: 'Rescheduling topics', body: 'Click any scheduled topic on the calendar to see options. You can reschedule by editing the topic in AutoBlog. The calendar refreshes automatically.' },
      { title: 'Filtering by client', body: 'Use the client dropdown at the top of the calendar to focus on one client\'s schedule. Useful when managing content calendars for many clients simultaneously.' },
    ],
  },
  {
    id: 'social-autopilot',
    icon: <Share2 className="w-4 h-4 text-violet-400" />,
    title: 'Social Media Autopilot — Publish Directly to Social',
    subtitle: 'One-click publishing to Google Business, LinkedIn, Medium, and Dev.to',
    steps: [
      { title: 'What is Social Media Autopilot?', body: 'Social Media Autopilot is a $15/mo add-on that lets you publish blog posts directly to multiple social platforms from the Bloggy editor. Instead of manually copying content to each platform, generate once and publish everywhere with one click.' },
      { title: 'Supported platforms', body: 'Google Business Profile: Share updates and drive local visibility · LinkedIn: Post to your company page · Medium: Publish full articles with canonical links · Dev.to: Share technical content with the dev community.' },
      { title: 'Enabling the add-on', body: 'Go to Billing → scroll to Social Media Autopilot (featured section) → click "Add $15/mo". This activates the feature for your account and you\'ll immediately see publish buttons in the post editor.' },
      { title: 'Connecting Google Business Profile', body: 'Open any post → scroll to Social Media Autopilot section → click "Connect Google Business". A popup opens for OAuth authorization. Sign in with the Google account that manages the business profile. Once connected, you\'ll see the account name and a "Publish Now" button.' },
      { title: 'Publishing to Google Business', body: 'After connecting, open any post → Social Media Autopilot section → optionally add an image (Google Business includes images) → click "Publish Now". Your post appears as a Google Business update with a link back to the full blog post on WordPress.' },
      { title: 'Connecting LinkedIn', body: 'In the Social Media Autopilot section → click "Connect LinkedIn". A popup opens for OAuth. Sign in with your LinkedIn account. Once authorized, you\'ll see "Connected" status and the publish interface appears.' },
      { title: 'Publishing to LinkedIn', body: 'Open any post → Social Media Autopilot section → add an optional image → click "Publish Now". This creates a LinkedIn post with a snippet of your blog content and a link to the full post on WordPress. Perfect for driving traffic and engagement.' },
      { title: 'Publishing to Medium', body: 'Go to Settings → Integrations tab → add your Medium Integration Token (get it from medium.com/me/settings/security) → save. Then in the post editor, click "Publish to Medium" to publish the full article. Canonical URL is automatically set to your WordPress post.' },
      { title: 'Publishing to Dev.to', body: 'Go to Settings → Integrations tab → add your Dev.to API Key (get it from dev.to/settings/account) → save. In the post editor, click "Publish to Dev.to". The full article publishes to Dev.to with your WordPress URL as the canonical link.' },
      { title: 'Best practices', body: 'Google Business: Keep text short (~150 chars), add a clear image. LinkedIn: Write a hook/summary before the link — LinkedIn\'s algorithm rewards text, not just link shares. Medium: Let the full article speak for itself; Medium readers appreciate depth. Dev.to: Tags matter hugely — use relevant tags for discoverability.' },
      { title: 'Image requirements', body: 'Google Business: JPEG or PNG, square or landscape, min 400x400px. LinkedIn: Any size, but 1200x628px is optimal for the feed. Medium & Dev.to: Featured image is included in the article. Images are stored securely and linked from our server.' },
      { title: 'Troubleshooting connections', body: 'If "Connect" button doesn\'t work: 1) Clear browser cache and try again. 2) Check you\'re using the right Google/LinkedIn account. 3) Ensure popups aren\'t blocked (browser settings). 4) Join Discord for real-time help.' },
    ],
  },
  {
    id: 'repurpose',
    icon: <Share2 className="w-4 h-4 text-pink-400" />,
    title: 'Content Repurposing',
    subtitle: 'Turn every blog post into social media content',
    steps: [
      { title: 'Opening the repurpose tool', body: 'Open any post from Post History → click the "Repurpose" tab at the top of the editor. Select the platforms you want content for.' },
      { title: 'Supported platforms', body: 'LinkedIn post · Twitter/X thread · Instagram caption · Threads post · TikTok script · Google My Business update · Pinterest description · YouTube description · Facebook post.' },
      { title: 'Generating repurposed content', body: 'Select one or more platforms → click "Repurpose". Bloggy generates platform-native content for each — right length, right tone, right format. Copy directly to your clipboard.' },
    ],
  },
  {
    id: 'team',
    icon: <Users className="w-4 h-4 text-cyan-400" />,
    title: 'Team & Collaboration',
    subtitle: 'Invite team members to your workspace',
    steps: [
      { title: 'Inviting a team member', body: 'Go to Settings → Team → enter the email address → click Invite. They\'ll receive an email with a link to accept. Once accepted, they can generate posts for all your clients.' },
      { title: 'Team member permissions', body: 'Team members have access to all clients and posts in your workspace. They cannot change billing, invite other members, or access settings. Admin controls remain with the workspace owner.' },
      { title: 'Revoking access', body: 'In Settings → Team → click the × next to any member to remove their access immediately. Their session is invalidated and they can no longer generate posts.' },
    ],
  },
  {
    id: 'billing',
    icon: <CreditCard className="w-4 h-4 text-violet-400" />,
    title: 'Billing & Plans',
    subtitle: 'Manage your subscription, add-ons, and coupons',
    steps: [
      { title: 'Plan overview', body: 'Free: 2 posts/month · Freelancer Starter $49/mo: 20 posts, 5 clients · Growth $99/mo: 60 posts, 15 clients · Agency $149/mo: 175 posts, 40 clients · Agency Max $299/mo: 500 posts, 150 clients.' },
      { title: 'Upgrading your plan', body: 'Go to Billing → click "Subscribe" under the plan you want. You\'ll go to Stripe checkout. Your posts counter resets at the start of each billing month.' },
      { title: 'Applying a coupon', body: 'On the Billing page, enter your coupon code in the Promo Code field → click Apply. The discount is shown and applied at checkout. Coupons can be percent-off or dollar-off.' },
      { title: 'Rankings History Pro add-on ($19/mo)', body: 'Available now — adds weekly automated rank tracking, historical trend charts, and position movement tracking. Click "Add to Plan" on the Billing page.' },
      { title: 'Cancelling', body: 'Go to Billing → click "Manage Subscription" to open the Stripe customer portal. You can cancel, change plans, update payment method, and download invoices there.' },
    ],
  },
  {
    id: 'settings',
    icon: <Settings className="w-4 h-4 text-[#8888a8]" />,
    title: 'Settings',
    subtitle: 'White label, Google Indexing, and account preferences',
    steps: [
      { title: 'White label branding', body: 'Agency Max plan only. Go to Settings → White Label → enter your agency name. This replaces "Bloggy" in client-facing reports and emails with your brand name.' },
      { title: 'Google Indexing API', body: 'Automatically notifies Google to index posts the moment they\'re published. Requires a Google Cloud service account. Go to Settings → Google Indexing API and follow the 6-step setup guide shown there.' },
      { title: 'Usage & limits', body: 'Go to Account to see your posts used this month, words generated, and client count vs your plan limits. The nav always shows your remaining posts at a glance.' },
    ],
  },
]

function AccordionSection({ section, defaultOpen }: { section: Section; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#16161f] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] flex items-center justify-center shrink-0">
            {section.icon}
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">{section.title}</div>
            <div className="text-[#555570] text-xs mt-0.5">{section.subtitle}</div>
          </div>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4 text-[#555570] shrink-0" />
          : <ChevronRight className="w-4 h-4 text-[#555570] shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-[#2a2a3d] flex flex-col sm:flex-row">
          <div className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-[#2a2a3d] py-2">
            {section.steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                  activeStep === i
                    ? 'text-white bg-violet-600/10 border-r-2 border-violet-500'
                    : 'text-[#8888a8] hover:text-white hover:bg-[#1a1a26]'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>
          <div className="flex-1 px-6 py-5">
            <h3 className="text-white font-semibold text-sm mb-3">{section.steps[activeStep]?.title}</h3>
            <p className="text-[#b0b0c8] text-sm leading-relaxed">{section.steps[activeStep]?.body}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HelpAccordion() {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? SECTIONS.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        s.steps.some(step =>
          step.title.toLowerCase().includes(search.toLowerCase()) ||
          step.body.toLowerCase().includes(search.toLowerCase())
        )
      )
    : SECTIONS

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555570]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guides…"
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Quick links */}
      {!search && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {[
            { label: 'Quick Start', href: '#quickstart', icon: <Zap className="w-3.5 h-3.5" /> },
            { label: 'WordPress', href: '#wordpress', icon: <Send className="w-3.5 h-3.5" /> },
            { label: 'Social Autopilot', href: '#social-autopilot', icon: <Share2 className="w-3.5 h-3.5" /> },
            { label: 'Rankings', href: '#rankings', icon: <Globe className="w-3.5 h-3.5" /> },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 bg-[#12121a] border border-[#2a2a3d] hover:border-violet-500/40 rounded-xl px-3 py-2.5 text-sm text-[#8888a8] hover:text-white transition-colors"
            >
              <span className="text-violet-400">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#555570]">
          <HelpCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No guides match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((section, i) => (
            <div key={section.id} id={section.id}>
              <AccordionSection section={section} defaultOpen={i === 0 && !search} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 text-center">
        <p className="text-white font-semibold text-sm mb-1">Still stuck?</p>
        <p className="text-[#8888a8] text-xs mb-4">Join the community or send us a message directly.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://discord.gg/9avYXden"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 bg-violet-600/10 border border-violet-500/20 px-4 py-2 rounded-lg transition-colors"
          >
            Join Discord Community
          </a>
          <a
            href="mailto:eric@boommedia.us"
            className="text-xs font-semibold text-[#8888a8] hover:text-white bg-[#1a1a26] border border-[#2a2a3d] px-4 py-2 rounded-lg transition-colors"
          >
            Email Support
          </a>
        </div>
      </div>
    </>
  )
}
