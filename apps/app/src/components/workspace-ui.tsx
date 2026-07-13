import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'

// Neutral design-system tokens (see design-system/color.md).
export const INK = '#171717' // neutral-900 — primary text
export const SUBTLE = '#737373' // neutral-500 — secondary text
export const FAINT = '#a3a3a3' // neutral-400 — muted text
export const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.12)'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Rise({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-xl bg-white ${className}`} style={{ boxShadow: CARD_SHADOW, ...style }}>
      {children}
    </div>
  )
}

export function PageHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <Rise>
      <h1 className="text-[24px] font-medium tracking-[-0.4px]" style={{ color: INK }}>
        {title}
      </h1>
      {sub ? (
        <p className="mt-1 text-[14px]" style={{ color: SUBTLE }}>
          {sub}
        </p>
      ) : null}
    </Rise>
  )
}

// Small colored icon tile used across pages.
export function IconTile({ tint, children }: { tint: string; children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: tint }}>
      {children}
    </span>
  )
}

export const TINTS = {
  blue: '#3D82DE',
  green: '#22B27B',
  purple: '#8A63E8',
  orange: '#E8804F',
  pink: '#E85F9C',
}
