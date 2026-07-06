import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function ShimmeringText({
  text,
  duration = 1,
  transition,
  wave = false,
  className,
  color = '#737373', // neutral-500
  shimmeringColor = '#d4d4d4', // neutral-300
  ...props
}) {
  const reduced = usePrefersReducedMotion()

  // Reduced motion: render the text statically — the shimmer is an infinite
  // loop, so it must not run when the user has asked for reduced motion.
  if (reduced) {
    return (
      <span className={cn('relative inline-block', className)} style={{ color }} {...props}>
        {text}
      </span>
    )
  }

  return (
    <motion.span
      className={cn('relative inline-block [perspective:500px]', className)}
      style={{
        '--shimmering-color': shimmeringColor,
        '--color': color,
        color: 'var(--color)',
      }}
      {...props}
    >
      {text?.split('')?.map((char, i) => (
        <motion.span
          animate={{
            ...(wave
              ? {
                  x: [0, 5, 0],
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                  rotateY: [0, 15, 0],
                }
              : {}),
            color: ['var(--color)', 'var(--shimmering-color)', 'var(--color)'],
          }}
          className="inline-block whitespace-pre [transform-style:preserve-3d]"
          initial={{
            ...(wave
              ? {
                  scale: 1,
                  rotateY: 0,
                }
              : {}),
            color: 'var(--color)',
          }}
          key={i}
          transition={{
            duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'loop',
            repeatDelay: text.length * 0.05,
            delay: (i * duration) / text.length,
            ease: 'easeInOut',
            ...transition,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default ShimmeringText
