import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { INK, SUBTLE, FAINT, Card, Rise, PageHeading, TINTS } from '../components/workspace-ui'

const STATS = [
  { label: 'Monthly listeners', value: '48.2k', delta: '+42%', up: true },
  { label: 'Saves this month', value: '3,910', delta: '+18%', up: true },
  { label: 'Avg. completion', value: '71%', delta: '+4%', up: true },
]

const WEEKS = [32, 41, 38, 55, 60, 72, 68, 88] // relative stream volume
const REGIONS = [
  { name: 'Germany', pct: 28 },
  { name: 'United States', pct: 22 },
  { name: 'United Kingdom', pct: 14 },
  { name: 'Netherlands', pct: 9 },
  { name: 'Mexico', pct: 7 },
]

export default function Signals() {
  const max = Math.max(...WEEKS)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeading title="Signals" sub="Where your audience is growing, and how the release is landing." />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <Rise key={s.label} delay={0.06 + i * 0.05}>
            <Card className="p-5">
              <div className="text-[13px]" style={{ color: FAINT }}>
                {s.label}
              </div>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[26px] font-medium leading-none" style={{ color: INK }}>
                  {s.value}
                </span>
                <span className="mb-0.5 flex items-center gap-0.5 text-[13px] font-medium" style={{ color: TINTS.green }}>
                  <TrendingUp className="h-3.5 w-3.5" />
                  {s.delta}
                </span>
              </div>
            </Card>
          </Rise>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Streams chart */}
        <Rise delay={0.22} className="lg:col-span-2">
          <Card className="p-5">
            <div className="text-[14px] font-medium" style={{ color: INK }}>
              Streams · last 8 weeks
            </div>
            <div className="mt-6 flex h-40 items-end gap-2.5">
              {WEEKS.map((w, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(w / max) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-md"
                    style={{ background: i === WEEKS.length - 1 ? TINTS.blue : 'rgba(61,130,222,0.28)', minHeight: 4 }}
                  />
                  <span className="text-[10px]" style={{ color: FAINT }}>
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Rise>

        {/* Top regions */}
        <Rise delay={0.28}>
          <Card className="p-5">
            <div className="text-[14px] font-medium" style={{ color: INK }}>
              Top regions
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {REGIONS.map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: SUBTLE }}>{r.name}</span>
                    <span style={{ color: FAINT }}>{r.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full" style={{ width: `${r.pct * 3}%`, background: TINTS.blue }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Rise>
      </div>
    </div>
  )
}
