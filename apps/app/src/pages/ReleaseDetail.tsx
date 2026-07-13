import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Radio, ArrowUpRight } from 'lucide-react'
import { INK, SUBTLE, FAINT, Card, Rise, TINTS } from '../components/workspace-ui'
import { releaseById, type Task } from '../lib/data'

const DOT: Record<Task['state'], string> = { done: '#22B27B', active: '#3D82DE', upcoming: 'rgba(13,27,75,0.25)' }

export default function ReleaseDetail() {
  const { id } = useParams()
  const r = releaseById(id)

  if (!r) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link to="/releases" className="inline-flex items-center gap-1.5 text-[14px]" style={{ color: SUBTLE }}>
          <ArrowLeft className="h-4 w-4" /> Releases
        </Link>
        <p className="mt-8 text-[15px]" style={{ color: SUBTLE }}>
          That release couldn't be found.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Rise>
        <Link to="/releases" className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: SUBTLE }}>
          <ArrowLeft className="h-4 w-4" /> Releases
        </Link>
      </Rise>

      {/* Header */}
      <Rise delay={0.05} className="mt-4">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: r.cover }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[12px] uppercase tracking-[0.14em] text-white/70">{r.type}</div>
              <div className="mt-1 text-[28px] font-medium leading-tight">{r.title}</div>
              <div className="mt-1 text-[13px] text-white/75">{r.meta}</div>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-medium backdrop-blur">{r.status}</span>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-[12px] text-white/70">
              <span>Release readiness</span>
              <span>{r.readiness}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.readiness}%` }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>
        </div>
      </Rise>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {r.stats.map((s, i) => (
          <Rise key={s.label} delay={0.1 + i * 0.04}>
            <Card className="p-4">
              <div className="text-[12px]" style={{ color: FAINT }}>
                {s.label}
              </div>
              <div className="mt-1 text-[20px] font-medium" style={{ color: INK }}>
                {s.value}
              </div>
            </Card>
          </Rise>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Next up / tasks */}
        <Rise delay={0.16}>
          <Card className="p-5">
            <div className="text-[14px] font-medium" style={{ color: INK }}>
              Plan
            </div>
            <ol className="relative mt-4 ml-1">
              <span className="absolute left-[11px] top-1 bottom-1 w-px bg-black/[0.08]" aria-hidden />
              {r.tasks.map((t, i) => (
                <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                  <span
                    className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: t.state === 'done' ? DOT.done : '#fff', border: `2px solid ${DOT[t.state]}` }}
                  >
                    {t.state === 'done' ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : <span className="h-2 w-2 rounded-full" style={{ background: DOT[t.state] }} />}
                  </span>
                  <div className="flex flex-1 items-baseline justify-between gap-2 pt-0.5">
                    <span className="text-[14px]" style={{ color: t.state === 'upcoming' ? SUBTLE : INK }}>
                      {t.title}
                    </span>
                    <span className="text-[12px]" style={{ color: FAINT }}>
                      {t.when}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </Rise>

        {/* Radar / playlist matches */}
        <Rise delay={0.22}>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-[14px] font-medium" style={{ color: INK }}>
              <Radio className="h-[18px] w-[18px]" style={{ color: TINTS.blue }} />
              Playlist matches
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {r.playlists.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[14px]" style={{ color: INK }}>
                      {p.name}
                    </div>
                    <div className="text-[12px]" style={{ color: FAINT }}>
                      {p.followers} followers
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ background: '#E8F1FF', color: '#3D82DE' }}>
                    {p.match}% match
                  </span>
                </div>
              ))}
            </div>
            <Link to="/campaigns" className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium" style={{ color: TINTS.blue }}>
              Draft pitches <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </Rise>
      </div>
    </div>
  )
}
