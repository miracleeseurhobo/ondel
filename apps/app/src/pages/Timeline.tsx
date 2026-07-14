import { useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/ui/icon'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'

type Post = { title: string; platforms: string[]; release?: boolean }
type DayEdit = { quiet?: boolean; added?: Post[] }

// A Serena-style release calendar (calm monochrome, hairline borders, platform
// brand colours on post chips, one warm accent for "scheduled"), with a flush
// top nav and an "Ask Ondie" panel that slides in from the right and pushes the
// calendar left for conversational work. See design-system/color.md.

const SCHEDULED = '#ffb362'
const ROUNDED_FONT = "ui-rounded, 'SF Pro Rounded', 'Inter Tight', -apple-system, sans-serif"
const HAIR = 'var(--ds-hair)' // faint hairline — nav, objectives, panel
const GRID = 'var(--ds-grid)' // bolder calendar grid lines for a crisp, high-resolution grid

// Platform brand colours — the one place chromatic colour is allowed.
const PLATFORM: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C' },
  tiktok: { label: 'TikTok', color: '#111111' },
  youtube: { label: 'YouTube', color: '#FF0000' },
  threads: { label: 'Threads', color: '#111111' },
  spotify: { label: 'Spotify', color: '#1DB954' },
  x: { label: 'X', color: '#111111' },
  all: { label: 'All platforms', color: 'var(--ds-text-secondary)' },
}

type Plan = { title: string; platforms: string[]; release?: boolean }

// Plan day N maps to May N (release = day 24 = Fri, May 24).
const PLAN: Record<number, Plan> = {
  1: { title: 'Teaser', platforms: ['instagram', 'tiktok'] },
  2: { title: 'The story', platforms: ['instagram', 'threads'] },
  3: { title: 'Chorus preview', platforms: ['tiktok', 'youtube'] },
  4: { title: 'Studio diary', platforms: ['instagram'] },
  5: { title: 'Poll: guess the date', platforms: ['instagram'] },
  6: { title: 'Inspiration playlist', platforms: ['spotify'] },
  7: { title: 'Acoustic verse', platforms: ['tiktok'] },
  8: { title: 'Artwork reveal', platforms: ['instagram'] },
  9: { title: 'Cover making-of', platforms: ['instagram'] },
  10: { title: 'Favourite lyric', platforms: ['threads', 'instagram'] },
  11: { title: 'Hook replay', platforms: ['tiktok'] },
  12: { title: 'Friends react', platforms: ['instagram'] },
  13: { title: '10 days to go', platforms: ['instagram'] },
  14: { title: 'Chorus challenge', platforms: ['tiktok'] },
  15: { title: 'Release-week checklist', platforms: ['x', 'threads'] },
  16: { title: 'Mixing clips', platforms: ['instagram'] },
  17: { title: 'Fan Q&A (Live)', platforms: ['instagram'] },
  18: { title: 'Why pre-saves matter', platforms: ['instagram'] },
  19: { title: 'Verse 2 teaser', platforms: ['tiktok'] },
  20: { title: 'Voice note', platforms: ['instagram'] },
  21: { title: '3 things to notice', platforms: ['instagram'] },
  22: { title: 'Early reactions', platforms: ['instagram'] },
  23: { title: 'Midnight reminder', platforms: ['all'] },
  24: { title: 'Release Day', platforms: ['all'], release: true },
  25: { title: 'Thank supporters', platforms: ['instagram'] },
  26: { title: 'Share fan videos', platforms: ['tiktok', 'instagram'] },
  27: { title: 'If you like…', platforms: ['instagram'] },
  28: { title: 'Live clip', platforms: ['youtube'] },
  29: { title: 'Milestones', platforms: ['instagram'] },
  30: { title: 'Week-one recap', platforms: ['instagram'] },
}

const OBJECTIVES = [
  { week: 'Week 1', label: 'Build Curiosity' },
  { week: 'Week 2', label: 'Build Connection' },
  { week: 'Week 3', label: 'Build Demand' },
  { week: 'Week 4', label: 'Launch & Amplify' },
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const CAMPAIGN = { year: 2024, month: 4 } // May 2024
const TODAY_DAY = 11

type Cell = { day: number; cur: boolean }

function monthMatrix(year: number, month: number): Cell[] {
  const startDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells: Cell[] = []
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true })
  let nd = 1
  while (cells.length % 7 !== 0) cells.push({ day: nd++, cur: false })
  return cells
}

/* ---------- small graphics ---------- */

function Sparkle({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 2l1.7 6.1a2 2 0 0 0 1.4 1.4L21 11l-5.9 1.5a2 2 0 0 0-1.4 1.4L12 20l-1.7-6.1a2 2 0 0 0-1.4-1.4L3 11l5.9-1.5a2 2 0 0 0 1.4-1.4z" />
    </svg>
  )
}

// Ondie assistant face — friendly bot mark (mirrors Serena's).
function OndieFace({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--ds-accent)" />
      <circle cx="12" cy="14" r="2" fill="var(--ds-accent-fg)" />
      <circle cx="20" cy="14" r="2" fill="var(--ds-accent-fg)" />
      <path d="M11.5 20c1.3 1.4 4 2 6.2 1 .6-.3 1.2-.6 1.8-1.1" stroke="var(--ds-accent-fg)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function PlatformDots({ platforms }: { platforms: string[] }) {
  return (
    <span className="flex -space-x-1">
      {platforms.map((p) => (
        <span
          key={p}
          title={PLATFORM[p]?.label}
          className="h-[7px] w-[7px] rounded-full ring-1 ring-white"
          style={{ background: PLATFORM[p]?.color ?? 'var(--ds-text-secondary)' }}
        />
      ))}
    </span>
  )
}

/* ---------- top nav ---------- */

function CalendarTopNav({
  monthLabel,
  view,
  setView,
  askOpen,
  onAsk,
}: {
  monthLabel: string
  view: 'month' | 'week'
  setView: (v: 'month' | 'week') => void
  askOpen: boolean
  onAsk: () => void
}) {
  return (
    <div className="flex h-[60px] items-center gap-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Icon name="timeline" size={17} style={{ color: SUBTLE }} />
        <span className="text-[14px]" style={{ color: SUBTLE }}>
          Calendar
        </span>
        <Icon name="chevronRight" size={14} style={{ color: 'var(--ds-text-muted)' }} />
        <span className="text-[14px] font-medium" style={{ color: INK }}>
          {monthLabel}
        </span>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Month / Week toggle */}
        <div className="flex items-center rounded-lg p-0.5" style={{ background: 'var(--ds-surface-2)' }}>
          {(['month', 'week'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="h-7 rounded-md px-3 text-[13px] font-medium capitalize transition-colors"
              style={
                view === v
                  ? { background: 'var(--ds-surface)', color: INK, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
                  : { color: SUBTLE }
              }
            >
              {v}
            </button>
          ))}
        </div>

        {/* Ask Ondie */}
        <button
          type="button"
          onClick={onAsk}
          aria-pressed={askOpen}
          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-[color:var(--ds-accent-fg)] transition-transform active:scale-[0.98]"
          style={{ background: askOpen ? 'var(--ds-accent)' : 'var(--ds-accent)' }}
        >
          <Sparkle size={13} color="var(--ds-accent-fg)" />
          Ask Ondie
        </button>
      </div>
    </div>
  )
}

/* ---------- Ask Ondie panel ---------- */

function AskOndiePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`shrink-0 overflow-hidden border-l transition-[width] duration-300 ease-out ${open ? 'w-full md:w-[380px]' : 'w-0'}`}
      style={{ borderColor: HAIR }}
      aria-hidden={!open}
    >
      <div className="flex h-full w-full flex-col md:w-[380px]" style={{ background: 'var(--ds-surface-3)' }}>
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-5 py-3.5" style={{ borderColor: HAIR }}>
          <OndieFace size={22} />
          <span className="text-[14px] font-medium" style={{ color: INK }}>
            Ask Ondie
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ask Ondie"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-overlay/5"
          >
            <Icon name="close" size={16} style={{ color: SUBTLE }} />
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <OndieFace size={44} />
          <div className="mt-4 text-[16px] font-medium" style={{ color: INK }}>
            Ask about your week
          </div>
          <p className="mt-1.5 max-w-[260px] text-[14px] leading-[20px]" style={{ color: SUBTLE }}>
            Ondie knows your release plan, your platforms, and how your days are balanced.
          </p>
        </div>

        {/* Input */}
        <div className="p-4">
          <div className="flex h-11 items-center gap-2 rounded-lg px-3" style={{ background: 'var(--ds-surface-2)' }}>
            <Sparkle size={15} color="var(--ds-text-faint)" />
            <input
              type="text"
              placeholder="Ask about your release week"
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--ds-text-muted)]"
              style={{ color: INK }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- day cell ---------- */

function DayCell({ cell, cur, isToday, isPast, isRelease, posts, quiet, tall, lastCol, menuOpen, onAdd }: {
  cell: Cell
  cur: boolean
  isToday: boolean
  isPast: boolean
  isRelease: boolean | undefined
  posts: Post[]
  quiet: boolean
  tall: boolean
  lastCol: boolean
  menuOpen: boolean
  onAdd: (day: number, e: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <div
      className={`group relative border-b p-2 ${tall ? 'min-h-[360px]' : 'min-h-[112px]'} ${lastCol ? '' : 'border-r'}`}
      style={{ borderColor: GRID, background: isRelease ? 'rgba(255,179,98,0.08)' : undefined }}
    >
      <div className="flex items-center justify-between px-0.5">
        {isToday ? (
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full text-[13px] font-medium text-[color:var(--ds-accent-fg)]" style={{ background: 'var(--ds-accent)' }}>
            {cell.day}
          </span>
        ) : isRelease ? (
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full text-[13px] font-medium text-[color:var(--ds-accent-fg)]" style={{ background: SCHEDULED }}>
            {cell.day}
          </span>
        ) : (
          <span className="text-[13px] font-medium" style={{ color: cur ? (isPast ? FAINT : INK) : 'var(--ds-text-muted)' }}>
            {cell.day}
          </span>
        )}

        {/* release label — hidden on hover so the + can take the corner */}
        {isRelease ? (
          <span className="text-[9px] font-medium uppercase tracking-wide group-hover:hidden" style={{ color: '#b06a1f' }}>
            Release
          </span>
        ) : null}

        {/* hover add / open-menu toggle (current month only) */}
        {cur ? (
          <button
            type="button"
            aria-label={menuOpen ? 'Close add menu' : 'Add to this day'}
            onClick={(e) => onAdd(cell.day, e)}
            className={`flex h-[22px] w-[22px] items-center justify-center rounded-md transition-opacity ${menuOpen ? 'bg-overlay/[0.06] opacity-100' : 'opacity-0 hover:bg-overlay/[0.06] group-hover:opacity-100'}`}
          >
            <Icon name={menuOpen ? 'close' : 'plus'} size={14} style={{ color: SUBTLE }} />
          </button>
        ) : null}
      </div>

      <div className="mt-1 space-y-1">
        {posts.map((p, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 ${isPast && !p.release ? 'opacity-55' : ''}`}
            style={{ background: p.release ? SCHEDULED : 'var(--ds-surface-2)' }}
          >
            <PlatformDots platforms={p.platforms} />
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium" style={{ color: p.release ? '#3b2405' : INK }}>
              {p.title}
            </span>
            {!isPast && !p.release ? (
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: SCHEDULED }} title="Scheduled" />
            ) : null}
          </div>
        ))}
        {quiet ? (
          <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1" style={{ background: 'var(--ds-surface-2)' }}>
            <Icon name="quiet" size={12} style={{ color: 'var(--ds-text-muted)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--ds-text-muted)' }}>Quiet day</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function MenuItem({ icon, label, strong, onClick }: { icon: 'newPost' | 'fillPlan' | 'quiet'; label: string; strong?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--ds-surface-2)]">
      <Icon name={icon} size={17} style={{ color: strong ? INK : SUBTLE }} />
      <span className="text-[14px]" style={{ color: INK, fontWeight: strong ? 500 : 400 }}>{label}</span>
    </button>
  )
}

export default function Timeline() {
  const [cursor, setCursor] = useState({ year: CAMPAIGN.year, month: CAMPAIGN.month })
  const [view, setView] = useState<'month' | 'week'>('month')
  const [askOpen, setAskOpen] = useState(false)
  const [menu, setMenu] = useState<{ day: number; left: number; top: number } | null>(null)
  const [dayEdits, setDayEdits] = useState<Record<number, DayEdit>>({})

  const openMenu = (day: number, e: MouseEvent<HTMLButtonElement>) => {
    if (menu?.day === day) {
      setMenu(null)
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    const width = 240
    setMenu({ day, left: Math.max(8, r.right - width), top: r.bottom + 6 })
  }
  const edit = (day: number, fn: (d: DayEdit) => DayEdit) => setDayEdits((m) => ({ ...m, [day]: fn(m[day] ?? {}) }))
  const addPost = (day: number, post: Post) => {
    edit(day, (d) => ({ ...d, quiet: false, added: [...(d.added ?? []), post] }))
    setMenu(null)
  }
  const markQuiet = (day: number) => {
    edit(day, (d) => ({ ...d, quiet: !d.quiet }))
    setMenu(null)
  }

  const isCampaignMonth = cursor.year === CAMPAIGN.year && cursor.month === CAMPAIGN.month
  const cells = monthMatrix(cursor.year, cursor.month)
  const monthLabel = `${MONTHS[cursor.month]} ${cursor.year}`

  // Week view = the week containing "today" (or the first week).
  const weeks: Cell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  const weekCells =
    weeks.find((w) => w.some((c) => c.cur && isCampaignMonth && c.day === TODAY_DAY)) ?? weeks[0]
  const gridCells = view === 'week' ? weekCells : cells

  const shift = (delta: number) => {
    setCursor((c) => {
      const m = c.month + delta
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  return (
    <div
      className="-mx-6 -mb-8 -mt-4 flex flex-col sm:-mx-8 md:h-[calc(100dvh-1.25rem)]"
      style={{ fontFamily: ROUNDED_FONT, minHeight: 560 }}
    >
      {/* Flush top nav */}
      <div className="border-b px-6 sm:px-8" style={{ borderColor: HAIR }}>
        <CalendarTopNav monthLabel={monthLabel} view={view} setView={setView} askOpen={askOpen} onAsk={() => setAskOpen((v) => !v)} />
      </div>

      {/* Body: calendar (pushed left, scrolls) + Ask Ondie panel (fills height) */}
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-6 pb-8 pt-5 sm:px-8">
          {/* Release header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: 'var(--ds-text-faint)' }}>
                Release campaign
              </div>
              <h1 className="mt-1 text-[22px] font-medium tracking-[-0.4px]" style={{ color: INK }}>
                Midnight Drive
              </h1>
              <p className="mt-0.5 text-[13px]" style={{ color: SUBTLE }}>
                Out Friday, May 24 · 30-day plan
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="flex h-8 w-8 items-center justify-center rounded-lg border bg-surface transition-colors hover:bg-surface2" style={{ borderColor: HAIR }}>
                <Icon name="chevronLeft" size={16} style={{ color: SUBTLE }} />
              </button>
              <button type="button" onClick={() => shift(1)} aria-label="Next month" className="flex h-8 w-8 items-center justify-center rounded-lg border bg-surface transition-colors hover:bg-surface2" style={{ borderColor: HAIR }}>
                <Icon name="chevronRight" size={16} style={{ color: SUBTLE }} />
              </button>
              <button type="button" onClick={() => setCursor({ year: CAMPAIGN.year, month: CAMPAIGN.month })} className="ml-1 h-8 rounded-lg px-3 text-[13px] font-medium text-[color:var(--ds-accent-fg)] transition-transform active:scale-[0.98]" style={{ background: 'var(--ds-accent)' }}>
                Today
              </button>
            </div>
          </div>

          {/* Weekly objectives */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {OBJECTIVES.map((o, i) => (
              <div key={o.week} className="rounded-md border bg-surface px-3 py-2" style={{ borderColor: HAIR }}>
                <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: FAINT }}>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-[color:var(--ds-accent-fg)]" style={{ background: 'var(--ds-accent)' }}>
                    {i + 1}
                  </span>
                  {o.week}
                </div>
                <div className="mt-1 text-[13px] font-medium" style={{ color: INK }}>
                  {o.label}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="mt-4 overflow-hidden rounded-xl border bg-surface" style={{ borderColor: GRID }}>
            <div className="grid grid-cols-7 border-b" style={{ borderColor: GRID }}>
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2.5 text-center text-[12px] font-medium" style={{ color: 'var(--ds-text-secondary)' }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {gridCells.map((cell, i) => {
                const base = cell.cur && isCampaignMonth ? PLAN[cell.day] : undefined
                const edits = cell.cur ? dayEdits[cell.day] : undefined
                const posts: Post[] = []
                if (base) posts.push({ title: base.title, platforms: base.platforms, release: base.release })
                if (edits?.added) posts.push(...edits.added)
                const isToday = cell.cur && isCampaignMonth && cell.day === TODAY_DAY
                const isPast = cell.cur && isCampaignMonth && cell.day < TODAY_DAY
                return (
                  <DayCell
                    key={i}
                    cell={cell}
                    cur={cell.cur}
                    isToday={isToday}
                    isPast={isPast}
                    isRelease={base?.release}
                    posts={posts}
                    quiet={!!edits?.quiet}
                    tall={view === 'week'}
                    lastCol={(i + 1) % 7 === 0}
                    menuOpen={menu?.day === cell.day}
                    onAdd={openMenu}
                  />
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]" style={{ color: SUBTLE }}>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: SCHEDULED }} /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: 'var(--ds-accent)' }} /> Today</span>
            <span className="flex items-center gap-1.5 opacity-70"><span className="h-2 w-2 rounded-full" style={{ background: 'var(--ds-border)' }} /> Posted</span>
            <span className="mx-1 h-3 w-px" style={{ background: 'var(--ds-border)' }} />
            {Object.entries(PLATFORM).filter(([k]) => k !== 'all').map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: v.color }} /> {v.label}</span>
            ))}
          </div>
        </div>

        <AskOndiePanel open={askOpen} onClose={() => setAskOpen(false)} />
      </div>

      {/* Day add-menu popover */}
      {menu ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-50 w-[240px] rounded-xl border bg-surface p-1.5"
            style={{ left: menu.left, top: menu.top, borderColor: GRID, boxShadow: '0 12px 32px -12px rgba(0,0,0,0.24)', transformOrigin: 'top right' }}
          >
            <MenuItem icon="newPost" label="New post" strong onClick={() => addPost(menu.day, { title: 'New post', platforms: ['instagram'] })} />
            <MenuItem icon="fillPlan" label="Fill from plan" onClick={() => addPost(menu.day, { title: 'Ondie suggestion', platforms: ['instagram', 'tiktok'] })} />
            <MenuItem icon="quiet" label={dayEdits[menu.day]?.quiet ? 'Unmark quiet day' : 'Mark as quiet day'} onClick={() => markQuiet(menu.day)} />
          </motion.div>
        </>
      ) : null}
    </div>
  )
}
