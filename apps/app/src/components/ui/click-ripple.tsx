import { Fragment, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Page-level click ripple: bold expanding double-ring water wake from the pointer
// on any click within the host element. Rendered ON TOP (pointer-events-none) so
// it reads clearly without blocking interaction. Attach `onPointerDown` to a
// `relative overflow-hidden` container and render `rippleLayer` inside it.
type Ripple = { id: number; x: number; y: number }
const EASE = [0.23, 1, 0.32, 1] as const

export function useClickRipple({ color = 'var(--ds-accent)', size = 360 }: { color?: string; size?: number } = {}) {
  const reduced = useReducedMotion()
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const id = nextId.current++
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
  }

  const remove = (id: number) => setRipples((x) => x.filter((y) => y.id !== id))

  const rippleLayer: ReactNode = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {ripples.map((r) => (
        <Fragment key={r.id}>
          {/* leading ring — bold */}
          <motion.span
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: size, height: size, opacity: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="absolute rounded-full border-[3px]"
            style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)', borderColor: color }}
          />
          {/* trailing ring — larger, softer wake */}
          <motion.span
            initial={{ width: 0, height: 0, opacity: 0.4 }}
            animate={{ width: size * 1.3, height: size * 1.3, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.07 }}
            onAnimationComplete={() => remove(r.id)}
            className="absolute rounded-full border-2"
            style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)', borderColor: color }}
          />
        </Fragment>
      ))}
    </div>
  )

  return { onPointerDown, rippleLayer }
}
