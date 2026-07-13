import { Music2 } from 'lucide-react'
import { INK, SUBTLE, FAINT, Card, Rise, PageHeading } from '../components/workspace-ui'

type Status = 'In progress' | 'Draft' | 'Scheduled' | 'Released'

const STATUS_COLOR: Record<Status, { bg: string; fg: string }> = {
  'In progress': { bg: '#E8F1FF', fg: '#3D82DE' },
  Draft: { bg: 'rgba(13,27,75,0.06)', fg: 'rgba(13,27,75,0.55)' },
  Scheduled: { bg: '#EFE9FC', fg: '#8A63E8' },
  Released: { bg: '#E4F6EE', fg: '#22B27B' },
}

const RELEASES: { title: string; type: string; status: Status; meta: string; cover: string }[] = [
  { title: 'Midnight Bloom', type: 'Single', status: 'In progress', meta: 'Release week in 12 days', cover: 'linear-gradient(135deg,#5B8DEF,#2F5F9E)' },
  { title: 'Neon Tide', type: 'EP · 5 tracks', status: 'Draft', meta: 'No date set', cover: 'linear-gradient(135deg,#8A63E8,#5B3FB0)' },
  { title: 'Paper Skies', type: 'Single', status: 'Scheduled', meta: 'Out Aug 8', cover: 'linear-gradient(135deg,#22B27B,#128a5c)' },
  { title: 'Slow River', type: 'Single', status: 'Released', meta: '128k streams · 2 mo ago', cover: 'linear-gradient(135deg,#E8804F,#c85a2a)' },
]

export default function Releases() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading title="Releases" sub="Everything you've shipped and everything in motion." />
      <Rise delay={0.06} className="mt-6">
        <Card className="divide-y divide-black/[0.05]">
          {RELEASES.map((r) => {
            const c = STATUS_COLOR[r.status]
            return (
              <div key={r.title} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                <span className="h-11 w-11 shrink-0 rounded-lg" style={{ background: r.cover }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium" style={{ color: INK }}>
                    {r.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px]" style={{ color: FAINT }}>
                    <Music2 className="h-3.5 w-3.5" />
                    {r.type}
                  </div>
                </div>
                <div className="hidden text-right text-[13px] sm:block" style={{ color: SUBTLE }}>
                  {r.meta}
                </div>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: c.bg, color: c.fg }}>
                  {r.status}
                </span>
              </div>
            )
          })}
        </Card>
      </Rise>
    </div>
  )
}
