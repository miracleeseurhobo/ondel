# Icons

## Rule

**Hugeicons**, accessed through a single wrapper: `src/components/ui/icon.tsx`.
Pages never import an icon directly — they reference a semantic name.

```tsx
import { Icon } from '@/components/ui/icon' // (relative import in this app)

<Icon name="home" />                       {/* 18px, 1.2px stroke, currentColor */}
<Icon name="bell" size={20} className="text-neutral-500" />
```

## Style: solid vs stroke

The spec calls for Hugeicons **solid**. Solid variants are part of Hugeicons
**Pro** (`@hugeicons-pro/*`), which needs a paid license + npm token. Until that
token exists, the app uses the closest freely-available Hugeicons set:
`@hugeicons/core-free-icons` (stroke, rounded, 1.2px).

**Moving to solid is a one-line change** — in `icon.tsx`, swap:

```ts
} from '@hugeicons/core-free-icons'
// →
} from '@hugeicons-pro/core-solid-rounded'
```

The export names match across sets, so no page edits are needed.

## Vocabulary

Defined once in `icon.tsx`. Add a role here rather than importing ad hoc.

| `name` | Hugeicons | Was (lucide) |
| --- | --- | --- |
| `home` | `Home01Icon` | Home |
| `releases` | `DiscIcon` | Disc3 |
| `timeline` | `Calendar03Icon` | CalendarDays |
| `signals` | `Activity03Icon` | Activity |
| `campaigns` | `Megaphone01Icon` | Megaphone |
| `bell` | `Notification01Icon` | Bell |
| `logout` | `Logout01Icon` | LogOut |
| `chevronDown` | `ArrowDown01Icon` | ChevronDown |
| `arrowLeft` | `ArrowLeft01Icon` | ArrowLeft |
| `radio` | `Radio02Icon` | Radio |
| `check` | `CheckmarkCircle02Icon` | CheckCircle2 |
| `plus` | `PlusSignIcon` | Plus |
| `close` | `Cancel01Icon` | X |
| `hammer` | `HammerIcon` | Hammer |
| `music` | `MusicNote01Icon` | ListMusic |

## Defaults

Size `18`, `strokeWidth` `1.2`, color inherited (`currentColor`). Override per
instance via props; set color with the parent's Tailwind `text-*` class.
