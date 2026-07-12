import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowLeft, ListMusic, Disc3, Radio } from 'lucide-react'
import DisplayCards from './DisplayCards'
import SiriOrb from './SiriOrb'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

const SYS = {
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

// Shadow tokens (Lemni Light) — depth is entirely shadow-driven, no borders.
const INPUT_SHADOW =
  'rgba(95,122,143,0.23) 0px 2px 3px 0px, rgba(0,0,0,0.03) -1px -1px 1px 0px inset, rgb(255,255,255) 1px 1px 1px 0px inset'
const CTA_SHADOW = 'rgba(0,0,0,0.4) 0px 2px 5px 0px'
const OAUTH_SHADOW =
  'rgba(95,122,143,0.25) 0px 1px 2px 0px, rgb(255,255,255) 1px 1px 1px 0px inset'

// Playlist deck for the sign-in preview — the same "animated card" as the
// landing, auto-looping (DisplayCards loop) and themed as playlist placements.
// The fade colour matches the panel (#f0f0f3) so back cards blend out; the
// reveal (grayscale → colour) keys off the group's data-open state.
//
// Motion mirrors the landing's wave: the same ease-out curve as <Reveal>
// (cubic-bezier .22,1,.36,1), and a per-card transition-delay stepped like the
// manifesto ripple (~180ms/ring) so the cards rise one after another — a wave
// rolling through the stack — rather than all together.
const CARD_EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const CARD_FADE =
  "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#f0f0f3] after:to-transparent after:content-['']"
const CARD_REVEAL =
  "grayscale-[100%] group-data-[open=true]:grayscale-0 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:outline-1 before:outline-neutral-200 before:bg-[#f0f0f3]/60 before:bg-blend-overlay before:transition-opacity before:duration-700 before:content-[''] group-data-[open=true]:before:opacity-0"

const PLAYLIST_CARDS = [
  {
    icon: <ListMusic className="size-4 text-white" />,
    badgeClassName: 'bg-blue-500',
    titleClassName: 'text-blue-600',
    title: 'New Music Friday',
    description: 'Editorial · 4.1M followers',
    date: 'Pitched · 2h ago',
    className: `[grid-area:stack] ${CARD_EASE} group-data-[open=true]:-translate-y-10 ${CARD_FADE} ${CARD_REVEAL}`,
  },
  {
    icon: <Disc3 className="size-4 text-white" />,
    badgeClassName: 'bg-fuchsia-500',
    titleClassName: 'text-fuchsia-600',
    title: 'Indie Pop Rising',
    description: '94% match · 82k followers',
    date: 'Added yesterday',
    className: `[grid-area:stack] ${CARD_EASE} delay-[180ms] translate-x-8 translate-y-8 group-data-[open=true]:-translate-y-1 sm:translate-x-16 sm:translate-y-10 ${CARD_FADE} ${CARD_REVEAL}`,
  },
  {
    icon: <Radio className="size-4 text-white" />,
    badgeClassName: 'bg-emerald-500',
    titleClassName: 'text-emerald-600',
    title: 'Bedroom Pop',
    description: 'Curator pick · 31k followers',
    date: 'Under review',
    className: `[grid-area:stack] ${CARD_EASE} delay-[360ms] translate-x-16 translate-y-16 group-data-[open=true]:translate-y-8 sm:translate-x-32 sm:translate-y-20 ${CARD_FADE}`,
  },
]

// Progressive welcome — reuses the landing manifesto's word-reveal (.reveal-word)
// as an onboarding message, written in the manifesto's own voice and cadence.
const WELCOME =
  "Welcome to Ondel. Your song already has a story unfolding. The people who'll love it. The places it belongs. Let's bring it into focus."
const WELCOME_WORDS = WELCOME.split(' ')

const OndelLogo = ({ className }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden="true">
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

const GoogleGlyph = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
  </svg>
)

const AppleGlyph = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="#000" {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.42 7.31c1.33.07 2.25.74 3.03.8 1.16-.24 2.27-.93 3.51-.84 1.47.12 2.58.7 3.31 1.74-3.04 1.82-2.32 5.82.44 6.93-.55 1.44-1.26 2.87-2.66 4.35zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

const SpotifyGlyph = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="#1DB954" {...props}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

function OAuthButton({ glyph, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-white text-[15px] font-medium text-black transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
      style={{ boxShadow: OAUTH_SHADOW }}
    >
      {glyph}
      {label}
    </button>
  )
}

// Sign-in / sign-up gate — Lemni Light aesthetic (near-white, monochrome,
// shadow-driven depth, system-ui). Google primary + collapsible Apple/Spotify
// + email. UI-only (no backend). Reuses the Ondel brand mark.
export default function SignIn() {
  const reduced = usePrefersReducedMotion()
  const [showMore, setShowMore] = useState(false)
  const [email, setEmail] = useState('')
  // idle → welcome. Mock only: any provider/email opens the welcome moment —
  // a Siri orb + a manifesto message that reveals progressively (no backend).
  const [status, setStatus] = useState('idle')
  const [reveal, setReveal] = useState(0)

  // Drive the manifesto word-reveal over time — the timed counterpart of the
  // landing's scroll-driven <SignalStatement>. Reduced motion shows it solid.
  useEffect(() => {
    if (status !== 'welcome') {
      setReveal(0)
      return
    }
    if (reduced) {
      setReveal(1)
      return
    }
    let raf
    let start = null
    // Reveal at an average reading pace (~200 wpm ≈ 300ms/word), scaled to the
    // word count, so the eye can track and absorb each word as it lands. Linear
    // (steady cadence) — an ease curve would front-load the reveal and fight the
    // reader's rhythm.
    const DURATION = WELCOME_WORDS.length * 300
    const tick = (t) => {
      if (start === null) start = t
      const p = Math.min((t - start) / DURATION, 1)
      setReveal(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status, reduced])

  const enterWelcome = (e) => {
    e?.preventDefault?.()
    setStatus('welcome')
  }

  const goBack = () => setStatus('idle')

  return (
    <main className="min-h-dvh bg-[#f6f6f8] text-black" style={SYS}>
      <div className="grid min-h-dvh lg:grid-cols-2">
        {/* Auth column */}
        <div
          className="relative flex items-center justify-center px-5 py-16"
          style={{
            paddingTop: 'max(4rem, env(safe-area-inset-top))',
            paddingBottom: 'max(4rem, env(safe-area-inset-bottom))',
          }}
        >
          {status !== 'idle' && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back to sign in"
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full text-[#646465] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
              style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          {status === 'welcome' && (
            <div key="welcome" className="sync-view-enter flex w-full max-w-[440px] flex-col items-center text-center">
              <SiriOrb size="132px" />
              <p
                className="mt-9 font-display text-[clamp(1.75rem,6.5vw,2.5rem)] font-medium leading-[1.15] tracking-tight text-neutral-900"
                style={{ '--reveal': reveal }}
              >
                {WELCOME_WORDS.map((w, i) => (
                  <span
                    key={i}
                    className="reveal-word"
                    style={{ '--i': ((i / (WELCOME_WORDS.length - 1)) * 0.94).toFixed(4) }}
                  >
                    {i < WELCOME_WORDS.length - 1 ? `${w} ` : w}
                  </span>
                ))}
              </p>
              {/* Continue — sign-in CTA style; fades in once the message lands */}
              <Link
                to="/"
                aria-hidden={reveal < 0.9}
                tabIndex={reveal < 0.9 ? -1 : 0}
                className="mt-10 inline-flex h-11 w-full items-center justify-center rounded-xl bg-black text-[15px] font-medium text-white transition-[opacity,transform] duration-300 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                style={{
                  boxShadow: CTA_SHADOW,
                  opacity: reveal >= 0.9 ? 1 : 0,
                  transform: reveal >= 0.9 ? 'none' : 'translateY(8px)',
                  pointerEvents: reveal >= 0.9 ? 'auto' : 'none',
                }}
              >
                Continue
              </Link>
            </div>
          )}

          {status === 'idle' && (
          <div className="w-full max-w-[370px]">
            <div className="flex flex-col items-center">
              <Link
                to="/"
                aria-label="Ondel home"
                className="rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
              >
                <OndelLogo className="h-9 w-9 text-black" />
              </Link>
              <h1 className="mt-6 text-center text-[32px] font-medium leading-[38.4px] tracking-[-0.32px] text-black">
                Welcome to Ondel
              </h1>
              <p className="mt-2 text-center text-[15px] leading-[21px] text-[#646465]">
                Your AI operating system for music releases.
              </p>
            </div>

            {/* OAuth — Google primary, collapsible Apple/Spotify */}
            <div className="mt-8 flex flex-col gap-2.5">
              <OAuthButton
                glyph={<GoogleGlyph className="h-[18px] w-[18px]" />}
                label="Continue with Google"
                onClick={enterWelcome}
              />

              <div
                className={`-mx-2 grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                  showMore ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                {/* px-2/pb-2 give the button drop-shadows room inside the clip;
                    the -mx-2 above keeps the buttons aligned with Google's width */}
                <div className="overflow-hidden px-2 pb-2">
                  <div className="flex flex-col gap-2.5 pt-2.5">
                    <OAuthButton
                      glyph={<AppleGlyph className="h-[18px] w-[18px]" />}
                      label="Continue with Apple"
                      onClick={enterWelcome}
                    />
                    <OAuthButton
                      glyph={<SpotifyGlyph className="h-[18px] w-[18px]" />}
                      label="Continue with Spotify"
                      onClick={enterWelcome}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                aria-expanded={showMore}
                className="mx-auto flex min-h-[44px] items-center gap-1 rounded-md px-2 text-[14px] text-[#646465] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
              >
                {showMore ? 'Fewer options' : 'More sign-in options'}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transition-none ${
                    showMore ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[14px] text-[#9b9b9c]">or</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            {/* Email */}
            <form onSubmit={enterWelcome} className="flex flex-col gap-2.5">
              <label htmlFor="signin-email" className="sr-only">
                Email address
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 w-full rounded-xl bg-white/50 pl-5 pr-2.5 text-[16px] text-black placeholder-[#646465] outline-none focus-visible:ring-2 focus-visible:ring-black/25"
                style={{ boxShadow: INPUT_SHADOW }}
              />
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-black text-[15px] font-medium text-white transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                style={{ boxShadow: CTA_SHADOW }}
              >
                Continue
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] leading-[18px] text-[#9b9b9c]">
              By continuing you agree to our{' '}
              <a href="#" className="underline-offset-2 hover:text-black hover:underline">
                Terms
              </a>{' '}
              &amp;{' '}
              <a href="#" className="underline-offset-2 hover:text-black hover:underline">
                Privacy
              </a>
              .
            </p>
          </div>
          )}
        </div>

        {/* Product preview — desktop only (mobile is the centered gate). The
            looping playlist deck stands in for the product until the real
            mockup lands. */}
        <div className="relative hidden items-center justify-center overflow-hidden border-l border-black/[0.06] bg-[#f0f0f3] p-10 lg:flex">
          <div className="-translate-x-12 -translate-y-2">
            <DisplayCards loop cards={PLAYLIST_CARDS} />
          </div>
        </div>
      </div>
    </main>
  )
}
