import { useRef, useState, useEffect } from 'react'
import Hero from './components/Hero'
import SignalStatement from './components/SignalStatement'
import WaveInterlude from './components/WaveInterlude'
import Section2 from './components/Section2'
import CreatorPlan from './components/CreatorPlan'
import Faq from './components/Faq'
import AntigravityCard from './components/AntigravityCard'
import SiteFooter from './components/SiteFooter'
import { useScrollProgress } from './hooks/useScrollProgress'

export default function App() {
  const stageRef = useRef(null)
  const planRef = useRef(null)
  const { progress, reduced } = useScrollProgress(stageRef)
  const [planNear, setPlanNear] = useState(false)

  // Hide the chatbox as the section right after Section 2 (the creator-plan
  // dashboard) approaches, so the pinned chatbox vanishes gracefully on the way
  // out instead of snapping.
  useEffect(() => {
    const el = planRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setPlanNear(entry.isIntersecting),
      // Fires while the section is still below the fold, so the chatbox is gone
      // just before it enters — but late enough to linger through "Ask Ondie".
      { rootMargin: '0px 0px 12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* Scroll stage: tall so the sticky hero pins and the video zooms while scrolling. */}
      <section ref={stageRef} className={reduced ? 'relative z-0 h-dvh' : 'relative z-0 h-[280vh]'}>
        <div className={reduced ? 'h-dvh overflow-hidden' : 'sticky top-0 h-dvh overflow-hidden'}>
          <Hero progress={reduced ? 0 : progress} />
        </div>
      </section>

      {/* Section 2's first row is scroll-linked to the hero's white-out, so the
          same scroll carries the transition straight into content — no empty
          gap to scroll past after the parallax. */}
      <Section2 progress={reduced ? 1 : progress} reduced={reduced} hideChatbox={planNear} />

      {/* Bold product beat — "turn one song into weeks of content" + dashboard
          mock. Chatbox vanishes as this approaches. */}
      <div ref={planRef}>
        <CreatorPlan />
      </div>

      {/* Manifesto statement — words brighten progressively as you scroll through */}
      <SignalStatement />

      {/* Particle headline + film-strip carousel — its own section (no chatbox) */}
      <WaveInterlude />

      {/* FAQ — resolve objections right before the closing CTA */}
      <Faq />

      {/* Dark CTA card above the footer — ASCII field + headline + buttons */}
      <AntigravityCard />

      {/* Site footer — giant wordmark + link columns inside a blueprint frame */}
      <SiteFooter />
    </>
  )
}
