
# Scroll-Zoom-Into-Headset → Section 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pinned, scroll-driven cinematic transition where the hero background video zooms into the main character's headset and darkens, then a light-themed Section 2 (AI chat demo) rises up over it.

**Architecture:** A tall "scroll stage" wrapper pins the hero (`sticky top-0 h-dvh`) while it scrolls past. A custom `useScrollProgress` hook reports 0→1 progress (rAF-throttled, passive listeners). The hero maps progress to `transform`/`opacity` (video scale + focal-origin, black overlay, content fade). Section 2 follows in normal flow and scrolls over the zoomed video.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 3.4, lucide-react. No new dependencies. No CSS `animation-timeline` (unreliable in Safari). No animation library.

## Global Constraints

- No new npm dependencies; use only `react`, `lucide-react`, Tailwind utilities, and the existing type-token classes in `src/index.css` (`text-display`, `text-body`, `text-body-sm`, `text-body-sm-medium`, `text-label-semibold`, `text-button`).
- Animate `transform`/`opacity` only — no animating width/height/top/left; no layout reads in the scroll hot path (no CLS).
- Respect `prefers-reduced-motion: reduce` — skip pinning and zoom; hero renders at normal viewport height and Section 2 flows in plainly.
- Assistant chat name is **"Ondie"** exactly as in the scrbox eenshot; product name is **"Ondel"**. Do not normalize.
- Video keeps `autoPlay loop muted playsInline`; source is `/Background%20.mp4`.
- Section 2 is static/visual only — no real AI, no network.
- Project is **not** a git repo and has **no test runner**: verification = `npm run build` (compile gate) + `npm run lint` + visual observation on the running dev server (http://localhost:5174/). "Checkpoint" replaces "commit".

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `src/hooks/useScrollProgress.js` (create) | `usePrefersReducedMotion()` + `useScrollProgress(ref)` → `{ progress, reduced }`. |
| `src/components/Hero.jsx` (create) | Dark hero (nav, headline, form). Consumes `progress`, drives video zoom / overlay / content fade. |
| `src/components/Section2.jsx` (create) | Light AI chat demo section (headline, chat bubbles, report card, input bar). |
| `src/App.jsx` (modify — full rewrite) | Page shell: scroll stage + sticky Hero + Section2. |

---

### Task 1: `useScrollProgress` hook

**Files:**
- Create: `src/hooks/useScrollProgress.js`

**Interfaces:**
- Produces:
  - `usePrefersReducedMotion(): boolean`
  - `useScrollProgress(ref: React.RefObject<HTMLElement>): { progress: number, reduced: boolean }` — `progress` is `0` when the stage top is at/below the viewport top, ramps to `1` when the stage has scrolled up by `stageHeight - viewportHeight`. Returns `{ progress: 0, reduced: true }` under reduced motion.

- [ ] **Step 1: Create the hook file**

```js
// src/hooks/useScrollProgress.js
import { useState, useEffect, useRef } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

// Progress 0..1 as `ref` element scrolls up through the viewport.
// 0 = element top at viewport top; 1 = element bottom reaches viewport bottom.
export function useScrollProgress(ref) {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (reduced) {
      setProgress(0)
      return
    }
    const el = ref.current
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1)
      setProgress(p)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, reduced])

  return { progress, reduced }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (no unresolved imports / syntax errors). The hook is unused at this point, which is fine.

- [ ] **Step 3: Checkpoint** — hook file exists and builds. Proceed.

---

### Task 2: `Hero` component (extract + progress-driven transforms)

**Files:**
- Create: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: nothing from Task 1 directly (App passes `progress` in Task 4).
- Produces: `export default function Hero({ progress = 0 })` — a full-height (`h-full`) hero meant to fill a `h-dvh` sticky container.

- [ ] **Step 1: Create the Hero component**

```jsx
// src/components/Hero.jsx
import { useState } from 'react'
import { Menu, X, ArrowRight, MoreHorizontal } from 'lucide-react'

const OndelLogo = ({ className }) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    aria-label="Ondel logo"
  >
    <path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z" />
  </svg>
)

const navLinks = ['Product', 'Pricing', 'FAQs', 'Blog', 'X(Twitter)']

// Zoom focal point — aimed at the headset on the main character.
// Tune FOCAL_X / FOCAL_Y in Step 3 after inspecting a video frame.
const FOCAL_X = 50 // %
const FOCAL_Y = 42 // %
const MAX_ZOOM = 0.8 // scale delta: 1.0 -> 1.8

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

export default function Hero({ progress = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert(`You're on the next wave. We'll let you know when Ondel is ready to hear your music.`)
      setEmail('')
    }
  }

  const videoScale = 1 + progress * MAX_ZOOM
  const overlayOpacity = Math.min(progress * 0.9, 0.9)
  const contentP = easeOut(Math.min(progress / 0.55, 1))
  const contentOpacity = 1 - contentP
  const contentShift = contentP * -40

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ transform: `scale(${videoScale})`, transformOrigin: `${FOCAL_X}% ${FOCAL_Y}%` }}
        className="absolute inset-0 w-full h-full object-cover [object-position:80%_center] md:[object-position:center_center] will-change-transform"
      >
        <source src="/Background%20.mp4" type="video/mp4" />
      </video>

      {/* Base cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
      {/* Scroll-driven darkening as we zoom into the lens */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

      {/* Content Layer */}
      <div
        className="relative z-10 flex h-full flex-col"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentShift}px)`,
          pointerEvents: contentOpacity < 0.1 ? 'none' : 'auto',
        }}
      >
        {/* Navigation */}
        <nav className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 sm:py-6">
          <a href="#" className="flex items-center gap-2 text-white">
            <OndelLogo className="w-5 h-5 flex-shrink-0" />
            <span className="font-inter font-semibold text-lg tracking-tight">Ondel</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-body text-white/70 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
            <button className="text-button text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md rounded-full px-5 py-2 transition-colors">
              Sign in
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden mx-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-5">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="text-body text-white/85 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
              <button className="mt-1 w-full text-button text-white bg-white/10 border border-white/15 rounded-full px-5 py-2.5">
                Sign in
              </button>
            </div>
          </div>
        )}

        {/* Hero content — bottom anchored */}
        <main className="flex-1 flex flex-col items-center justify-end text-center px-5 pb-14 sm:pb-20 lg:pb-24">
          <h1 className="text-display text-white max-w-[900px]">
            Know your release before the world does.
          </h1>
          <p className="mt-5 text-body text-white/60 max-w-[560px]">
            Ondel helps independent artists discover playlists, audience signals, and hidden opportunities with an AI release manager built for music before and after release.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex items-center gap-2 w-full max-w-[460px] rounded-full bg-white/10 backdrop-blur-md border border-white/15 p-1.5 pl-5 transition-colors focus-within:border-white/40"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-transparent text-white placeholder-white/40 text-body outline-none"
            />
            <MoreHorizontal className="hidden sm:block w-5 h-5 text-white/40 flex-shrink-0" />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-white text-ink text-button rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Join the beta
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <a
            href="#"
            className="mt-5 text-button text-white/90 hover:text-white transition-colors"
          >
            Discover the hidden signals
          </a>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds. (Hero not yet mounted; App still renders the old hero until Task 4.)

- [ ] **Step 3: Tune the focal point to the headset**

Extract a representative frame to locate the character's headset:

Run: `command -v ffmpeg && ffmpeg -y -ss 3 -i "public/Background .mp4" -frames:v 1 "/private/tmp/claude-501/-Users-macbook-Desktop-Ondel/d1cd9c2c-dbc0-4bbe-9bef-e7ac8f56f532/scratchpad/frame.png" || echo "ffmpeg not available"`

- If a frame is produced: open it, estimate the headset center as a percentage of frame width/height, and set `FOCAL_X` / `FOCAL_Y` accordingly.
- If ffmpeg is unavailable: leave defaults (50% / 42%) and refine visually in Task 4.

- [ ] **Step 4: Checkpoint** — Hero builds and focal constants are set. Proceed.

---

### Task 3: `Section2` component (light AI chat demo)

**Files:**
- Create: `src/components/Section2.jsx`

**Interfaces:**
- Produces: `export default function Section2()` — a self-contained light-themed section.

- [ ] **Step 1: Create the Section2 component**

```jsx
// src/components/Section2.jsx
import {
  Paperclip,
  SlidersHorizontal,
  Mic,
  ArrowUp,
  ChevronDown,
  BarChart3,
  Music,
  Eye,
} from 'lucide-react'

export default function Section2() {
  return (
    <section className="relative bg-[#fafafa] text-neutral-800 px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left: headline + subhead */}
          <div className="lg:pt-8">
            <h2 className="text-display text-neutral-900 max-w-[420px] leading-[1.1]">
              Your music has more potential than you think.
            </h2>
            <p className="mt-6 text-body text-neutral-500 max-w-[380px]">
              Ondel AI analyzes your unreleased music, audience signals, and marketplace opportunities—so you can make smarter decisions before you release.
            </p>
          </div>

          {/* Right: chat demo */}
          <div className="flex flex-col gap-4">
            {/* User bubble */}
            <div className="self-end max-w-[92%]">
              <div className="rounded-3xl rounded-tr-lg bg-[#eaf1fe] px-5 py-4">
                <p className="text-body text-neutral-800">
                  <span className="font-medium text-blue-600">@Ondie</span> I&rsquo;m planning to release a new single next month. What should I know before I make it live?
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-body-sm-medium text-blue-600">Ondie</span>
                </div>
              </div>
            </div>

            {/* Assistant */}
            <div className="max-w-[92%]">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                </span>
                <span className="text-body-sm-medium text-neutral-800">Ondie</span>
              </div>
              <div className="rounded-3xl rounded-tl-lg bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
                <p className="text-body text-neutral-700">
                  I&rsquo;ve analyzed your track and here&rsquo;s what stands out: strong playlist potential in Indie Pop, growing audience in Germany, and a window of low release competition in 3 weeks.
                </p>
              </div>

              {/* Report card */}
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-label-semibold text-neutral-500">OI</span>
                  <span className="text-body-sm-medium text-neutral-800">Release strategy report</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-body-sm text-neutral-400">In progress</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyzing row + input bar */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex -space-x-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1db954] ring-2 ring-[#fafafa]">
                <Music className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fa2d48] ring-2 ring-[#fafafa]">
                <Music className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-[#fafafa]">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              </span>
            </div>
            <span className="text-body-sm text-neutral-500">is analyzing for you</span>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-[28px] bg-white p-3 shadow-sm ring-1 ring-black/5"
          >
            <input
              type="text"
              placeholder="Ask Ondie anything about your music..."
              className="w-full bg-transparent px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Attach file" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" aria-label="Settings" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="flex items-center gap-1 rounded-full px-3 py-1.5 text-body-sm-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                  Pro <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" aria-label="Voice input" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button type="submit" aria-label="Send message" className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify it compiles (catches any missing lucide icon export)**

Run: `npm run build`
Expected: build succeeds. If it fails on an icon import (e.g. an icon name not exported by this lucide-react version), substitute the nearest available icon (e.g. `BarChart2` for `BarChart3`, `Sliders` for `SlidersHorizontal`) and rebuild.

- [ ] **Step 3: Checkpoint** — Section2 builds. Proceed.

---

### Task 4: App shell composition + full-flow verification

**Files:**
- Modify: `src/App.jsx` (full rewrite)

**Interfaces:**
- Consumes: `useScrollProgress` (Task 1), `Hero` (Task 2), `Section2` (Task 3).

- [ ] **Step 1: Rewrite App.jsx as the page shell**

```jsx
// src/App.jsx
import { useRef } from 'react'
import Hero from './components/Hero'
import Section2 from './components/Section2'
import { useScrollProgress } from './hooks/useScrollProgress'

export default function App() {
  const stageRef = useRef(null)
  const { progress, reduced } = useScrollProgress(stageRef)

  return (
    <>
      {/* Scroll stage: tall so the sticky hero pins and the video zooms while scrolling. */}
      <section ref={stageRef} className={reduced ? 'relative h-dvh' : 'relative h-[220vh]'}>
        <div className={reduced ? 'h-dvh overflow-hidden' : 'sticky top-0 h-dvh overflow-hidden'}>
          <Hero progress={reduced ? 0 : progress} />
        </div>
      </section>

      <Section2 />
    </>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors. Fix any reported issues (e.g. unused imports).

- [ ] **Step 4: Verify the behavior live (drive the real app)**

The dev server is already running at http://localhost:5174/ (HMR). In the browser:
1. On load, the dark hero fills the viewport, content bottom-anchored.
2. Scrolling down: the video scales up toward the headset focal point and darkens; hero content (nav, headline, form) fades out by roughly the midpoint of the scroll stage.
3. Continuing to scroll: the light Section 2 rises up over the zoomed video — headline left, chat demo right, platform icons + input bar below.
4. Enable OS "Reduce Motion", reload: no pinning/zoom; hero is a single normal-height screen and Section 2 follows directly beneath.

If the zoom doesn't center on the headset, adjust `FOCAL_X` / `FOCAL_Y` in `src/components/Hero.jsx`. If the transition feels too fast/slow, adjust the stage height (`h-[220vh]`) in `App.jsx` and/or the `0.55` fade cutoff in `Hero.jsx`.

- [ ] **Step 5: Checkpoint** — full flow verified in-browser (both normal and reduced-motion). Feature complete.

---

## Self-Review

**Spec coverage:**
- Pinned zoom + focal-point video scale → Task 2 (transforms) + Task 4 (sticky stage). ✓
- `useScrollProgress` rAF/passive hook → Task 1. ✓
- Hero extraction → Task 2. ✓
- Section 2 full chat demo (headline, subhead, user bubble, Ondie reply, report card, platform icons, input bar) → Task 3. ✓
- Performance (transform/opacity, no CLS) → constraints + Task 2 code (`will-change-transform`, style-driven). ✓
- Reduced motion fallback → Task 1 (hook), Task 4 (conditional stage). ✓
- Section 2 WCAG AA contrast → Task 3 (neutral-900/700 on #fafafa). ✓
- "Ondie" vs "Ondel" copy → Global Constraints + Task 3 text. ✓

**Placeholder scan:** No TBD/TODO; all code blocks complete; focal tuning has explicit default + procedure. ✓

**Type consistency:** `useScrollProgress` returns `{ progress, reduced }` in Task 1 and is destructured identically in Task 4; `Hero` prop `progress` defined in Task 2 and passed in Task 4. ✓
