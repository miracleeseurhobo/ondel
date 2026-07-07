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
  baseOpacity = 0.22, // innermost ring; fades outward
  glow = false, // soft radial gradient behind the rings for depth
}) {
  const fieldSize = baseSize + numCircles * step
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      {glow && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `${fieldSize}px`,
            height: `${fieldSize}px`,
            background: `radial-gradient(circle, rgb(${color} / 0.10) 0%, rgb(${color} / 0.05) 38%, rgb(${color} / 0.02) 58%, transparent 72%)`,
          }}
        />
      )}
      {Array.from({ length: numCircles }).map((_, i) => {
        const size = baseSize + i * step
        const opacity = Math.max(baseOpacity - i * 0.045, 0.05)
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
