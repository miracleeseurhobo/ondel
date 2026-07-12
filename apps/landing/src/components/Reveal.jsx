import { useRef, useState, useEffect } from 'react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

// Fades + lifts its children into view the first time they intersect.
// Respects reduced motion (renders immediately, no transition).
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  duration = 640,
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      // Negative bottom margin makes reveals fire once the element rises above
      // the pinned chatbox/blur zone at the bottom — so the entrance animation
      // is actually visible (in the clear area) rather than playing while hidden
      // behind the chatbox.
      { threshold: 0, rootMargin: '0px 0px -32% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: reduced
          ? 'none'
          : `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
