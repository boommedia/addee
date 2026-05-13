import { cookies } from 'next/headers'
import { createHmac } from 'crypto'
import Logo from '@/components/Logo'

function expectedToken(): string {
  const password = process.env.INVESTOR_PAGE_PASSWORD ?? ''
  const secret = process.env.INVESTOR_PAGE_SECRET ?? ''
  return createHmac('sha256', secret).update(password).digest('hex')
}

async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get('investor_auth')?.value
  return token === expectedToken()
}

// ─── Password gate ────────────────────────────────────────────────────────────

function PasswordGate({ error }: { error: boolean }) {
  return (
    <div className="min-h-screen bg-[#0a0900] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo className="h-9 mx-auto mb-4" />
          <h1 className="text-white font-bold text-lg">Investor Overview</h1>
          <p className="text-[#8888a8] text-sm mt-1">This page is password protected.</p>
        </div>

        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl p-8">
          <form method="POST" action="/api/investors/auth" className="space-y-4">
            <div>
              <label className="block text-[#8888a8] text-xs font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                autoFocus
                autoComplete="current-password"
                className="w-full bg-[#0a0900] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#555570] focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Enter access password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
                Incorrect password. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              View Investor Materials
            </button>
          </form>
        </div>

        <p className="text-[#3a3a5a] text-xs text-center mt-6">
          Bloggy by Boom Media · Confidential
        </p>
      </div>
    </div>
  )
}

// ─── Full investor content ────────────────────────────────────────────────────

function InvestorContent() {
  const labelClass = 'text-[#8888a8] text-xs font-semibold uppercase tracking-widest'
  const tdBase = 'px-4 py-3 text-sm text-[#c8c8d8] border-b border-[#1a1a26]'
  const thBase = 'px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#8888a8] bg-[#0d0d16] border-b border-[#2a2a3d]'

  return (
    <div className="min-h-screen bg-[#0a0900] text-[#e8e8f0]">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-12 pb-6 border-b border-[#2a2a3d]">
          <div className="flex items-center gap-3 mb-4">
            <Logo className="h-9" />
            <span className="bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Confidential
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Cost &amp; Profit Analysis</h1>
          <p className="text-[#8888a8] text-sm">
            Full breakdown of operating costs vs revenue across all plans, credits, and add-ons.
            Last updated: April 2026.
          </p>
        </div>

        {/* Platform Summary */}
        <Section title="Platform Summary" sub="Estimated at 20 active clients / 500 posts per month">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard label="Est. Monthly Revenue" value="$1,980" sub="20 clients × avg $99/mo" color="text-emerald-400" />
            <StatCard label="Claude API Cost / mo" value="$17.50" sub="500 posts × $0.035" color="text-violet-400" />
            <StatCard label="Infrastructure / mo" value="~$65" sub="Vercel + Supabase + Resend" color="text-amber-400" />
            <StatCard label="Gross Margin" value="~95%" sub="After API + infra" color="text-emerald-400" />
          </div>
        </Section>

        {/* Base Plans */}
        <Section title="Base Plan Margins" sub="Claude Sonnet 4.6 at ~$0.035/post (with prompt caching, real cost closer to $0.020–$0.025). Infrastructure amortized across user base.">
          <Table headers={['Plan', 'Price / mo', 'Posts', 'Sites', 'Claude API Cost', 'Infrastructure', 'Gross Profit', 'Margin']}>
            <tr>
              <td className={tdBase}><strong className="text-cyan-400">Starter</strong></td>
              <td className={`${tdBase} font-bold`}>$49</td>
              <td className={tdBase}>20</td>
              <td className={tdBase}>5</td>
              <td className={`${tdBase} text-[#555570]`}>$0.70</td>
              <td className={`${tdBase} text-[#555570]`}>~$2</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$46</td>
              <td className={tdBase}><Tag color="green">94%</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong className="text-violet-400">Growth</strong></td>
              <td className={`${tdBase} font-bold`}>$99</td>
              <td className={tdBase}>40</td>
              <td className={tdBase}>10</td>
              <td className={`${tdBase} text-[#555570]`}>$1.40</td>
              <td className={`${tdBase} text-[#555570]`}>~$2</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$96</td>
              <td className={tdBase}><Tag color="green">97%</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong className="text-cyan-300">Agency</strong></td>
              <td className={`${tdBase} font-bold`}>$199</td>
              <td className={tdBase}>80</td>
              <td className={tdBase}>20</td>
              <td className={`${tdBase} text-[#555570]`}>$2.80</td>
              <td className={`${tdBase} text-[#555570]`}>~$2</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$194</td>
              <td className={tdBase}><Tag color="green">97%</Tag></td>
            </tr>
            <tr>
              <td className={`${tdBase} border-b-0`}><strong className="text-emerald-400">Agency Max</strong></td>
              <td className={`${tdBase} font-bold border-b-0`}>$299</td>
              <td className={`${tdBase} border-b-0`}>160</td>
              <td className={`${tdBase} border-b-0`}>40</td>
              <td className={`${tdBase} text-[#555570] border-b-0`}>$5.60</td>
              <td className={`${tdBase} text-[#555570] border-b-0`}>~$2</td>
              <td className={`${tdBase} font-bold text-emerald-400 border-b-0`}>~$291</td>
              <td className={`${tdBase} border-b-0`}><Tag color="green">97%</Tag></td>
            </tr>
          </Table>
        </Section>

        {/* Annual Billing */}
        <Section title="Annual Billing (20% discount)" sub="Annual billing improves cash flow and reduces churn. Your cost doesn't change — only revenue is discounted.">
          <Table headers={['Plan', 'Monthly Price', 'Annual Monthly Equiv.', 'Annual Total', 'Your Cost / yr', 'Annual Profit']}>
            <tr>
              <td className={tdBase}><strong className="text-cyan-400">Starter</strong></td>
              <td className={tdBase}>$49/mo</td>
              <td className={tdBase}>$39/mo</td>
              <td className={`${tdBase} font-bold`}>$468</td>
              <td className={`${tdBase} text-[#555570]`}>~$32</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$436</td>
            </tr>
            <tr>
              <td className={tdBase}><strong className="text-violet-400">Growth</strong></td>
              <td className={tdBase}>$99/mo</td>
              <td className={tdBase}>$79/mo</td>
              <td className={`${tdBase} font-bold`}>$948</td>
              <td className={`${tdBase} text-[#555570]`}>~$41</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$907</td>
            </tr>
            <tr>
              <td className={tdBase}><strong className="text-cyan-300">Agency</strong></td>
              <td className={tdBase}>$199/mo</td>
              <td className={tdBase}>$159/mo</td>
              <td className={`${tdBase} font-bold`}>$1,908</td>
              <td className={`${tdBase} text-[#555570]`}>~$58</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$1,850</td>
            </tr>
            <tr>
              <td className={`${tdBase} border-b-0`}><strong className="text-emerald-400">Agency Max</strong></td>
              <td className={`${tdBase} border-b-0`}>$299/mo</td>
              <td className={`${tdBase} border-b-0`}>$239/mo</td>
              <td className={`${tdBase} font-bold border-b-0`}>$2,868</td>
              <td className={`${tdBase} text-[#555570] border-b-0`}>~$91</td>
              <td className={`${tdBase} font-bold text-emerald-400 border-b-0`}>~$2,777</td>
            </tr>
          </Table>
        </Section>

        {/* Power Credits */}
        <Section title="Power Credits Margins" sub="Credits are sold at a significant markup over API cost — this is pure high-margin revenue.">
          <Table headers={['Pack', 'Price', 'Per Credit', 'Extra Post (1cr) Cost', 'Opus 4.7 (3cr) Cost', 'Extra Post Margin', 'Opus Margin']}>
            <tr>
              <td className={tdBase}><strong>Starter Pack</strong> — 10cr</td>
              <td className={`${tdBase} font-bold`}>$7</td>
              <td className={tdBase}>$0.70</td>
              <td className={`${tdBase} text-[#555570]`}>$0.035</td>
              <td className={`${tdBase} text-[#555570]`}>$0.20</td>
              <td className={tdBase}><Tag color="green">95%</Tag></td>
              <td className={tdBase}><Tag color="green">71%</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Power Pack</strong> — 50cr</td>
              <td className={`${tdBase} font-bold`}>$29</td>
              <td className={tdBase}>$0.58</td>
              <td className={`${tdBase} text-[#555570]`}>$0.035</td>
              <td className={`${tdBase} text-[#555570]`}>$0.20</td>
              <td className={tdBase}><Tag color="green">94%</Tag></td>
              <td className={tdBase}><Tag color="green">66%</Tag></td>
            </tr>
            <tr>
              <td className={`${tdBase} border-b-0`}><strong>Agency Pack</strong> — 150cr</td>
              <td className={`${tdBase} font-bold border-b-0`}>$69</td>
              <td className={`${tdBase} border-b-0`}>$0.46</td>
              <td className={`${tdBase} text-[#555570] border-b-0`}>$0.035</td>
              <td className={`${tdBase} text-[#555570] border-b-0`}>$0.20</td>
              <td className={`${tdBase} border-b-0`}><Tag color="green">92%</Tag></td>
              <td className={`${tdBase} border-b-0`}><Tag color="green">57%</Tag></td>
            </tr>
          </Table>
        </Section>

        {/* Add-ons */}
        <Section title="Add-on Margins" sub="Most add-ons have near-zero variable cost — margin is exceptional across the board except one.">
          <Table headers={['Add-on', 'Price', 'Your Cost / mo', 'Gross Profit', 'Margin', 'Status']}>
            <tr>
              <td className={tdBase}><strong>Rankings History Pro</strong></td>
              <td className={`${tdBase} font-bold`}>$19</td>
              <td className={`${tdBase} text-[#555570]`}>$0.60–$6 (DataForSEO)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>$13–$18</td>
              <td className={tdBase}><Tag color="green">68–97%</Tag></td>
              <td className={tdBase}><Tag color="green">Live</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Branded Monthly Reports</strong></td>
              <td className={`${tdBase} font-bold`}>$19</td>
              <td className={`${tdBase} text-[#555570]`}>~$0.20 (Claude call)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$19</td>
              <td className={tdBase}><Tag color="green">99%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q3 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Social Media Autopilot</strong></td>
              <td className={`${tdBase} font-bold`}>$19</td>
              <td className={`${tdBase} text-[#555570]`}>~$0.80 (Claude calls)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$18</td>
              <td className={tdBase}><Tag color="green">96%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q3 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>White-label Client Portal</strong></td>
              <td className={`${tdBase} font-bold`}>$29</td>
              <td className={`${tdBase} text-[#555570]`}>~$0</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$29</td>
              <td className={tdBase}><Tag color="green">~100%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q3 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Competitor Gap Analysis</strong></td>
              <td className={`${tdBase} font-bold`}>$29</td>
              <td className={`${tdBase} text-[#555570]`}>$2–5 (DataForSEO)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>$24–$27</td>
              <td className={tdBase}><Tag color="green">83–93%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q4 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Client Approval Workflow</strong></td>
              <td className={`${tdBase} font-bold`}>$29</td>
              <td className={`${tdBase} text-[#555570]`}>~$0.10 (email)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$29</td>
              <td className={tdBase}><Tag color="green">99%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q4 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Video Script Generator</strong></td>
              <td className={`${tdBase} font-bold`}>$19</td>
              <td className={`${tdBase} text-[#555570]`}>~$0.10 (Claude call)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$19</td>
              <td className={tdBase}><Tag color="green">99%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q4 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Email Newsletter Digest</strong></td>
              <td className={`${tdBase} font-bold`}>$19</td>
              <td className={`${tdBase} text-[#555570]`}>~$0.20 (Claude + Resend)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$19</td>
              <td className={tdBase}><Tag color="green">99%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q4 2026</Tag></td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Search Console Sync</strong></td>
              <td className={`${tdBase} font-bold`}>$19</td>
              <td className={`${tdBase} text-[#555570]`}>~$0 (GSC API free)</td>
              <td className={`${tdBase} font-bold text-emerald-400`}>~$19</td>
              <td className={tdBase}><Tag color="green">~100%</Tag></td>
              <td className={tdBase}><Tag color="amber">Q1 2027</Tag></td>
            </tr>
            <tr className="bg-red-950/20">
              <td className={`${tdBase} border-b-0`}><strong className="text-red-400">AI Image Pack ⚠️</strong></td>
              <td className={`${tdBase} font-bold text-red-400 border-b-0`}>$9</td>
              <td className={`${tdBase} text-red-400 border-b-0`}>$0.48–$19.20 (DALL-E 3)</td>
              <td className={`${tdBase} text-red-400 border-b-0`}>-$10.20 to $8.52</td>
              <td className={`${tdBase} border-b-0`}><Tag color="red">Loss risk</Tag></td>
              <td className={`${tdBase} border-b-0`}><Tag color="amber">Q4 2026</Tag></td>
            </tr>
          </Table>

          <Alert type="warn" title="AI Image Pack is underpriced for heavy users">
            At $9/mo flat, Agency Max users generating 160 posts × 3 images = 480 images × $0.04 = <strong className="text-red-400">$19.20 in DALL-E costs</strong> — a $10+ loss per user.
            <br /><br />
            <strong>Fix options:</strong> (A) Cap at 20 images/mo then $0.50/image after. (B) Price per post ($0.25 extra/post). (C) Use Flux via Replicate ($0.003/image) instead of DALL-E 3 — reduces cost 13×.
          </Alert>
        </Section>

        {/* Infrastructure */}
        <Section title="Fixed Infrastructure Costs" sub="Monthly fixed costs regardless of user count (within free/lower tiers).">
          <Table headers={['Service', 'What It Does', 'Current Tier', 'Cost / mo', 'Scales At']}>
            <tr>
              <td className={tdBase}><strong>Vercel</strong></td>
              <td className={`${tdBase} text-[#8888a8]`}>Hosting, CDN, edge functions</td>
              <td className={tdBase}>Pro</td>
              <td className={`${tdBase} font-bold text-amber-400`}>$20</td>
              <td className={`${tdBase} text-[#555570]`}>High traffic / team seats</td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Supabase</strong></td>
              <td className={`${tdBase} text-[#8888a8]`}>Postgres DB + Auth</td>
              <td className={tdBase}>Pro</td>
              <td className={`${tdBase} font-bold text-amber-400`}>$25</td>
              <td className={`${tdBase} text-[#555570]`}>&gt;8GB storage or high bandwidth</td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Resend</strong></td>
              <td className={`${tdBase} text-[#8888a8]`}>Transactional email</td>
              <td className={tdBase}>Free / Pro</td>
              <td className={`${tdBase} font-bold text-amber-400`}>$0–$20</td>
              <td className={`${tdBase} text-[#555570]`}>&gt;3,000 emails/mo</td>
            </tr>
            <tr>
              <td className={tdBase}><strong>DataForSEO</strong></td>
              <td className={`${tdBase} text-[#8888a8]`}>Rankings &amp; SERP data</td>
              <td className={tdBase}>Pay-per-use</td>
              <td className={`${tdBase} font-bold text-amber-400`}>~$5–50</td>
              <td className={`${tdBase} text-[#555570]`}>Per API call (~$0.003/check)</td>
            </tr>
            <tr>
              <td className={tdBase}><strong>Anthropic (Claude)</strong></td>
              <td className={`${tdBase} text-[#8888a8]`}>AI generation &amp; rewrites</td>
              <td className={tdBase}>Pay-per-use</td>
              <td className={`${tdBase} font-bold text-amber-400`}>~$0.035/post</td>
              <td className={`${tdBase} text-[#555570]`}>Linear with usage</td>
            </tr>
            <tr>
              <td className={tdBase}><strong>OpenAI (DALL-E 3)</strong></td>
              <td className={`${tdBase} text-[#8888a8]`}>AI image generation</td>
              <td className={tdBase}>Pay-per-use</td>
              <td className={`${tdBase} font-bold text-amber-400`}>$0.04/image</td>
              <td className={`${tdBase} text-[#555570]`}>Linear with usage</td>
            </tr>
            <tr className="border-t-2 border-[#2a2a3d]">
              <td className={`${tdBase} border-b-0 font-bold text-white`}>Total Fixed</td>
              <td className={`${tdBase} border-b-0`}></td>
              <td className={`${tdBase} border-b-0`}></td>
              <td className={`${tdBase} font-bold text-emerald-400 border-b-0`}>~$65–115/mo</td>
              <td className={`${tdBase} text-[#555570] border-b-0`}>Before variable API usage</td>
            </tr>
          </Table>
        </Section>

        {/* Break-even */}
        <Section title="Break-even Analysis" sub="How many paying users you need to cover infrastructure costs.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Break-even (Starter users)" value="2–3" sub="$65 infra ÷ $46 margin = 1.4 users" color="text-amber-400" />
            <StatCard label="Break-even (Growth users)" value="1" sub="$65 infra ÷ $96 margin = 0.7 users" color="text-amber-400" />
            <StatCard label="Revenue at 10 clients" value="$990" sub="Avg Growth plan" color="text-emerald-400" />
            <StatCard label="Revenue at 20 clients" value="$1,980" sub="Blogify.ai charges: $3,200+" color="text-emerald-400" />
          </div>
        </Section>

        {/* Recommendations */}
        <Section title="Recommendations" sub="">
          <div className="space-y-3">
            <Alert type="info" title="1. Fix AI Image Pack pricing before launch">
              Switch from DALL-E 3 ($0.04/image) to Flux via Replicate ($0.003/image) — same quality, 13× cheaper. Then price the add-on at $19/mo to match other add-ons.
            </Alert>
            <Alert type="info" title="2. Update stale ETAs on billing page">
              Add-on ETAs show Q3/Q4 2025 — update to 2026 dates to avoid credibility issues with new signups.
            </Alert>
            <Alert type="info" title="3. Rankings History Pro is your best add-on to push">
              $19/mo with near-zero cost. Agencies love rankings data. Lead with it in onboarding emails and the dashboard. Could realistically add $5–10K ARR quickly.
            </Alert>
            <Alert type="info" title="4. Annual billing is underused">
              Offering annual upfront lowers churn significantly. Consider offering 2 months free (instead of 20% off) to increase perceived value — same effective discount for you.
            </Alert>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-[#1a1a26] text-center text-[#3a3a5a] text-xs">
          Bloggy by Boom Media · Confidential · April 2026 · eric@boommedia.us
        </div>

      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-white font-bold text-base mb-1">{title}</h2>
      {sub && <p className="text-[#8888a8] text-sm mb-4">{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  )
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2a3d]">
      <table className="w-full bg-[#12121a] text-sm border-collapse">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#8888a8] bg-[#0d0d16] border-b border-[#2a2a3d]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
      <p className="text-[#8888a8] text-[10px] font-semibold uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-[#555570] text-xs mt-1">{sub}</p>
    </div>
  )
}

function Tag({ color, children }: { color: 'green' | 'amber' | 'red'; children: React.ReactNode }) {
  const styles = {
    green: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
    red: 'bg-red-500/10 border border-red-500/30 text-red-400',
  }
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[color]}`}>
      {children}
    </span>
  )
}

function Alert({ type, title, children }: { type: 'warn' | 'info'; title: string; children: React.ReactNode }) {
  const styles = {
    warn: 'bg-red-950/20 border border-red-500/30',
    info: 'bg-blue-950/20 border border-blue-500/20',
  }
  const icons = { warn: '⚠️', info: '💡' }
  return (
    <div className={`rounded-xl px-5 py-4 flex gap-4 items-start ${styles[type]}`}>
      <span className="text-lg shrink-0 mt-0.5">{icons[type]}</span>
      <div>
        <p className="text-white font-bold text-sm mb-1">{title}</p>
        <p className="text-[#8888a8] text-xs leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default async function InvestorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const authed = await isAuthenticated()
  const hasError = error === '1'

  if (!authed) return <PasswordGate error={hasError} />
  return <InvestorContent />
}
