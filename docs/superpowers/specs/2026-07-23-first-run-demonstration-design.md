# Ondel first run — "watch Ondie work" (Explee-style demonstration)

**Date:** 2026-07-23
**Status:** Design approved (spine); pending spec review → implementation plan
**Surface:** In-product first run (`apps/app`, post sign-in) — the Ask Ondie home + its generate sequence

## 1. Goal

Reposition Ondel's first run around **demonstration, not claims**. Today a new artist
lands on an empty Ask Ondie prompt and must describe what they want before seeing any
value. The current generate step is a small stepped checklist overlay
([Index.tsx](../../../apps/app/src/pages/Index.tsx), `genSteps` + `TextShimmer`,
`STEP_MS`/`FINISH_MS`) that then navigates to `/releases`.

We borrow **Explee/AutoGTM's** first-experience mechanic: the agent narrates its own work
in plain verbs and **real artifacts accumulate on screen as it runs**, so the outcome is
proven before the user does anything else. See the captured reference in section 8.

The artist's own song is the trigger (they chose "their input is the demo"): **upload a
song → an Explee-style staged reveal that surfaces a regional campaign, playlist
opportunities, and proposed content → land in the populated workspace.**

## 2. Scope

**In scope**
- Replace the current generating checklist overlay with a **full-bleed staged reveal** in
  [Index.tsx](../../../apps/app/src/pages/Index.tsx).
- Five stages, each leaving a persistent **artifact card** (analysis chips, regional
  campaign, playlist opportunities, proposed content, ready badge).
- Keep the existing entry (prompt box + Song upload `ToolChip`); make **song upload the
  hero path**. Prompt-only still works (falls back to a generic, artifact-light run).
- Mock/deterministic data only — song-aware via filename where possible.
- Reduced-motion, skip control, and the existing `setPlanGenerated` → navigate handoff.

**Out of scope**
- Real audio analysis, real DSP/playlist data, real geo analytics, backend, auth.
- Landing-site (`apps/landing`) changes — this is the in-product run only.
- Changing the destination pages (`/releases`, `/timeline`) beyond arriving with a plan.

## 3. Flow

```
Ask Ondie home (no plan)
  │  drop a track / paste link  (hero)   — or type a prompt (fallback)
  ▼
Full-bleed staged reveal  ── artifacts stack & persist, present-tense narration
  1 Listening to your track…      → analysis chips
  2 Mapping where it'll land…     → Regional campaign card
  3 Finding your playlist openings… → Playlist opportunity cards
  4 Proposing your content…       → Proposed content preview
  5 Plan ready                    → outcome badge + CTAs
  ▼
setPlanGenerated(song|prompt) → navigate to /releases (existing Review flow)
```

Skip control ("Skip to plan") is available throughout and jumps straight to the handoff.

## 4. The staged reveal (heart of the feature)

Each stage: a plain-verb heading with present-tense shimmer while active, then its artifact
card animates in (fade + small translateY, staggered children) and **stays** as the next
stage begins. Prior stages collapse to a compact "done" row (verb + green check) so the
column reads as an accumulating transcript of work.

| # | Stage heading (active) | Artifact (persists) | Mock content |
|---|---|---|---|
| 1 | Listening to your track… | **Analysis chips** | genre · mood · BPM · energy + 2 sound-alike references |
| 2 | Mapping where it'll land… | **Regional campaign** | ranked regions/cities (3–5) with a fit signal + one-line why; light map or ranked list |
| 3 | Finding your playlist openings… | **Playlist opportunities** | 3 cards: editorial / curator / algorithmic, each fit % + follower count |
| 4 | Proposing your content… | **Proposed content** | preview of the 30-day plan — a few post cards per platform with hooks |
| 5 | Plan ready | **Outcome badge** | "30 posts · 5 platforms · out {date}" + **Open your calendar** and soft **Connect profiles to track results** |

Microcopy is present-tense while working ("Listening to your track…"), past/absent once
done. Song-aware headings reuse the filename (`clip(songName)`), matching today's copy.

## 5. Component architecture

- **`FirstRunReveal`** (new, `apps/app/src/components/`) — owns the staged sequence: takes
  `{ songName, prompt, onComplete }`, drives stage index on a timer, renders the stack of
  artifact cards, exposes Skip. Replaces the inline `generating` overlay JSX in Index.
- **Artifact subcomponents** (small, local to the reveal or `components/`):
  `AnalysisChips`, `RegionalCampaign`, `PlaylistOpportunities`, `ProposedContent`,
  `PlanReadyBadge`. Prefer reusing existing visual language:
  - Playlist/opportunity cards already exist in
    [ReleaseOverview.tsx](../../../apps/app/src/pages/ReleaseOverview.tsx) — extract/share.
  - Post/platform chips mirror [Timeline.tsx](../../../apps/app/src/pages/Timeline.tsx)
    (`PLATFORM` colors, post chip styling).
  - Use the shared `Icon`, `OndieMark`, `TextShimmer`, and DS tokens.
- **`lib/firstRunMock.ts`** (new) — deterministic mock artifacts, optionally seeded by
  `songName`, so the reveal is stable and screenshot-verifiable.

## 6. State, timing, motion

- Reuse `generating` / `step` state pattern in Index; generalize `genSteps` → `STAGES`.
- Per-stage dwell ~1.4–1.8s (artifacts need a beat to read); total lands in a ~7–9s
  "it's really working" window, a touch longer than today's `STEP_MS=1250` because each
  stage now shows a real artifact. Final `FINISH_MS` beat before navigate.
- Enter animations: split + stagger (~80–100ms) per artifact child; exit/collapse subtle
  (small translateY). Interruptible; transitions specify exact properties (no `all`).
- **Reduced motion** (`useReducedMotion`, already imported in SignIn): render all stages
  resolved with no timed reveal — show the assembled artifacts and the ready badge at once.

## 7. Edge cases & handoff

- **Prompt only, no song:** run a reduced set (skip stage 1 analysis chips or show a
  generic "Reading your brief"); still reveal regional/playlist/content from the prompt.
- **Unsupported / huge file:** accept optimistically (mock) but validate type; if invalid,
  keep the artist on the entry with an inline message, don't enter the reveal.
- **Skip:** immediately call `onComplete` → `setPlanGenerated(...)` → navigate.
- **Handoff unchanged:** on complete, `setPlanGenerated(songName || prompt || default)` then
  `navigate('/releases')` (current behaviour; calendar is one click away). `hasPlan()`
  gating on `/releases` and `/timeline` continues to work.

## 8. Reference — Explee/AutoGTM first experience (what we're modelling)

1. Promise + speed hook ("…while you sleep", "60 seconds, on autopilot").
2. One low-friction input (paste URL) + escape hatch.
3. Auto-runs on a concrete example; you watch.
4. Visible pipeline, plain-verb labels, in order.
5. **Real artifacts at every stage** (favicons, ICP table, prospect cards, written email,
   booked-meeting badge, cost-per-lead table) — proof accumulates.
6. Present-tense progress copy ("…studying competitors…").
7. Resolved outcome badge ("Demo booked · Tue 14:00").
8. Learning loop ("doubles down").
9. Friction-free conversion.

Ondel keeps 4, 5, 6, 7 as the core; the artist's uploaded song replaces the canned example
(their input is the demo); the learning loop (8) becomes the soft "Connect profiles to
track results" CTA.

## 9. Verification

- `npm run build:app` (tsc strict + vite) clean.
- Headless-Chrome screenshots (existing harness): entry state, each stage mid-reveal, the
  assembled stack, the ready badge, and the reduced-motion assembled view.
- Confirm handoff: after complete/skip, `/releases` shows the plan (`hasPlan()` true).

## 10. Open questions / future

- Exact regional-campaign visual: mini map vs ranked list (start with ranked list; map is
  a later polish).
- Whether to also add audience/fanbase personas or creator/collab opportunities as stages
  (deferred; spine approved at 5 stages).
- Later: bring the same reveal (canned "Midnight Drive" example) to the landing hero for a
  single demo-led story across marketing → product.
