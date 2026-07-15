import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon, type IconName } from '../components/ui/icon'
import OndieMark from '../components/OndieMark'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'
import { hasPlan } from '../lib/plan'

const HAIR = 'var(--ds-hair)'
const EASE = [0.23, 1, 0.32, 1] as const

const PLATFORM: Record<string, string> = {
  spotify: '#1DB954',
  apple: '#FA243C',
  audiomack: '#FF7A00',
  tiktok: '#111111',
  instagram: '#E1306C',
}

/* ---------- collapsible module ---------- */

function Module({
  index,
  icon,
  title,
  stat,
  defaultOpen = false,
  actionLabel,
  onAction,
  children,
}: {
  index: number
  icon: IconName
  title: string
  stat: string
  defaultOpen?: boolean
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.1, duration: 0.45, ease: EASE }}
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: HAIR, background: 'var(--ds-surface)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-[52px] w-full items-center gap-3 px-4 text-left transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)]"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ type: 'spring', duration: 0.3, bounce: 0 }} className="flex">
          <Icon name="chevronRight" size={16} style={{ color: 'var(--ds-text-muted)' }} />
        </motion.span>
        <Icon name={icon} size={18} style={{ color: SUBTLE }} />
        <span className="text-[15px] font-medium" style={{ color: INK }}>
          {title}
        </span>
        <span className="ml-2 text-[13px] tabular-nums" style={{ color: SUBTLE }}>
          {stat}
        </span>
        {actionLabel ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
              onAction?.()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation()
                onAction?.()
              }
            }}
            className="ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-[transform,background-color] duration-150 hover:bg-[color:var(--ds-surface-2)] active:scale-[0.96]"
            style={{ color: INK }}
          >
            {actionLabel}
            <Icon name="chevronRight" size={13} />
          </span>
        ) : (
          <span className="ml-auto" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t px-4 py-3.5" style={{ borderColor: HAIR }}>
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}

/* ---------- module bodies ---------- */

const PLAN_TASKS: { t: string; s: 'done' | 'blocker' | 'todo' }[] = [
  { t: 'Lock the artwork', s: 'done' },
  { t: 'Confirm release date', s: 'done' },
  { t: 'Upload master to distributor', s: 'blocker' },
  { t: 'Set the pre-save link', s: 'blocker' },
  { t: 'Pitch New Music Friday', s: 'todo' },
]
const STATUS_COLOR = { done: '#16a34a', blocker: '#ffb362', todo: 'var(--ds-text-muted)' }

function ReleasePlanBody() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--ds-surface-2)' }}>
          <div className="h-full rounded-full" style={{ width: '87%', background: 'var(--ds-accent)' }} />
        </div>
        <span className="text-[13px] font-medium tabular-nums" style={{ color: INK }}>
          87%
        </span>
      </div>
      <div className="mt-3 flex flex-col">
        {PLAN_TASKS.map((task) => (
          <div key={task.t} className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)]">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: STATUS_COLOR[task.s] }} />
            <span className="text-[14px]" style={{ color: task.s === 'done' ? FAINT : INK, textDecoration: task.s === 'done' ? 'line-through' : 'none' }}>
              {task.t}
            </span>
            {task.s === 'blocker' ? (
              <span className="ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium" style={{ background: 'rgba(255,179,98,0.16)', color: '#b06a1f' }}>
                Blocker
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

const CONTENT_CHIPS = ['Teaser', 'Chorus preview', 'Artwork reveal', 'Release Day', 'Fan Q&A', '+25 more']

function ContentCalendarBody() {
  return (
    <div>
      <p className="text-[14px]" style={{ color: SUBTLE }}>
        A 30-day plan across your platforms — teasers, behind-the-scenes, release day and follow-up.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CONTENT_CHIPS.map((c) => (
          <span key={c} className="rounded-lg px-2.5 py-1 text-[12px] font-medium" style={{ background: 'var(--ds-surface-2)', color: SUBTLE }}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

const PLAYLISTS = [
  { name: 'Coffee Beats', meta: 'Editorial · 410k', match: 92, platform: 'spotify' },
  { name: 'Fresh Finds', meta: 'Algorithmic · 1.2M', match: 88, platform: 'spotify' },
  { name: 'Afro Heat', meta: 'Curator · 220k', match: 90, platform: 'audiomack' },
  { name: 'Indie Radar', meta: 'Editorial · 88k', match: 86, platform: 'apple' },
]

function PlaylistBody() {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
      {PLAYLISTS.map((p) => (
        <div key={p.name} className="flex w-[190px] shrink-0 flex-col gap-2.5 rounded-xl border p-3" style={{ borderColor: HAIR, background: 'var(--ds-surface-2)' }}>
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PLATFORM[p.platform] }} />
            <span className="rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums" style={{ background: 'var(--ds-surface)', color: INK }}>
              {p.match}% match
            </span>
          </div>
          <div>
            <div className="text-[14px] font-medium" style={{ color: INK }}>
              {p.name}
            </div>
            <div className="text-[12px]" style={{ color: FAINT }}>
              {p.meta}
            </div>
          </div>
          <button
            type="button"
            className="mt-0.5 h-8 rounded-lg text-[13px] font-medium transition-[transform] duration-150 active:scale-[0.96]"
            style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  )
}

const CREATORS = [
  { name: 'maya.sounds', meta: '82k · TikTok', overlap: 74, platform: 'tiktok', hue: '#8A63E8' },
  { name: 'the.crate', meta: '54k · Instagram', overlap: 69, platform: 'instagram', hue: '#E1306C' },
  { name: 'lowkeyfm', meta: '120k · TikTok', overlap: 66, platform: 'tiktok', hue: '#22B27B' },
  { name: 'nightdrive', meta: '38k · Instagram', overlap: 63, platform: 'instagram', hue: '#3D82DE' },
]

function CreatorBody() {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
      {CREATORS.map((c) => (
        <div key={c.name} className="flex w-[168px] shrink-0 flex-col gap-2 rounded-xl border p-3" style={{ borderColor: HAIR, background: 'var(--ds-surface-2)' }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium text-white" style={{ background: c.hue }}>
            {c.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="text-[14px] font-medium" style={{ color: INK }}>
              {c.name}
            </div>
            <div className="text-[12px]" style={{ color: FAINT }}>
              {c.meta}
            </div>
          </div>
          <div className="text-[12px] tabular-nums" style={{ color: SUBTLE }}>
            {c.overlap}% audience overlap
          </div>
          <button
            type="button"
            className="mt-0.5 h-8 rounded-lg border text-[13px] font-medium transition-[transform,background-color] duration-150 hover:bg-[color:var(--ds-surface)] active:scale-[0.96]"
            style={{ borderColor: HAIR, color: INK }}
          >
            Invite
          </button>
        </div>
      ))}
    </div>
  )
}

const TASKS = [
  { day: 'Tomorrow', title: 'Film studio clip', platform: 'tiktok' },
  { day: 'Thursday', title: 'Pitch editorial playlists', platform: 'spotify' },
  { day: 'Friday', title: 'Release artwork', platform: 'instagram' },
]

function TasksBody() {
  return (
    <div className="flex flex-col">
      {TASKS.map((t) => (
        <div key={t.title} className="flex items-center gap-3 rounded-lg px-1.5 py-2 transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)]">
          <span className="w-20 text-[13px]" style={{ color: FAINT }}>
            {t.day}
          </span>
          <span className="h-2 w-2 rounded-full" style={{ background: PLATFORM[t.platform] }} />
          <span className="text-[14px]" style={{ color: INK }}>
            {t.title}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------- page ---------- */

export default function ReleaseOverview() {
  const navigate = useNavigate()

  if (!hasPlan()) {
    return (
      <div className="flex min-h-[calc(100dvh-14rem)] flex-col items-center justify-center px-6 text-center">
        <OndieMark size={56} />
        <h1 className="mt-5 text-[22px] font-medium tracking-[-0.4px]" style={{ color: INK }}>
          No release plan yet
        </h1>
        <p className="mt-1.5 max-w-[320px] text-[14px] leading-[20px]" style={{ color: SUBTLE }}>
          Ask Ondie on the home screen to build your release — I&apos;ll lay everything out here.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-5 h-10 rounded-lg px-4 text-[14px] font-medium transition-[transform] duration-150 active:scale-[0.96]"
          style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}
        >
          Plan with Ondie
        </button>
      </div>
    )
  }

  return (
    <div className="w-full pb-10">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: FAINT }}>
          Release
        </div>
        <h1 className="mt-1 text-[22px] font-medium tracking-[-0.4px] [text-wrap:balance]" style={{ color: INK }}>
          Midnight Drive
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: SUBTLE }}>
          Your plan is ready — out Friday, May 24.
        </p>
      </motion.div>

      {/* progressively-revealed modules */}
      <div className="mt-6 flex flex-col gap-3">
        <Module index={0} icon="releases" title="Release Plan" stat="87% ready · 14 tasks · 2 blockers" defaultOpen>
          <ReleasePlanBody />
        </Module>
        <Module index={1} icon="timeline" title="Content Calendar" stat="30 pieces" actionLabel="Open calendar" onAction={() => navigate('/timeline')}>
          <ContentCalendarBody />
        </Module>
        <Module index={2} icon="music" title="Playlist opportunities" stat="4 matches">
          <PlaylistBody />
        </Module>
        <Module index={3} icon="campaigns" title="Creator opportunities" stat="4 recommended">
          <CreatorBody />
        </Module>
        <Module index={4} icon="signals" title="Upcoming tasks" stat="3 this week">
          <TasksBody />
        </Module>
      </div>
    </div>
  )
}
