import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = 'Eric at Bloggy <eric@bloggy.online>'
const BASE_URL = 'https://bloggy.online'

function base(content: string) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#0a0a0f;color:#e8e8f0;border-radius:16px;">
      <div style="margin-bottom:32px;">
        <img src="${BASE_URL}/logo.png" alt="Bloggy" style="height:32px;width:auto;" />
      </div>
      ${content}
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid #2a2a3d;">
        <p style="color:#555570;font-size:12px;margin:0;">© 2026 Boom Media · <a href="${BASE_URL}" style="color:#555570;">bloggy.online</a></p>
      </div>
    </div>
  `
}

export async function sendWelcomeEmail(email: string, plan = 'free') {
  if (!resend) return
  const isPaid = plan !== 'free'
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: isPaid
      ? `Welcome to Bloggy ${plan.replace('_', ' ')} — you're all set`
      : 'Welcome to Bloggy — here\'s how to get started',
    html: base(`
      <h1 style="font-size:22px;font-weight:700;color:white;margin:0 0 12px;">
        Welcome to Bloggy${isPaid ? ` ${plan.replace('_', ' ')}` : ''}! 🎉
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 28px;">
        You're ready to start generating SEO blog posts for your clients — in seconds, not hours.
        Here's how to get the most out of Bloggy:
      </p>
      <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:20px;margin-bottom:28px;">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;">
          <div style="background:#7c3aed22;color:#a78bfa;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">1</div>
          <div><strong style="color:white;font-size:14px;">Add a client</strong><br/><span style="color:#8888a8;font-size:13px;">Create a client profile with their name, industry, and brand voice.</span></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;">
          <div style="background:#7c3aed22;color:#a78bfa;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">2</div>
          <div><strong style="color:white;font-size:14px;">Generate a blog post</strong><br/><span style="color:#8888a8;font-size:13px;">Enter a topic or paste a URL — Bloggy writes an SEO-optimized post in under 30 seconds.</span></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="background:#7c3aed22;color:#a78bfa;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">3</div>
          <div><strong style="color:white;font-size:14px;">Connect WordPress & publish</strong><br/><span style="color:#8888a8;font-size:13px;">Add your client's WordPress credentials and publish directly from Bloggy.</span></div>
        </div>
      </div>
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Open Bloggy →
      </a>
    `),
  }).catch(console.error)
}

export async function sendUsageWarningEmail(email: string, used: number, limit: number, plan: string) {
  if (!resend) return
  const pct = Math.round((used / limit) * 100)
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You've used ${pct}% of your Bloggy posts this month`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        Heads up — you're at ${pct}% of your monthly posts
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        You've generated <strong style="color:white;">${used} of ${limit} posts</strong> this month on the
        <strong style="color:white;">${plan.replace('_', ' ')} plan</strong>.
        Upgrade now to keep publishing without interruption.
      </p>
      <a href="${BASE_URL}/billing" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-right:12px;">
        Upgrade Plan →
      </a>
      <a href="${BASE_URL}/dashboard" style="display:inline-block;color:#a78bfa;font-weight:600;font-size:15px;padding:14px 0;text-decoration:none;">
        Keep generating
      </a>
    `),
  }).catch(console.error)
}

export async function sendLimitReachedEmail(email: string, limit: number, plan: string) {
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You've hit your Bloggy post limit for this month`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        You've used all ${limit} posts for this month
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Your <strong style="color:white;">${plan.replace('_', ' ')} plan</strong> includes ${limit} posts per month.
        Upgrade to keep generating — your limit resets at the start of next month.
      </p>
      <a href="${BASE_URL}/billing" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Upgrade Now →
      </a>
    `),
  }).catch(console.error)
}

export async function sendPlanUpgradeEmail(email: string, plan: string) {
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You're now on Bloggy ${plan.replace('_', ' ')} — welcome!`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        You're on ${plan.replace('_', ' ')} now 🚀
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Your plan has been upgraded. Your new limits are active immediately —
        head back to Bloggy and keep publishing.
      </p>
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Back to Bloggy →
      </a>
    `),
  }).catch(console.error)
}

export async function sendCancellationEmail(email: string) {
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Bloggy subscription has been canceled',
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        Your subscription has been canceled
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Your Bloggy subscription has been canceled. You'll keep access until the end of your current billing period,
        after which your account will revert to the free plan (2 posts/month).
      </p>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        If this was a mistake or you'd like to come back, just resubscribe anytime.
      </p>
      <a href="${BASE_URL}/billing" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Resubscribe →
      </a>
    `),
  }).catch(console.error)
}

export async function sendAutoblogFailureEmail(
  email: string,
  failures: { topic: string; clientName: string; error: string }[]
) {
  if (!resend || !failures.length) return
  const rows = failures.map(f => `
    <tr>
      <td style="padding:8px 0;color:#c8c8d8;font-size:13px;">${f.clientName}</td>
      <td style="padding:8px 0;color:#c8c8d8;font-size:13px;">${f.topic}</td>
      <td style="padding:8px 0;color:#f87171;font-size:12px;font-family:monospace;">${f.error}</td>
    </tr>`).join('')
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `⚠️ ${failures.length} autoblog job${failures.length > 1 ? 's' : ''} failed`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 8px;">Autoblog failure alert</h1>
      <p style="color:#8888a8;font-size:14px;line-height:1.6;margin:0 0 20px;">
        ${failures.length} scheduled post${failures.length > 1 ? 's' : ''} failed during the last autoblog run.
        Check the <a href="${BASE_URL}/admin?tab=health" style="color:#a78bfa;">admin health tab</a> for details.
      </p>
      <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;padding:16px;">
          <thead>
            <tr style="border-bottom:1px solid #2a2a3d;">
              <th style="text-align:left;padding:10px 16px;color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Client</th>
              <th style="text-align:left;padding:10px 16px;color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Topic</th>
              <th style="text-align:left;padding:10px 16px;color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Error</th>
            </tr>
          </thead>
          <tbody style="padding:0 16px;">${rows}</tbody>
        </table>
      </div>
      <a href="${BASE_URL}/admin?tab=health" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none;">
        View in Admin →
      </a>
    `),
  }).catch(console.error)
}

export async function sendWeeklyClientDigestEmail(
  email: string,
  clientName: string,
  posts: { title: string; url: string | null; wordCount: number; publishedAt: string; status?: string }[]
) {
  if (!resend || !posts.length) return
  const week = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const postRows = posts.map(p => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #2a2a3d;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="flex:1;">
            ${p.url
              ? `<a href="${p.url}" style="color:#a78bfa;text-decoration:none;font-size:14px;font-weight:500;">${p.title}</a>`
              : `<span style="color:#c8c8d8;font-size:14px;">${p.title}</span>`
            }
            <div style="color:#555570;font-size:12px;margin-top:2px;">${p.wordCount.toLocaleString()} words · ${new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
          <span style="display:inline-block;background:#34d39922;color:#34d399;font-size:11px;font-weight:600;padding:4px 10px;border-radius:4px;margin-left:12px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">✓ Live</span>
        </div>
      </td>
    </tr>`).join('')

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${posts.length} new post${posts.length > 1 ? 's' : ''} published for ${clientName} this week`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 4px;">Weekly content update</h1>
      <p style="color:#8888a8;font-size:14px;margin:0 0 20px;">Week of ${week} · ${clientName}</p>
      <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">${postRows}</table>
      </div>
      <p style="color:#555570;font-size:12px;margin:0;">
        Powered by <a href="${BASE_URL}" style="color:#555570;">Bloggy</a>
      </p>
    `),
  }).catch(console.error)
}

export async function sendDay3NudgeEmail(email: string, firstName: string | null) {
  if (!resend) return
  const name = firstName ? firstName.split(' ')[0] : null
  const greeting = name ? `Hey ${name}` : 'Hey'
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Still figuring out Bloggy? Let me help.',
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        ${greeting} — you signed up a few days ago and I wanted to check in.
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 20px;">
        You have <strong style="color:white;">2 free blog posts</strong> waiting for you in Bloggy — no credit card needed.
        Each one is a full SEO-optimized article, published directly to WordPress in under 30 seconds.
      </p>
      <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#a78bfa;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Here's what to do first:</p>
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
          <div style="background:#7c3aed22;color:#a78bfa;min-width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">1</div>
          <div style="color:#c8c8d8;font-size:14px;"><strong style="color:white;">Add a client</strong> — just a name and industry is enough to start</div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
          <div style="background:#7c3aed22;color:#a78bfa;min-width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">2</div>
          <div style="color:#c8c8d8;font-size:14px;"><strong style="color:white;">Type a topic</strong> — e.g. "5 tips for choosing a contractor in Miami"</div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <div style="background:#7c3aed22;color:#a78bfa;min-width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">3</div>
          <div style="color:#c8c8d8;font-size:14px;"><strong style="color:white;">Hit Generate</strong> — a full post is ready in ~20 seconds</div>
        </div>
      </div>
      <p style="color:#8888a8;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Most agencies that try it end up billing $150–$400/mo per client for blog content.
        Your tool cost at the Starter plan is <strong style="color:white;">$9.80 per client</strong>.
      </p>
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Use my free posts →
      </a>
      <p style="color:#555570;font-size:12px;margin:16px 0 0;">
        Questions? Just reply to this email — I read every one. — Eric, Boom Media
      </p>
    `),
  }).catch(console.error)
}

export async function sendUpsellEmail(email: string, firstName: string | null, postsUsed: number, postsLimit: number) {
  if (!resend) return
  const name = firstName ? firstName.split(' ')[0] : null
  const greeting = name ? `Hey ${name}` : 'Hey'
  const usagePct = Math.round((postsUsed / postsLimit) * 100)
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You've used ${usagePct}% of your free posts — here's how to scale up`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        ${greeting} — you're getting value from Bloggy. Let's 10x it.
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 20px;">
        You've used <strong style="color:white;">${postsUsed} of your ${postsLimit} free posts</strong>.
        Agencies on paid plans generate 25–200 posts a month and bill clients $150–$400/mo each for the content.
      </p>
      <div style="background:#12121a;border:1px solid #7c3aed44;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#a78bfa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 14px;">Early access pricing — 50% off for 1 year</p>
        ${[
          { name: 'Freelancer Starter', price: 49, discounted: 24.50, sites: 5 },
          { name: 'Growth', price: 99, discounted: 49.50, sites: 15 },
          { name: 'Agency', price: 149, discounted: 74.50, sites: 40 },
        ].map(p => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #2a2a3d;">
            <div>
              <span style="color:white;font-size:14px;font-weight:600;">${p.name}</span>
              <span style="color:#555570;font-size:12px;margin-left:8px;">${p.sites} clients</span>
            </div>
            <div style="text-align:right;">
              <span style="color:#34d399;font-size:14px;font-weight:700;">$${p.discounted}/mo</span>
              <span style="color:#555570;font-size:11px;text-decoration:line-through;margin-left:6px;">$${p.price}</span>
            </div>
          </div>
        `).join('')}
        <p style="color:#555570;font-size:12px;margin:12px 0 0;">Discount auto-applied at checkout · First ${20} members only</p>
      </div>
      <a href="${BASE_URL}/billing?coupon=sn28Uv8i" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Claim 50% off — upgrade now →
      </a>
      <p style="color:#555570;font-size:12px;margin:16px 0 0;">
        Cancel anytime · No contracts · — Eric, Boom Media
      </p>
    `),
  }).catch(console.error)
}

export async function sendApprovalRequestEmail(
  clientEmail: string,
  clientName: string,
  postTitle: string,
  approvalUrl: string
) {
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: `Your blog post is ready for review — "${postTitle}"`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        Your blog post is ready for review
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 8px;">
        Hi ${clientName},
      </p>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        We've written a new blog post for you and it's ready for your approval:
      </p>
      <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:white;font-size:16px;font-weight:600;margin:0;">${postTitle}</p>
      </div>
      <p style="color:#8888a8;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Click the button below to read the post and either approve it for publishing or request revisions.
        No account needed — just click the link.
      </p>
      <a href="${approvalUrl}" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Review &amp; Approve Post →
      </a>
      <p style="color:#555570;font-size:12px;margin:20px 0 0;">
        Questions? Reply to this email and we'll get back to you. — Boom Media
      </p>
    `),
  }).catch(console.error)
}

export async function sendApprovalNotificationEmail(
  staffEmail: string,
  clientName: string,
  postTitle: string,
  status: 'approved' | 'revision_requested',
  feedback?: string
) {
  if (!resend) return
  const isApproved = status === 'approved'
  await resend.emails.send({
    from: FROM,
    to: staffEmail,
    subject: isApproved
      ? `✅ ${clientName} approved "${postTitle}"`
      : `✏️ ${clientName} requested revisions on "${postTitle}"`,
    html: base(`
      <h1 style="font-size:20px;font-weight:700;color:white;margin:0 0 12px;">
        ${isApproved ? '✅ Post approved' : '✏️ Revisions requested'}
      </h1>
      <p style="color:#8888a8;font-size:15px;line-height:1.7;margin:0 0 8px;">
        <strong style="color:white;">${clientName}</strong> has reviewed <strong style="color:white;">"${postTitle}"</strong>.
      </p>
      ${isApproved
        ? `<p style="color:#34d399;font-size:15px;font-weight:600;margin:16px 0;">The post has been approved and is ready to publish.</p>`
        : `<div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:16px;margin:16px 0;">
            <p style="color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Client Feedback</p>
            <p style="color:#c8c8d8;font-size:14px;line-height:1.6;margin:0;">${feedback ?? 'No feedback provided.'}</p>
          </div>`
      }
      <a href="${BASE_URL}/posts" style="display:inline-block;background:#7c3aed;color:white;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none;">
        View in Bloggy →
      </a>
    `),
  }).catch(console.error)
}

export async function sendMonthlyDigestEmail(
  email: string,
  data: {
    plan: string
    postsThisMonth: number
    postsLimit: number
    wordsThisMonth: number
    totalPosts: number
    topClients: { name: string; posts: number }[]
  }
) {
  if (!resend) return
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const usagePct = Math.round((data.postsThisMonth / data.postsLimit) * 100)
  const clientRows = data.topClients.map(c =>
    `<tr><td style="padding:6px 0;color:#c8c8d8;">${c.name}</td><td style="padding:6px 0;color:#8888a8;text-align:right;">${c.posts} posts</td></tr>`
  ).join('')

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your Bloggy digest for ${month}`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;color:white;margin:0 0 4px;">Your ${month} digest</h1>
      <p style="color:#8888a8;margin:0 0 28px;font-size:14px;">Here's what Bloggy generated for you this month.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:16px;">
          <div style="color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Posts Generated</div>
          <div style="color:white;font-size:28px;font-weight:800;">${data.postsThisMonth}</div>
          <div style="color:#555570;font-size:11px;">of ${data.postsLimit} this month (${usagePct}%)</div>
        </div>
        <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:16px;">
          <div style="color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Words Written</div>
          <div style="color:white;font-size:28px;font-weight:800;">${(data.wordsThisMonth / 1000).toFixed(1)}k</div>
          <div style="color:#555570;font-size:11px;">this month</div>
        </div>
      </div>
      ${data.topClients.length > 0 ? `
      <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="color:#8888a8;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Top Clients</div>
        <table style="width:100%;border-collapse:collapse;">${clientRows}</table>
      </div>` : ''}
      <div style="background:#1a1a2e;border:1px solid #2a2a3d;border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="color:#8888a8;font-size:12px;">All-time total</div>
        <div style="color:white;font-size:18px;font-weight:700;">${data.totalPosts} posts generated</div>
      </div>
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#7c3aed;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
        Generate more posts →
      </a>
    `),
  }).catch(console.error)
}
