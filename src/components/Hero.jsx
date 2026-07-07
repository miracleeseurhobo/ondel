import { useState, useRef, useEffect } from 'react'
import { Menu, X, ArrowRight, MoreHorizontal } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

const OndelLogo = ({ className }) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    aria-label="Ondel logo"
  >
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

const navLinks = ['Product', 'Pricing', 'FAQs', 'Blog', 'X(Twitter)']

// Focal point — the glowing headphone earcup ring the footage dollies into.
const FOCAL_X = 48 // %
const FOCAL_Y = 42 // %
const MAX_ZOOM = 0.22 // subtle CSS push on top of the filmed dolly (1.0 -> 1.22)
const WHITE_START = 0.6 // progress at which the earcup light blooms

// Video timeline (seconds). Rest loops the ambient crowd; scroll scrubs the
// filmed push into the headphone earcup ring.
const REST_LOOP_END = 4.5
const SCRUB_START = 4.5
const SCRUB_END = 9.9
// Progress at which the scrub reaches the glowing earcup ring — matched to the
// white flood so the zoomed-in white light and the light-mode white-out sync.
const SCRUB_COMPLETE = 0.88

const clamp01 = (t) => Math.min(Math.max(t, 0), 1)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeIn = (t) => t * t

export default function Hero({ progress = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const videoRef = useRef(null)
  const scrubbing = useRef(false)
  const reduced = usePrefersReducedMotion()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert(`You're on the next wave. We'll let you know when Ondel is ready to hear your music.`)
      setEmail('')
    }
  }

  // Drive the scrub/zoom/flood directly from scroll (no smoothing lag) so the
  // transition can never fall behind fast scrolling and expose the video edge.
  const p = progress

  // Loop the ambient crowd (0..REST_LOOP_END) while at rest.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => {
      if (!scrubbing.current && v.currentTime >= REST_LOOP_END) {
        v.currentTime = 0
      }
    }
    v.addEventListener('timeupdate', onTime)
    return () => v.removeEventListener('timeupdate', onTime)
  }, [])

  // Scroll drives the video: at rest it plays/loops; scrolling scrubs the
  // filmed dolly into the earcup ring by mapping progress -> currentTime.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (p > 0.004) {
      scrubbing.current = true
      if (!v.paused) v.pause()
      const t =
        SCRUB_START + Math.min(p / SCRUB_COMPLETE, 1) * (SCRUB_END - SCRUB_START)
      if (Math.abs(v.currentTime - t) > 0.015) {
        try {
          v.currentTime = t
        } catch {
          /* seek not ready yet */
        }
      }
    } else {
      scrubbing.current = false
      if (!reduced && v.paused) v.play().catch(() => {})
    }
  }, [p, reduced])

  // Reduced motion: hold the background video on a static frame instead of
  // looping the ambient crowd.
  useEffect(() => {
    const v = videoRef.current
    if (v && reduced) {
      v.pause()
      v.currentTime = 0
    }
  }, [reduced])

  const videoScale = 1 + p * MAX_ZOOM
  // Headset light blooms outward, then floods to full #fafafa by ~0.88 — so the
  // screen is fully white before Section 2's first row rises out of it.
  const whiteP = easeIn(clamp01((p - WHITE_START) / (1 - WHITE_START)))
  const floodP = clamp01((p - 0.72) / 0.16)
  const contentP = easeOut(clamp01(p / 0.35))
  const contentOpacity = 1 - contentP
  const contentShift = contentP * -40

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        aria-hidden="true"
        autoPlay={!reduced}
        muted
        playsInline
        preload="auto"
        style={{ transform: `scale(${videoScale})`, transformOrigin: `${FOCAL_X}% ${FOCAL_Y}%` }}
        className="absolute inset-0 w-full h-full object-cover [object-position:60%_center] md:[object-position:center_center] will-change-transform"
      >
        <source src="/wave-scrub.mp4" type="video/mp4" />
      </video>

      {/* Base cinematic gradient — fades as the light takes over */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75"
        style={{ opacity: 1 - whiteP }}
      />
      {/* Headset light bloom — grows from the focal point */}
      <div
        className="absolute inset-0"
        style={{
          opacity: whiteP,
          background: `radial-gradient(circle at ${FOCAL_X}% ${FOCAL_Y}%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 28%, rgba(255,255,255,0) 62%)`,
        }}
      />
      {/* Final flood — clean white-out handoff into Section 2 (#fafafa) */}
      <div className="absolute inset-0 bg-[#fafafa]" style={{ opacity: floodP }} />

      {/* Content Layer */}
      <div
        className="relative z-10 flex h-full flex-col"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentShift}px)`,
          pointerEvents: contentOpacity < 0.1 ? 'none' : 'auto',
          // Keep nav/text clear of the notch, Dynamic Island, home indicator and
          // landscape sensor housing while the video floods edge-to-edge behind.
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {/* Navigation */}
        <nav className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 sm:py-6">
          <a href="#" className="flex items-center gap-2 text-white">
            <OndelLogo className="w-5 h-5 flex-shrink-0" />
            <span className="font-inter font-semibold text-lg tracking-tight">Ondel</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="rounded text-body text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {link}
              </a>
            ))}
            <a href="#signin" className="inline-flex items-center text-button text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md rounded-full px-5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
              Sign in
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden mx-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-5">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded text-body text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {link}
                </a>
              ))}
              <a
                href="#signin"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex min-h-[44px] w-full items-center justify-center text-button text-white bg-white/10 border border-white/15 rounded-full px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Sign in
              </a>
            </div>
          </div>
        )}

        {/* Hero content — bottom anchored */}
        <main className="flex-1 flex flex-col items-center justify-end text-center px-5 pb-14 sm:pb-20 lg:pb-24 [@media(max-height:600px)]:!pb-6">
          <h1 className="text-display text-white max-w-[900px]">
            Know your release before the world does.
          </h1>
          <p className="mt-5 [@media(max-height:600px)]:mt-2 text-body text-white/60 max-w-[560px]">
            Ondel helps independent artists discover playlists, audience signals, and hidden opportunities with an AI release manager built for music before and after release.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 [@media(max-height:600px)]:mt-4 flex items-center gap-2 w-full max-w-[460px] rounded-full bg-white/10 backdrop-blur-md border border-white/15 p-1 pl-5 transition-colors focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/40"
          >
            <label htmlFor="hero-email" className="sr-only">
              Email address
            </label>
            <input
              id="hero-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-transparent text-white placeholder-white/40 text-body py-2.5 outline-none"
            />
            <MoreHorizontal className="hidden sm:block w-5 h-5 text-white/40 flex-shrink-0" aria-hidden="true" />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-white text-ink text-button rounded-full px-5 py-3.5 hover:bg-white/90 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              Request Invite
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-5 [@media(max-height:600px)]:mt-2 max-w-[420px] text-body-sm font-normal leading-normal text-white/50">
            We're onboarding a small group of independent artists and teams
            building their next release.
          </p>
        </main>
      </div>
    </div>
  )
}
