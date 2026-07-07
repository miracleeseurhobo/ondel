import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import DottedGlowBackground from './DottedGlowBackground'

const OndelLogo = ({ className }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden="true">
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

const GoogleGlyph = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
  </svg>
)

// Sign-in page — Lemni Dark AI aesthetic (near-black canvas, blue-white display,
// violet-glow CTA, dark glass panels). UI-only (no backend). TWK Lausanne is
// commercial/unavailable, so Inter stands in with the spec's sizes/weights.
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // UI-only for now — no backend/auth wired.
    alert('Sign-in is not connected yet — join the waitlist from the home page.')
  }

  const inputCls =
    'w-full min-h-[48px] rounded-xl border border-white/10 bg-[#20232e] px-4 text-[16px] text-[#ccd1e9] placeholder-[#636475] outline-none transition-colors focus:border-[#9900ff]/60 focus:ring-2 focus:ring-[#9900ff]/25'

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0d0d12] px-5"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Dotted glow field — lavender dots with a violet pulse, masked to center */}
      <DottedGlowBackground
        color="#2b2e40"
        glowColor="#7c4dff"
        gap={16}
        radius={1.7}
        speedMin={1.2}
        speedMax={4.5}
      />
      {/* Violet halo behind the card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(153,0,255,0.18), transparent 62%)' }}
        aria-hidden="true"
      />

      {/* Wordmark → back home, pinned top-left (clears the notch) */}
      <Link
        to="/"
        className="absolute z-20 inline-flex items-center gap-2 rounded text-[#e3e8ff] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9900ff]/50"
        style={{
          top: 'calc(env(safe-area-inset-top) + 1.25rem)',
          left: 'calc(env(safe-area-inset-left) + 1.25rem)',
        }}
      >
        <OndelLogo className="h-6 w-6" />
        <span className="font-inter text-lg font-semibold tracking-tight">Ondel</span>
      </Link>

      <div className="relative z-10 w-full max-w-[400px]">
        <h1 className="font-inter text-[clamp(2rem,7vw,2.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#e3e8ff]">
          Sign in to Ondel
        </h1>
        <p className="mt-3 font-inter text-[15px] leading-relaxed text-[#9095a4]">
          Continue to your release intelligence dashboard.
        </p>

        {/* Glass form card */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#16171f]/70 p-6 backdrop-blur-md"
          style={{ boxShadow: '0px 2px 3px 0px rgba(19,0,77,0.35)' }}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signin-email" className="font-inter text-[13px] font-medium text-[#ccd1e9]">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="signin-password" className="font-inter text-[13px] font-medium text-[#ccd1e9]">
                Password
              </label>
              <a
                href="#"
                className="rounded font-inter text-[13px] text-[#9095a4] transition-colors hover:text-[#ccd1e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9900ff]/50"
              >
                Forgot?
              </a>
            </div>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>

          {/* Violet-glow CTA */}
          <button
            type="submit"
            className="mt-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#9900ff] font-inter text-[15px] font-medium text-white transition-[box-shadow,background-color] hover:bg-[#a41aff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98cff]"
            style={{ boxShadow: '0 0 26px 0 rgba(153,0,255,0.55), inset 1px 1px 1px 0 rgba(255,255,255,0.25)' }}
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-inter text-[12px] text-[#636475]">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* Social */}
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border border-white/10 bg-[#20232e] font-inter text-[15px] font-medium text-[#ccd1e9] transition-colors hover:bg-[#272a37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <GoogleGlyph className="h-[18px] w-[18px]" />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center font-inter text-[14px] text-[#9095a4]">
          New to Ondel?{' '}
          <Link
            to="/"
            className="rounded text-[#ccd1e9] underline-offset-4 transition-colors hover:text-[#e3e8ff] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9900ff]/50"
          >
            Request an invite
          </Link>
        </p>
      </div>
    </main>
  )
}
