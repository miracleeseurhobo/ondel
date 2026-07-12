import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Check, ArrowLeft } from 'lucide-react'
import GradientShimmerText from './GradientShimmerText'

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
  const [showMore, setShowMore] = useState(false)
  const [email, setEmail] = useState('')
  // idle → syncing → success. Mock only: any provider/email kicks off the same
  // "syncing artist data" success flow (no backend). See startSync below.
  const [status, setStatus] = useState('idle')
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const startSync = (e) => {
    e?.preventDefault?.()
    setStatus('syncing')
    timerRef.current = setTimeout(() => setStatus('success'), 2500)
  }

  const goBack = () => {
    clearTimeout(timerRef.current)
    setStatus('idle')
  }

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

          {status === 'syncing' && (
            <div key="syncing" className="sync-view-enter flex w-full max-w-[370px] flex-col items-center text-center">
              <OndelLogo className="h-9 w-9 text-black" />
              <h1 className="mt-7 text-[28px] font-medium leading-[34px] tracking-[-0.3px]">
                <GradientShimmerText>Syncing your artist data</GradientShimmerText>
              </h1>
              <p className="mt-2.5 text-[15px] leading-[21px] text-[#646465]">
                Connecting your catalog and release history…
              </p>
            </div>
          )}

          {status === 'success' && (
            <div key="success" className="sync-view-enter flex w-full max-w-[370px] flex-col items-center text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white"
                style={{ boxShadow: CTA_SHADOW }}
              >
                <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h1 className="mt-6 text-[28px] font-medium leading-[34px] tracking-[-0.3px] text-black">
                You&rsquo;re in
              </h1>
              <p className="mt-2.5 text-[15px] leading-[21px] text-[#646465]">
                Your workspace is being prepared.
              </p>
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
                onClick={startSync}
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
                      onClick={startSync}
                    />
                    <OAuthButton
                      glyph={<SpotifyGlyph className="h-[18px] w-[18px]" />}
                      label="Continue with Spotify"
                      onClick={startSync}
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
            <form onSubmit={startSync} className="flex flex-col gap-2.5">
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

        {/* Product-preview placeholder — desktop only (mobile is the centered gate) */}
        <div className="hidden items-center justify-center border-l border-black/[0.06] bg-[#f0f0f3] p-10 lg:flex">
          <div className="flex aspect-[4/3] w-full max-w-xl items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/50">
            <span className="text-[14px] text-[#9b9b9c]">Product preview — coming soon</span>
          </div>
        </div>
      </div>
    </main>
  )
}
