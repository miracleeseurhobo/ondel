# Scroll-Zoom-Into-Headset → Section 2

**Date:** 2026-07-04
**Status:** Approved design
**Component:** Ondel landing page (React 19 + Vite + Tailwind 3.4)

## Goal

Add a scroll-triggered cinematic transition: as the user scrolls past the dark
hero, the background video **zooms into the headset on the main character** and
darkens, then the light-themed **Section 2** (AI chat demo) rises up over it —
reading as diving through the lens into the product interface.

## Non-Goals

- No real AI / backend. Section 2's chat is static/visual only.
- No new animation library (no Framer Motion). No CSS `animation-timeline`
  (unreliable in Safari as of 2026).

## Architecture

Three new pieces plus a refactor of the current single-file hero:

| Unit | Responsibility | Depends on |
|------|----------------|-----------|
| `useScrollProgress(ref)` | Returns a 0→1 value as a "scroll stage" element passes through the viewport. rAF-throttled, passive listener, cleans up on unmount. | React, DOM |
| `<Hero>` | Current dark hero (nav, headline, subhead, email pill, link, video). Extracted from `App.jsx`. Consumes `progress` to drive video zoom, overlay darkening, and content fade-out. | `useScrollProgress`, lucide-react |
| `<Section2>` | New light-themed AI chat demo built from the screenshot. Static. | lucide-react |
| `App.jsx` | Page shell composing the scroll stage + `<Hero>` (sticky) + `<Section2>`. | above |

## Scroll Mechanics (pinned zoom)

- A **scroll stage** wrapper is ~200vh tall. Inside it, the hero is
  `sticky top-0 h-dvh`, so it pins while the stage scrolls past.
- `useScrollProgress` maps the stage's position to `progress` ∈ [0, 1]
  (0 = stage top at viewport top, 1 = stage bottom reached).
- Progress → visual mapping (all `transform`/`opacity`, GPU-friendly):
  - Video: `scale(1 → 1.8)`, `transform-origin` = **headset focal point**.
    Focal point is a tunable CSS var (`--focal-x`, `--focal-y`); we locate the
    character by extracting a video frame with ffmpeg during implementation.
  - Black overlay: `opacity 0 → 0.9`.
  - Hero content (nav, headline, subhead, form, link): `opacity 1 → 0` and a
    slight `translateY`/`scale`, fully faded by ~progress 0.55 with ease-out.
- When the stage ends, the sticky hero unpins and Section 2 (next in normal
  flow) scrolls up over the zoomed, darkened video.

## Section 2 (light theme, from screenshot)

- Background near-white (`#fafafa`); text dark ink (`#3f3f46`).
- Layout: two columns on desktop, stacked single column on mobile.
- **Left column:** serif headline "Your music has more potential than you
  think." (uses `text-display` token, dark) + muted subhead (`text-body`):
  "Ondel AI analyzes your unreleased music, audience signals, and marketplace
  opportunities—so you can make smarter decisions before you release."
- **Right column — chat demo (static):**
  - User bubble (tinted blue): "@Ondie I'm planning to release a new single next
    month. What should I know before I make it live?" with a small "👀 Ondie"
    chip.
  - Assistant reply from "Ondie": "I've analyzed your track and here's what
    stands out: strong playlist potential in Indie Pop, growing audience in
    Germany, and a window of low release competition in 3 weeks."
  - Card: "Release strategy report — In progress ●".
- **Below:** platform icons row (Spotify / Apple Music / analyze glyph) +
  "is analyzing for you", then the input bar: "Ask Ondie anything about your
  music…" with attach + settings icons (left), "Pro ⌄" + mic + send (right).

## Performance & Accessibility

- Only `transform`/`opacity` animate; passive scroll + rAF; no layout reads in
  the hot path → no CLS, 60fps target.
- `prefers-reduced-motion: reduce`: skip pinning and zoom entirely. Hero renders
  at normal viewport height; Section 2 flows in with no scroll-driven motion.
- Section 2 contrast meets WCAG AA (dark ink on near-white).
- Video keeps `autoplay loop muted playsInline`.

## Copy Note

The screenshot uses **"Ondie"** as the AI assistant's chat name; the product is
**"Ondel"**. We keep both as shown: assistant = "Ondie", product = "Ondel".

## Open / Tunable

- `--focal-x` / `--focal-y` and max zoom scale (default 1.8) tuned visually
  after first render.
- Scroll stage height (default 200vh) may be adjusted for pacing.

## Notes

- Project is **not** a git repository, so this spec is written but not committed.
