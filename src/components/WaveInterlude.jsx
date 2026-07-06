import { useRef, useEffect } from 'react'
import Reveal from './Reveal'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

// Standalone section: a quiet headline over the film-strip carousel. The
// carousel (product UI) is the moment here — no particle/canvas effect, so it
// doesn't compete with the ASCII wave or the magic-text reveal elsewhere.
export default function WaveInterlude() {
  const reduced = usePrefersReducedMotion()
  const videoRef = useRef(null)

  // The carousel loops forever; hold it on a static frame when the visitor
  // has asked for reduced motion (covers a preference toggled after mount).
  useEffect(() => {
    const v = videoRef.current
    if (v && reduced) {
      v.pause()
      v.currentTime = 0
    }
  }, [reduced])

  return (
    <section className="relative bg-[#fafafa] py-16 sm:py-20">
      <div className="flex flex-col items-center gap-10 sm:gap-14">
        <div className="flex flex-col items-center gap-5">
          <Reveal
            as="h2"
            className="max-w-3xl px-5 text-center text-display text-neutral-900"
          >
            Discover where your music belongs.
          </Reveal>
          <Reveal
            as="p"
            className="max-w-2xl px-5 text-center text-body text-neutral-500"
          >
            Ondel reads the signals in your music and points you to the
            playlists, audiences, and moments where it truly fits.
          </Reveal>
        </div>

        {/* Film-strip carousel — full-bleed loop (WebM + MP4); paused under
            reduced motion. */}
        <div className="w-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay={!reduced}
            loop
            muted
            playsInline
            preload="auto"
            className="h-[34vh] w-full object-cover sm:h-[40vh]"
          >
            <source src="/animo-film-strip.webm" type="video/webm" />
            <source src="/animo-film-strip.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
