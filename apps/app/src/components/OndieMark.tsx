// Ondie AI brand mark — a boxy smiley (upside-down headphone read): two chunky
// bar eyes + a bold U smile, filling the tile. Monochrome + theme-aware (accent
// tile, accent-fg mark). Single source of truth.
export default function OndieMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--ds-accent)" />
      {/* eyes */}
      <g fill="var(--ds-accent-fg)">
        <rect x="10.4" y="6.3" width="3.3" height="7.4" rx="1.3" />
        <rect x="18.3" y="6.3" width="3.3" height="7.4" rx="1.3" />
      </g>
      {/* smile */}
      <path d="M7.5 15 A 8.5 8.5 0 0 0 24.5 15" fill="none" stroke="var(--ds-accent-fg)" strokeWidth="3.3" strokeLinecap="round" />
    </svg>
  )
}
