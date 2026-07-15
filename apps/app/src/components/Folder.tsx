import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

type FolderColor = 'blue' | 'black' | 'grey' | 'yellow' | 'orange' | 'red'
type FolderSize = 'sm' | 'md'

const sizeMap: Record<FolderSize, { container: string; tabLeft: string; tabRight: string; tabBridge: string; flapBody: string; papers: string; paperOffset: string; paperH: string; paperContent: string; hoverY: number; hoverBackY: number }> = {
  sm: { container: 'size-24 rounded-[24px]', tabLeft: 'w-9 h-3 rounded-tl-lg', tabRight: 'w-2 h-3 rounded-tr-[24px]', tabBridge: 'w-2 h-2', flapBody: 'h-9 rounded-b-[24px]', papers: 'inset-x-5 top-2', paperOffset: 'top-1', paperH: 'h-16', paperContent: 'pt-2.5 px-2.5 space-y-1', hoverY: -3, hoverBackY: -4 },
  md: { container: 'size-32 rounded-[32px]', tabLeft: 'w-12 h-4 rounded-tl-lg', tabRight: 'w-2.5 h-4 rounded-tr-[32px]', tabBridge: 'w-2.5 h-2.5', flapBody: 'h-12 rounded-b-[32px]', papers: 'inset-x-6 top-3', paperOffset: 'top-1.5', paperH: 'h-24', paperContent: 'pt-3 px-3 space-y-1', hoverY: -3, hoverBackY: -5 },
}

const colorMap: Record<FolderColor, { folder: string; flap: string; paperBack: string; paperFront: string; paperLine: string; paperBorder: string; folderBorder: string }> = {
  blue: { folder: 'from-blue-400 to-blue-500', flap: 'bg-blue-300/50', paperBack: 'bg-blue-100/60', paperFront: 'bg-blue-50', paperLine: 'bg-blue-300/40', paperBorder: 'border-blue-200', folderBorder: 'border-white/30' },
  black: { folder: 'from-neutral-800 to-neutral-900', flap: 'bg-neutral-600/50', paperBack: 'bg-neutral-500/60', paperFront: 'bg-neutral-100', paperLine: 'bg-neutral-300', paperBorder: 'border-neutral-500', folderBorder: 'border-white/10' },
  yellow: { folder: 'from-yellow-400 to-yellow-500', flap: 'bg-yellow-200/50', paperBack: 'bg-yellow-100/60', paperFront: 'bg-yellow-50', paperLine: 'bg-yellow-400/40', paperBorder: 'border-yellow-200', folderBorder: 'border-white/30' },
  orange: { folder: 'from-orange-400 to-orange-500', flap: 'bg-orange-300/50', paperBack: 'bg-orange-100/60', paperFront: 'bg-orange-50', paperLine: 'bg-orange-400/40', paperBorder: 'border-orange-200', folderBorder: 'border-white/30' },
  red: { folder: 'from-red-400 to-red-500', flap: 'bg-red-300/50', paperBack: 'bg-red-100/60', paperFront: 'bg-red-50', paperLine: 'bg-red-400/40', paperBorder: 'border-red-200', folderBorder: 'border-white/30' },
  grey: { folder: 'from-gray-400 to-gray-500', flap: 'bg-gray-300/50', paperBack: 'bg-gray-200/60', paperFront: 'bg-gray-100', paperLine: 'bg-gray-400/40', paperBorder: 'border-gray-300', folderBorder: 'border-white/40' },
}

const spring = { type: 'spring', stiffness: 300, damping: 22 } as const

// The colourful folder graphic (adapted to framer-motion + Tailwind v3).
function FolderGraphic({ color, size = 'md' }: { color: FolderColor; size?: FolderSize }) {
  const c = colorMap[color]
  const s = sizeMap[size]
  return (
    <motion.div
      aria-hidden
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{ rest: {}, hover: {} }}
      className={cn('relative overflow-hidden border-t-2 bg-gradient-to-b', s.container, c.folder, c.folderBorder)}
    >
      {/* front flap */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="flex items-end">
          <div className={cn(s.tabLeft, 'backdrop-blur-sm', c.flap)} />
          <div className={cn(s.tabRight, 'backdrop-blur-sm', c.flap)} />
          <div className={cn(s.tabBridge, '[mask-image:radial-gradient(200%_200%_at_100%_0%,transparent_50%,black_50%)]', c.flap)} />
        </div>
        <div className={cn(s.flapBody, 'rounded-tr-xl backdrop-blur-sm', c.flap)} />
      </div>

      {/* papers */}
      <div className={cn('absolute z-10', s.papers)}>
        <motion.div variants={{ rest: { rotate: 4, y: 0, transition: spring }, hover: { rotate: 6, y: s.hoverBackY, transition: spring } }} style={{ originY: 1 }} className={cn('absolute inset-x-0 rounded-2xl', s.paperOffset, s.paperH, c.paperBack)} />
        <motion.div variants={{ rest: { rotate: -4, y: 0, transition: spring }, hover: { rotate: -6, y: s.hoverBackY, transition: spring } }} style={{ originY: 1 }} className={cn('absolute inset-x-0 rounded-2xl', s.paperOffset, s.paperH, c.paperBack)} />
        <motion.div variants={{ rest: { y: 0, transition: spring }, hover: { y: s.hoverY, transition: spring } }} className={cn('absolute inset-x-0 top-0 rounded-xl border-t', s.paperH, c.paperFront, c.paperBorder)}>
          <div className={s.paperContent}>
            <div className={cn('h-1 w-3/4 rounded-full', c.paperLine)} />
            <div className={cn('h-1 w-1/2 rounded-full', c.paperLine)} />
            <div className={cn('h-1 w-2/3 rounded-full', c.paperLine)} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Grid folder: colourful graphic + label/count below (same grid API as before).
export default function Folder({ label, count, empty, color = 'blue', onClick }: { label: string; count: number; empty?: boolean; color?: FolderColor; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex w-full items-center justify-center outline-none">
      {/* Grey hover card hugs the folder + label with even padding on all sides */}
      <span className="flex flex-col items-center rounded-[44px] p-3 transition-[background-color,transform] duration-150 group-hover:bg-[color:var(--ds-surface-2)] group-active:scale-[0.96] group-focus-visible:ring-2 group-focus-visible:ring-brand/40">
        <FolderGraphic color={empty ? 'grey' : color} size="md" />
        <div className="mt-2.5 w-32 text-center">
          <div className="truncate text-[13px] font-medium" style={{ color: 'var(--ds-text)' }}>
            {label}
          </div>
          <div className="text-[12px] tabular-nums" style={{ color: 'var(--ds-text-muted)' }}>
            {count} file{count === 1 ? '' : 's'}
          </div>
        </div>
      </span>
    </button>
  )
}
