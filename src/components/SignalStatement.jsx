import { useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

const TEXT =
  'Every song leaves clues about its future—who it will resonate with, where it belongs, and the opportunities quietly taking shape around it. Ondel reveals those hidden signals so you can make better decisions before you release.'

const WORDS = TEXT.split(' ')

// Map raw scroll progress into the reveal window: start once the section is a
// little into view and finish as it passes center, so the words stay lit while
// the statement sits centered on screen.
function easeReveal(p) {
  return Math.min(1, Math.max(0, (p - 0.12) / 0.5))
}

// Manifesto — words brighten from dim to solid as you scroll through, driven by
// a single CSS variable (--reveal) so the browser recomputes each word's opacity
// from its own threshold (--i). Scroll up and they dim back. Opacity-only keeps
// it smooth and Safari-safe; reduced motion shows everything solid.
export default function SignalStatement() {
  const ref = useRef(null)
  const { progress, reduced } = useScrollProgress(ref)
  const reveal = reduced ? 1 : easeReveal(progress)
  const last = WORDS.length - 1

  return (
    <section ref={ref} className="bg-[#fafafa] px-6 py-28 sm:py-36">
      <p
        className="mx-auto max-w-4xl text-center font-display leading-[1.3] tracking-tight text-neutral-900 text-[clamp(1.6rem,3vw,2.5rem)]"
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
