import { memo } from 'react'

// Concentric "signal" rings that gently breathe outward — adapted from MagicUI's
// Ripple to plain JSX/Tailwind. Decorative (aria-hidden), CSS-only, and paused
// under prefers-reduced-motion (see .ripple-ring in index.css). `color` is an
// "R G B" triplet so opacity can be applied per ring.
function Ripple({
  className = '',
  color = '150 217 255', // brand #96d9ff — matches the beam gradient
  numCircles = 4,
  baseSize = 68,
  step = 40,
}) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      {Array.from({ length: numCircles }).map((_, i) => {
        const size = baseSize + i * step
        const opacity = Math.max(0.22 - i * 0.05, 0.05)
        return (
          <div
            key={i}
            className="ripple-ring absolute rounded-full border"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: `rgb(${color} / ${opacity})`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export default memo(Ripple)
