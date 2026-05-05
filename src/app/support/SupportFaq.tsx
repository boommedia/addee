'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const FAQS = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Bloggy and who is it for?',
        a: 'Bloggy is an AI blog automation platform built specifically for digital marketing agencies. It lets you generate, optimize, and publish SEO blog posts to WordPress for all your clients — from one dashboard. If you manage content for multiple clients and want to scale output without hiring more writers, Bloggy is for you.',
      },
      {
        q: 'Do I need technical skills to use Bloggy?',
        a: 'No. If you can log into WordPress and copy-paste a password, you can use Bloggy. Connecting a client site takes about 2 minutes. Generating a post takes 15 seconds. There\'s no code, no setup complexity — just add clients and start generating.',
      },
      {
        q: 'How do I try Bloggy before paying?',
        a: 'Every account starts with 2 free posts and 2 client sites — no credit card required. You can generate posts, publish to WordPress, and test the full workflow before upgrading to a paid plan.',
      },
      {
        q: 'Can I use Bloggy for my own website or just client sites?',
        a: 'Both. Many users add their own agency website as one of their client sites. You get the same AI generation, WordPress publishing, and brand voice settings — treat yourself like a client.',
      },
    ],
  },
  {
    category: 'Content & Quality',
    questions: [
      {
        q: 'Does Bloggy generate unique content or duplicate content?',
        a: 'Every post is generated fresh from scratch by Claude (Anthropic\'s AI). No templates, no spinning, no recycled content. Each post is unique based on your topic, client brand voice, keywords, and settings. Google treats it as original content.',
      },
      {
        q: 'How long are the generated posts?',
        a: 'You choose from three lengths: Short (400–600 words), Medium (800–1,200 words), or Long (1,500–2,500 words). We recommend Medium or Long for SEO purposes. Every post includes an H1, H2/H3 subheadings, a conclusion, and a call to action.',
      },
      {
        q: 'Can I edit posts before publishing?',
        a: 'Yes. Every generated post opens in a live markdown editor. You can edit, rewrite, or adjust anything before publishing. Word count updates in real time. You can also regenerate sections or the full post if you\'re not happy with it.',
      },
      {
        q: 'What languages does Bloggy support?',
        a: 'Bloggy can generate content in any language Claude supports — including English, Spanish, French, German, Portuguese, Dutch, Italian, and more. Just specify the language in your topic or brand voice settings.',
      },
    ],
  },
  {
    category: 'WordPress & Publishing',
    questions: [
      {
        q: 'Which WordPress version is required?',
        a: 'WordPress 5.6 or higher (Application Passwords were introduced in 5.6). Hosted on WordPress.com Free plans may not support Application Passwords — self-hosted or Business/Pro plans work best.',
      },
      {
        q: 'Which SEO plugins does Bloggy support?',
        a: 'Bloggy pushes SEO meta fields compatible with SmartCrawl, Yoast SEO, and Rank Math. The meta title, description, and focus keyword are all written by AI and sent on publish. If you\'re using a different SEO plugin, the meta may not populate automatically.',
      },
      {
        q: 'Can I publish to multiple WordPress sites?',
        a: 'Yes — that\'s the core use case. Each client has their own WordPress credentials in Bloggy. You can generate a post for Client A and publish it to their site, then do the same for Client B, all from one dashboard. Plans vary by number of client sites (5 on Freelancer Starter, up to 150 on Agency Max).',
      },
      {
        q: 'Why is my WordPress connection failing?',
        a: 'The three most common causes: (1) Application Passwords are disabled by your host — check your WP host\'s security settings. (2) The URL has a typo or trailing slash issue — use https://yoursite.com with no trailing slash. (3) A security plugin like Wordfence is blocking Bloggy\'s IP — whitelist it or temporarily disable REST API protection.',
      },
    ],
  },
  {
    category: 'Plans & Billing',
    questions: [
      {
        q: 'What happens if I reach my monthly post limit?',
        a: 'Bloggy will block further generation until the next billing month starts (or you upgrade). The nav shows your remaining posts at all times so you\'re never surprised. Upgrading instantly increases your limit — prorated for the current month.',
      },
      {
        q: 'Can I upgrade or downgrade my plan anytime?',
        a: 'Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the start of your next billing cycle. You can also cancel anytime via the Stripe customer portal — no penalty, no minimum term.',
      },
      {
        q: 'What\'s the difference between the plans?',
        a: 'Freelancer Starter ($49): 5 clients, 20 posts/mo, core generation + WordPress publish. Growth ($99): 15 clients, 60 posts/mo, adds AutoBlog, AI hero images, team collab, URL/YouTube to blog. Agency ($149): 40 clients, 175 posts/mo, adds LocalFalcon rankings, white-label portal, client reports. Agency Max ($299): up to 150 clients, 500 posts/mo, adds white-label domain, custom integrations, 24/7 support.',
      },
      {
        q: 'Do you offer discounts for annual billing?',
        a: 'We periodically offer early-access discounts and coupon codes. Join our Discord or watch for announcements on the billing page. Enter a promo code in the Promo Code field on the Billing page before subscribing.',
      },
    ],
  },
  {
    category: 'Features & Integrations',
    questions: [
      {
        q: 'What is AutoBlog and how does it work?',
        a: 'AutoBlog is Bloggy\'s set-and-forget publishing engine. You queue topics for each client, set a publish date/time for each, and Bloggy generates and publishes the post automatically when the time comes. No login required. You can queue weeks or months of content in advance.',
      },
      {
        q: 'Can team members use my Bloggy account?',
        a: 'Yes. On any paid plan you can invite team members via Settings → Team. They get access to all your clients and can generate and publish posts. Billing and settings remain owner-only. There\'s no limit on team member count.',
      },
      {
        q: 'What is the Rankings History Pro add-on?',
        a: 'Rankings History Pro ($19/mo) adds weekly automated Google rank tracking for all client target keywords. It shows current position, position change (↑↓), trend sparklines, and keeps a full history of every check. It runs automatically every Monday with no manual clicks needed.',
      },
      {
        q: 'Does Bloggy integrate with Google Analytics or Search Console?',
        a: 'Not directly yet — these integrations are on the roadmap. Currently Bloggy tracks production analytics (posts, words, quality scores) and SERP rankings via DataForSEO. Google Search Console integration is planned for 2025 and will pull real impressions and clicks per post.',
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#2a2a3d] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:text-white transition-colors"
      >
        <span className={`text-sm font-medium leading-relaxed ${open ? 'text-white' : 'text-[#c8c8d8]'}`}>{q}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-[#555570] shrink-0 mt-0.5" />
          : <ChevronRight className="w-4 h-4 text-[#555570] shrink-0 mt-0.5" />
        }
      </button>
      {open && (
        <p className="text-[#8888a8] text-sm leading-relaxed pb-4">{a}</p>
      )}
    </div>
  )
}

export default function SupportFaq() {
  return (
    <div className="space-y-6">
      {FAQS.map(section => (
        <div key={section.category} className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-[#2a2a3d] bg-[#0d0d15]">
            <span className="text-[#8888a8] text-xs font-bold uppercase tracking-wider">{section.category}</span>
          </div>
          <div className="px-6">
            {section.questions.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
