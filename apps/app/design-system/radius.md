# Radius

## Rule

**8–12px. No more, no less** — for every rectangular surface (cards, inputs,
buttons, sheets, tiles, menus).

`--radius` is set to `12px` in `index.css`, so shadcn's radius scale resolves
neatly into range, and explicit `ds-*` aliases document intent:

| Token | Tailwind class | Value |
| --- | --- | --- |
| Small | `rounded-ds-sm` · `rounded-sm` | `8px` |
| Medium | `rounded-ds-md` · `rounded-md` | `10px` |
| Large | `rounded-ds-lg` · `rounded-lg` · `rounded-xl` | `12px` |

## Exempt — naturally circular

`rounded-full` is allowed **only** for elements that are round by nature:

- Avatars and avatar tiles' status badges
- Status dots and step indicators
- Circular icon-buttons (equal width/height)
- The Siri-style orb

## Not allowed

- `rounded-2xl` (16px) → use `rounded-xl` (12px)
- `rounded-md` was 6px by Tailwind default but is remapped to 10px here — safe
- Arbitrary values like `rounded-[9px]` → use a token (`rounded-ds-md`)
- `rounded-full` on **wide pills** (e.g. a text button). Clamp to `rounded-xl`
  (12px). Full radius is for circles, not stadiums.
