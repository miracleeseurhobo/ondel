import { memo, useEffect, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export type DisplayCardProps = {
  icon: ReactNode
  title: string
  description: string
  date: string
}

// Accent palette the cards cycle through (blue → fuchsia → emerald).
const PALETTE = [
  { badge: '#3b82f6', text: '#2563eb' },
  { badge: '#d946ef', text: '#c026d3' },
  { badge: '#10b981', text: '#059669' },
]

// Fanned stack offsets (down-right); front card is last / on top.
const OFFSETS = [
  { x: -46, y: -34 },
  { x: 0, y: 0 },
  { x: 46, y: 34 },
]

// A stacked preview deck: each card floats in a continuous wave (staggered
// phase) and the accent colours rotate between cards on a calm timer. Reduced
// motion holds it still.
function DisplayCards({ cards, loop = false }: { cards: DisplayCardProps[]; loop?: boolean }) {
  const reduced = useReducedMotion()
  const [shift, setShift] = useState(0)

  useEffect(() => {
    if (!loop || reduced) return
    const id = setInterval(() => setShift((s) => s + 1), 2600)
    return () => clearInterval(id)
  }, [loop, reduced])

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {cards.map((c, i) => {
        const off = OFFSETS[i] ?? { x: 0, y: 0 }
        const color = PALETTE[(i + shift) % PALETTE.length]
        return (
          <motion.div
            key={i}
            className="[grid-area:stack] flex min-h-[8rem] w-[15rem] select-none flex-col justify-between rounded-xl border border-hair bg-white/80 px-4 py-3 shadow-[0_12px_34px_-14px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:h-36 sm:w-[22rem]"
            style={{ zIndex: i }}
            initial={{ x: off.x, y: off.y }}
            animate={reduced ? { x: off.x, y: off.y } : { x: off.x, y: [off.y - 6, off.y + 6, off.y - 6] }}
            transition={{ x: { duration: 0 }, y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.55 } }}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full p-1.5 transition-colors duration-700" style={{ background: color.badge }}>
                {c.icon}
              </span>
              <p className="text-[15px] font-medium transition-colors duration-700" style={{ color: color.text }}>
                {c.title}
              </p>
            </div>
            <p className="text-[15px] text-subtle sm:whitespace-nowrap">{c.description}</p>
            <p className="text-[12px] text-faint">{c.date}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

export default memo(DisplayCards)
