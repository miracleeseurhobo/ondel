import { useState } from 'react'
import { motion } from 'framer-motion'

// A stylised folder whose "pages" fan up on hover; clicking opens it. Adapted
// from a motion/react reference to framer-motion + theme-neutral pages.
const PAGES = [
  { initial: { rotate: -3, x: -38, y: 2 }, open: { rotate: -8, x: -70, y: -55 }, transition: { type: 'spring' as const, bounce: 0.15, stiffness: 160, damping: 22 }, z: 'z-10' },
  { initial: { rotate: 0, x: 0, y: 0 }, open: { rotate: 1, x: 2, y: -75 }, transition: { type: 'spring' as const, bounce: 0.12, stiffness: 190, damping: 24 }, z: 'z-20' },
  { initial: { rotate: 3.5, x: 42, y: 1 }, open: { rotate: 9, x: 75, y: -60 }, transition: { type: 'spring' as const, bounce: 0.17, stiffness: 170, damping: 21 }, z: 'z-10' },
]

const Page = () => (
  <div className="h-full w-full rounded-xl bg-gradient-to-b from-[#f7f7f9] to-[#e9e9ee] p-3 shadow-lg">
    <div className="flex flex-col gap-1.5">
      <div className="h-1 w-2/3 rounded-full bg-[#d4d4dc]" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-1.5">
          <div className="h-1 flex-1 rounded-full bg-[#dcdce2]" />
          <div className="h-1 flex-1 rounded-full bg-[#dcdce2]" />
        </div>
      ))}
    </div>
  </div>
)

export default function Folder({ label, count, empty, onClick }: { label: string; count: number; empty?: boolean; onClick: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="group flex flex-col items-center rounded-2xl p-3 outline-none transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)] focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="relative h-44 w-72">
        {/* folder body (holds the pages) */}
        <div
          className="relative mx-auto flex h-full w-[87.5%] items-center justify-center"
          style={{ background: '#18151b', boxShadow: '0px 0px 15.7px 16px rgba(79,73,85,0.30) inset', borderRadius: 10 }}
        >
          {PAGES.map((p, i) => (
            <motion.div key={i} initial={p.initial} animate={open && !empty ? p.open : p.initial} transition={p.transition} className={`absolute top-2 h-fit w-28 rounded-xl ${p.z} shadow-md`}>
              <Page />
            </motion.div>
          ))}
          {empty ? <span className="relative z-30 text-[12px] font-medium text-white/40">Empty</span> : null}
        </div>

        {/* front flap */}
        <motion.div
          animate={{ rotateX: open ? -38 : 0 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
          className="absolute -bottom-px -left-px -right-px z-20 flex h-40 origin-bottom items-center justify-center overflow-visible rounded-3xl"
        >
          <svg className="h-full w-full overflow-visible" viewBox="0 0 235 121" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z"
              fill="url(#folderFront)"
              stroke="url(#folderEdge)"
              strokeWidth="0.7"
            />
            <defs>
              <linearGradient id="folderFront" x1="114.7" y1="0.7" x2="114.7" y2="121.7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2d2535" />
                <stop offset="1" stopColor="#201f22" />
              </linearGradient>
              <linearGradient id="folderEdge" x1="114.7" y1="0.7" x2="114.7" y2="121.7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4a4a4a" stopOpacity="0.35" />
                <stop offset="1" stopColor="#212121" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-[14px] font-medium" style={{ color: 'var(--ds-text)' }}>
          {label}
        </div>
        <div className="text-[12px] tabular-nums" style={{ color: 'var(--ds-text-muted)' }}>
          {count} file{count === 1 ? '' : 's'}
        </div>
      </div>
    </button>
  )
}
