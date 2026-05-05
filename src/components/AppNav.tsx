import Logo from '@/components/Logo'
import { logout } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/server'
import NavAccountMenu from '@/components/NavAccountMenu'
import MobileNav from '@/components/MobileNav'
import NavSearchButton from '@/components/NavSearchButton'

const NAV_LINKS = [
  { href: '/dashboard',  label: 'Generate'   },
  { href: '/clients',    label: 'Clients'    },
  { href: '/keywords',   label: 'Keywords'   },
  { href: '/autoblog',   label: 'Autoblog'   },
  { href: '/calendar',   label: 'Calendar'   },
  { href: '/analytics',  label: 'Analytics'  },
  { href: '/tools',      label: 'Tools'      },
]

const PLAN_STYLES: Record<string, string> = {
  starter:    'bg-blue-500/15 border-blue-500/30 text-blue-400',
  growth:     'bg-violet-500/15 border-violet-500/30 text-violet-400',
  agency:     'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  agency_max: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  free:       'bg-[#1a1a26] border-[#2a2a3d] text-[#8888a8]',
}

export default async function AppNav({ active }: { active: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [{ data: sub }, { count: postsUsed }] = await Promise.all([
    supabase.from('subscriptions').select('plan, status, posts_limit, sites_limit').eq('user_id', user!.id).single(),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('created_by', user!.id).gte('created_at', monthStart),
  ])

  const plan = sub?.plan ?? 'free'
  const isActive = sub?.status === 'active'
  const displayPlan = isActive ? plan : 'free'
  const postsLimit = sub?.posts_limit ?? 2
  const postsLeft = Math.max(0, postsLimit - (postsUsed ?? 0))
  const nearLimit = postsLeft <= Math.ceil(postsLimit * 0.2)
  const planStyle = PLAN_STYLES[displayPlan] ?? PLAN_STYLES.free

  return (
    <nav className="border-b border-[#2a2a3d] bg-[#0a0a0f]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <a href="/home" className="flex items-center shrink-0">
            <Logo />
          </a>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={
                  active === link.href
                    ? 'text-white text-sm px-3 py-1.5 rounded-lg bg-[#1a1a26] transition-colors'
                    : 'text-[#8888a8] hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-[#1a1a26] transition-colors'
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavSearchButton />
          <a
            href="https://discord.gg/9avYXden"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[#8888a8] hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#1a1a26] transition-colors border border-transparent hover:border-[#2a2a3d]"
            title="Join the Bloggy Community"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Community
          </a>
          <NavAccountMenu
            email={user?.email ?? ''}
            planLabel={displayPlan.replace('_', ' ')}
            planStyle={planStyle}
            postsLeft={postsLeft}
            postsLimit={postsLimit}
            nearLimit={nearLimit}
            signOutAction={logout}
          />
          {/* Mobile hamburger */}
          <MobileNav active={active} links={NAV_LINKS} signOutAction={logout} />
        </div>
      </div>
    </nav>
  )
}
