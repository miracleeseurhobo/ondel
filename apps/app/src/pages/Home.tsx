import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUp, ArrowUpRight, ListMusic, Radio, Activity, CalendarDays, Megaphone } from 'lucide-react'
import { INK, SUBTLE, FAINT, CARD_SHADOW, Rise, PageHeading, IconTile, TINTS } from '../components/workspace-ui'

function StatCard({
  to,
  icon,
  tint,
  label,
  value,
  sub,
  delay,
}: {
  to: string
  icon: React.ReactNode
  tint: string
  label: string
  value: string
  sub: string
  delay: number
}) {
  const navigate = useNavigate()
  return (
    <Rise delay={delay}>
      <button
        type="button"
        onClick={() => navigate(to)}
        className="group flex h-full w-full flex-col justify-between rounded-2xl bg-white p-5 text-left transition-transform active:scale-[0.99]"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="flex items-start justify-between">
          <IconTile tint={tint}>{icon}</IconTile>
          <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: FAINT }} />
        </div>
        <div className="mt-6">
          <div className="text-[13px]" style={{ color: FAINT }}>
            {label}
          </div>
          <div className="mt-1 text-[22px] font-medium leading-tight" style={{ color: INK }}>
            {value}
          </div>
          <div className="mt-1 text-[13px]" style={{ color: SUBTLE }}>
            {sub}
          </div>
        </div>
      </button>
    </Rise>
  )
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeading title="Welcome back" sub="Here's what's moving on your release." />

      {/* Ondie ask bar */}
      <Rise delay={0.06} className="mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/start')
          }}
          className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <Sparkles className="h-[18px] w-[18px] shrink-0" style={{ color: TINTS.blue }} />
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Ondie about your release…"
            className="h-9 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[rgba(13,27,75,0.4)]"
            style={{ color: INK, minWidth: 0 }}
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-transform active:scale-95"
            style={{ background: 'linear-gradient(180deg, #70A8F2 0%, #3D82DE 100%)', boxShadow: '0 6px 16px -4px rgba(61,130,222,0.5)' }}
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </button>
        </form>
      </Rise>

      {/* Active release */}
      <Rise delay={0.12} className="mt-5">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #2F6FE0 0%, #1B3E7A 100%)' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                <ListMusic className="h-6 w-6" />
              </span>
              <div>
                <div className="text-[12px] uppercase tracking-[0.14em] text-white/60">Active release · Single</div>
                <div className="text-[22px] font-medium leading-tight">Midnight Bloom</div>
                <div className="mt-0.5 text-[13px] text-white/70">Release week in 12 days · 3 tasks need you</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/timeline')}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-[14px] font-medium"
              style={{ color: '#1B3E7A' }}
            >
              Open workspace
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-[12px] text-white/60">
              <span>Release readiness</span>
              <span>64%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '64%' }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>
        </div>
      </Rise>

      {/* Stat grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard to="/releases" delay={0.18} tint={TINTS.blue} icon={<Radio className="h-[18px] w-[18px]" />} label="Radar" value="14 playlists" sub="match your sound" />
        <StatCard to="/signals" delay={0.24} tint={TINTS.green} icon={<Activity className="h-[18px] w-[18px]" />} label="Signals" value="+42%" sub="audience this month" />
        <StatCard to="/timeline" delay={0.3} tint={TINTS.purple} icon={<CalendarDays className="h-[18px] w-[18px]" />} label="Timeline" value="Pitch editorial" sub="next up · Thursday" />
        <StatCard to="/campaigns" delay={0.36} tint={TINTS.orange} icon={<Megaphone className="h-[18px] w-[18px]" />} label="Campaign" value="318 saves" sub="pre-save live" />
      </div>
    </div>
  )
}
