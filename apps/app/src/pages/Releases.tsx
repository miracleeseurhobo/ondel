import { Link } from 'react-router-dom'
import { Music2, ChevronRight } from 'lucide-react'
import { INK, SUBTLE, FAINT, Card, Rise, PageHeading } from '../components/workspace-ui'
import { RELEASES, STATUS_COLOR } from '../lib/data'

export default function Releases() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading title="Releases" sub="Everything you've shipped and everything in motion." />
      <Rise delay={0.06} className="mt-6">
        <Card className="divide-y divide-black/[0.05]">
          {RELEASES.map((r) => {
            const c = STATUS_COLOR[r.status]
            return (
              <Link
                key={r.id}
                to={`/releases/${r.id}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-black/[0.015] sm:px-5"
              >
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
                <ChevronRight className="h-4 w-4 shrink-0" style={{ color: FAINT }} />
              </Link>
            )
          })}
        </Card>
      </Rise>
    </div>
  )
}
