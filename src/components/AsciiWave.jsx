import { useRef, useEffect } from 'react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

const DEFAULT_CHARS = ' .:-=+*xsoX0#8@'

function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}
function fade(t) {
  return t * t * (3 - 2 * t)
}
function valueNoise(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const tl = hash(xi, yi)
  const tr = hash(xi + 1, yi)
  const bl = hash(xi, yi + 1)
  const br = hash(xi + 1, yi + 1)
  const u = fade(xf)
  const v = fade(yf)
  const top = tl + (tr - tl) * u
  const bot = bl + (br - bl) * u
  return top + (bot - top) * v
}
function fbm(x, y) {
  return valueNoise(x, y) * 0.65 + valueNoise(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.35
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const int = parseInt(v, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

// A horizontal river of ASCII glyphs flowing through a value-noise field.
// Deep accent, hottest at the center band. Freezes to a single static frame
// under reduced motion, and pauses when off-screen.
export default function AsciiWave({
  accent = '#8b5cf6',
  cell = 12,
  speed = 1,
  spread = 0.15,
  chars = DEFAULT_CHARS,
  className = '',
}) {
  const canvasRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const [ar, ag, ab] = hexToRgb(accent)

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let raf = 0
    let t = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / cell) + 1
      rows = Math.ceil(height / cell) + 1
      ctx.font = `${cell}px ui-monospace, "JetBrains Mono", monospace`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const centerRow = rows / 2
      const sigma = Math.max(1, rows * spread)
      const freq = 0.08
      for (let r = 0; r < rows; r++) {
        const dy = (r - centerRow) / sigma
        const band = Math.exp(-dy * dy * 0.5)
        if (band < 0.02) continue
        for (let c = 0; c < cols; c++) {
          const n = fbm(c * freq + t, r * freq)
          let heat = n * band
          if (heat < 0.08) continue
          heat = Math.min(1, heat * 1.35)
          const ci = Math.min(chars.length - 1, Math.floor(heat * chars.length))
          const ch = chars[ci]
          if (ch === ' ') continue
          ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${heat})`
          ctx.fillText(ch, c * cell + cell / 2, r * cell + cell / 2)
        }
      }
    }

    const loop = () => {
      t += 0.02 * speed
      draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    draw()

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced || speed === 0) draw()
    })
    ro.observe(canvas)

    let io
    if (!reduced && speed !== 0) {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(loop)
        } else {
          cancelAnimationFrame(raf)
          raf = 0
        }
      })
      io.observe(canvas)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io?.disconnect()
    }
  }, [accent, cell, speed, spread, chars, reduced])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
