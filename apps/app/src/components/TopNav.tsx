import { type ReactNode } from 'react'
import Breadcrumb, { type Crumb } from './Breadcrumb'

// Shared flush top nav — the calendar's bar: h-[60px], hairline bottom border,
// px-6/8, breadcrumb on the left, page controls on the right. Reused by the
// shell (Bell + Connect) and the calendar (Month/Week + Ask Ondie); each page
// just swaps the right-hand content via `children`.
export default function TopNav({ crumbs, leading, children }: { crumbs: Crumb[]; leading?: ReactNode; children?: ReactNode }) {
  return (
    <div className="border-b px-6 sm:px-8" style={{ borderColor: 'var(--ds-hair)' }}>
      <div className="flex h-[60px] items-center gap-3">
        {leading}
        <Breadcrumb crumbs={crumbs} />
        {children ? <div className="ml-auto flex items-center gap-2">{children}</div> : null}
      </div>
    </div>
  )
}
