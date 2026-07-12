import { useRef, useState, useEffect, Fragment } from 'react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

// "Overflow reveal": each word sits in an overflow-hidden box and slides up
// from below the mask into place, staggered word-by-word. Editorial-style
// entrance. Respects reduced motion (renders instantly).
export default function RevealText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 45,
  duration = 680,
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
      // Fire once the heading clears the pinned chatbox/blur zone at the bottom,
      // so the word-reveal is visible rather than playing while hidden behind it.
      { threshold: 0, rootMargin: '0px 0px -32% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden"
            // pad/negative-margin so descenders (g, y, p) aren't clipped
            style={{ paddingBottom: '0.14em', marginBottom: '-0.14em' }}
          >
            <span
              className="inline-block"
              style={{
                transform: shown ? 'translateY(0)' : 'translateY(115%)',
                opacity: shown ? 1 : 0,
                transition: reduced
                  ? 'none'
                  : `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay + i * stagger}ms, opacity ${duration}ms ease ${delay + i * stagger}ms`,
                willChange: 'transform, opacity',
              }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}
