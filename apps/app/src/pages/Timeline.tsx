import { useState } from 'react'
import { Icon } from '../components/ui/icon'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'

// A Serena-style release calendar (calm monochrome, hairline borders, platform
// brand colours on post chips, one warm accent for "scheduled"), with a flush
// top nav and an "Ask Ondie" panel that slides in from the right and pushes the
// calendar left for conversational work. See design-system/color.md.

const SCHEDULED = '#ffb362'
const ROUNDED_FONT = "ui-rounded, 'SF Pro Rounded', 'Inter Tight', -apple-system, sans-serif"
const HAIR = '#f0f0f0'

// Platform brand colours — the one place chromatic colour is allowed.
const PLATFORM: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C' },
  tiktok: { label: 'TikTok', color: '#111111' },
  youtube: { label: 'YouTube', color: '#FF0000' },
  threads: { label: 'Threads', color: '#111111' },
  spotify: { label: 'Spotify', color: '#1DB954' },
  x: { label: 'X', color: '#111111' },
  all: { label: 'All platforms', color: '#737373' },
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
      <rect width="32" height="32" rx="9" fill="#1c1c1c" />
      <circle cx="12" cy="14" r="2" fill="#fff" />
      <circle cx="20" cy="14" r="2" fill="#fff" />
      <path d="M11.5 20c1.3 1.4 4 2 6.2 1 .6-.3 1.2-.6 1.8-1.1" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
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
          style={{ background: PLATFORM[p]?.color ?? '#737373' }}
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
        <Icon name="chevronRight" size={14} style={{ color: '#c4c4c4' }} />
        <span className="text-[14px] font-medium" style={{ color: INK }}>
          {monthLabel}
        </span>
      </div>

      {/* Center prompt pill → opens Ask Ondie */}
      <button
        type="button"
        onClick={onAsk}
        className="mx-1 hidden h-9 min-w-0 flex-1 items-center gap-2 rounded-lg px-3 text-left transition-colors hover:brightness-[0.98] md:flex"
        style={{ background: '#f3f3f3' }}
      >
        <Sparkle size={14} color="#b5b5b5" />
        <span className="truncate text-[13px]" style={{ color: '#9a9a9a' }}>
          Ask Ondie about this release…
        </span>
      </button>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Month / Week toggle */}
        <div className="flex items-center rounded-lg p-0.5" style={{ background: '#f3f3f3' }}>
          {(['month', 'week'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="h-7 rounded-md px-3 text-[13px] font-medium capitalize transition-colors"
              style={
                view === v
                  ? { background: '#ffffff', color: INK, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
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
          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-white transition-transform active:scale-[0.98]"
          style={{ background: askOpen ? '#000000' : '#252525' }}
        >
          <Sparkle size={13} color="#ffffff" />
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
      <div className="flex h-full w-full flex-col md:w-[380px]" style={{ background: '#fafafa' }}>
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
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
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
          <div className="flex h-11 items-center gap-2 rounded-lg px-3" style={{ background: '#f3f3f3' }}>
            <Sparkle size={15} color="#b5b5b5" />
            <input
              type="text"
              placeholder="Ask about your release week"
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#9a9a9a]"
              style={{ color: INK }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- day cell ---------- */

function DayCell({ cell, cur, isToday, isPast, isRelease, plan, tall, lastCol }: {
  cell: Cell
  cur: boolean
  isToday: boolean
  isPast: boolean
  isRelease: boolean | undefined
  plan: Plan | undefined
  tall: boolean
  lastCol: boolean
}) {
  return (
    <div
      className={`border-b p-1.5 ${tall ? 'min-h-[360px]' : 'min-h-[92px]'} ${lastCol ? '' : 'border-r'}`}
      style={{ borderColor: HAIR, background: isRelease ? 'rgba(255,179,98,0.08)' : undefined }}
    >
      <div className="flex items-center justify-between px-0.5">
        {isToday ? (
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] font-medium text-white" style={{ background: '#252525' }}>
            {cell.day}
          </span>
        ) : isRelease ? (
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] font-medium text-white" style={{ background: SCHEDULED }}>
            {cell.day}
          </span>
        ) : (
          <span className="text-[12px] font-medium" style={{ color: cur ? (isPast ? FAINT : SUBTLE) : '#d4d4d4' }}>
            {cell.day}
          </span>
        )}
        {isRelease ? (
          <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: '#b06a1f' }}>
            Release
          </span>
        ) : null}
      </div>

      {plan ? (
        <div
          className={`mt-1 flex items-center gap-1.5 rounded-md px-1.5 py-1 ${isPast ? 'opacity-55' : ''}`}
          style={{ background: isRelease ? SCHEDULED : '#f3f3f3' }}
        >
          <PlatformDots platforms={plan.platforms} />
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium" style={{ color: isRelease ? '#3b2405' : INK }}>
            {plan.title}
          </span>
          {!isPast && !isRelease ? (
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: SCHEDULED }} title="Scheduled" />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function Timeline() {
  const [cursor, setCursor] = useState({ year: CAMPAIGN.year, month: CAMPAIGN.month })
  const [view, setView] = useState<'month' | 'week'>('month')
  const [askOpen, setAskOpen] = useState(false)

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
    <div className="-mt-4 flex h-full min-h-[640px] flex-col" style={{ fontFamily: ROUNDED_FONT }}>
      {/* Flush top nav (breaks out of the card's main padding) */}
      <div className="-mx-6 border-b px-6 sm:-mx-8 sm:px-8" style={{ borderColor: HAIR }}>
        <CalendarTopNav monthLabel={monthLabel} view={view} setView={setView} askOpen={askOpen} onAsk={() => setAskOpen((v) => !v)} />
      </div>

      {/* Body: calendar (pushed left) + Ask Ondie panel */}
      <div className="-mx-6 flex min-h-0 flex-1 sm:-mx-8">
        <div className="min-w-0 flex-1 overflow-x-hidden px-6 pb-8 pt-5 sm:px-8">
          {/* Release header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: '#b5b5b5' }}>
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
              <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition-colors hover:bg-neutral-50" style={{ borderColor: HAIR }}>
                <Icon name="chevronLeft" size={16} style={{ color: SUBTLE }} />
              </button>
              <button type="button" onClick={() => shift(1)} aria-label="Next month" className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white transition-colors hover:bg-neutral-50" style={{ borderColor: HAIR }}>
                <Icon name="chevronRight" size={16} style={{ color: SUBTLE }} />
              </button>
              <button type="button" onClick={() => setCursor({ year: CAMPAIGN.year, month: CAMPAIGN.month })} className="ml-1 h-8 rounded-lg px-3 text-[13px] font-medium text-white transition-transform active:scale-[0.98]" style={{ background: '#252525' }}>
                Today
              </button>
            </div>
          </div>

          {/* Weekly objectives */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {OBJECTIVES.map((o, i) => (
              <div key={o.week} className="rounded-md border bg-white px-3 py-2" style={{ borderColor: HAIR }}>
                <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: FAINT }}>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white" style={{ background: '#252525' }}>
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
          <div className="mt-4 overflow-hidden rounded-xl border bg-white" style={{ borderColor: HAIR }}>
            <div className="grid grid-cols-7 border-b" style={{ borderColor: HAIR }}>
              {WEEKDAYS.map((d) => (
                <div key={d} className="px-2 py-2 text-center text-[11px] font-medium" style={{ color: '#b5b5b5' }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {gridCells.map((cell, i) => {
                const plan = cell.cur && isCampaignMonth ? PLAN[cell.day] : undefined
                const isToday = cell.cur && isCampaignMonth && cell.day === TODAY_DAY
                const isPast = cell.cur && isCampaignMonth && cell.day < TODAY_DAY
                return (
                  <DayCell
                    key={i}
                    cell={cell}
                    cur={cell.cur}
                    isToday={isToday}
                    isPast={isPast}
                    isRelease={plan?.release}
                    plan={plan}
                    tall={view === 'week'}
                    lastCol={(i + 1) % 7 === 0}
                  />
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]" style={{ color: SUBTLE }}>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: SCHEDULED }} /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#252525' }} /> Today</span>
            <span className="flex items-center gap-1.5 opacity-70"><span className="h-2 w-2 rounded-full" style={{ background: '#d4d4d4' }} /> Posted</span>
            <span className="mx-1 h-3 w-px" style={{ background: '#eaeaea' }} />
            {Object.entries(PLATFORM).filter(([k]) => k !== 'all').map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: v.color }} /> {v.label}</span>
            ))}
          </div>
        </div>

        <AskOndiePanel open={askOpen} onClose={() => setAskOpen(false)} />
      </div>
    </div>
  )
}
