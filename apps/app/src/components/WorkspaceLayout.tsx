import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Icon, type IconName } from './ui/icon'
import { INK, SUBTLE, FAINT } from './workspace-ui'
import { mockSignOut } from '../lib/auth'

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/releases', label: 'Releases', icon: 'releases' },
  { to: '/timeline', label: 'Timeline', icon: 'timeline' },
  { to: '/signals', label: 'Signals', icon: 'signals' },
  { to: '/campaigns', label: 'Campaigns', icon: 'campaigns' },
]

const OndelLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden>
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

const SpotifyGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="#1DB954" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

const AppleGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="#000" className={className}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.42 7.31c1.33.07 2.25.74 3.03.8 1.16-.24 2.27-.93 3.51-.84 1.47.12 2.58.7 3.31 1.74-3.04 1.82-2.32 5.82.44 6.93-.55 1.44-1.26 2.87-2.66 4.35zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

export default function WorkspaceLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh" style={{ background: '#f5f5f5', color: INK }}>
      {/* Sidebar (desktop) — gray-100 fill with a soft sky-blue bloom that blends in */}
      <aside
        className="sticky top-0 hidden h-dvh w-[236px] flex-col justify-between overflow-hidden px-4 py-6 md:flex"
        style={{ background: '#f5f5f5' }}
      >
        <div className="relative">
          <div className="flex items-center gap-2.5 px-1">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-ds-md"
              style={{ background: '#D6E4FB', color: '#171717' }}
            >
              <OndelLogo className="h-[15px] w-[15px]" />
            </span>
            <span className="text-[16px] font-medium tracking-[-0.32px]">Ondel</span>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors"
                style={({ isActive }) =>
                  isActive
                    ? { background: 'rgba(255,255,255,0.9)', color: '#3D82DE', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
                    : { color: SUBTLE }
                }
              >
                <Icon name={icon} className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="relative">
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
            <Icon name="logout" size={16} style={{ color: FAINT }} aria-label="Sign out" />
          </button>
        </div>
      </aside>

      {/* Main — floating elevated card (subtle shadow, tight whitespace) */}
      <div className="flex-1 p-2 pb-24 md:p-2.5 md:pb-2.5 md:pl-1">
        <div
          className="flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-xl bg-white md:min-h-[calc(100dvh-1.25rem)]"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px -8px rgba(0,0,0,0.1)' }}
        >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 sm:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-ds-md"
              style={{ background: '#D6E4FB', color: '#171717' }}
            >
              <OndelLogo className="h-[15px] w-[15px]" />
            </span>
            <span className="text-[16px] font-medium">Ondel</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
              aria-label="Notifications"
            >
              <Icon name="bell" className="h-[18px] w-[18px]" style={{ color: SUBTLE }} />
            </button>
            {/* Connect — stacked Spotify + Apple service logos, brand-blue primary */}
            <button
              type="button"
              className="flex h-9 items-center gap-2.5 rounded-full py-1 pl-1 pr-3.5 text-[13px] font-medium text-white"
              style={{ background: '#3D82DE' }}
            >
              <span className="flex -space-x-2">
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center overflow-hidden rounded-full"
                  style={{ boxShadow: '0 0 0 2px #3D82DE' }}
                >
                  <SpotifyGlyph className="h-[26px] w-[26px]" />
                </span>
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white"
                  style={{ boxShadow: '0 0 0 2px #3D82DE' }}
                >
                  <AppleGlyph className="h-[15px] w-[15px]" />
                </span>
              </span>
              Connect
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
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px]"
            style={({ isActive }) => ({ color: isActive ? '#3D82DE' : FAINT })}
          >
            <Icon name={icon} className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
