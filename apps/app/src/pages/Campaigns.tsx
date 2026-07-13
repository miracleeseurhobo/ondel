import { Megaphone, Send, Clapperboard, Target } from 'lucide-react'
import { INK, SUBTLE, FAINT, Card, Rise, PageHeading, IconTile, TINTS } from '../components/workspace-ui'

type Camp = {
  icon: React.ReactNode
  tint: string
  title: string
  status: string
  statusColor: { bg: string; fg: string }
  detail: string
  progress?: { value: number; label: string }
}

const GREEN = { bg: '#E4F6EE', fg: '#22B27B' }
const PURPLE = { bg: '#EFE9FC', fg: '#8A63E8' }
const BLUE = { bg: '#E8F1FF', fg: '#3D82DE' }
const GRAY = { bg: 'rgba(13,27,75,0.06)', fg: 'rgba(13,27,75,0.55)' }

const CAMPAIGNS: Camp[] = [
  {
    icon: <Megaphone className="h-[18px] w-[18px]" />,
    tint: TINTS.green,
    title: 'Pre-save campaign',
    status: 'Live',
    statusColor: GREEN,
    detail: '318 of 500 saves toward goal',
    progress: { value: 64, label: '64%' },
  },
  {
    icon: <Send className="h-[18px] w-[18px]" />,
    tint: TINTS.purple,
    title: 'Editorial pitches',
    status: 'In review',
    statusColor: PURPLE,
    detail: '14 sent · 3 curator replies so far',
  },
  {
    icon: <Clapperboard className="h-[18px] w-[18px]" />,
    tint: TINTS.blue,
    title: 'Short-form clips',
    status: 'Scheduled',
    statusColor: BLUE,
    detail: '6 clips queued for release week',
  },
  {
    icon: <Target className="h-[18px] w-[18px]" />,
    tint: TINTS.orange,
    title: 'Paid discovery ads',
    status: 'Draft',
    statusColor: GRAY,
    detail: 'Budget & audience not set yet',
  },
]

export default function Campaigns() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading title="Campaigns" sub="How you're getting Midnight Bloom in front of the right ears." />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPAIGNS.map((c, i) => (
          <Rise key={c.title} delay={0.06 + i * 0.05}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between">
                <IconTile tint={c.tint}>{c.icon}</IconTile>
                <span className="rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: c.statusColor.bg, color: c.statusColor.fg }}>
                  {c.status}
                </span>
              </div>
              <div className="mt-4 text-[16px] font-medium" style={{ color: INK }}>
                {c.title}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: SUBTLE }}>
                {c.detail}
              </div>
              {c.progress ? (
                <div className="mt-4">
                  <div className="flex justify-between text-[12px]" style={{ color: FAINT }}>
                    <span>Progress</span>
                    <span>{c.progress.label}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full" style={{ width: `${c.progress.value}%`, background: c.tint }} />
                  </div>
                </div>
              ) : null}
            </Card>
          </Rise>
        ))}
      </div>
    </div>
  )
}
