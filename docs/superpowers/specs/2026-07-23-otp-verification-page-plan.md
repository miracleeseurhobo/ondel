# OTP verification page — plan

**Date:** 2026-07-23
**Status:** Plan for review → implementation
**Surface:** `apps/app` auth flow — a new email-code (OTP) step reached after the user submits their email on `/signin`.

## 1. Goal

Add an OTP verification screen that appears after login (email submit), styled with the
**sign-in "Lemni Light" design properties** (shadow-driven depth, Instrument Serif display,
light theme, neutral palette, 8–12px radius, Hugeicons) — replacing the plain dark mock in
the reference screenshot — and add a **ripple effect**.

Decisions (confirmed):
- **Ripple:** wrap the OTP card in the **canvasui `Ripple`** component (the requested one;
  it gracefully degrades — children always render, water effect only in browsers with the
  experimental `html-in-canvas` API) **and** add a lightweight, universally-supported
  **click-ripple on the Verify button** so a tactile ripple is always visible.
- **Auth:** **mock verification, Clerk-ready** — any valid-format code verifies →
  `mockSignIn()` → dashboard; `verify()` is abstracted so Clerk's
  `attemptEmailAddressVerification` can drop in later. The "couldn't match email" copy stays
  as flavor.

## 2. Where it lives in the flow

```
/signin  ── submit email ──▶  /verify  ── correct code ──▶  /  (dashboard)
                                  │  Resend code
                                  └─ no email in state ▶ redirect /signin
```

- New route **`/verify`** in [main.tsx](../../../apps/app/src/main.tsx).
- Add `/verify` to the `authRoute` check (line ~28) so it **forces light theme** and stays
  outside the dashboard chrome, exactly like `/signin` and `/sso`.
- Email is carried from `/signin` → `/verify` via router `location.state` (`{ email }`),
  with a fallback: if absent, redirect to `/signin`.
- `/signin` email submit (currently `mockSignIn()` + navigate) changes to
  `navigate('/verify', { state: { email } })`. `mockSignIn()` moves to the OTP verify step.
  (Clerk path later: `signIn.create({ strategy: 'email_code', identifier: email })`.)

## 3. Design — match the sign-in ("Lemni Light")

Reuse the sign-in's visual language rather than reinventing it:
- **Extract shared tokens.** The shadow tokens live as private consts in
  [SignIn.tsx](../../../apps/app/src/pages/SignIn.tsx) (`CTA_SHADOW`, `OAUTH_SHADOW`,
  `INPUT_SHADOW`). Move them (+ the Instrument Serif display treatment) into a small shared
  module `apps/app/src/lib/authStyle.ts` and import in both SignIn and VerifyOtp (DRY).
- **Layout:** centered column on a light surface — OndieMark/logo, Instrument Serif heading
  ("Verify your email"), subtext showing the email ("We sent a code to **name@x.com**"),
  the OTP input, the Verify button, a "Resend code" affordance, and the existing helper
  line ("If you don't see anything after 2 minutes… couldn't match the provided email").
- **OTP input:** single text field (matches the screenshot: "Enter your OTP"), styled with
  `INPUT_SHADOW`, radius within 8–12px. `inputMode="numeric"`, `autoComplete="one-time-code"`,
  `maxLength=6`, `pattern=\d*`, autofocus. (Segmented 6-box input noted as an optional
  enhancement, not in scope.)
- **Verify button:** black primary with `CTA_SHADOW` + accent, matching the sign-in CTA;
  hosts the universal click-ripple (below).
- **Design-system compliance:** two font weights (400/500) + Instrument Serif for the
  display heading (documented exception, same as sign-in), neutral palette, Hugeicons via
  the shared `Icon`, radius 8–12px (the ripple/card follow this).

## 4. Ripple integration

### a. canvasui Ripple (vendored)
- **Do not run `npx shadcn add`** — this repo has no `components.json`; the CLI would try to
  init and reconfigure Tailwind. Instead **vendor the single zero-dependency file** from
  `https://canvasui.dev/r/ripple-react.json` → `apps/app/src/components/canvasui/Ripple.tsx`.
- It already contains `@ts-expect-error` for the experimental attribute; confirm it compiles
  under our strict tsconfig (adjust only if the directive placement fights `noUnusedLocals`).
- Wrap the OTP **card** (not the whole viewport) in `<Ripple trigger="click" …>`; tune
  amplitude/decay subtly so supporting browsers get a gentle splash on interaction. Children
  render normally everywhere (graceful degrade).

### b. Universal Verify-button ripple
- Add a small `RippleButton` (or a `useRipple` hook) in `apps/app/src/components/ui/` —
  Material-style: on pointer-down, spawn an absolutely-positioned span at the pointer
  coords, animate `scale(0)→scale(1)` + `opacity 0.35→0` via a CSS transition
  (`cubic-bezier(0.23,1,0.32,1)`, ~500ms), `overflow-hidden` + `position:relative` on the
  button, then remove the span on transition end. Specific properties only (no
  `transition: all`).
- **Respect `prefers-reduced-motion`**: skip both ripples when reduced.

## 5. State, verification, edge cases

- `VerifyOtp` state: `code`, `error`, `submitting`.
- `verify(code)` (mock): valid format = 6 digits → `mockSignIn()` → `navigate('/')`.
  Wrong length/format → inline error (`aria-live="polite"`), keep focus. Structure as an
  async function returning a result so the Clerk call slots in without UI changes.
- **Loading:** disable the button + show a spinner while `submitting` (matches app pattern).
- **Resend:** "Resend code" with a short cooldown (e.g. 30s countdown, `tabular-nums`);
  mock no-op + toast/inline confirmation. Clerk later: `prepareEmailAddressVerification`.
- **No email in `location.state`:** redirect to `/signin` (guard on mount).
- **Accessibility:** labeled input, `autoComplete="one-time-code"` (iOS/Android SMS
  autofill), error via `role="alert"`/`aria-live`, visible focus, keyboard submit (Enter),
  reduced-motion honored.

## 6. Files

- **New** `apps/app/src/pages/VerifyOtp.tsx` — the screen.
- **New** `apps/app/src/components/canvasui/Ripple.tsx` — vendored canvasui component.
- **New** `apps/app/src/components/ui/RippleButton.tsx` (or `useRipple.ts`) — universal button ripple.
- **New** `apps/app/src/lib/authStyle.ts` — shared Lemni-Light tokens (extracted from SignIn).
- **Edit** `apps/app/src/main.tsx` — add `/verify` route + include it in the `authRoute`
  (light-theme) check.
- **Edit** `apps/app/src/pages/SignIn.tsx` — email submit navigates to `/verify` with email;
  import tokens from `authStyle.ts`.

## 7. Verification

- `npm run build:app` (strict TS) clean; confirm the vendored Ripple compiles.
- Headless-Chrome screenshots: the `/verify` screen (light, matching sign-in), the Verify
  button mid-ripple (universal effect), error state, and the graceful-degrade case (no
  water effect but fully interactive).
- Flow check: `/signin` email → `/verify` → correct code → lands on `/` (dashboard),
  `ondel_signed_in` set; missing-email guard redirects to `/signin`.

## 8. Out of scope / later

- Real Clerk email-code wiring (the `verify()`/resend abstraction is the seam).
- Segmented 6-box OTP input (optional visual upgrade).
- Landing-app (`apps/landing`) parity.
- Rate-limiting / lockout UX beyond the resend cooldown.

## 9. Risk

- The canvasui water effect is invisible for most users today (experimental API) — mitigated
  by the always-on universal button ripple, so the page never looks "missing" its effect.
- Vendoring bypasses the shadcn CLI (intended); we own updates to `Ripple.tsx` manually.
