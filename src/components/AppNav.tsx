import Logo from '@/components/Logo'
import { logout } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/server'
import NavAccountMenu from '@/components/NavAccountMenu'
import MobileNav from '@/components/MobileNav'
import NavSearchButton from '@/components/NavSearchButton'

const NAV_LINKS = [
  { href: '/dashboard',  label: 'Generate'   },
  { href: '/brands',     label: 'Brands'     },
  { href: '/campaigns',  label: 'Campaigns'  },
  { href: '/clients',    label: 'Clients'    },
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
    <nav className="border-b sticky top-0 z-50 backdrop-blur" style={{ borderColor: 'rgba(0,102,255,0.2)', background: 'rgba(6,13,26,0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
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
                style={{
                  color: active === link.href ? '#00FF00' : '#7a90b8',
                  fontSize: '0.875rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'color 0.2s',
                }}
                className="hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavSearchButton />
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
