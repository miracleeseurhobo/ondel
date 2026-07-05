import AsciiWave from './AsciiWave'

// Dark "anti-gravity" CTA card above the footer — headline + buttons on the
// left, the ASCII wave drifting as an atmospheric field on the right.
export default function AntigravityCard() {
  return (
    <section className="bg-[#fafafa] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="relative mx-auto flex min-h-[24rem] max-w-7xl items-center overflow-hidden rounded-[2rem] bg-[#0a0a0f] sm:min-h-[30rem]">
        {/* Atmospheric ASCII field (dark mode: light glyphs on the void) */}
        <AsciiWave
          accent="#7aa2ff"
          cell={12}
          speed={1}
          spread={0.3}
          className="absolute inset-0 h-full w-full opacity-70 mix-blend-screen"
        />
        {/* Darken the left so the copy stays legible over the field */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/75 to-transparent" />

        <div className="relative z-10 max-w-xl px-8 sm:px-14 lg:px-20">
          <h2 className="text-display max-w-[26rem] leading-[1.05] text-white">
            Stop guessing what happens next.
          </h2>
          <p className="mt-5 max-w-[24rem] text-body text-white/70">
            Plan better song releases with Ondel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="text-button rounded-full bg-white px-6 py-3 text-ink transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]">
              Join the beta
            </button>
            <button className="text-button rounded-full border border-white/15 bg-white/10 px-6 py-3 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
              See how it works
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
