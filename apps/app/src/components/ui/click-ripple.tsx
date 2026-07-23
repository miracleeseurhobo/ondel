import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Page-level click ripple: a ripple emanates from the pointer on any click within
// the host element. Same visual language as the OTP slot ripple, scaled up for a
// full surface. Reduced-motion safe. Attach `onPointerDown` to a
// `relative overflow-hidden` container and render `rippleLayer` as its first child
// (behind content, which should sit `relative z-10`).
type Ripple = { id: number; x: number; y: number }
const EASE = [0.23, 1, 0.32, 1] as const

export function useClickRipple({ color = 'var(--ds-accent)', size = 260 }: { color?: string; size?: number } = {}) {
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
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.14 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.62, ease: EASE }}
            onAnimationComplete={() => setRipples((x) => x.filter((y) => y.id !== r.id))}
            className="absolute rounded-full"
            style={{ left: r.x, top: r.y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, background: color }}
          />
        ))}
      </AnimatePresence>
    </div>
  )

  return { onPointerDown, rippleLayer }
}
