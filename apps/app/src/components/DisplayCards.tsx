import { memo, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export type DisplayCardProps = {
  icon: ReactNode
  title: string
  description: string
  date: string
  badgeClassName?: string
  titleClassName?: string
}

// Fanned cascade offsets (down-right); front card is last / on top.
const OFFSETS = [
  { x: 0, y: 0 },
  { x: 64, y: 44 },
  { x: 128, y: 88 },
]

// The original skewed, glassy card look with static per-card colours — now
// floating in a continuous wave (staggered per-card phase). Reduced motion
// holds it still.
function DisplayCards({ cards, loop = false }: { cards: DisplayCardProps[]; loop?: boolean }) {
  const reduced = useReducedMotion()
  const wavy = loop && !reduced

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {cards.map((c, i) => {
        const off = OFFSETS[i] ?? { x: 0, y: 0 }
        return (
          <motion.div
            key={i}
            className="[grid-area:stack]"
            style={{ zIndex: i }}
            initial={{ x: off.x, y: off.y }}
            animate={wavy ? { x: off.x, y: [off.y - 6, off.y + 6, off.y - 6] } : { x: off.x, y: off.y }}
            transition={{ x: { duration: 0 }, y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.55 } }}
          >
            <div className="relative flex min-h-[8rem] w-[15rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-hair bg-white/70 px-4 py-3 backdrop-blur-sm sm:h-36 sm:w-[22rem] [&>*]:flex [&>*]:items-center [&>*]:gap-2">
              <div>
                <span className={cn('relative inline-block rounded-full p-1.5', c.badgeClassName ?? 'bg-blue-500')}>{c.icon}</span>
                <p className={cn('text-[15px] font-medium', c.titleClassName ?? 'text-blue-600')}>{c.title}</p>
              </div>
              <p className="text-[15px] text-subtle sm:whitespace-nowrap">{c.description}</p>
              <p className="text-[12px] text-faint">{c.date}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default memo(DisplayCards)
