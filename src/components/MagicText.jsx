import { Fragment } from 'react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const wordV = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 8 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

// Reveals a paragraph word-by-word — each word resolves from blurred + dim into
// focus, staggered, once as it scrolls into view. One-shot blur (perf-safe).
// Reduced motion renders the text immediately.
export default function MagicText({ text, className = '' }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <p className={className}>{text}</p>

  const words = text.split(' ')
  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -20% 0px' }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span variants={wordV} className="inline-block">
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </motion.p>
  )
}
