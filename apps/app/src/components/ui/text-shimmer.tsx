import { motion } from 'framer-motion'
import { memo, useMemo, type CSSProperties, type ElementType } from 'react'
import { cn } from '../../lib/utils'

export type TextShimmerProps = {
  children: string
  as?: ElementType
  className?: string
  duration?: number
  spread?: number
}

// A shimmer that sweeps a brighter highlight across muted text — signals an
// in-progress / "thinking" state. Theme-aware: base = muted text, highlight =
// primary text (via --ds-* tokens), so it works in light and dark unchanged.
function TextShimmerComponent({ children, as: Component = 'span', className, duration = 2, spread = 2 }: TextShimmerProps) {
  const MotionComponent = motion.create(Component as ElementType)
  const dynamicSpread = useMemo(() => children.length * spread, [children, spread])

  return (
    <MotionComponent
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{ repeat: Infinity, duration, ease: 'linear' }}
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
        '[--base-color:var(--ds-text-muted)] [--base-gradient-color:var(--ds-text)]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        className,
      )}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: 'var(--bg), linear-gradient(var(--base-color), var(--base-color))',
        } as CSSProperties
      }
    >
      {children}
    </MotionComponent>
  )
}

export const TextShimmer = memo(TextShimmerComponent)
