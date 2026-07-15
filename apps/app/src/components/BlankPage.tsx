import { Icon } from './ui/icon'
import { INK, SUBTLE, FAINT } from './workspace-ui'

// Placeholder for nav sections we'll build out step by step from Home.
// Full-width (fills the card like every page) with the shared eyebrow/title.
export default function BlankPage({ title, eyebrow = 'Workspace' }: { title: string; eyebrow?: string }) {
  return (
    <div className="w-full pb-10">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: FAINT }}>
        {eyebrow}
      </div>
      <h1 className="mt-1 text-[26px] font-medium tracking-[-0.5px]" style={{ color: INK }}>
        {title}
      </h1>
      <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center" style={{ borderColor: 'var(--ds-border)' }}>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'var(--ds-surface-2)' }}>
          <Icon name="hammer" size={20} style={{ color: INK }} />
        </span>
        <div className="mt-4 text-[16px] font-medium" style={{ color: INK }}>
          {title} is coming soon
        </div>
        <div className="mt-1 max-w-sm text-[14px]" style={{ color: SUBTLE }}>
          We&apos;re building the workspace step by step from Home.
        </div>
      </div>
    </div>
  )
}
