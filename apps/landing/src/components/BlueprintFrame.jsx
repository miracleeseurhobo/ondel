function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const int = parseInt(v, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

const CORNERS = [
  { x: 'left', y: 'top' },
  { x: 'right', y: 'top' },
  { x: 'left', y: 'bottom' },
  { x: 'right', y: 'bottom' },
]

function Crosshair({ style, color }) {
  return (
    <div
      className="bp-cross absolute h-3.5 w-3.5"
      style={{ ...style, transform: 'translate(-50%, -50%)' }}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: color }} />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: color }} />
    </div>
  )
}

// A drafting-style frame: framing rules + registration crosshairs draw in on
// first paint, then a diagonal hatch drifts as an ambient current. Pure CSS
// keyframes (off the main thread); reduced motion collapses it to a fade.
export default function BlueprintFrame({
  color = '#ffffff',
  inset = 48,
  speed = 1,
  mask = false,
  className = '',
}) {
  const [r, g, b] = hexToRgb(color)
  const a = (v) => `rgba(${r}, ${g}, ${b}, ${v})`
  const hatch = `repeating-linear-gradient(45deg, ${a(0.05)} 0px, ${a(0.05)} 1px, transparent 1px, transparent 13px)`
  const maskStyle = mask
    ? {
        WebkitMaskImage: 'radial-gradient(ellipse 82% 82% at 50% 50%, black 55%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 82% 82% at 50% 50%, black 55%, transparent 100%)',
      }
    : undefined

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={maskStyle}
    >
      {/* Ambient diagonal hatch */}
      <div
        className={speed === 0 ? 'bp-hatch bp-hatch-static absolute inset-0' : 'bp-hatch absolute inset-0'}
        style={{ backgroundImage: hatch, '--bp-drift': speed ? `${24 / speed}s` : undefined }}
      />
      {/* Full-width rules */}
      <div className="bp-rule-x absolute inset-x-0 top-0 h-px" style={{ background: a(0.16) }} />
      <div
        className="bp-rule-x absolute inset-x-0 bottom-0 h-px"
        style={{ background: a(0.16), animationDelay: '0.08s' }}
      />
      {/* Vertical framing bands */}
      <div className="bp-rule-y absolute inset-y-0 w-px" style={{ left: inset, background: a(0.16), animationDelay: '0.15s' }} />
      <div className="bp-rule-y absolute inset-y-0 w-px" style={{ right: inset, background: a(0.16), animationDelay: '0.15s' }} />
      {/* Registration crosshairs at the frame intersections */}
      {CORNERS.map((c, i) => (
        <Crosshair key={i} color={a(0.38)} style={{ [c.x]: inset, [c.y]: 0 }} />
      ))}
    </div>
  )
}
