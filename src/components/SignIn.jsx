import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { OTPInput } from 'input-otp'
import DottedGlowBackground from './DottedGlowBackground'

const OndelLogo = ({ className }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden="true">
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

// OTP slot — Lemni dark styling; active slot pops with a violet outline.
function Slot({ char, isActive, hasFakeCaret }) {
  return (
    <div
      className={`relative flex h-12 w-9 items-center justify-center font-inter text-[1.5rem] text-[#e3e8ff] border-y border-r border-white/10 bg-[#20232e] outline outline-[#96d9ff] transition-all duration-200 first:rounded-l-xl first:border-l last:rounded-r-xl sm:h-14 sm:w-11 sm:text-[1.6rem] ${
        isActive ? 'z-10 outline-2' : 'outline-0'
      }`}
    >
      {char !== null && <span>{char}</span>}
      {hasFakeCaret && <FakeCaret />}
    </div>
  )
}

function FakeCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-px animate-caret-blink bg-[#e3e8ff] motion-reduce:animate-none" />
    </div>
  )
}

function FakeDash() {
  return (
    <div className="flex w-6 items-center justify-center sm:w-8">
      <div className="h-1 w-3 rounded-full bg-white/20" />
    </div>
  )
}

// Sign-in via one-time code — Lemni Dark AI aesthetic. UI-only (no backend);
// TWK Lausanne is commercial/unavailable, so Inter stands in.
export default function SignIn() {
  const [code, setCode] = useState('')

  const verify = () => {
    // UI-only for now — no backend/verification wired.
    alert('Code verification is not connected yet — join the waitlist from the home page.')
  }

  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0d0d12] px-5"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Dotted glow field — lavender/violet shimmer, masked to center */}
      <DottedGlowBackground
        color="#253244"
        glowColor="#96d9ff"
        gap={16}
        radius={1.7}
        speedMin={1.2}
        speedMax={4.5}
      />
      {/* Violet halo behind the card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(150,217,255,0.16), transparent 62%)' }}
        aria-hidden="true"
      />

      {/* Wordmark → back home, pinned top-left (clears the notch) */}
      <Link
        to="/"
        className="absolute z-20 inline-flex items-center gap-2 rounded text-[#e3e8ff] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96d9ff]/50"
        style={{
          top: 'calc(env(safe-area-inset-top) + 1.75rem)',
          left: 'calc(env(safe-area-inset-left) + 1.75rem)',
        }}
      >
        <OndelLogo className="h-6 w-6" />
        <span className="font-inter text-lg font-semibold tracking-tight">Ondel</span>
      </Link>

      <div className="relative z-10 w-full max-w-[400px]">
        <h1 className="text-display text-white">Enter your code</h1>
        <p className="mt-3 font-inter text-[15px] leading-relaxed text-[#9095a4]">
          We sent a 6-digit code to your email. Enter it below to continue.
        </p>

        {/* Glass card */}
        <div
          className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-white/[0.07] bg-[#16171f]/70 px-4 py-6 backdrop-blur-md sm:p-6"
          style={{ boxShadow: '0px 2px 3px 0px rgba(19,0,77,0.35)' }}
        >
          <OTPInput
            maxLength={6}
            value={code}
            onChange={setCode}
            onComplete={verify}
            aria-label="Verification code"
            containerClassName="group flex items-center justify-center has-[:disabled]:opacity-40"
            render={({ slots }) => (
              <>
                <div className="flex">
                  {slots.slice(0, 3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
                <FakeDash />
                <div className="flex">
                  {slots.slice(3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              </>
            )}
          />

          {/* Violet-glow CTA */}
          <button
            type="button"
            onClick={verify}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#96d9ff] font-inter text-[15px] font-semibold text-[#06131c] transition-[box-shadow,background-color] hover:bg-[#aee2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7ebff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d12]"
            style={{ boxShadow: '0 0 26px 0 rgba(150,217,255,0.45), inset 1px 1px 1px 0 rgba(255,255,255,0.4)' }}
          >
            Verify
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <p className="font-inter text-[13px] text-[#636475]">
            Didn&apos;t get a code?{' '}
            <button
              type="button"
              onClick={() => setCode('')}
              className="rounded text-[#ccd1e9] transition-colors hover:text-[#e3e8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96d9ff]/50"
            >
              Resend
            </button>
          </p>
        </div>

        <p className="mt-6 text-center font-inter text-[14px] text-[#9095a4]">
          New to Ondel?{' '}
          <Link
            to="/"
            className="rounded text-[#ccd1e9] underline-offset-4 transition-colors hover:text-[#e3e8ff] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96d9ff]/50"
          >
            Request an invite
          </Link>
        </p>
      </div>
    </main>
  )
}
