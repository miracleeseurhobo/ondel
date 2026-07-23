import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Page-level click ripple: an expanding ring emanates from the pointer on any
// click within the host element — a visible water-ripple. Rendered ON TOP as a
// thin ring (pointer-events-none) so it reads clearly without obscuring content.
// Attach `onPointerDown` to a `relative overflow-hidden` container and render
// `rippleLayer` inside it.
type Ripple = { id: number; x: number; y: number }
const EASE = [0.23, 1, 0.32, 1] as const

export function useClickRipple({ color = 'var(--ds-accent)', size = 340 }: { color?: string; size?: number } = {}) {
  const reduced = useReducedMotion()
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const id = nextId.current++
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
  }

  const rippleLayer: ReactNode = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: size, height: size, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            onAnimationComplete={() => setRipples((x) => x.filter((y) => y.id !== r.id))}
            className="absolute rounded-full border-2"
            style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)', borderColor: color }}
          />
        ))}
      </AnimatePresence>
    </div>
  )

  return { onPointerDown, rippleLayer }
}
