import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon, type IconName } from './ui/icon'

// Compact flat folder for a tight, even grid. Papers peek and lift slightly on
// hover; small badges hint at what's inside. Theme-agnostic folder greys.
export default function Folder({
  label,
  count,
  empty,
  badges = [],
  onClick,
}: {
  label: string
  count: number
  empty?: boolean
  badges?: { icon: IconName; hue: string }[]
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const spring = { type: 'spring' as const, stiffness: 260, damping: 22 }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group flex w-full flex-col items-start rounded-xl p-2 outline-none transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)] focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="relative w-full" style={{ aspectRatio: '1.4' }}>
        {/* back panel + tab */}
        <div className="absolute inset-x-0 bottom-0 top-[14%] rounded-[10px]" style={{ background: '#8a8a92' }} />
        <div className="absolute left-[6%] top-0 h-[22%] w-[42%] rounded-t-[8px]" style={{ background: '#8a8a92' }} />

        {/* papers */}
        {!empty
          ? [0, 1].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-[6px] bg-white shadow-sm"
                style={{ left: `${18 + i * 8}%`, right: `${16 - i * 8}%`, top: '10%', height: '58%', zIndex: 1 }}
                initial={false}
                animate={{ y: hover ? -8 - i * 3 : -2 - i, rotate: i === 0 ? -2 : 2 }}
                transition={spring}
              >
                <div className="flex flex-col gap-1 p-2">
                  <div className="h-1 w-2/3 rounded-full bg-[#dcdce2]" />
                  <div className="h-1 w-full rounded-full bg-[#e6e6ea]" />
                  <div className="h-1 w-4/5 rounded-full bg-[#e6e6ea]" />
                </div>
              </motion.div>
            ))
          : null}

        {/* front */}
        <motion.div
          className="absolute inset-x-0 bottom-0 top-[30%] overflow-hidden rounded-[10px]"
          style={{ zIndex: 2, background: 'linear-gradient(180deg, #74747c 0%, #656569 100%)', boxShadow: '0 6px 14px -8px rgba(0,0,0,0.4)' }}
          animate={{ y: hover ? -1 : 0 }}
          transition={spring}
        >
          {/* badges */}
          {badges.length ? (
            <div className="absolute bottom-1.5 left-2 flex -space-x-1.5">
              {badges.map((b, i) => (
                <span key={i} className="flex h-5 w-5 items-center justify-center rounded-md ring-[1.5px] ring-[#656569]" style={{ background: b.hue }}>
                  <Icon name={b.icon} size={11} className="text-white" />
                </span>
              ))}
            </div>
          ) : null}
          {empty ? <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white/45">Empty</span> : null}
        </motion.div>
      </div>

      <div className="mt-1.5 w-full text-left">
        <div className="truncate text-[13px] font-medium" style={{ color: 'var(--ds-text)' }}>
          {label}
        </div>
        <div className="text-[12px] tabular-nums" style={{ color: 'var(--ds-text-muted)' }}>
          {count} file{count === 1 ? '' : 's'}
        </div>
      </div>
    </button>
  )
}
