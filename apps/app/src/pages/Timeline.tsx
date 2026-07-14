import { useState } from 'react'
import { Icon } from '../components/ui/icon'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'

// A Serena-style release calendar (calm monochrome, hairline borders, platform
// brand colours on post chips, one warm accent for "scheduled"). It renders the
// 30-day "Midnight Drive" plan onto its release month (May 2024), with each day
// carrying an actionable post chip. See design-system/color.md for the accent.

const SCHEDULED = '#ffb362'
const ROUNDED_FONT = "ui-rounded, 'SF Pro Rounded', 'Inter Tight', -apple-system, sans-serif"

// Platform brand colours — the one place chromatic colour is allowed (service
// brand marks are a documented palette exception).
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

// Weekly objectives from the AI-release-manager view.
const OBJECTIVES = [
  { week: 'Week 1', label: 'Build Curiosity' },
  { week: 'Week 2', label: 'Build Connection' },
  { week: 'Week 3', label: 'Build Demand' },
  { week: 'Week 4', label: 'Launch & Amplify' },
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Demo "today" — matches the plan's Day 11 (the campaign runs in 2024).
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

export default function Timeline() {
  const [cursor, setCursor] = useState({ year: CAMPAIGN.year, month: CAMPAIGN.month })
  const isCampaignMonth = cursor.year === CAMPAIGN.year && cursor.month === CAMPAIGN.month
  const cells = monthMatrix(cursor.year, cursor.month)

  const shift = (delta: number) => {
    setCursor((c) => {
      const m = c.month + delta
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  return (
    <div className="mx-auto max-w-5xl" style={{ fontFamily: ROUNDED_FONT }}>
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

        {/* Month nav */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f0f0f0] bg-white transition-colors hover:bg-neutral-50"
          >
            <Icon name="chevronLeft" size={16} style={{ color: SUBTLE }} />
          </button>
          <div className="min-w-[124px] text-center text-[14px] font-medium" style={{ color: INK }}>
            {MONTHS[cursor.month]} {cursor.year}
          </div>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f0f0f0] bg-white transition-colors hover:bg-neutral-50"
          >
            <Icon name="chevronRight" size={16} style={{ color: SUBTLE }} />
          </button>
          <button
            type="button"
            onClick={() => setCursor({ year: CAMPAIGN.year, month: CAMPAIGN.month })}
            className="ml-1 h-8 rounded-lg px-3 text-[13px] font-medium text-white transition-transform active:scale-[0.98]"
            style={{ background: '#252525' }}
          >
            Today
          </button>
        </div>
      </div>

      {/* Weekly objectives */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OBJECTIVES.map((o, i) => (
          <div key={o.week} className="rounded-md border border-[#f0f0f0] bg-white px-3 py-2">
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

      {/* Calendar */}
      <div className="mt-4 overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-[#f0f0f0]">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-[11px] font-medium" style={{ color: '#b5b5b5' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            const plan = cell.cur && isCampaignMonth ? PLAN[cell.day] : undefined
            const isToday = cell.cur && isCampaignMonth && cell.day === TODAY_DAY
            const isPast = cell.cur && isCampaignMonth && cell.day < TODAY_DAY
            const isRelease = plan?.release
            const lastCol = (i + 1) % 7 === 0

            return (
              <div
                key={i}
                className={`min-h-[92px] border-b border-[#f0f0f0] p-1.5 ${lastCol ? '' : 'border-r'}`}
                style={{ background: isRelease ? 'rgba(255,179,98,0.08)' : undefined }}
              >
                {/* Date number */}
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
                    <span className="text-[12px] font-medium" style={{ color: cell.cur ? (isPast ? FAINT : SUBTLE) : '#d4d4d4' }}>
                      {cell.day}
                    </span>
                  )}
                  {isRelease ? (
                    <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: '#b06a1f' }}>
                      Release
                    </span>
                  ) : null}
                </div>

                {/* Post chip */}
                {plan ? (
                  <div
                    className={`mt-1 flex items-center gap-1.5 rounded-md px-1.5 py-1 ${isPast ? 'opacity-55' : ''}`}
                    style={{
                      background: isRelease ? SCHEDULED : '#f3f3f3',
                    }}
                  >
                    <PlatformDots platforms={plan.platforms} />
                    <span
                      className="min-w-0 flex-1 truncate text-[11px] font-medium"
                      style={{ color: isRelease ? '#3b2405' : INK }}
                    >
                      {plan.title}
                    </span>
                    {!isPast && !isRelease ? (
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: SCHEDULED }} title="Scheduled" />
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]" style={{ color: SUBTLE }}>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: SCHEDULED }} /> Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: '#252525' }} /> Today
        </span>
        <span className="flex items-center gap-1.5 opacity-70">
          <span className="h-2 w-2 rounded-full" style={{ background: '#d4d4d4' }} /> Posted
        </span>
        <span className="mx-1 h-3 w-px" style={{ background: '#eaeaea' }} />
        {Object.entries(PLATFORM)
          .filter(([k]) => k !== 'all')
          .map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: v.color }} /> {v.label}
            </span>
          ))}
      </div>
    </div>
  )
}
