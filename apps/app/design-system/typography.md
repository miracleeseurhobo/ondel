# Typography

## Rule

**Only two font weights.**

| Weight | Value | Use |
| --- | --- | --- |
| Regular | `400` | Body text, labels, secondary text — everything by default |
| Medium | `500` | Headings and emphasis |

No `font-semibold` (600), `font-bold` (700), or `font-light` (300). These
utilities are removed from Tailwind (`theme.fontWeight` in `tailwind.config.js`),
so `font-bold` will simply not exist.

## Families

- **Inter Tight** — the UI typeface. Loaded at weights `400;500` in `index.html`.
  `body` defaults to `400` (`index.css`).
- **Instrument Serif** — display only, for the manifesto / welcome moments.
  It is a single (regular) weight, so it does not break the two-weight rule;
  treat it as a voice, not a UI font.

## In code

```tsx
<h1 className="font-medium">Create your studio</h1>   {/* heading → 500 */}
<p>Where every release lives.</p>                     {/* body → 400 (default) */}
<span className="font-medium">Emphasis</span>          {/* emphasis → 500 */}
```

Do not reach for weight to build hierarchy beyond these two steps — use size,
color (`neutral-900` vs `neutral-500`), and spacing instead.
