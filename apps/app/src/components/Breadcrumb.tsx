import { Fragment } from 'react'
import { Icon, type IconName } from './ui/icon'
import { INK, SUBTLE } from './workspace-ui'

export type Crumb = { icon?: IconName; label: string }

// Shared breadcrumb — the calendar's exact divider (chevronRight) and spacing
// (gap-2), reused by the shell top bar and the calendar's flush nav so every
// page reads the same. Leading crumbs are muted; the final crumb is emphasised
// (you-are-here). The first crumb carries the section icon.
export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1
        return (
          <Fragment key={i}>
            {i > 0 ? <Icon name="chevronRight" size={14} style={{ color: 'var(--ds-text-muted)' }} /> : null}
            {c.icon ? <Icon name={c.icon} size={17} style={{ color: SUBTLE }} /> : null}
            <span className={`text-[14px] ${last ? 'min-w-0 truncate font-medium' : ''}`} style={{ color: last ? INK : SUBTLE }}>
              {c.label}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}
