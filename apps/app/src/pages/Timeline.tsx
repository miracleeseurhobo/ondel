import { Check } from 'lucide-react'
import { INK, SUBTLE, FAINT, Rise, PageHeading } from '../components/workspace-ui'

type State = 'done' | 'active' | 'upcoming'

const ITEMS: { title: string; when: string; state: State; note?: string }[] = [
  { title: 'Master & artwork finalized', when: '2 weeks ago', state: 'done' },
  { title: 'Delivered to stores', when: 'Last Friday', state: 'done', note: 'Live on Spotify, Apple Music, 4 more' },
  { title: 'Pitch to editorial curators', when: 'Thursday', state: 'active', note: '14 playlist matches from Radar — 3 drafts ready' },
  { title: 'Pre-save campaign', when: 'Running now', state: 'active', note: '318 saves so far' },
  { title: 'Release day — Midnight Bloom', when: 'In 12 days', state: 'upcoming' },
  { title: 'Post-release content push', when: 'Release week', state: 'upcoming', note: 'Clips, socials, playlist follow-ups' },
]

const DOT: Record<State, string> = { done: '#22B27B', active: '#3D82DE', upcoming: 'rgba(13,27,75,0.25)' }

export default function Timeline() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading title="Timeline" sub="The plan for Midnight Bloom, start to release week." />
      <Rise delay={0.06} className="mt-8">
        <ol className="relative ml-2">
          <span className="absolute left-[11px] top-1 bottom-1 w-px bg-black/[0.08]" aria-hidden />
          {ITEMS.map((it, i) => (
            <li key={i} className="relative flex gap-4 pb-7 last:pb-0">
              <span
                className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: it.state === 'done' ? DOT.done : '#EEF1F7', border: `2px solid ${DOT[it.state]}` }}
              >
                {it.state === 'done' ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : <span className="h-2 w-2 rounded-full" style={{ background: DOT[it.state] }} />}
              </span>
              <div className="flex-1 pt-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-[15px] font-medium" style={{ color: it.state === 'upcoming' ? SUBTLE : INK }}>
                    {it.title}
                  </span>
                  <span className="text-[13px]" style={{ color: FAINT }}>
                    {it.when}
                  </span>
                </div>
                {it.note ? (
                  <p className="mt-1 text-[13px]" style={{ color: SUBTLE }}>
                    {it.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Rise>
    </div>
  )
}
