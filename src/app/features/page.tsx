import Logo from '@/components/Logo'
import { ArrowRight, Check, Zap, Globe, BarChart2, Image, Calendar, Star, Share2, Link, Search, Users, FileText, Clock, Layers, ChevronRight, Play, UserCheck, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features',
  description: 'AI blog generation from topics, URLs & YouTube · one-click WordPress publish · AutoBlog scheduler · keyword research · social repurposing · keyword & local rankings tracker.',
  keywords: ['AI blog generator features', 'WordPress publish automation', 'autoblog scheduler', 'content repurposing tool', 'keyword rankings tracker', 'local rankings', 'SEO blog writer AI'],
  alternates: { canonical: 'https://bloggy.online/features' },
  openGraph: {
    title: 'Bloggy Features — Everything Your Agency Needs to Scale Blog Content',
    description: 'AI blog generation, WordPress auto-publish, AutoBlog scheduler, keyword research, social repurposing, and keyword & local rankings tracking — all in one platform.',
    url: 'https://bloggy.online/features',
    type: 'website',
    images: [{ url: 'https://bloggy.online/og-image.png', width: 1200, height: 630, alt: 'Bloggy Features' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggy Features — Everything Your Agency Needs',
    description: 'AI blog generation, WordPress auto-publish, AutoBlog scheduler, keyword research, social repurposing, and keyword & local rankings tracking.',
    images: ['https://bloggy.online/og-image.png'],
    site: '@GetBloggy',
  },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav className="border-b border-[#2a2a3d]/60 bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <Logo />
            </a>
            <span className="text-[#2a2a3d] mx-1">·</span>
            <span className="text-[#8888a8] text-xs">by Boom Media</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/#pricing" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Pricing</a>
            <a href="/blog" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Blog</a>
            <a href="/support" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Support</a>
            <a href="/login" className="text-[#8888a8] hover:text-white text-sm transition-colors hidden sm:block">Sign In</a>
            <a href="/#waitlist" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-600/15 border border-violet-500/25 text-violet-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-7">
            <Layers className="w-3 h-3" /> Full Feature Overview
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-5">
            One platform. Every tool<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              your agency needs.
            </span>
          </h1>
          <p className="text-lg text-[#8888a8] max-w-2xl mx-auto leading-relaxed">
            From AI blog generation to YouTube repurposing, SEO scoring, and WordPress autopublish — Bloggy replaces a 5-tool stack with one clean dashboard.
          </p>
        </div>
      </section>

      {/* Feature nav pills */}
      <section className="border-y border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-4 overflow-x-auto">
        <div className="max-w-5xl mx-auto flex items-center gap-3 text-xs font-semibold whitespace-nowrap justify-center flex-wrap">
          {[
            ['#core', 'AI Content Engine'],
            ['#seo', 'SEO & Scoring'],
            ['#publish', 'Publishing'],
            ['#clients', 'Client Management'],
            ['#addons', 'Add-ons'],
            ['#integrations', 'Integrations'],
            ['#team', 'Team & Workflow'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="px-3 py-1.5 rounded-full bg-[#1a1a26] border border-[#2a2a3d] text-[#8888a8] hover:text-white hover:border-violet-500/40 transition-colors">
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* ── SECTION 1: AI CONTENT ENGINE ── */}
      <section id="core" className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeader tag="AI Content Engine" title="Generate expert content in seconds" sub="Claude Sonnet — Anthropic's most capable writing model — powers every post. The output reads like a human expert wrote it." />

        {/* Big feature: AI Blog Generation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <FeatureBadge icon={<Zap className="w-4 h-4" />} label="AI Blog Generation" />
            <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">From brief to 1,200-word post in under 30 seconds</h3>
            <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
              Type a topic or paste a brief. Bloggy generates a fully-structured, SEO-optimized blog post with H2/H3 headings, introduction, body sections, and a CTA — ready to publish or refine.
            </p>
            <ul className="space-y-2">
              {[
                'Short, medium, or long-form (400–2,500 words)',
                '5 tone presets: professional, conversational, educational, persuasive, casual',
                'Per-client brand voice applied automatically',
                'Optional data tables and bar charts included in output',
                'SEO keyword weaving — not stuffing',
              ].map(f => <FeatureCheck key={f} text={f} />)}
            </ul>
          </div>
          <MockGenerateUI />
        </div>

        {/* YouTube to Blog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          <MockYouTubeUI />
          <div>
            <FeatureBadge icon={<Play className="w-4 h-4" />} label="YouTube → Blog" color="red" />
            <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">Turn any YouTube video into a full blog post</h3>
            <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
              Paste a YouTube URL. Bloggy extracts the video transcript automatically — no API key, no plugins — then rewrites it into original, SEO-optimized long-form content. Perfect for repurposing podcast episodes, tutorials, and explainer videos.
            </p>
            <ul className="space-y-2">
              {[
                'Works with any YouTube video that has captions',
                'Supports auto-generated and manual subtitles',
                'Rewrites — not cleans up — the transcript into original content',
                'Applies client brand voice and tone settings',
                'Saves directly to post history, ready to publish to WordPress',
              ].map(f => <FeatureCheck key={f} text={f} />)}
            </ul>
          </div>
        </div>

        {/* URL to Blog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <FeatureBadge icon={<Link className="w-4 h-4" />} label="URL → Blog" color="cyan" />
            <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">Repurpose any article or webpage into a fresh post</h3>
            <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
              Paste any URL — a competitor article, industry news piece, or your own old content — and Bloggy reads the page and rewrites it as a new, original post for your client. Great for staying on top of trending topics without starting from scratch.
            </p>
            <ul className="space-y-2">
              {[
                'Fetches and parses any public webpage',
                'Rewrites content — 100% original output',
                'Applies tone, brand voice, and keyword targeting',
                'Works alongside manual topic entry',
              ].map(f => <FeatureCheck key={f} text={f} />)}
            </ul>
          </div>
          <MockUrlUI />
        </div>
      </section>

      {/* ── SECTION 2: SEO ── */}
      <section id="seo" className="border-t border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="SEO & Scoring" title="Built for search, not just writing" sub="Every Bloggy post ships with a full SEO package — meta tags, keyword analysis, readability scoring, and internal link suggestions." />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
            <MockSeoUI />
            <div>
              <FeatureBadge icon={<Search className="w-4 h-4" />} label="SEO Score Panel" />
              <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">Real-time SEO scoring on every post</h3>
              <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
                After generation, the SEO tab shows a visual gauge (0–100), content structure breakdown, and a live keyword frequency map. See exactly what's strong and what needs tuning — before you hit publish.
              </p>
              <ul className="space-y-2">
                {[
                  '0–100 score gauge: green / yellow / red at a glance',
                  'Content structure: words, headings, paragraphs, images',
                  'Top keyword chips with frequency counts',
                  'Focus keyword highlighted across the content',
                  'Auto-generated meta title and meta description',
                  'Character count warnings (60-char title, 160-char description limits)',
                ].map(f => <FeatureCheck key={f} text={f} />)}
              </ul>
            </div>
          </div>

          {/* 3-col smaller SEO features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Search className="w-5 h-5" />,
                title: 'Keyword Targeting',
                desc: 'Add comma-separated target keywords before generation. Claude weaves them in naturally — no stuffing, no awkward placement.',
              },
              {
                icon: <Link className="w-5 h-5" />,
                title: 'Internal Link Suggestions',
                desc: "AI scans your client's post history and suggests internal links with anchor text and placement reasoning for each new post.",
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: 'Structured Output',
                desc: 'Every post includes H1, H2, H3 hierarchy, short paragraphs, bullet points, and a CTA section — matching Google\'s preferred content structure.',
              },
            ].map(({ icon, title, desc }) => (
              <SmallFeatureCard key={title} icon={icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PUBLISHING ── */}
      <section id="publish" className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeader tag="Publishing & Automation" title="Publish once. Or let it run forever." sub="Direct WordPress integration and an autoblogging scheduler that handles your entire content pipeline on autopilot." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <FeatureBadge icon={<Globe className="w-4 h-4" />} label="WordPress Direct Publish" color="blue" />
            <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">One click to any WordPress site</h3>
            <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
              Connect any WordPress site using Application Passwords — no plugin required. Send posts directly as a draft for client review, or publish live immediately. Every connected site is managed per-client.
            </p>
            <ul className="space-y-2">
              {[
                'No WordPress plugin required — uses built-in REST API',
                'Publish as draft or live with a single toggle',
                'Hero image uploaded and set as featured image automatically',
                'SEO meta title and description pushed to the post',
                'View the live post URL directly in Bloggy after publish',
              ].map(f => <FeatureCheck key={f} text={f} />)}
            </ul>
          </div>
          <MockPublishUI />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <MockAutoblogUI />
          <div>
            <FeatureBadge icon={<Calendar className="w-4 h-4" />} label="Autoblogging Scheduler" color="emerald" />
            <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">Queue topics. Bloggy publishes on schedule.</h3>
            <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
              Load a list of topics per client, set a daily or weekly publishing cadence, and walk away. Bloggy generates, optimizes, and publishes each post automatically — no manual intervention needed.
            </p>
            <ul className="space-y-2">
              {[
                'Per-client topic queues — unlimited topics',
                'Daily or weekly scheduling cadences',
                'Applies brand voice, tone, and keywords automatically',
                'Publishes as draft or live based on your client settings',
                'Content calendar view to see upcoming posts',
                'Pause and resume any client queue at any time',
              ].map(f => <FeatureCheck key={f} text={f} />)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CLIENT MANAGEMENT ── */}
      <section id="clients" className="border-t border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Client Management" title="Every client. One dashboard." sub="Each client gets their own profile: brand voice, WordPress credentials, keyword strategy, logo, and content history — all in one place." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              {
                icon: <Star className="w-5 h-5" />,
                title: 'Per-Client Brand Voice',
                desc: 'Store tone, style guidelines, target audience, and avoid words for each client. Every post automatically sounds like they wrote it.',
              },
              {
                icon: <Image className="w-5 h-5" />,
                title: 'Brand Assets',
                desc: "Upload each client's logo, colors, and style references. Used in hero image prompts and content guidelines to maintain visual consistency.",
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: 'WordPress Connection',
                desc: 'Store WordPress site URL and Application Password per client. Switch between clients and publish to the right site every time.',
              },
              {
                icon: <BarChart2 className="w-5 h-5" />,
                title: 'Post History & Stats',
                desc: "Full post history per client: word counts, published vs. draft status, WordPress post URLs, and total words written across the account.",
              },
              {
                icon: <Search className="w-5 h-5" />,
                title: 'Keyword Strategy per Client',
                desc: 'Store focus keywords and content pillars per client profile. Referenced automatically during generation without re-entering them each time.',
              },
              {
                icon: <Calendar className="w-5 h-5" />,
                title: 'Content Calendar',
                desc: "See all upcoming and published posts across all clients in a single calendar view. Spot gaps, avoid overlap, and plan client campaigns.",
              },
              {
                icon: <UserCheck className="w-5 h-5" />,
                title: 'Client Approval Workflow',
                desc: 'Send any post for client sign-off with one click. Clients receive a branded email with the full post and a secure link to approve or request revisions — no login required.',
                badge: 'Live',
              },
            ].map(({ icon, title, desc, badge }) => (
              <SmallFeatureCard key={title} icon={icon} title={title} desc={desc} badge={badge} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: ADD-ONS ── */}
      <section id="addons" className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeader tag="Power Add-ons" title="Go further with every post" sub="Built-in tools that transform each post into a full content campaign — social copy, visual data, and downloadable assets." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <FeatureBadge icon={<Share2 className="w-4 h-4" />} label="Social Repurposing" color="pink" />
            <h3 className="text-2xl font-black text-white mt-4 mb-4 leading-tight">Turn every blog post into 3 social posts</h3>
            <p className="text-[#8888a8] text-sm leading-relaxed mb-5">
              After generation, switch to the Social tab and Bloggy rewrites the post into platform-native copy for LinkedIn, X (Twitter), and Facebook — each formatted correctly for that platform's style and character limits.
            </p>
            <ul className="space-y-2">
              {[
                'LinkedIn long-form with professional framing',
                'X / Twitter thread or single tweet with hook',
                'Facebook post with conversational tone',
                'One-click copy to clipboard',
                'Re-generate for each platform independently',
              ].map(f => <FeatureCheck key={f} text={f} />)}
            </ul>
          </div>
          <MockSocialUI />
        </div>

        {/* 3-col add-on grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Image className="w-5 h-5" />,
              title: 'AI Hero Images',
              desc: 'DALL-E 3 generates a custom hero image for every post based on the title and topic. Automatically uploaded as the WordPress featured image.',
              badge: 'DALL-E 3',
            },
            {
              icon: <BarChart2 className="w-5 h-5" />,
              title: 'Data Tables & Charts',
              desc: 'Toggle on Data Table or Chart during generation and Claude adds structured comparison tables or visual bar charts directly inside the post.',
              badge: 'Visual',
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: 'Export to HTML & Markdown',
              desc: 'Download any post as a clean .md file or a complete .html file with inline styles — ready to paste into any CMS or email.',
              badge: 'Export',
            },
          ].map(({ icon, title, desc, badge }) => (
            <SmallFeatureCard key={title} icon={icon} title={title} desc={desc} badge={badge} />
          ))}
        </div>
      </section>

      {/* ── SECTION 6: TEAM ── */}
      <section id="team" className="border-t border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Team & Workflow" title="Built for agencies, not solo writers" sub="Invite your team, manage permissions, and let multiple users work across the same client base without stepping on each other." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                icon: <Users className="w-5 h-5" />,
                title: 'Team Invitations',
                desc: 'Invite team members by email. They get a branded welcome email with a one-click join link. No separate account creation required.',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: 'Shared Post History',
                desc: 'All team members see the same post library and client list. Collaborate without re-doing work or losing context.',
              },
              {
                icon: <Star className="w-5 h-5" />,
                title: 'Regenerate from History',
                desc: "Jump back into any previous post and regenerate with different settings — tone, length, or target keyword — in one click from the post history page.",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Onboarding Checklist',
                desc: 'First-time users see a guided checklist: add a client, connect WordPress, generate a post, and queue autoblog topics. New team members get up to speed fast.',
              },
            ].map(({ icon, title, desc }) => (
              <SmallFeatureCard key={title} icon={icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" className="border-t border-[#2a2a3d]/50 bg-[#0d0d14] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Publishing & Integrations" title="Publish everywhere Bloggy supports" sub="Connect your favorite platforms. More integrations added every month." />

          {/* Live Integrations */}
          <div className="mb-16">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Live Now
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'WordPress', icon: '🔵', desc: 'Direct publish, draft, schedule' },
                { name: 'LinkedIn', icon: '💼', desc: 'Native social repurposing' },
                { name: 'X / Twitter', icon: '𝕏', desc: 'Tweet threads & singles' },
                { name: 'Facebook', icon: '📘', desc: 'Conversational copy' },
                { name: 'YouTube', icon: '▶️', desc: 'Transcript → blog' },
                { name: 'DALL-E 3', icon: '🎨', desc: 'AI hero images' },
                { name: 'Google Business', icon: '📍', desc: 'Business info syncing' },
                { name: 'Stripe', icon: '💳', desc: 'Billing & subscriptions' },
              ].map(({ name, icon, desc }) => (
                <div key={name} className="bg-[#12121a] border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                  <div className="text-2xl mb-2">{icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">{name}</h4>
                  <p className="text-[#8888a8] text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              Coming in Future Builds
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Instagram', icon: '📸', desc: 'Stories & feed posts' },
                { name: 'TikTok', icon: '♪', desc: 'Short-form content' },
                { name: 'Threads', icon: '◆', desc: 'Meta integration' },
                { name: 'Bluesky', icon: '☁️', desc: 'Open social network' },
                { name: 'Medium', icon: '📰', desc: 'Publication syncing' },
                { name: 'Substack', icon: '✉️', desc: 'Newsletter publishing' },
                { name: 'HubSpot CMS', icon: '🔗', desc: 'Hubspot integration' },
                { name: 'Contentful', icon: '⚙️', desc: 'Headless CMS sync' },
                { name: 'Sanity', icon: '🎯', desc: 'Structured content' },
                { name: 'Webflow', icon: '🌐', desc: 'Web design platform' },
                { name: 'Ghost', icon: '👻', desc: 'Membership publishing' },
                { name: 'Shopify Blog', icon: '🛍️', desc: 'E-commerce blogging' },
                { name: 'Drupal', icon: '💧', desc: 'Enterprise CMS' },
                { name: 'Wix', icon: '✨', desc: 'Website builder' },
                { name: 'Pinterest', icon: '📌', desc: 'Visual discovery' },
                { name: 'Reddit', icon: '🔥', desc: 'Community posting' },
              ].map(({ name, icon, desc }) => (
                <div key={name} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4 opacity-60 hover:opacity-80 transition-opacity">
                  <div className="text-2xl mb-2">{icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">{name}</h4>
                  <p className="text-[#8888a8] text-xs leading-relaxed">{desc}</p>
                  <span className="inline-block mt-2 text-[10px] bg-violet-600/20 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <SectionHeader tag="vs. the alternatives" title="Why agencies choose Bloggy" sub="Compare what you'd need to stitch together without Bloggy." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 bg-[#1a1a26] text-[#8888a8] text-xs font-semibold uppercase tracking-wider border border-[#2a2a3d] w-1/3">Feature</th>
                <th className="px-4 py-3 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider w-1/3">Bloggy</th>
                <th className="px-4 py-3 bg-[#1a1a26] text-[#8888a8] text-xs font-semibold uppercase tracking-wider border border-[#2a2a3d] w-1/3">DIY Stack</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['AI blog generation', true, 'ChatGPT / Claude ($20–$20/mo)'],
                ['WordPress direct publish', true, 'Manual copy-paste'],
                ['YouTube → Blog', true, 'Transcript tool + rewrite'],
                ['SEO score + meta output', true, 'Yoast + Surfer SEO ($89/mo)'],
                ['AI hero images', true, 'Midjourney / DALL-E ($10+/mo)'],
                ['Social repurposing', true, 'Separate repurposing tool'],
                ['Autoblogging scheduler', true, 'WP plugin + manual setup'],
                ['Multi-client management', true, 'Spreadsheet + Notion'],
                ['Internal link suggestions', true, 'Manual research'],
                ['Per-client brand voice', true, 'Custom ChatGPT prompts'],
                ['Client approval workflow', true, 'Email + manual back-and-forth'],
                ['Content calendar', true, 'CoSchedule / separate tool'],
                ['Team access', true, 'Multiple accounts'],
              ].map(([feature, hasBloggy, alternative]) => (
                <tr key={feature as string} className="even:bg-[#0d0d14]">
                  <td className="px-4 py-2.5 text-[#c8c8d8] border border-[#2a2a3d]">{feature as string}</td>
                  <td className="px-4 py-2.5 text-center border border-violet-500/20 bg-violet-600/5">
                    <span className="text-emerald-400 font-bold">✓</span>
                  </td>
                  <td className="px-4 py-2.5 text-[#8888a8] text-xs border border-[#2a2a3d]">{alternative as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-[#8888a8] text-xs mt-4">DIY stack cost: $150–$300/mo + hours of management overhead. Bloggy: from $49/mo.</p>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-20 border-t border-[#2a2a3d]/50 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to see it in action?</h2>
          <p className="text-[#8888a8] text-sm mb-8 leading-relaxed">
            Join the waitlist and get 2 free posts + 2 free client slots to test every feature before your plan starts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#waitlist" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm">
              Join the Waitlist — It's Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/#pricing" className="text-[#8888a8] hover:text-white text-sm font-semibold transition-colors">
              View pricing →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a3d]/50 px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Logo className="h-6" />
          <span className="text-[#8888a8] text-xs">by Boom Media</span>
        </div>
        <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
          <a href="/" className="text-[#8888a8] hover:text-white text-xs transition-colors">Home</a>
          <a href="/features" className="text-[#8888a8] hover:text-white text-xs transition-colors">Features</a>
          <a href="/#pricing" className="text-[#8888a8] hover:text-white text-xs transition-colors">Pricing</a>
          <a href="/blog" className="text-[#8888a8] hover:text-white text-xs transition-colors">Blog</a>
          <a href="/support" className="text-[#8888a8] hover:text-white text-xs transition-colors">Support</a>
        </div>
        <p className="text-[#8888a8] text-xs">© 2026 Boom Media. All rights reserved.</p>
      </footer>
    </div>
  )
}

// ── Reusable Components ──

function SectionHeader({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-14">
      <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">{tag}</div>
      <h2 className="text-3xl font-black text-white mb-3">{title}</h2>
      <p className="text-[#8888a8] text-sm max-w-xl mx-auto leading-relaxed">{sub}</p>
    </div>
  )
}

function FeatureBadge({ icon, label, color = 'violet' }: { icon: React.ReactNode; label: string; color?: string }) {
  const colors: Record<string, string> = {
    violet: 'bg-violet-600/15 border-violet-500/25 text-violet-400',
    red: 'bg-red-600/15 border-red-500/25 text-red-400',
    cyan: 'bg-cyan-600/15 border-cyan-500/25 text-cyan-400',
    blue: 'bg-blue-600/15 border-blue-500/25 text-blue-400',
    emerald: 'bg-emerald-600/15 border-emerald-500/25 text-emerald-400',
    pink: 'bg-pink-600/15 border-pink-500/25 text-pink-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${colors[color] ?? colors.violet}`}>
      {icon} {label}
    </span>
  )
}

function FeatureCheck({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
      <span className="text-[#c8c8d8] text-sm">{text}</span>
    </li>
  )
}

function SmallFeatureCard({ icon, title, desc, badge }: { icon: React.ReactNode; title: string; desc: string; badge?: string }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
          {icon}
        </div>
        {badge && <span className="text-xs font-bold text-[#8888a8] bg-[#1a1a26] border border-[#2a2a3d] px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
      <p className="text-[#8888a8] text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

// ── Mock UI Components ──

function MockGenerateUI() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        <span className="text-[#555570] text-xs ml-2">bloggy.online/dashboard</span>
      </div>
      <div className="p-5">
        <div className="mb-3">
          <div className="text-[#555570] text-xs mb-1.5">Topic / Brief</div>
          <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2 text-[#c8c8d8] text-xs">
            Top 7 reasons local businesses need Google Business Profile in 2025
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          {['Professional', 'Conversational', 'Educational'].map((t, i) => (
            <div key={t} className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${i === 0 ? 'bg-violet-600 border-violet-600 text-white' : 'bg-[#0a0a0f] border-[#2a2a3d] text-[#555570]'}`}>{t}</div>
          ))}
        </div>
        <div className="bg-violet-600 rounded-lg py-2 text-center text-white text-xs font-semibold mb-4">Generate Blog Post</div>
        <div className="bg-[#0d0d14] border border-[#2a2a3d] rounded-xl p-4 space-y-2">
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-5/6" />
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-3 bg-violet-500/20 rounded w-1/2 mt-3" />
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-4/5" />
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-emerald-400 text-xs">1,247 words generated</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockYouTubeUI() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-red-900/10">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        <span className="text-[#555570] text-xs ml-2">YouTube → Blog</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/20 flex items-center justify-center">
            <Play className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="text-white text-xs font-semibold">YouTube → Blog</div>
            <div className="text-[#555570] text-xs">Paste a video URL</div>
          </div>
        </div>
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2 text-[#c8c8d8] text-xs mb-3 flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-red-400 shrink-0" />
          youtube.com/watch?v=dQw4w9WgXcQ
        </div>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[#8888a8]">Transcript extracted — 4,200 words</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[#8888a8]">Rewriting as SEO blog post...</span>
          </div>
        </div>
        <div className="bg-[#0d0d14] border border-[#2a2a3d] rounded-xl p-3 space-y-2">
          <div className="text-violet-400 text-xs font-semibold">How to Rank #1 on Google in 2025 (Step-by-Step)</div>
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-4/5" />
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="flex gap-2 mt-2">
            <div className="text-xs bg-[#1a1a26] border border-[#2a2a3d] px-2 py-1 rounded-lg text-[#8888a8]">1,380 words</div>
            <div className="text-xs bg-emerald-600/10 border border-emerald-500/20 px-2 py-1 rounded-lg text-emerald-400">SEO: 84/100</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockUrlUI() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/10">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        <span className="text-[#555570] text-xs ml-2">URL → Blog</span>
      </div>
      <div className="p-5">
        <div className="text-[#555570] text-xs mb-1.5">Source URL</div>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-[#0a0a0f] border border-cyan-500/30 rounded-lg px-3 py-2 text-[#c8c8d8] text-xs truncate">
            moz.com/blog/local-seo-guide-2025
          </div>
          <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-400 text-xs font-semibold">
            Generate
          </div>
        </div>
        <div className="space-y-2 bg-[#0d0d14] border border-[#2a2a3d] rounded-xl p-4">
          <div className="text-xs text-[#8888a8] mb-2">Output preview</div>
          <div className="text-white text-xs font-bold">The Complete Local SEO Guide for Small Businesses (2025 Edition)</div>
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-5/6" />
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-3/4" />
          <div className="text-xs text-violet-400 mt-2 flex items-center gap-1">
            <ChevronRight className="w-3 h-3" /> Why Local SEO Matters in 2025
          </div>
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-4/5" />
        </div>
      </div>
    </div>
  )
}

function MockSeoUI() {
  const R = 50
  const C = 2 * Math.PI * R
  const HALF = C / 2
  const score = 84
  const fillLen = (score / 100) * HALF

  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex gap-4 text-xs">
        <span className="text-[#555570]">Preview</span>
        <span className="text-[#555570]">Edit</span>
        <span className="text-white border-b-2 border-violet-500 pb-0.5">SEO Meta</span>
        <span className="text-[#555570]">Social</span>
      </div>
      <div className="p-5 space-y-4">
        {/* Gauge */}
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4 flex flex-col items-center">
          <svg viewBox="0 0 140 82" width="160" height="94">
            <circle cx="70" cy="70" r={R} fill="none" stroke="#1a1a26" strokeWidth="12"
              strokeDasharray={`${HALF} ${HALF}`} strokeDashoffset={`${HALF}`} strokeLinecap="round" />
            <circle cx="70" cy="70" r={R} fill="none" stroke="#34d399" strokeWidth="12"
              strokeDasharray={`${fillLen} ${C - fillLen}`} strokeDashoffset={`${HALF}`} strokeLinecap="round" />
            <text x="70" y="62" textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="system-ui">{score}</text>
            <text x="70" y="76" textAnchor="middle" fill="#8888a8" fontSize="10" fontFamily="system-ui">/ 100</text>
            <text x="14" y="78" textAnchor="middle" fill="#555570" fontSize="9" fontFamily="system-ui">0</text>
            <text x="126" y="78" textAnchor="middle" fill="#555570" fontSize="9" fontFamily="system-ui">100</text>
          </svg>
          <p className="text-emerald-400 text-xs mt-1">Good — strong SEO foundation</p>
        </div>
        {/* Structure */}
        <div className="grid grid-cols-2 gap-2">
          {[['Words', '1,247', true], ['Headings', '9', true], ['Paragraphs', '18', true], ['Images', '1', true]].map(([l, v, ok]) => (
            <div key={l as string} className={`rounded-lg px-3 py-2 border ${ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[#2a2a3d] bg-[#12121a]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[#8888a8] text-xs">{l as string}</span>
                <span className="text-emerald-400 text-xs">✓</span>
              </div>
              <div className="text-white text-base font-bold">{v as string}</div>
            </div>
          ))}
        </div>
        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5">
          {[['local seo', '12x', true], ['google business', '8x', false], ['rankings', '6x', false], ['citations', '4x', false]].map(([w, c, focus]) => (
            <span key={w as string} className={`text-xs px-2 py-0.5 rounded-full border ${focus ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' : 'bg-[#1a1a26] border-[#2a2a3d] text-[#c8c8d8]'}`}>
              {w as string} <span className="opacity-50">{c as string}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockPublishUI() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        <span className="text-[#555570] text-xs ml-2">WordPress Publish</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4">
          <div className="text-[#8888a8] text-xs mb-2">Publishing to</div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-semibold">smithplumbing.com.au</span>
            <span className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Connected</span>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-[#2a2a3d] rounded-lg py-2 text-center text-white text-xs font-semibold">Draft</div>
            <div className="flex-1 bg-[#1a1a26] rounded-lg py-2 text-center text-[#555570] text-xs">Publish Live</div>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg py-2.5 text-center text-blue-300 text-xs font-semibold flex items-center justify-center gap-2">
            <Globe className="w-3.5 h-3.5" /> Send to WordPress as Draft
          </div>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
            <Globe className="w-4 h-4" /> Saved as Draft in WordPress
          </div>
          <a className="text-violet-400 text-xs">smithplumbing.com.au/?p=247 ↗</a>
        </div>
      </div>
    </div>
  )
}

function MockAutoblogUI() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const posts = [
    { day: 0, title: '5 Benefits of Pipe Relining', status: 'published' },
    { day: 2, title: 'How to Fix a Leaking Tap', status: 'published' },
    { day: 4, title: 'Emergency Plumbing Tips', status: 'queued' },
    { day: 6, title: 'Hot Water System Guide', status: 'queued' },
  ]
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex items-center justify-between">
        <span className="text-white text-xs font-semibold">Autoblog Queue — Smith Plumbing</span>
        <span className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Active</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((d, i) => {
            const post = posts.find(p => p.day === i)
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <span className="text-[#555570] text-xs">{d}</span>
                <div className={`w-full aspect-square rounded-lg text-xs flex items-center justify-center font-bold ${post?.status === 'published' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : post?.status === 'queued' ? 'bg-violet-500/20 border border-violet-500/30 text-violet-400' : 'bg-[#0a0a0f] border border-[#2a2a3d] text-[#2a2a3d]'}`}>
                  {post ? '✓' : '·'}
                </div>
              </div>
            )
          })}
        </div>
        <div className="space-y-2">
          {posts.map(p => (
            <div key={p.title} className="flex items-center gap-3 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.status === 'published' ? 'bg-emerald-400' : 'bg-violet-400'}`} />
              <span className="text-[#c8c8d8] text-xs flex-1 truncate">{p.title}</span>
              <span className={`text-xs ${p.status === 'published' ? 'text-emerald-400' : 'text-[#555570]'}`}>
                {p.status === 'published' ? 'Live' : 'Queued'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockSocialUI() {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden shadow-2xl shadow-pink-900/10">
      <div className="border-b border-[#2a2a3d] px-4 py-3 flex gap-4 text-xs">
        <span className="text-[#555570]">Preview</span>
        <span className="text-[#555570]">SEO</span>
        <span className="text-white border-b-2 border-violet-500 pb-0.5">Social</span>
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-4">
          {['LinkedIn', 'X / Twitter', 'Facebook'].map((p, i) => (
            <div key={p} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center border ${i === 0 ? 'bg-violet-600 border-violet-600 text-white' : 'bg-[#0a0a0f] border-[#2a2a3d] text-[#555570]'}`}>{p}</div>
          ))}
        </div>
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl p-4 space-y-2 mb-3">
          <div className="text-white text-xs font-semibold">🔑 7 reasons your clients are losing customers without local SEO.</div>
          <div className="h-2 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-5/6" />
          <div className="text-violet-400 text-xs mt-1">→ Read the full guide (link in comments)</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['#LocalSEO', '#DigitalMarketing', '#Agency'].map(tag => (
              <span key={tag} className="text-xs text-cyan-400">{tag}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center gap-1.5 text-xs text-[#8888a8] bg-[#1a1a26] border border-[#2a2a3d] px-3 py-1.5 rounded-lg">
            Copy to clipboard
          </div>
        </div>
      </div>
    </div>
  )
}
