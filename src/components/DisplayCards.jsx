import { memo, useState, useEffect } from 'react'
import { Radar, AudioLines, TrendingUp } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function DisplayCard({
  className,
  icon = <Radar className="size-4 text-white" />,
  title = 'Featured',
  description = 'Discover amazing content',
  date = 'Just now',
  badgeClassName = 'bg-blue-500',
  titleClassName = 'text-blue-600',
  // Surface + body text are themeable so the deck can render light (landing) or
  // frosted-glass (sign-in) without a second component. Defaults = landing look.
  surfaceClassName = 'border-2 border-neutral-200 bg-white/70 backdrop-blur-sm hover:border-neutral-300 hover:bg-white',
  descClassName = 'text-neutral-700',
  dateClassName = 'text-neutral-400',
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[8rem] w-[15rem] sm:h-36 sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl px-4 py-3 transition-all duration-700 [&>*]:flex [&>*]:items-center [&>*]:gap-2',
        surfaceClassName,
        className,
      )}
    >
      <div>
        <span className={cn('relative inline-block rounded-full p-1.5', badgeClassName)}>
          {icon}
        </span>
        <p className={cn('text-body font-medium', titleClassName)}>{title}</p>
      </div>
      <p className={cn('text-body sm:whitespace-nowrap', descClassName)}>{description}</p>
      <p className={cn('text-body-sm', dateClassName)}>{date}</p>
    </div>
  )
}

// Right-edge fade — only the back cards (which peek out behind the front one)
// get it, so the front "Audience" card stays fully visible.
const afterFade =
  "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#fafafa] after:to-transparent after:content-['']"

const beforeOverlay =
  "before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:outline-1 before:outline-neutral-200 before:bg-[#fafafa]/60 before:bg-blend-overlay before:transition-opacity before:duration-700 before:content-[''] grayscale-[100%] hover:grayscale-0 hover:before:opacity-0"

const defaultCards = [
  {
    icon: <Radar className="size-4 text-white" />,
    badgeClassName: 'bg-blue-500',
    titleClassName: 'text-blue-600',
    title: 'Radar',
    description: '14 playlists match your sound.',
    date: '2 minutes ago',
    className: `[grid-area:stack] hover:-translate-y-10 ${afterFade} ${beforeOverlay}`,
  },
  {
    icon: <AudioLines className="size-4 text-white" />,
    badgeClassName: 'bg-fuchsia-500',
    titleClassName: 'text-fuchsia-600',
    title: 'Song Signal',
    description: 'This chorus has strong replay potential.',
    date: '0:42–0:57',
    className: `[grid-area:stack] translate-x-7 translate-y-8 hover:-translate-y-1 sm:translate-x-16 sm:translate-y-10 ${afterFade} ${beforeOverlay}`,
  },
  {
    icon: <TrendingUp className="size-4 text-white" />,
    badgeClassName: 'bg-emerald-500',
    titleClassName: 'text-emerald-600',
    title: 'Audience',
    description: 'New audience growth in Germany.',
    date: '+42% listeners this month',
    className: `[grid-area:stack] translate-x-14 translate-y-16 hover:translate-y-8 sm:translate-x-32 sm:translate-y-20 sm:hover:translate-y-10 ${afterFade}`,
  },
]

// `loop` auto-cycles the reveal (fan-out + colourise) on a calm timer instead of
// waiting for hover — for the ambient sign-in preview. Cards opt in by keying
// their motion on the group's data-open state (group-data-[open=true]:…), so the
// hover-driven landing deck is unaffected. Reduced motion holds the deck open.
function DisplayCards({ cards, loop = false }) {
  const displayCards = cards || defaultCards
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!loop) return
    if (reduced) {
      setOpen(true)
      return
    }
    const id = setInterval(() => setOpen((o) => !o), 2600)
    return () => clearInterval(id)
  }, [loop, reduced])

  return (
    <div
      data-open={open ? 'true' : 'false'}
      className="group grid [grid-template-areas:'stack'] place-items-center"
    >
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  )
}

// Memoized: props are stable, so it won't re-render on every scroll frame when
// its parent re-renders (fixing-motion-performance — reduce per-frame work).
export default memo(DisplayCards)
