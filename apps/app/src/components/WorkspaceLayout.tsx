import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Icon, type IconName } from './ui/icon'
import { INK, SUBTLE, FAINT } from './workspace-ui'
import ThemeToggle from './ThemeToggle'
import { mockSignOut } from '../lib/auth'
import { applyTheme, getStoredTheme } from '../lib/theme'

// Inbox gets a unique spot at the top of the sidebar (separated from the
// workflow nav), like a mail app.
const INBOX = { to: '/inbox', label: 'Inbox', icon: 'inbox' as IconName, count: 3 }

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/releases', label: 'Releases', icon: 'releases' },
  { to: '/timeline', label: 'Calendar', icon: 'timeline' },
  { to: '/vault', label: 'Vault', icon: 'vault' },
  { to: '/signals', label: 'Signals', icon: 'signals' },
  { to: '/campaigns', label: 'Campaigns', icon: 'campaigns' },
]

// Social apps the artist posts to — app-icon tiles (brand colour + white mark).
const PLATFORMS: { key: string; label: string; icon: IconName; color: string }[] = [
  { key: 'instagram', label: 'Instagram', icon: 'pInstagram', color: '#E1306C' },
  { key: 'tiktok', label: 'TikTok', icon: 'pTiktok', color: '#111111' },
  { key: 'youtube', label: 'YouTube', icon: 'pYoutube', color: '#FF0000' },
  { key: 'threads', label: 'Threads', icon: 'pThreads', color: '#111111' },
  { key: 'x', label: 'X (Twitter)', icon: 'pX', color: '#111111' },
]

// Streaming sources for trending-charts data — connected via the Connect button.
const CHARTS: { key: string; label: string; icon: IconName; color: string; connected: boolean }[] = [
  { key: 'spotify', label: 'Spotify', icon: 'pSpotify', color: '#1DB954', connected: true },
  { key: 'apple', label: 'Apple Music', icon: 'music', color: '#FA243C', connected: false },
  { key: 'audiomack', label: 'Audiomack', icon: 'radio', color: '#FF7A00', connected: false },
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
  // The calendar renders its own flush top nav, so suppress the shell's.
  const hideTopBar = useLocation().pathname.startsWith('/timeline')
  // Dark mode is scoped to the dashboard — re-apply the stored theme on entry
  // (the auth/onboarding flow forces light).
  useEffect(() => {
    applyTheme(getStoredTheme())
  }, [])
  const [platformsOpen, setPlatformsOpen] = useState(true)
  const [chartsOpen, setChartsOpen] = useState(true)
  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(new Set(['instagram', 'tiktok', 'x']))
  const togglePlatform = (key: string) =>
    setActivePlatforms((s) => {
      const next = new Set(s)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="flex min-h-dvh" style={{ background: 'var(--ds-bg)', color: INK }}>
      {/* Sidebar (desktop) — gray-100 fill with a soft sky-blue bloom that blends in */}
      <aside
        className="sticky top-0 hidden h-dvh w-[236px] flex-col justify-between overflow-hidden px-4 py-6 md:flex"
        style={{ background: 'var(--ds-bg)' }}
      >
        <div className="relative">
          <div className="flex items-center gap-2.5 px-1">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-ds-md"
              style={{ background: 'var(--ds-surface-2)', color: 'var(--ds-text)' }}
            >
              <OndelLogo className="h-[15px] w-[15px]" />
            </span>
            <span className="text-[16px] font-medium tracking-[-0.32px]">Ondel</span>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {/* Inbox — its own spot up top */}
            <NavLink
              to={INBOX.to}
              className="flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors"
              style={({ isActive }) =>
                isActive
                  ? { background: 'var(--ds-surface)', color: 'var(--ds-accent)', boxShadow: 'var(--ds-card-shadow)' }
                  : { color: SUBTLE }
              }
            >
              <Icon name={INBOX.icon} className="h-[18px] w-[18px]" />
              {INBOX.label}
              {INBOX.count ? (
                <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-medium tabular-nums text-[color:var(--ds-accent-fg)]" style={{ background: 'var(--ds-accent)' }}>
                  {INBOX.count}
                </span>
              ) : null}
            </NavLink>

            <div className="my-1.5 h-px" style={{ background: 'var(--ds-hair)' }} />

            {NAV.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors"
                style={({ isActive }) =>
                  isActive
                    ? { background: 'var(--ds-surface)', color: 'var(--ds-accent)', boxShadow: 'var(--ds-card-shadow)' }
                    : { color: SUBTLE }
                }
              >
                <Icon name={icon} className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Platforms — creator apps the artist can post to */}
          <div className="mt-7">
            <button
              type="button"
              onClick={() => setPlatformsOpen((v) => !v)}
              className="flex w-full items-center gap-1 px-3 pb-1.5 text-[12px] font-medium"
              style={{ color: 'var(--ds-text-faint)' }}
            >
              Platforms
              <Icon name="chevronDown" size={13} className={`transition-transform ${platformsOpen ? '' : '-rotate-90'}`} />
            </button>
            {platformsOpen ? (
              <div className="flex flex-col gap-0.5">
                {PLATFORMS.map((p) => {
                  const on = activePlatforms.has(p.key)
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => togglePlatform(p.key)}
                      aria-pressed={on}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[14px] transition-colors"
                      style={
                        on
                          ? { background: 'var(--ds-surface)', color: INK, boxShadow: 'var(--ds-card-shadow)' }
                          : { color: SUBTLE }
                      }
                    >
                      <span
                        className="flex h-[22px] w-[22px] items-center justify-center rounded-md"
                        style={{ background: p.color, opacity: on ? 1 : 0.55 }}
                      >
                        <Icon name={p.icon} size={13} className="text-white" />
                      </span>
                      {p.label}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Trending charts — streaming sources, populated once connected */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setChartsOpen((v) => !v)}
              className="flex w-full items-center gap-1 px-3 pb-1.5 text-[12px] font-medium"
              style={{ color: 'var(--ds-text-faint)' }}
            >
              Trending charts
              <Icon name="chevronDown" size={13} className={`transition-transform ${chartsOpen ? '' : '-rotate-90'}`} />
            </button>
            {chartsOpen ? (
              <div className="flex flex-col gap-0.5">
                {CHARTS.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[14px]"
                    style={s.connected ? { color: INK } : { color: SUBTLE }}
                  >
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md" style={{ background: s.color, opacity: s.connected ? 1 : 0.5 }}>
                      <Icon name={s.icon} size={13} className="text-white" />
                    </span>
                    {s.label}
                    <span className="ml-auto text-[11px] font-medium" style={{ color: s.connected ? '#16a34a' : 'var(--ds-text-faint)' }}>
                      {s.connected ? 'Connected' : 'Connect'}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="relative">
          <div className="mb-2 px-1">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => {
              mockSignOut()
              navigate('/signin')
            }}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-overlay/[0.06]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium" style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}>
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
          className="flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-xl border border-hair bg-surface md:min-h-[calc(100dvh-1.25rem)]"
          style={{ boxShadow: 'var(--ds-card-shadow)' }}
        >
        {/* Top bar (suppressed on the calendar, which renders its own) */}
        {!hideTopBar && (
        <div className="flex items-center justify-between px-6 pt-6 sm:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-ds-md"
              style={{ background: 'var(--ds-surface-2)', color: 'var(--ds-text)' }}
            >
              <OndelLogo className="h-[15px] w-[15px]" />
            </span>
            <span className="text-[16px] font-medium">Ondel</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
              aria-label="Notifications"
            >
              <Icon name="bell" className="h-[18px] w-[18px]" style={{ color: SUBTLE }} />
            </button>
            {/* Connect — stacked Spotify + Apple service logos, black primary */}
            <button
              type="button"
              className="flex h-9 items-center gap-2.5 rounded-full py-1 pl-1 pr-3.5 text-[13px] font-medium"
              style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}
            >
              <span className="flex -space-x-2">
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center overflow-hidden rounded-full"
                  style={{ boxShadow: '0 0 0 2px var(--ds-accent)' }}
                >
                  <SpotifyGlyph className="h-[26px] w-[26px]" />
                </span>
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white"
                  style={{ boxShadow: '0 0 0 2px var(--ds-accent)' }}
                >
                  <AppleGlyph className="h-[15px] w-[15px]" />
                </span>
              </span>
              Connect
            </button>
          </div>
        </div>
        )}

        <main className="flex-1 px-6 pb-8 pt-4 sm:px-8">
          <Outlet />
        </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-overlay/5 bg-surface/95 px-2 py-2 backdrop-blur-md md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {[NAV[0], INBOX, NAV[1], NAV[2], NAV[3]].map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px]"
            style={({ isActive }) => ({ color: isActive ? 'var(--ds-accent)' : FAINT })}
          >
            <Icon name={icon} className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
