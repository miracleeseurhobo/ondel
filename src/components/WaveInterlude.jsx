import { useState, useEffect } from 'react'
import VaporizeTextCycle from './VaporizeText'

// Standalone section: vaporizing headline + film-strip carousel. No chatbox,
// no hero overlap — a normal section in the flow.
export default function WaveInterlude() {
  const [fontSize, setFontSize] = useState(40)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setFontSize(Math.round(Math.min(54, Math.max(20, w * 0.04))))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section className="relative bg-[#fafafa] py-16 sm:py-20">
      <div className="flex flex-col items-center gap-8 sm:gap-10">
        {/* Vaporizing headline */}
        <div className="h-32 w-full max-w-5xl px-5 sm:h-36">
          <VaporizeTextCycle
            texts={['Discover where your music belongs.']}
            font={{
              fontFamily: 'Instrument Serif, ui-serif, Georgia, serif',
              fontSize: `${fontSize}px`,
              fontWeight: 400,
            }}
            color="rgb(23, 23, 23)"
            spread={4}
            density={6}
            animation={{ vaporizeDuration: 2.2, fadeInDuration: 1.2, waitDuration: 1 }}
            direction="left-to-right"
            alignment="center"
            tag="h2"
            loop={false}
          />
        </div>

        {/* Film-strip carousel — full-bleed, auto-playing loop */}
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
