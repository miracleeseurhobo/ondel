// Ondie AI brand mark — an upside-down headphone that reads as a smiley: the
// thick headband arc is the smile, the two rounded earcup bars are the eyes.
// Monochrome + theme-aware (accent tile, accent-fg mark). Single source of truth.
export default function OndieMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--ds-accent)" />
      {/* earcups = eyes */}
      <g fill="var(--ds-accent-fg)">
        <rect x="11.2" y="8" width="2.6" height="6.1" rx="1.3" />
        <rect x="18.2" y="8" width="2.6" height="6.1" rx="1.3" />
      </g>
      {/* headband = smile */}
      <path d="M9.6 15.6 A 6.4 6.4 0 0 0 22.4 15.6" fill="none" stroke="var(--ds-accent-fg)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}
