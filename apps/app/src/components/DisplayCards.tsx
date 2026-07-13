import { memo, useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ListMusic } from 'lucide-react'

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export type DisplayCardProps = {
  className?: string
  icon?: ReactNode
  title?: string
  description?: string
  date?: string
  badgeClassName?: string
  titleClassName?: string
}

function DisplayCard({
  className,
  icon = <ListMusic className="size-4 text-white" />,
  title = 'Featured',
  description = 'Discover amazing content',
  date = 'Just now',
  badgeClassName = 'bg-blue-500',
  titleClassName = 'text-blue-600',
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-[8rem] w-[15rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-neutral-200 bg-white/70 px-4 py-3 backdrop-blur-sm transition-all duration-700 hover:border-neutral-300 hover:bg-white sm:h-36 sm:w-[22rem] [&>*]:flex [&>*]:items-center [&>*]:gap-2',
        className,
      )}
    >
      <div>
        <span className={cn('relative inline-block rounded-full p-1.5', badgeClassName)}>{icon}</span>
        <p className={cn('text-[15px] font-medium', titleClassName)}>{title}</p>
      </div>
      <p className="text-[15px] text-neutral-700 sm:whitespace-nowrap">{description}</p>
      <p className="text-[12px] text-neutral-400">{date}</p>
    </div>
  )
}

// `loop` auto-cycles the reveal (fan-out + colourise) on a calm timer; cards opt
// in via group-data-[open=true]:… classes. Reduced motion holds the deck open.
function DisplayCards({ cards, loop = false }: { cards: DisplayCardProps[]; loop?: boolean }) {
  const reduced = useReducedMotion()
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
    <div data-open={open ? 'true' : 'false'} className="group grid [grid-template-areas:'stack'] place-items-center">
      {cards.map((c, i) => (
        <DisplayCard key={i} {...c} />
      ))}
    </div>
  )
}

export default memo(DisplayCards)
