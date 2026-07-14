import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { Icon } from '../components/ui/icon'
import StudioFolder from '../components/StudioFolder'
import SiriOrb from '../components/SiriOrb'
import DisplayCards, { type DisplayCardProps } from '../components/DisplayCards'
import { mockSignIn, mockSignOut } from '../lib/auth'
import { applyTheme, getStoredTheme } from '../lib/theme'
import { clearPlan } from '../lib/plan'

// Shadow tokens (Lemni Light) — depth is shadow-driven, no borders.
const CTA_SHADOW = 'rgba(0,0,0,0.4) 0px 2px 5px 0px'
const OAUTH_SHADOW =
  'rgba(95,122,143,0.25) 0px 1px 2px 0px, rgb(255,255,255) 1px 1px 1px 0px inset'
const INPUT_SHADOW =
  'rgba(95,122,143,0.23) 0px 2px 3px 0px, rgba(0,0,0,0.03) -1px -1px 1px 0px inset, rgb(255,255,255) 1px 1px 1px 0px inset'

// Spaced dashed rounded border as an inline SVG overlay — CSS `border-dashed`
// packs the dashes too tightly for this look, and an SVG background has no
// intrinsic size to stretch to. `active` swaps neutral → brand on drag/hover.
function DashedBorder({ active }: { active: boolean }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <rect
        width="100%"
        height="100%"
        rx="12"
        ry="12"
        fill="none"
        stroke={active ? 'var(--ds-accent)' : 'var(--ds-border)'}
        strokeWidth="2"
        strokeDasharray="7 9"
        strokeLinecap="round"
        className="transition-[stroke] duration-200 ease-out"
      />
    </svg>
  )
}

const WELCOME =
  "Welcome to Ondel. Your release already has a story unfolding. The people who'll love it. The places it belongs. Let's bring it into focus."
const WELCOME_WORDS = WELCOME.split(' ')

// Onboarding step indicator (Lemni-style footer) — Welcome is the active step.
const STEPS = ['Welcome', 'Workspace', 'Plan', 'Tutorial']

// Animated preview deck for the sign-in right panel (dual layout). Cards fan out
// and colourise on a calm loop; the fade colour matches the panel.
const CARD_EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const CARD_FADE =
  "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[color:var(--ds-surface-2)] after:to-transparent after:content-['']"
const CARD_REVEAL =
  "grayscale-[100%] group-data-[open=true]:grayscale-0 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:outline-1 before:outline-[color:var(--ds-border)] before:bg-overlay/[0.04] before:bg-blend-overlay before:transition-opacity before:duration-700 before:content-[''] group-data-[open=true]:before:opacity-0"

// The animated preview deck keeps its colours — a lively, colourful counterpoint
// to the otherwise neutral onboarding (an intentional exception to the neutral
// palette; see design-system/color.md).
const PLAYLIST_CARDS: DisplayCardProps[] = [
  {
    icon: <Icon name="music" size={16} className="text-white" />,
    badgeClassName: 'bg-blue-500',
    titleClassName: 'text-blue-600',
    title: 'New Music Friday',
    description: 'Editorial · 4.1M followers',
    date: 'Pitched · 2h ago',
    className: `[grid-area:stack] ${CARD_EASE} group-data-[open=true]:-translate-y-10 ${CARD_FADE} ${CARD_REVEAL}`,
  },
  {
    icon: <Icon name="releases" size={16} className="text-white" />,
    badgeClassName: 'bg-fuchsia-500',
    titleClassName: 'text-fuchsia-600',
    title: 'Indie Pop Rising',
    description: '94% match · 82k followers',
    date: 'Added yesterday',
    className: `[grid-area:stack] ${CARD_EASE} delay-[180ms] translate-x-8 translate-y-8 group-data-[open=true]:-translate-y-1 sm:translate-x-16 sm:translate-y-10 ${CARD_FADE} ${CARD_REVEAL}`,
  },
  {
    icon: <Icon name="radio" size={16} className="text-white" />,
    badgeClassName: 'bg-emerald-500',
    titleClassName: 'text-emerald-600',
    title: 'Bedroom Pop',
    description: 'Curator pick · 31k followers',
    date: 'Under review',
    className: `[grid-area:stack] ${CARD_EASE} delay-[360ms] translate-x-16 translate-y-16 group-data-[open=true]:translate-y-8 sm:translate-x-32 sm:translate-y-20 ${CARD_FADE}`,
  },
]

const OndelLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden>
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

type GlyphProps = { className?: string }

const GoogleGlyph = ({ className }: GlyphProps) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
  </svg>
)
const AppleGlyph = ({ className }: GlyphProps) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="#000" className={className}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.42 7.31c1.33.07 2.25.74 3.03.8 1.16-.24 2.27-.93 3.51-.84 1.47.12 2.58.7 3.31 1.74-3.04 1.82-2.32 5.82.44 6.93-.55 1.44-1.26 2.87-2.66 4.35zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)
const SpotifyGlyph = ({ className }: GlyphProps) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="#1DB954" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

function OAuthButton({ glyph, label, onClick }: { glyph: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-surface text-[15px] font-medium text-ink transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay/25"
      style={{ boxShadow: OAUTH_SHADOW }}
    >
      {glyph}
      {label}
    </button>
  )
}

// Filled success check (Tailwind green-600 / --ds-success) — Hugeicons free has
// no solid variant, so this is an inline solid check-circle.
function SuccessCheck({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="#16a34a" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// Onboarding step footer (Lemni-style) — done steps get a filled success check,
// current is dark.
function StepFooter({ active }: { active: number }) {
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-10 flex flex-col items-center"
      style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="mb-4 h-px w-full max-w-3xl"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)' }}
      />
      <div className="flex items-center gap-5 text-[13px]">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            {i < active ? (
              <SuccessCheck size={15} />
            ) : (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: i === active ? 'var(--ds-text)' : 'var(--ds-border)' }}
              />
            )}
            <span style={{ color: i <= active ? 'var(--ds-text)' : 'var(--ds-text-muted)', fontWeight: i === active ? 500 : 400 }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </footer>
  )
}

export default function SignIn({ onOAuth }: { onOAuth?: (strategy: string) => void }) {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'welcome' | 'workspace'>('idle')
  const [reveal, setReveal] = useState(0)
  const [workspaceName, setWorkspaceName] = useState('Midnight Studio')
  const [logo, setLogo] = useState<string | null>(null) // data URL of the uploaded studio image
  const [dragging, setDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Accept a picked/dropped image → validate type + size, read to a data URL.
  const acceptFile = (file: File | undefined) => {
    if (!file) return
    const okType = ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)
    if (!okType) {
      setUploadError('Use a JPG, PNG or SVG image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('That image is over 5.0MB.')
      return
    }
    setUploadError(null)
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (status !== 'welcome') {
      setReveal(0)
      return
    }
    if (reduced) {
      setReveal(1)
      return
    }
    let raf = 0
    let start: number | null = null
    const DURATION = WELCOME_WORDS.length * 300 // ~200 wpm reading pace, linear
    const tick = (t: number) => {
      if (start === null) start = t
      const p = Math.min((t - start) / DURATION, 1)
      setReveal(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status, reduced])

  // Landing on the sign-in page always starts a fresh (mock) session, so the
  // sign-in + welcome simulation plays before the dashboard every time.
  useEffect(() => {
    mockSignOut()
    clearPlan() // fresh session starts without a plan, so the Ask Ondie loop replays
  }, [])

  // Auth + manifesto + workspace onboarding are always light; dark mode is
  // scoped to the dashboard. Force light here, restore the stored theme on exit.
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    return () => applyTheme(getStoredTheme())
  }, [])

  const provider = (strategy: string) => {
    if (onOAuth) onOAuth(strategy)
    else setStatus('welcome') // mock flow when Clerk isn't configured
  }
  const emailSubmit = (e: FormEvent) => {
    e.preventDefault()
    setStatus('welcome')
  }

  // Welcome (manifesto) is single-centered; the sign-in form uses a dual layout
  // with the animated preview deck on the right.
  if (status === 'welcome') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-app px-5 text-ink">
        <button
          type="button"
          onClick={() => setStatus('idle')}
          aria-label="Back to sign in"
          className="fixed z-20 flex h-11 w-11 items-center justify-center rounded-full text-subtle transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay/25"
          style={{ top: 'max(24px, env(safe-area-inset-top))', left: 24 }}
        >
          <Icon name="arrowLeft" size={20} aria-hidden />
        </button>
        <div
          className="flex w-full items-center justify-center"
          style={{ paddingTop: 'max(4rem, env(safe-area-inset-top))', paddingBottom: 'max(4rem, env(safe-area-inset-bottom))' }}
        >
          <div className="sync-view-enter flex w-full max-w-[440px] flex-col items-center text-center">
            <SiriOrb size="132px" />
            <p
              className="mt-9 leading-[1.15] tracking-tight text-ink"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(1.75rem,6.5vw,2.5rem)', '--reveal': reveal } as CSSProperties}
            >
              {WELCOME_WORDS.map((w, i) => (
                <span
                  key={i}
                  className="reveal-word"
                  style={{ '--i': ((i / (WELCOME_WORDS.length - 1)) * 0.94).toFixed(4) } as CSSProperties}
                >
                  {i < WELCOME_WORDS.length - 1 ? `${w} ` : w}
                </span>
              ))}
            </p>
            <button
              type="button"
              aria-hidden={reveal < 0.9}
              tabIndex={reveal < 0.9 ? -1 : 0}
              className="mt-10 inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand text-[15px] font-medium text-white transition-[opacity,transform] duration-300 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              style={{
                boxShadow: CTA_SHADOW,
                opacity: reveal >= 0.9 ? 1 : 0,
                transform: reveal >= 0.9 ? 'none' : 'translateY(8px)',
                pointerEvents: reveal >= 0.9 ? 'auto' : 'none',
              }}
              onClick={() => setStatus('workspace')}
            >
              Get started
            </button>
          </div>
        </div>

        <StepFooter active={0} />
      </main>
    )
  }

  if (status === 'workspace') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-app px-5 text-ink">
        <button
          type="button"
          onClick={() => setStatus('welcome')}
          aria-label="Back to welcome"
          className="fixed z-20 flex h-11 w-11 items-center justify-center rounded-full text-subtle transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay/25"
          style={{ top: 'max(24px, env(safe-area-inset-top))', left: 24 }}
        >
          <Icon name="arrowLeft" size={20} aria-hidden />
        </button>
        <div
          className="flex w-full items-center justify-center"
          style={{ paddingTop: 'max(4rem, env(safe-area-inset-top))', paddingBottom: 'max(4rem, env(safe-area-inset-bottom))' }}
        >
          <form
            className="sync-view-enter flex w-full max-w-[370px] flex-col items-center text-center"
            onSubmit={(e) => {
              e.preventDefault()
              mockSignIn()
              navigate('/')
            }}
          >
            {/* Studio image — folder dropzone (drag-drop or click to pick a local file) */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload a studio image"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                acceptFile(e.dataTransfer.files?.[0])
              }}
              className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-7 text-center outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-brand/40"
              style={{ backgroundColor: dragging ? 'rgba(0,0,0,0.04)' : 'transparent' }}
            >
              <DashedBorder active={dragging} />
              {logo ? (
                <img
                  src={logo}
                  alt="Studio"
                  className="h-[76px] w-[76px] rounded-lg object-cover"
                  style={{ boxShadow: '0 6px 18px -8px rgba(0,0,0,0.35)' }}
                />
              ) : (
                <div className="transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                  <StudioFolder scale={0.72} />
                </div>
              )}

              <p className="mt-3 text-[14px] leading-[20px] text-subtle">
                Drag and drop or{' '}
                <span className="font-medium text-ink underline underline-offset-2">
                  {logo ? 'choose another' : 'choose file'}
                </span>{' '}
                to upload.
              </p>
              <p className="mt-1 text-[13px] leading-[18px] text-faint">
                Image format : JPG, PNG &amp; SVG. Max 5.0MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/svg+xml"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
            </div>
            {uploadError ? (
              <p className="mt-2 w-full text-left text-[13px] text-red-600" role="alert">
                {uploadError}
              </p>
            ) : null}

            <h1 className="mt-7 text-center text-[32px] font-medium leading-[38.4px] tracking-[-0.32px] text-ink">
              Create your studio
            </h1>
            <p className="mt-2 text-center text-[15px] leading-[21px] text-subtle">
              Where every release, playlist pitch, and signal lives — set the tempo for your team.
            </p>

            <div className="mt-6 w-full text-left">
              <label htmlFor="workspace-name" className="text-[13px] font-medium text-ink">
                Studio name
              </label>
              <input
                id="workspace-name"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                autoFocus
                maxLength={40}
                placeholder="Midnight Records"
                className="mt-2 h-11 w-full rounded-xl border-0 bg-surface px-3.5 text-[15px] text-ink outline-none transition-shadow placeholder:text-faint focus:ring-2 focus:ring-overlay/15"
                style={{ boxShadow: INPUT_SHADOW }}
              />
            </div>

            <button
              type="submit"
              disabled={!workspaceName.trim()}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand text-[15px] font-medium text-white transition-[transform,opacity] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:opacity-40"
              style={{ boxShadow: CTA_SHADOW }}
            >
              Create studio
            </button>
          </form>
        </div>

        <StepFooter active={1} />
      </main>
    )
  }

  return (
    <main className="grid min-h-dvh grid-cols-1 bg-app text-ink lg:grid-cols-2">
      {/* Auth column */}
      <div
        className="flex items-center justify-center px-5"
        style={{ paddingTop: 'max(4rem, env(safe-area-inset-top))', paddingBottom: 'max(4rem, env(safe-area-inset-bottom))' }}
      >
        <div className="w-full max-w-[370px]">
            <div className="flex flex-col items-center">
              <Link to="/" aria-label="Ondel home" className="rounded-md transition-opacity hover:opacity-80">
                <OndelLogo className="h-9 w-9 text-ink" />
              </Link>
              <h1 className="mt-6 text-center text-[32px] font-medium leading-[38.4px] tracking-[-0.32px] text-ink">
                Welcome to Ondel
              </h1>
              <p className="mt-2 text-center text-[15px] leading-[21px] text-subtle">
                Your AI operating system for music releases.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-2.5">
              <OAuthButton glyph={<GoogleGlyph className="h-[18px] w-[18px]" />} label="Continue with Google" onClick={() => provider('oauth_google')} />
              <div className={`-mx-2 grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${showMore ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden px-2 pb-2">
                  <div className="flex flex-col gap-2.5 pt-2.5">
                    <OAuthButton glyph={<AppleGlyph className="h-[18px] w-[18px]" />} label="Continue with Apple" onClick={() => provider('oauth_apple')} />
                    <OAuthButton glyph={<SpotifyGlyph className="h-[18px] w-[18px]" />} label="Continue with Spotify" onClick={() => provider('oauth_spotify')} />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                aria-expanded={showMore}
                className="mx-auto flex min-h-[44px] items-center gap-1 rounded-md px-2 text-[14px] text-subtle transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay/25"
              >
                {showMore ? 'Fewer options' : 'More sign-in options'}
                <Icon name="chevronDown" className={`h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transition-none ${showMore ? 'rotate-180' : ''}`} aria-hidden />
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-brand/10" />
              <span className="text-[14px] text-faint">or</span>
              <span className="h-px flex-1 bg-brand/10" />
            </div>

            <form onSubmit={emailSubmit} className="flex flex-col gap-2.5">
              <label htmlFor="signin-email" className="sr-only">Email address</label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 w-full rounded-xl bg-surface pl-5 pr-2.5 text-[16px] text-ink placeholder-faint outline-none focus-visible:ring-2 focus-visible:ring-overlay/25"
                style={{ boxShadow: INPUT_SHADOW }}
              />
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-brand text-[15px] font-medium text-white transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                style={{ boxShadow: CTA_SHADOW }}
              >
                Continue
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] leading-[18px] text-faint">
              By continuing you agree to our{' '}
              <a href="#" className="underline-offset-2 hover:text-ink hover:underline">Terms</a> &amp;{' '}
              <a href="#" className="underline-offset-2 hover:text-ink hover:underline">Privacy</a>.
            </p>
          </div>
        </div>

        {/* Right panel — animated preview deck (desktop only) */}
        <div className="relative hidden items-center justify-center overflow-hidden border-l border-overlay/[0.06] bg-surface2 p-10 lg:flex">
          <div className="-translate-x-12 -translate-y-2">
            <DisplayCards loop cards={PLAYLIST_CARDS} />
          </div>
        </div>
    </main>
  )
}
