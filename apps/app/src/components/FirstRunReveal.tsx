import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from './ui/icon'
import OndieMark from './OndieMark'
import { TextShimmer } from './ui/text-shimmer'
import { INK, SUBTLE, FAINT } from './workspace-ui'
import { buildFirstRunPlan, PLATFORM_COLOR, type FirstRunPlan } from '../lib/firstRunMock'

// First-run "watch Ondie work" reveal. The artist's song (or prompt) drives a
// staged sequence — each stage narrates its work in a plain verb and leaves a
// real artifact card behind, so proof accumulates before they act (Explee-style).
// Ends on a resolved "Plan ready" badge with the go-to-workspace CTA.

const EASE = [0.23, 1, 0.32, 1] as const
const STAGE_MS = 1500 // per-stage dwell → artifacts reveal over ~6s
const HAIR = 'var(--ds-hair)'

const clip = (s: string, n = 34) => (s.length > n ? s.slice(0, n - 1) + '…' : s)

/* ---------- artifact cards ---------- */

function Card({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className="rounded-xl border p-3.5"
      style={{ borderColor: HAIR, background: 'var(--ds-surface)' }}
    >
      {children}
    </motion.div>
  )
}

function PlatformDots({ platforms }: { platforms: string[] }) {
  return (
    <span className="flex -space-x-1">
      {platforms.map((p) => (
        <span key={p} className="h-[7px] w-[7px] rounded-full ring-1 ring-white" style={{ background: PLATFORM_COLOR[p] ?? 'var(--ds-text-secondary)' }} />
      ))}
    </span>
  )
}

function AnalysisArtifact({ plan }: { plan: FirstRunPlan }) {
  return (
    <Card>
      <div className="flex flex-wrap gap-1.5">
        {plan.analysis.map((c) => (
          <span key={c.label} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px]" style={{ background: 'var(--ds-surface-2)' }}>
            <span style={{ color: FAINT }}>{c.label}</span>
            <span className="font-medium" style={{ color: INK }}>
              {c.value}
            </span>
          </span>
        ))}
      </div>
      <div className="mt-2 text-[12px]" style={{ color: SUBTLE }}>
        Sounds like <span className="font-medium" style={{ color: INK }}>{plan.refs.join(' · ')}</span>
      </div>
    </Card>
  )
}

function RegionsArtifact({ plan }: { plan: FirstRunPlan }) {
  const max = plan.regions[0]?.fit ?? 100
  return (
    <Card>
      <div className="flex flex-col gap-2">
        {plan.regions.map((r, i) => (
          <div key={r.city} className="flex items-center gap-3">
            <span className="w-4 text-[12px] tabular-nums" style={{ color: FAINT }}>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-medium" style={{ color: INK }}>
                  {r.city}
                </span>
                <span className="text-[12px]" style={{ color: FAINT }}>
                  {r.country}
                </span>
              </div>
              <div className="truncate text-[12px]" style={{ color: SUBTLE }}>
                {r.why}
              </div>
            </div>
            <div className="flex w-24 items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--ds-surface-2)' }}>
                <span className="block h-full rounded-full" style={{ width: `${(r.fit / max) * 100}%`, background: 'var(--ds-accent)' }} />
              </span>
              <span className="text-[11px] tabular-nums" style={{ color: SUBTLE }}>
                {r.fit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PlaylistsArtifact({ plan }: { plan: FirstRunPlan }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {plan.playlists.map((p, i) => (
        <Card key={p.name} delay={i * 0.05}>
          <div className="text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: FAINT }}>
            {p.kind}
          </div>
          <div className="mt-1 text-[13px] font-medium" style={{ color: INK }}>
            {p.name}
          </div>
          <div className="mt-0.5 text-[12px]" style={{ color: SUBTLE }}>
            {p.reach}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium" style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>
              {p.fit}% fit
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ContentArtifact({ plan }: { plan: FirstRunPlan }) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        {plan.content.map((post) => (
          <div key={post.title} className="flex items-center gap-2.5">
            <span className="w-12 text-[11px] font-medium tabular-nums" style={{ color: FAINT }}>
              {post.day}
            </span>
            <span className="flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: 'var(--ds-surface-2)' }}>
              <PlatformDots platforms={post.platforms} />
              <span className="text-[12px] font-medium" style={{ color: INK }}>
                {post.title}
              </span>
            </span>
          </div>
        ))}
        <div className="text-[12px]" style={{ color: FAINT }}>
          + {plan.summary.posts - plan.content.length} more across the 30-day plan
        </div>
      </div>
    </Card>
  )
}

/* ---------- stage plumbing ---------- */

type Stage = { key: string; heading: string; render: () => React.ReactNode }

export default function FirstRunReveal({
  songName,
  prompt,
  reduced,
  onComplete,
}: {
  songName: string | null
  prompt: string
  reduced: boolean
  onComplete: () => void
}) {
  const plan = useMemo(() => buildFirstRunPlan(songName || prompt || 'ondel'), [songName, prompt])

  const stages: Stage[] = useMemo(
    () => [
      { key: 'listen', heading: songName ? `Listening to “${clip(songName)}”` : 'Reading your brief', render: () => <AnalysisArtifact plan={plan} /> },
      { key: 'regions', heading: "Mapping where it'll land", render: () => <RegionsArtifact plan={plan} /> },
      { key: 'playlists', heading: 'Finding your playlist openings', render: () => <PlaylistsArtifact plan={plan} /> },
      { key: 'content', heading: 'Proposing your content', render: () => <ContentArtifact plan={plan} /> },
    ],
    [plan, songName],
  )

  // active = index of the stage currently working; stages < active are done and
  // persist; when active === stages.length, the "Plan ready" badge appears.
  const [active, setActive] = useState(reduced ? stages.length : 0)

  useEffect(() => {
    if (reduced) {
      setActive(stages.length)
      return
    }
    setActive(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setActive(i)
      if (i >= stages.length) window.clearInterval(id)
    }, STAGE_MS)
    return () => window.clearInterval(id)
  }, [reduced, stages.length])

  const done = active >= stages.length
  const subtitle = songName ? `“${clip(songName, 46)}”` : prompt.trim() ? `“${clip(prompt.trim(), 60)}”` : 'Building your 30-day plan'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 flex flex-col items-center overflow-y-auto"
      style={{ background: 'var(--ds-surface)' }}
    >
      {/* Skip */}
      {!done ? (
        <button
          type="button"
          onClick={onComplete}
          className="absolute right-5 top-5 z-10 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-[color:var(--ds-surface-2)]"
          style={{ color: SUBTLE }}
        >
          Skip to plan
        </button>
      ) : null}

      <div className="w-full max-w-[560px] px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div animate={reduced || done ? {} : { scale: [1, 1.06, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <OndieMark size={52} />
          </motion.div>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="mt-4 text-[28px] font-normal tracking-[-0.3px]" >
            <span style={{ color: INK }}>{done ? 'Your release plan is ready' : songName ? 'Building from your track' : 'Building your release'}</span>
          </h2>
          <p className="mt-1 text-[14px]" style={{ color: SUBTLE }}>
            {subtitle}
          </p>
        </div>

        {/* Stages */}
        <div className="mt-8 flex flex-col gap-5">
          {stages.map((stage, i) => {
            if (i > active) return null
            const isActive = i === active
            return (
              <div key={stage.key} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  {isActive ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: 'var(--ds-border)', borderTopColor: 'var(--ds-accent)' }} />
                  ) : (
                    <Icon name="check" size={16} style={{ color: 'var(--ds-accent)' }} />
                  )}
                  {isActive ? (
                    <TextShimmer as="span" duration={1.4} spread={1.4} className="text-[14px] font-medium">
                      {stage.heading}
                    </TextShimmer>
                  ) : (
                    <span className="text-[14px] font-medium" style={{ color: INK }}>
                      {stage.heading}
                    </span>
                  )}
                </div>
                <div className="pl-[26px]">{stage.render()}</div>
              </div>
            )
          })}
        </div>

        {/* Plan ready badge + CTA */}
        {done ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mt-8 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium" style={{ background: 'var(--ds-surface-2)', color: INK }}>
              <Icon name="check" size={15} style={{ color: '#16a34a' }} />
              {plan.summary.posts} posts · {plan.summary.platforms} platforms · out {plan.summary.releaseDate}
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="mt-1 flex h-10 items-center gap-1.5 rounded-lg px-4 text-[14px] font-medium transition-transform active:scale-[0.96]"
              style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}
            >
              Open your plan
              <Icon name="arrowLeft" size={16} className="rotate-180" />
            </button>
            <div className="text-[12px]" style={{ color: FAINT }}>
              Connect profiles to track results as they come in
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  )
}
