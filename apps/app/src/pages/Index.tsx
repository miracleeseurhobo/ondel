import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'

// Remote assets (folder / lights / cards / icons) — the visual centrepiece.
const A = 'https://qclay.design/lovable/sixsense'

/* ------------------------------------------------------------------ */
/* Pixel-grid background                                               */
/* ------------------------------------------------------------------ */

const COLS = 12
const ROWS = 16
const TILE = 32
const GAP = 1
const STEP = TILE + GAP
const GRID_W = COLS * TILE + (COLS - 1) * GAP
const GRID_H = ROWS * TILE + (ROWS - 1) * GAP
const BASE_FILL = 0.35
const HOVER_FILL_RATIO = 0.7
const BASE_R = 4

const SPRITE_URLS = [
  '/tiles/tile-empty.svg',
  '/tiles/tile-1.svg',
  '/tiles/tile-2.svg',
  '/tiles/tile-3.svg',
  '/tiles/tile-4.svg',
  '/tiles/tile-5.svg',
]

// Load + rasterize sprites once (module-level cache shared by both grids).
let spritesPromise: Promise<HTMLCanvasElement[]> | null = null
function getSprites(): Promise<HTMLCanvasElement[]> {
  if (spritesPromise) return spritesPromise
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const size = TILE * dpr
  spritesPromise = Promise.all(
    SPRITE_URLS.map(
      (url) =>
        new Promise<HTMLCanvasElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const c = document.createElement('canvas')
            c.width = size
            c.height = size
            const g = c.getContext('2d')!
            g.drawImage(img, 0, 0, size, size)
            resolve(c)
          }
          img.onerror = reject
          img.src = url
        }),
    ),
  )
  return spritesPromise
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function PixelGrid({ side }: { side: 'left' | 'right' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = GRID_W * dpr
    canvas.height = GRID_H * dpr
    const ctx = canvas.getContext('2d')!

    const total = COLS * ROWS
    const baseCount = Math.round(total * BASE_FILL)
    // stable sprite (1..5) per cell
    const spriteIdx = new Int8Array(total).map(() => 1 + Math.floor(Math.random() * 5))
    // which cells belong to the base fill
    const baseTargets = new Set(shuffle([...Array(total).keys()]).slice(0, baseCount))
    const baseOn = new Uint8Array(total) // current base state
    const hoverOn = new Set<number>() // cells lit by the cursor blob

    let sprites: HTMLCanvasElement[] | null = null
    let raf = 0
    const timers: number[] = []
    let disposed = false

    const cellXY = (i: number) => [i % COLS, Math.floor(i / COLS)] as const

    const draw = () => {
      if (!sprites) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, GRID_W, GRID_H)
      for (let i = 0; i < total; i++) {
        const on = baseOn[i] === 1 || hoverOn.has(i)
        const sprite = on ? sprites[spriteIdx[i]] : sprites[0]
        const [cx, cy] = cellXY(i)
        ctx.drawImage(sprite, cx * STEP, cy * STEP, TILE, TILE)
      }
    }

    // ---- reveal on mount ----
    const runReveal = () => {
      const order = shuffle([...baseTargets])
      const perTick = Math.ceil(total / 18)
      let p = 0
      const tick = () => {
        if (disposed) return
        for (let k = 0; k < perTick && p < order.length; k++, p++) baseOn[order[p]] = 1
        draw()
        if (p < order.length) raf = requestAnimationFrame(tick)
        else startAmbient()
      }
      raf = requestAnimationFrame(tick)
    }

    // ---- ambient flicker ----
    const startAmbient = () => {
      const flick = () => {
        if (disposed) return
        for (let k = 0; k < 3; k++) {
          const i = Math.floor(Math.random() * total)
          if (hoverOn.has(i)) continue
          baseOn[i] = Math.random() < BASE_FILL ? 1 : 0
        }
        draw()
        timers.push(window.setTimeout(flick, 120 + Math.random() * 180))
      }
      timers.push(window.setTimeout(flick, 120 + Math.random() * 180))
    }

    // ---- hover blob (organic radius following the cursor) ----
    let pointer: { x: number; y: number } | null = null
    let hoverRaf = 0
    let dropSet = new Set<number>() // ~30% held out for the 0.7 fill + sparkle

    const reconcile = () => {
      hoverRaf = 0
      hoverOn.clear()
      if (pointer) {
        const rect = canvas.getBoundingClientRect()
        const px = (pointer.x - rect.left) / STEP
        const py = (pointer.y - rect.top) / STEP
        const t = performance.now()
        const n = Math.random()
        for (let i = 0; i < total; i++) {
          const [cx, cy] = cellXY(i)
          const dx = cx - px
          const dy = cy - py
          const dist = Math.hypot(dx, dy)
          if (dist > BASE_R * 2.5) continue
          const a = Math.atan2(dy, dx)
          const mod =
            Math.sin(a * 3 + t * 0.0011) * 0.55 +
            Math.sin(a * 5 - t * 0.0017 + 1.3) * 0.3 +
            Math.sin(a * 2 + t * 0.0007 + 2.1) * 0.2
          const rMax = BASE_R * (1 + mod) * (0.95 + n * 0.3)
          let inside = false
          if (dist <= rMax - 0.5) inside = true
          else if (dist <= rMax + 0.4) {
            const edge = (Math.sin(cx * 12.9898 + cy * 78.233 + t * 0.002) + 1) * 0.5
            inside = edge > 0.45
          }
          if (inside && !dropSet.has(i)) hoverOn.add(i)
        }
      }
      draw()
    }

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
      if (!hoverRaf) hoverRaf = requestAnimationFrame(reconcile)
    }
    const onLeave = () => {
      pointer = null
      if (!hoverRaf) hoverRaf = requestAnimationFrame(reconcile)
    }

    const startHoverFlicker = () => {
      const flick = () => {
        if (disposed) return
        // re-randomise the held-out (~30%) set so hovered cells sparkle
        const next = new Set<number>()
        hoverOn.forEach((i) => {
          if (Math.random() > HOVER_FILL_RATIO) next.add(i)
        })
        dropSet = next
        if (pointer && !hoverRaf) hoverRaf = requestAnimationFrame(reconcile)
        timers.push(window.setTimeout(flick, 70 + Math.random() * 90))
      }
      timers.push(window.setTimeout(flick, 70 + Math.random() * 90))
    }

    getSprites().then((s) => {
      if (disposed) return
      sprites = s
      if (reduced) {
        baseTargets.forEach((i) => (baseOn[i] = 1))
        draw()
        return
      }
      runReveal()
      startHoverFlicker()
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerleave', onLeave)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(hoverRaf)
      timers.forEach((t) => clearTimeout(t))
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  const mask =
    side === 'left'
      ? 'radial-gradient(ellipse 80% 80% at 30% 50%, black 0%, transparent 75%)'
      : 'radial-gradient(ellipse 80% 80% at 70% 50%, black 0%, transparent 75%)'

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        left: side === 'left' ? 0 : undefined,
        right: side === 'right' ? 0 : undefined,
        top: '50%',
        transform: 'translateY(-40%)',
        width: GRID_W,
        height: GRID_H,
        zIndex: 0,
        pointerEvents: 'none',
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Ondel wordmark (navbar)                                             */
/* ------------------------------------------------------------------ */

function OndelMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 22, marginLeft: 22, height: 16 }}>
      <svg width="16" height="16" viewBox="0 0 256 256" fill="#3D82DE" aria-hidden>
        <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
      </svg>
      <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '16px', letterSpacing: '-0.32px', color: '#11315D' }}>
        Ondel
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Folder / lights stack + floating cards                              */
/* ------------------------------------------------------------------ */

type Layer = {
  src: string
  z: number
  bottom: number
  left: number
  cx?: boolean
  w: number
  h: number
  kind: 'fade' | 'rise'
  duration: number
  delay: number
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_FOLDER: [number, number, number, number] = [0.22, 1, 0.36, 1]

const LAYERS: Layer[] = [
  { z: 1, src: 'blue-light-2.svg', bottom: 50, left: 54.6, cx: true, w: 104, h: 170, kind: 'fade', duration: 0.8, delay: 1.0 },
  { z: 2, src: 'blue-light.svg', bottom: 28, left: 54.6, cx: true, w: 104, h: 170, kind: 'fade', duration: 0.8, delay: 1.0 },
  { z: 3, src: 'light-1.svg', bottom: 35, left: 57.2, cx: true, w: 180.5, h: 124.5, kind: 'fade', duration: 1.0, delay: 1.0 },
  { z: 4, src: 'folder-3.svg', bottom: 60, left: 23.4, w: 69.71, h: 45, kind: 'rise', duration: 0.6, delay: 0.8 },
  { z: 5, src: 'small-light-2.svg', bottom: 55, left: 67.6, cx: true, w: 39, h: 17, kind: 'fade', duration: 0.6, delay: 1.4 },
  { z: 6, src: 'small-light.svg', bottom: 50, left: 44.2, cx: true, w: 39, h: 25, kind: 'fade', duration: 0.6, delay: 1.4 },
  { z: 7, src: 'folder-2.svg', bottom: 45, left: 18.98, w: 79, h: 51, kind: 'rise', duration: 0.6, delay: 0.6 },
  { z: 8, src: 'light-2.svg', bottom: 20, left: 57.2, cx: true, w: 109, h: 162.5, kind: 'fade', duration: 1.0, delay: 1.1 },
  { z: 9, src: 'folder-1.svg', bottom: 30, left: 13, w: 91, h: 58, kind: 'rise', duration: 0.6, delay: 0.4 },
  { z: 10, src: 'folder-0.svg?v=2', bottom: 0, left: 0, w: 113.67, h: 76.5, kind: 'rise', duration: 0.6, delay: 0.0 },
]

const FOLDER_CENTER = 113.67 / 2

type CardCfg = {
  img: string
  w: number
  h: number
  x: number
  y: number
  rot: number
  sw: number
  sh: number
  sx: number
  sy: number
  yKeys: number[]
  rotKeys: number[]
  dur: number
}

const CARDS: CardCfg[] = [
  { img: 'image-1.png', w: 88.55, h: 68.46, x: -82, y: 123, rot: -16, sw: 20, sh: 20, sx: -5, sy: 7, yKeys: [0, -6, 0, 4, 0], rotKeys: [0, -2, 0, 2, 0], dur: 6 },
  { img: 'image-2.png', w: 105, h: 87, x: 68, y: 124, rot: 24, sw: 20, sh: 20, sx: 35, sy: 33, yKeys: [0, 5, 0, -5, 0], rotKeys: [0, 2, 0, -2, 0], dur: 7 },
  { img: 'image-3.png', w: 105, h: 96, x: -4, y: 148, rot: -4, sw: 20, sh: 20, sx: -4, sy: 27, yKeys: [0, -4, 0, 6, 0], rotKeys: [0, -1.5, 0, 1.5, 0], dur: 8 },
]

function leftFor(x: number, w: number) {
  return FOLDER_CENTER + x - w / 2
}

function FolderStack() {
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = useReducedMotion()

  return (
    <div style={{ position: 'relative', width: 113.67, height: 220, overflow: 'visible' }}>
      {LAYERS.map((l) => (
        <motion.img
          key={l.z}
          src={`${A}/${l.src}`}
          alt=""
          aria-hidden
          initial={l.kind === 'fade' ? { opacity: 0, ...(l.cx ? { x: '-50%' } : {}) } : { opacity: 0, y: 30 }}
          animate={l.kind === 'fade' ? { opacity: 1, ...(l.cx ? { x: '-50%' } : {}) } : { opacity: 1, y: 0 }}
          transition={{ duration: l.duration, delay: l.delay, ease: l.kind === 'fade' ? 'easeOut' : EASE_FOLDER }}
          style={{ position: 'absolute', bottom: l.bottom, left: l.left, width: l.w, height: l.h, zIndex: l.z }}
        />
      ))}

      {CARDS.map((c, i) => {
        const isHovered = hovered === i
        const anyHovered = hovered !== null
        return (
          <motion.div
            key={c.img}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            initial={{ opacity: 0, width: c.sw, height: c.sh, left: leftFor(c.sx, c.sw), bottom: c.sy, rotate: 0 }}
            animate={{
              opacity: 1,
              width: c.w,
              height: c.h,
              left: leftFor(c.x, c.w),
              bottom: c.y,
              rotate: c.rot,
              scale: isHovered ? 1.08 : 1,
              zIndex: isHovered ? 20 : 11 + i,
            }}
            transition={{
              duration: 1.4,
              delay: 0.6 + i * 0.25,
              ease: EASE_OUT,
              scale: { duration: 0.4, ease: EASE_OUT },
              zIndex: { duration: 0 },
            }}
            style={{
              position: 'absolute',
              transformOrigin: '50% 100%',
              borderRadius: 10,
              boxShadow: '0 16px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={
                anyHovered || reduced
                  ? { y: 0, rotate: 0 }
                  : { y: c.yKeys, rotate: c.rotKeys }
              }
              transition={
                anyHovered || reduced
                  ? { duration: 0.4, ease: EASE_OUT }
                  : { duration: c.dur, repeat: Infinity, ease: 'easeInOut' }
              }
              style={{ width: '100%', height: '100%' }}
            >
              <img src={`${A}/${c.img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */

const PHRASES = [
  'Plan a single release in six weeks',
  'Find playlists for an indie-pop track',
  'Draft a launch-week content plan',
  'Pitch editorial curators',
  'Build a pre-save campaign',
]

function Typewriter() {
  const [text, setText] = useState('')
  const state = useRef({ phrase: 0, char: 0, deleting: false })

  useEffect(() => {
    let timer = 0
    const run = () => {
      const s = state.current
      const full = PHRASES[s.phrase]
      if (!s.deleting) {
        s.char++
        setText(full.slice(0, s.char))
        if (s.char >= full.length) {
          s.deleting = true
          timer = window.setTimeout(run, 1400)
          return
        }
        timer = window.setTimeout(run, 22 + Math.random() * 25)
      } else {
        s.char--
        setText(full.slice(0, s.char))
        if (s.char <= 0) {
          s.deleting = false
          s.phrase = (s.phrase + 1) % PHRASES.length
        }
        timer = window.setTimeout(run, 14)
      }
    }
    timer = window.setTimeout(run, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ height: 32, fontSize: 15, lineHeight: '22px', fontWeight: 400, color: '#0D1B4B', paddingBottom: 10 }}>
      {text}
      <span
        style={{
          display: 'inline-block',
          width: 2,
          height: 18,
          marginLeft: 2,
          background: '#0D1B4B',
          verticalAlign: 'text-bottom',
          animation: 'promptCaretBlink 1s steps(1) infinite',
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Send button                                                         */
/* ------------------------------------------------------------------ */

function SendButton() {
  const [hovered, setHovered] = useState(false)
  const [arrowToggle, setArrowToggle] = useState(0)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const anim = useRef({ rot: 0, speed: 0, last: 0, raf: 0, hovered: false })

  const loop = useCallback((t: number) => {
    const s = anim.current
    const dt = s.last ? t - s.last : 16
    s.last = t
    const target = s.hovered ? 360 / 1500 : 0
    const tau = s.hovered ? 250 : 700
    const k = 1 - Math.exp(-dt / tau)
    s.speed += (target - s.speed) * k
    s.rot += s.speed * dt
    if (spinnerRef.current) spinnerRef.current.style.transform = `rotate(${s.rot}deg)`
    if (s.hovered || Math.abs(s.speed) > 0.0005) s.raf = requestAnimationFrame(loop)
    else s.raf = 0
  }, [])

  useEffect(() => {
    anim.current.hovered = hovered
    if (hovered && !anim.current.raf) {
      anim.current.last = 0
      anim.current.raf = requestAnimationFrame(loop)
    }
    return () => {}
  }, [hovered, loop])

  useEffect(() => () => { if (anim.current.raf) cancelAnimationFrame(anim.current.raf) }, [])

  return (
    <motion.div
      onHoverStart={() => {
        setHovered(true)
        setArrowToggle((n) => n + 1)
      }}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale: hovered ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'relative',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transform: 'translateY(10%)',
      }}
    >
      {/* halo */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 15, background: 'rgba(151,195,255,0.15)', zIndex: 1 }} />

      {/* gradient square */}
      <div
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 12,
          background: 'linear-gradient(180deg, #70A8F2 0%, #3D82DE 100%)',
          padding: 8,
          overflow: 'hidden',
          zIndex: 2,
          boxShadow:
            'inset 0 1px 18px 2px rgba(173,208,255,0.20), inset 0 1px 4px 2px rgba(222,236,255,0.80), 0 42px 107px 0 rgba(61,130,222,0.34), 0 10px 10px 0 rgba(61,130,222,0.20), 0 3.714px 4.846px 0 rgba(61,130,222,0.15)',
        }}
      >
        {/* spinning conic ring */}
        <div
          ref={spinnerRef}
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 13,
            padding: 1,
            background:
              'conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, #FFFFFF 60deg, #9EC7FF 120deg, rgba(255,255,255,0) 200deg, rgba(255,255,255,0) 360deg)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
          }}
        />
        {/* static fallback border */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, border: '1px solid #9EC7FF', zIndex: 4 }} />
        {/* dots overlay */}
        <img
          src={`${A}/dots.svg`}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, zIndex: 2 }}
        />
        {/* shine sweep (once per hover) */}
        {arrowToggle > 0 && (
          <motion.div
            key={`blink-${arrowToggle}`}
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
            }}
          />
        )}
        {/* arrow swap */}
        <div style={{ position: 'relative', width: 16, height: 16, overflow: 'hidden', zIndex: 5 }}>
          {arrowToggle > 0 && (
            <motion.img
              key={`out-${arrowToggle}`}
              src={`${A}/arrow-up.svg`}
              alt=""
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
              style={{ position: 'absolute', inset: 0, width: 16, height: 16 }}
            />
          )}
          <motion.img
            key={`in-${arrowToggle}`}
            src={`${A}/arrow-up.svg`}
            alt=""
            initial={arrowToggle > 0 ? { y: 16, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
            style={{ position: 'absolute', inset: 0, width: 16, height: 16 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Toolbar bits                                                        */
/* ------------------------------------------------------------------ */

function IconButton({ icon }: { icon: string }) {
  return (
    <button
      type="button"
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: '1px solid rgba(0,0,0,0.10)',
        background: 'rgba(255,255,255,0.80)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <img src={`${A}/${icon}`} alt="" style={{ width: 14, height: 14 }} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar button                                                      */
/* ------------------------------------------------------------------ */

function SidebarButton({ icon, filled }: { icon: string; filled: boolean }) {
  const [hover, setHover] = useState(false)
  const bg = filled
    ? hover
      ? 'rgba(255,255,255,1)'
      : 'rgba(255,255,255,0.90)'
    : hover
      ? 'rgba(255,255,255,0.5)'
      : 'transparent'
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        border: filled ? '1px solid rgba(34,106,205,0.05)' : 'none',
        background: bg,
        backdropFilter: filled ? 'blur(8px)' : undefined,
        WebkitBackdropFilter: filled ? 'blur(8px)' : undefined,
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <img src={`${A}/${icon}`} alt="" style={{ width: 18, height: 18 }} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Index() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#EEF1F7',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PixelGrid side="left" />
      <PixelGrid side="right" />

      {/* Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50 }}>
        <OndelMark />
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <SidebarButton icon="chat.svg" filled />
        <SidebarButton icon="search.svg" filled={false} />
      </div>

      {/* Main column */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 60,
          maxWidth: 760,
          width: '100%',
        }}
      >
        <FolderStack />

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          style={{
            fontSize: 32,
            fontWeight: 400,
            lineHeight: '32px',
            letterSpacing: '-0.64px',
            color: '#11315D',
            width: 385,
            margin: '32px auto 8px',
            textAlign: 'center',
          }}
        >
          Let&apos;s find the right
          <br />
          moves for your release
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          style={{ fontSize: 14, fontWeight: 400, color: 'rgba(13,27,75,0.50)', textAlign: 'center', marginBottom: 20 }}
        >
          What do you want to plan today?
        </motion.p>

        {/* Prompt box */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
          style={{
            width: 702,
            maxWidth: '100%',
            padding: 4,
            borderRadius: 24,
            border: '0.5px solid rgba(0,0,0,0.05)',
            background: 'rgba(157,196,250,0.15)',
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 116,
              background: '#fff',
              borderRadius: 20,
              border: '1px solid rgba(34,106,205,0.05)',
              padding: '14px 14px 12px 16px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typewriter />

            {/* toolbar */}
            <div style={{ marginTop: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, transform: 'translateY(35%)' }}>
                {/* Ondie expert pill */}
                <div
                  style={{
                    width: 110,
                    height: 28,
                    background: '#E8F1FF',
                    borderRadius: 8,
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: 'linear-gradient(166deg, #A0E4FF 9.8%, #9CA4FB 184.41%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img src={`${A}/ai-select.svg`} alt="" style={{ width: 8, height: 8 }} />
                  </span>
                  <span style={{ fontSize: 12, lineHeight: '16px', color: '#5085CE', whiteSpace: 'nowrap' }}>Ondie</span>
                  <ChevronDown size={12} color="#5085CE" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </div>

                <IconButton icon="image.svg" />
                <IconButton icon="Capa_1.svg" />

                <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.12)', margin: '0 2px' }} />

                <button
                  type="button"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: '1px solid rgba(0,0,0,0.10)',
                    background: 'transparent',
                    fontSize: 16,
                    lineHeight: 1,
                    color: 'rgba(0,0,0,0.40)',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>

                <div
                  style={{
                    height: 28,
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: 6,
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 12, color: 'rgba(13,27,75,0.65)' }}>Single</span>
                  <X size={12} color="rgba(0,0,0,0.35)" style={{ marginLeft: 2 }} />
                </div>
              </div>

              <SendButton />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 0,
          width: '100%',
          zIndex: 5,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 400,
          color: 'rgba(13,27,75,0.45)',
        }}
      >
        By sending a message to Ondie, you agree to our{' '}
        <a href="#" style={{ color: 'rgba(13,27,75,0.65)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
          Terms
        </a>{' '}
        and have read our{' '}
        <a href="#" style={{ color: 'rgba(13,27,75,0.65)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
          Privacy Policy.
        </a>
      </div>
    </div>
  )
}
