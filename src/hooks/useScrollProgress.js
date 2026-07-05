import { useState, useEffect, useRef } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

// Eases `target` toward its latest value each frame for smooth motion,
// so animation doesn't snap between coarse scroll steps. Self-stops when settled.
export function useSmoothed(target, smoothing = 0.12) {
  const [value, setValue] = useState(target)
  const cur = useRef(target)
  const raf = useRef(0)

  useEffect(() => {
    const tick = () => {
      const diff = target - cur.current
      if (Math.abs(diff) < 0.0004) {
        cur.current = target
        setValue(target)
        return
      }
      cur.current += diff * smoothing
      setValue(cur.current)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, smoothing])

  return value
}

// Progress 0..1 as `ref` element scrolls up through the viewport.
// 0 = element top at viewport top; 1 = element bottom reaches viewport bottom.
export function useScrollProgress(ref) {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (reduced) {
      setProgress(0)
      return
    }
    const el = ref.current
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1)
      setProgress(p)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, reduced])

  return { progress, reduced }
}
