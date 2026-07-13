import { Hammer } from 'lucide-react'
import { INK, SUBTLE, FAINT, PageHeading } from './workspace-ui'

// Placeholder for nav sections we'll build out step by step from Home.
export default function BlankPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeading title={title} />
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'rgba(61,130,222,0.1)' }}>
          <Hammer className="h-5 w-5" style={{ color: '#3D82DE' }} />
        </span>
        <div className="mt-4 text-[16px] font-medium" style={{ color: INK }}>
          {title} is coming soon
        </div>
        <div className="mt-1 max-w-sm text-[14px]" style={{ color: SUBTLE }}>
          We&apos;re building the workspace step by step from Home.
        </div>
        <div className="mt-1 text-[12px]" style={{ color: FAINT }}>
          Ask Ondie on the home screen to get started.
        </div>
      </div>
    </div>
  )
}
