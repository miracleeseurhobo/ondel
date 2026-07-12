import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Disc3,
  CalendarDays,
  Activity,
  Megaphone,
  Sparkles,
  Plus,
  ArrowUp,
  Bell,
  ArrowUpRight,
  ListMusic,
  Radio,
  LogOut,
} from 'lucide-react'
import { mockSignOut } from '../lib/auth'

const INK = '#11315D'
const SUBTLE = 'rgba(13,27,75,0.55)'
const FAINT = 'rgba(13,27,75,0.40)'

const OndelLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden>
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

const NAV = [
  { icon: Home, label: 'Home', active: true },
  { icon: Disc3, label: 'Releases' },
  { icon: CalendarDays, label: 'Timeline' },
  { icon: Activity, label: 'Signals' },
  { icon: Megaphone, label: 'Campaigns' },
]

function Rise({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function StatCard({
  icon,
  tint,
  label,
  value,
  sub,
  delay,
}: {
  icon: ReactNode
  tint: string
  label: string
  value: string
  sub: string
  delay: number
}) {
  return (
    <Rise
      delay={delay}
      className="group flex flex-col justify-between rounded-2xl bg-white p-5"
      style={{ boxShadow: '0 1px 2px rgba(13,27,75,0.04), 0 8px 24px -12px rgba(13,27,75,0.12)' }}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: tint }}>
          {icon}
        </span>
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
    </Rise>
  )
}

export default function Workspace() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh" style={{ background: '#EEF1F7', color: INK }}>
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-[236px] flex-col justify-between px-4 py-6 md:flex">
        <div>
          <div className="flex items-center gap-2 px-2">
            <OndelLogo className="h-5 w-5" />
            <span className="text-[16px] font-medium tracking-[-0.32px]">Ondel</span>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors"
                  style={
                    item.active
                      ? { background: 'rgba(255,255,255,0.9)', color: INK, boxShadow: '0 1px 2px rgba(13,27,75,0.06)' }
                      : { color: SUBTLE }
                  }
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
        <div>
          <button
            type="button"
            className="mb-3 flex h-10 w-full items-center gap-2 rounded-xl px-3 text-[14px] text-white"
            style={{ background: 'linear-gradient(180deg, #70A8F2 0%, #3D82DE 100%)' }}
          >
            <Sparkles className="h-[18px] w-[18px]" />
            Ask Ondie
          </button>
          <button
            type="button"
            onClick={() => {
              mockSignOut()
              navigate('/signin')
            }}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/60"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium text-white" style={{ background: '#3D82DE' }}>
              O
            </span>
            <div className="flex-1 leading-tight">
              <div className="text-[13px] font-medium">Your workspace</div>
              <div className="text-[11px]" style={{ color: FAINT }}>
                Free plan
              </div>
            </div>
            <LogOut className="h-4 w-4" style={{ color: FAINT }} aria-label="Sign out" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-5 py-6 sm:px-8 lg:px-12">
        {/* Header */}
        <Rise className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <OndelLogo className="h-5 w-5" />
            <span className="text-[16px] font-medium">Ondel</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-[24px] font-medium tracking-[-0.4px]">Welcome back</h1>
            <p className="text-[14px]" style={{ color: SUBTLE }}>
              Here&apos;s what&apos;s moving on your release.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: '0 1px 2px rgba(13,27,75,0.08)' }}
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" style={{ color: SUBTLE }} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/start')}
              className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-white"
              style={{ background: INK }}
            >
              <Plus className="h-4 w-4" />
              New release
            </button>
          </div>
        </Rise>

        {/* Ondie ask bar */}
        <Rise delay={0.06} className="mt-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4"
            style={{ boxShadow: '0 1px 2px rgba(13,27,75,0.04), 0 8px 24px -12px rgba(13,27,75,0.12)' }}
          >
            <Sparkles className="h-[18px] w-[18px] shrink-0" style={{ color: '#3D82DE' }} />
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
              style={{
                background: 'linear-gradient(180deg, #70A8F2 0%, #3D82DE 100%)',
                boxShadow: '0 6px 16px -4px rgba(61,130,222,0.5)',
              }}
            >
              <ArrowUp className="h-[18px] w-[18px]" />
            </button>
          </form>
        </Rise>

        {/* Active release */}
        <Rise delay={0.12} className="mt-5">
          <div
            className="relative overflow-hidden rounded-2xl p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #2F6FE0 0%, #1B3E7A 100%)' }}
          >
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
                className="flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-[14px] font-medium"
                style={{ color: '#1B3E7A' }}
              >
                Open workspace
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            {/* progress */}
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
          <StatCard delay={0.18} tint="#3D82DE" icon={<Radio className="h-[18px] w-[18px]" />} label="Radar" value="14 playlists" sub="match your sound" />
          <StatCard delay={0.24} tint="#22B27B" icon={<Activity className="h-[18px] w-[18px]" />} label="Signals" value="+42%" sub="audience this month" />
          <StatCard delay={0.3} tint="#8A63E8" icon={<CalendarDays className="h-[18px] w-[18px]" />} label="Timeline" value="Pitch editorial" sub="next up · Thursday" />
          <StatCard delay={0.36} tint="#E8804F" icon={<Megaphone className="h-[18px] w-[18px]" />} label="Campaign" value="318 saves" sub="pre-save live" />
        </div>

        <Rise delay={0.42} className="mt-8 text-center">
          <Link to="/start" className="text-[13px] underline underline-offset-2" style={{ color: FAINT }}>
            Back to start
          </Link>
        </Rise>
      </main>
    </div>
  )
}
