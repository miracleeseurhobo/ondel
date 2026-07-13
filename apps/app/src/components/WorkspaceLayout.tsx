import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, Disc3, CalendarDays, Activity, Megaphone, Sparkles, Plus, Bell, LogOut } from 'lucide-react'
import { INK, SUBTLE, FAINT } from './workspace-ui'
import { mockSignOut } from '../lib/auth'

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/releases', label: 'Releases', icon: Disc3 },
  { to: '/timeline', label: 'Timeline', icon: CalendarDays },
  { to: '/signals', label: 'Signals', icon: Activity },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
]

const OndelLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden>
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

export default function WorkspaceLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh" style={{ background: '#F3F4F6', color: INK }}>
      {/* Sidebar (desktop) — gray-100 fill with a soft sky-blue bloom that blends in */}
      <aside
        className="sticky top-0 hidden h-dvh w-[236px] flex-col justify-between overflow-hidden px-4 py-6 md:flex"
        style={{ background: '#F3F4F6' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{
            background:
              'linear-gradient(180deg, rgba(150,217,255,0.32) 0%, rgba(122,162,255,0.14) 34%, rgba(243,244,246,0) 70%)',
            filter: 'blur(22px)',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2.5 px-1">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-[9px]"
              style={{ background: '#D6E4FB', color: '#0D1B4B' }}
            >
              <OndelLogo className="h-[15px] w-[15px]" />
            </span>
            <span className="text-[16px] font-medium tracking-[-0.32px]">Ondel</span>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors"
                style={({ isActive }) =>
                  isActive
                    ? { background: 'rgba(255,255,255,0.9)', color: INK, boxShadow: '0 1px 2px rgba(13,27,75,0.06)' }
                    : { color: SUBTLE }
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-3 flex h-10 w-full items-center gap-2 rounded-xl px-3 text-[14px] text-white"
            style={{ background: 'linear-gradient(180deg, #70A8F2 0%, #3D82DE 100%)' }}
          >
            <Sparkles className="h-[18px] w-[18px]" />
            Ask Ondie
          </button>
          <button
            type="button"
            onClick={() => {
              mockSignOut()
              navigate('/signin')
            }}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/60"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium text-white" style={{ background: '#3D82DE' }}>
              O
            </span>
            <div className="flex-1 leading-tight">
              <div className="text-[13px] font-medium">Your workspace</div>
              <div className="text-[11px]" style={{ color: FAINT }}>
                Free plan
              </div>
            </div>
            <LogOut className="h-4 w-4" style={{ color: FAINT }} aria-label="Sign out" />
          </button>
        </div>
      </aside>

      {/* Main — floating elevated card (subtle shadow, tight whitespace) */}
      <div className="flex-1 p-2 pb-24 md:p-2.5 md:pb-2.5 md:pl-1">
        <div
          className="flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-2xl bg-white md:min-h-[calc(100dvh-1.25rem)]"
          style={{ boxShadow: '0 1px 2px rgba(13,27,75,0.04), 0 4px 16px -8px rgba(13,27,75,0.1)' }}
        >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 sm:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-[9px]"
              style={{ background: '#D6E4FB', color: '#0D1B4B' }}
            >
              <OndelLogo className="h-[15px] w-[15px]" />
            </span>
            <span className="text-[16px] font-medium">Ondel</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: '0 1px 2px rgba(13,27,75,0.08)' }}
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" style={{ color: SUBTLE }} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-white"
              style={{ background: INK }}
            >
              <Plus className="h-4 w-4" />
              New release
            </button>
          </div>
        </div>

        <main className="flex-1 px-6 pb-8 pt-4 sm:px-8">
          <Outlet />
        </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-black/5 bg-white/90 px-2 py-2 backdrop-blur-md md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px]"
            style={({ isActive }) => ({ color: isActive ? INK : FAINT })}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
