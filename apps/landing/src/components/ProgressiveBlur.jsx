// Progressive (tiered) blur: stacked backdrop-blur layers, each masked to a
// band, so the blur intensifies toward the bottom edge. Content scrolling
// behind dissolves into a frosted gradient instead of hard-cutting.

// Three tiers keep the progressive falloff while limiting GPU blur passes
// (fixing-motion-performance rules 6 & 7 — blur ≤ 8px, few promoted layers).
const LAYERS = [
  { blur: 1, stop: 90 },
  { blur: 3, stop: 55 },
  { blur: 8, stop: 28 },
]

export default function ProgressiveBlur({ className = '', tint = '#fafafa' }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      {LAYERS.map((l, i) => {
        // Opaque at the bottom (0%), fading to transparent by `stop`% toward top.
        const mask = `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) ${l.stop}%)`
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${l.blur}px)`,
              WebkitBackdropFilter: `blur(${l.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      })}
      {/* Soft colour fade so content also lightens into the pinned chatbox. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${tint} 8%, transparent 70%)`,
        }}
      />
    </div>
  )
}
