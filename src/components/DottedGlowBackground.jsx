import { useRef, useEffect } from 'react'
import { usePrefersReducedMotion } from '../hooks/useScrollProgress'

// Adapted from Aceternity's DottedGlowBackground to plain JSX + <canvas> for
// this repo (Tailwind v3.4, no shadcn). A grid of dots that softly glow/pulse at
// varying speeds. Light-theme tuned. Reduced-motion → static dots. rAF pauses
// when off-screen. Decorative (aria-hidden). Radial mask fades dots at the edges
// (replaces the v4 `mask-radial-*` utilities from the original snippet).
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export default function DottedGlowBackground({
  className = '',
  gap = 12, // px between dot centers
  radius = 1.5, // dot radius (px)
  color = '#a3a3a3', // neutral-400 base dot
  glowColor = '#6b7280', // neutral-500 glow peak
  opacity = 1,
  backgroundOpacity = 0,
  speedMin = 0.3,
  speedMax = 1.6,
  speedScale = 1,
  maskRadial = true,
}) {
  const canvasRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const base = hexToRgb(color)
    const glow = hexToRgb(glowColor)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let dots = []
    let raf = 0
    let visible = true
    const start = performance.now()

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      dots = []
      for (let x = gap / 2; x < rect.width; x += gap) {
        for (let y = gap / 2; y < rect.height; y += gap) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: (speedMin + Math.random() * (speedMax - speedMin)) * speedScale,
          })
        }
      }
    }

    const draw = (time) => {
      const rect = canvas.getBoundingClientRect()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      if (backgroundOpacity > 0) {
        ctx.fillStyle = `rgba(${base[0]},${base[1]},${base[2]},${backgroundOpacity})`
        ctx.fillRect(0, 0, rect.width, rect.height)
      }
      const secs = (time - start) / 1000
      for (const d of dots) {
        const g = reduced ? 0.4 : Math.sin(secs * d.speed + d.phase) * 0.5 + 0.5
        const r = Math.round(base[0] + (glow[0] - base[0]) * g)
        const gg = Math.round(base[1] + (glow[1] - base[1]) * g)
        const b = Math.round(base[2] + (glow[2] - base[2]) * g)
        const a = (0.14 + g * 0.42) * opacity
        ctx.beginPath()
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${gg},${b},${a})`
        ctx.fill()
      }
    }

    const loop = (time) => {
      draw(time)
      if (!reduced && visible) raf = requestAnimationFrame(loop)
    }

    build()
    draw(performance.now())
    if (!reduced) raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => {
      build()
      if (reduced) draw(performance.now())
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !reduced && !raf) {
          raf = requestAnimationFrame(loop)
        } else if (!visible && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [gap, radius, color, glowColor, opacity, backgroundOpacity, speedMin, speedMax, speedScale, reduced])

  const maskStyle = maskRadial
    ? {
        WebkitMaskImage: 'radial-gradient(circle at center, #000 32%, transparent 88%)',
        maskImage: 'radial-gradient(circle at center, #000 32%, transparent 88%)',
      }
    : undefined

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={maskStyle}
    />
  )
}
