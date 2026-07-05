import { memo } from 'react'
import { Radar, AudioLines, TrendingUp } from 'lucide-react'

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
}) {
  return (
    <div
      className={cn(
        'relative flex h-32 w-[15rem] sm:h-36 sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-neutral-200 bg-white/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 hover:border-neutral-300 hover:bg-white [&>*]:flex [&>*]:items-center [&>*]:gap-2',
        className,
      )}
    >
      <div>
        <span className={cn('relative inline-block rounded-full p-1.5', badgeClassName)}>
          {icon}
        </span>
        <p className={cn('text-body font-medium', titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-body text-neutral-700">{description}</p>
      <p className="text-body-sm text-neutral-400">{date}</p>
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

function DisplayCards({ cards }) {
  const displayCards = cards || defaultCards
  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  )
}

// Memoized: props are stable, so it won't re-render on every scroll frame when
// its parent re-renders (fixing-motion-performance — reduce per-frame work).
export default memo(DisplayCards)
