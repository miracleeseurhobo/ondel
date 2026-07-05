import Reveal from './Reveal'

// Standalone section: a quiet headline over the film-strip carousel. The
// carousel (product UI) is the moment here — no particle/canvas effect, so it
// doesn't compete with the ASCII wave or the magic-text reveal elsewhere.
export default function WaveInterlude() {
  return (
    <section className="relative bg-[#fafafa] py-16 sm:py-20">
      <div className="flex flex-col items-center gap-8 sm:gap-12">
        <Reveal
          as="h2"
          className="max-w-3xl px-5 text-center text-display text-neutral-900"
        >
          Discover where your music belongs.
        </Reveal>

        {/* Film-strip carousel — full-bleed, auto-playing loop (WebM + MP4) */}
        <div className="w-full overflow-hidden">
          <video
            autoPlay
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
