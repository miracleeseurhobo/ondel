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

// Reference DisplayCard look & feel (border-2, frosted bg, right-edge fade into
// the panel) — with our wavy float animation and content kept intact.
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
            <div className="relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-hair bg-white/70 px-4 py-3 backdrop-blur-sm transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[color:var(--ds-surface-2)] after:to-transparent after:content-[''] hover:bg-white [&>*]:flex [&>*]:items-center [&>*]:gap-2">
              <div>
                <span className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/[0.06]">
                  {c.icon}
                </span>
                <p className={cn('text-lg font-medium', c.titleClassName ?? 'text-blue-600')}>{c.title}</p>
              </div>
              <p className="whitespace-nowrap text-[15px] text-subtle">{c.description}</p>
              <p className="text-[13px] text-faint">{c.date}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default memo(DisplayCards)
