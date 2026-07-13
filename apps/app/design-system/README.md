# Ondel Design System

Basic, enforceable rules for the Ondel web app (`apps/app`). Scope is the app
only — the marketing landing (`apps/landing`) keeps its cinematic identity.

Four rules, each with a spec:

| Rule | Spec | One-liner |
| --- | --- | --- |
| Typography | [typography.md](./typography.md) | Two weights: 400 body, 500 headings & emphasis |
| Color | [color.md](./color.md) | TailwindCSS `neutral` + one brand accent (`#3D82DE`) |
| Radius | [radius.md](./radius.md) | 8–12px only |
| Icons | [icons.md](./icons.md) | Hugeicons via one `<Icon>` wrapper |

## Where the rules live in code

- **Tokens** — `src/index.css` (`--ds-*` CSS vars) and `tailwind.config.js`
  (brand color, radius scale, and a `fontWeight` override that removes
  `font-semibold`/`font-bold`).
- **Icons** — `src/components/ui/icon.tsx` is the only place icons are chosen.

## Rollback

The commit before this system was applied is tagged `pre-design-system`.

```bash
# inspect what changed
git diff pre-design-system --stat

# hard revert everything to the pre-system state
git reset --hard pre-design-system

# or revert just the design-system commits, keeping later work
git revert <commit>..<commit>
```

Because the whole system is token- and wrapper-driven, most of it can also be
tuned in place: change `--ds-brand` / `--radius` in `index.css`, or the icon
import source in `icon.tsx`, without touching pages.
