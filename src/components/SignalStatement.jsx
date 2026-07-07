import { useRef } from 'react'
import { useRevealProgress } from '../hooks/useScrollProgress'
import Ripple from './Ripple'

const TEXT =
  'Your song already has a story unfolding. People who will love it. Places where it belongs. Opportunities quietly taking shape around it. Ondel helps you see that story before the world does.'

const WORDS = TEXT.split(' ')

// Manifesto — words brighten from dim to solid as you scroll through, driven by
// a single CSS variable (--reveal) so the browser recomputes each word's opacity
// from its own threshold (--i). Scroll up and they dim back. Opacity-only keeps
// it smooth and Safari-safe; reduced motion shows everything solid.
export default function SignalStatement() {
  const ref = useRef(null)
  const { progress } = useRevealProgress(ref)
  const reveal = progress
  const last = WORDS.length - 1

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#fafafa] px-6 py-28 sm:py-36">
      {/* Signal ripple field — "opportunities quietly taking shape around it" */}
      <Ripple className="absolute inset-0" numCircles={6} baseSize={240} step={116} baseOpacity={0.36} />
      <p
        className="relative z-10 mx-auto max-w-4xl text-center font-display leading-[1.3] tracking-tight text-neutral-900 text-[clamp(1.6rem,3vw,2.5rem)]"
        style={{ '--reveal': reveal }}
      >
        {WORDS.map((w, i) => (
          <span
            key={i}
            className="reveal-word"
            // Spread thresholds across [0, 0.94] so the final word reaches full
            // opacity exactly when --reveal hits 1.
            style={{ '--i': ((i / last) * 0.94).toFixed(4) }}
          >
            {i < last ? `${w} ` : w}
          </span>
        ))}
      </p>
    </section>
  )
}
