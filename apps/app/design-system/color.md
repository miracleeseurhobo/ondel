# Color

## Rule

Foundation is the **TailwindCSS `neutral` palette**
(<https://tailwindcss.com/docs/colors>). One **brand accent** on top. Nothing
else — except the documented exceptions below.

## Semantic tokens

Defined as CSS vars in `index.css` and mirrored by Tailwind's built-in
`neutral-*` classes.

| Role | Token | Tailwind | Value |
| --- | --- | --- | --- |
| App background | `--ds-bg` | `bg-neutral-100` | `#f5f5f5` |
| Surface / card / input | `--ds-surface` | `bg-white` | `#ffffff` |
| Border / hairline | `--ds-border` | `border-neutral-200` | `#e5e5e5` |
| Text — primary | `--ds-text` | `text-neutral-900` | `#171717` |
| Text — secondary | `--ds-text-secondary` | `text-neutral-500` | `#737373` |
| Text — muted | `--ds-text-muted` | `text-neutral-400` | `#a3a3a3` |
| **Accent** | `--ds-brand` | `bg-brand` / `text-brand` | `#000000` |
| Accent foreground | `--ds-brand-fg` | `text-brand-fg` | `#ffffff` |

The accent is **parked on greyscale (black) for now** — `#3D82DE` is retired
until we revisit brand colour. Because the accent is a token (`--ds-brand` /
Tailwind `brand`), changing it back is a one-line edit in `index.css` +
`tailwind.config.js`.

### Where the accent is allowed

Primary CTA, active nav item, focus rings, links, and the single most important
highlight on a screen. Use it sparingly — if everything is accented, nothing is.

## Functional colors (forms only)

Semantic state still needs hue; keep it minimal and always pair with an
icon/text, never color alone.

| State | Token | Tailwind |
| --- | --- | --- |
| Danger / error | `--ds-danger` | `text-red-600` |
| Success | `--ds-success` | `text-green-600` |
| Scheduled | `--ds-scheduled` | `text-scheduled` / `bg-scheduled` |

**Scheduled** (`#ffb362`, warm amber) is the one chromatic status colour — used
only to mark scheduled/upcoming content on the release calendar (never
decoratively). Borrowed from the Serena scheduler system.

## Exceptions

- **Third-party service logos** (Google, Apple, Spotify) render in their real
  brand colors — legal + recognizability.
- **The sign-in animated preview deck** keeps its colourful badges (blue /
  fuchsia / emerald) as a deliberate lively counterpoint to the neutral
  onboarding.

## Retired colors

The previous blue identity (`#0D1B4B`, `#11315D`, `#3D82DE` used broadly) and ad
hoc grays (`#646465`, `#f6f6f8`, `#F3F4F6`) are replaced by the neutral tokens
above. `#3D82DE` survives only as the single accent.
