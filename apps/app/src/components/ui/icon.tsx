import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react'
import {
  Home01Icon,
  DiscIcon,
  Calendar03Icon,
  Activity03Icon,
  Megaphone01Icon,
  Notification01Icon,
  Logout01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Radio02Icon,
  CheckmarkCircle02Icon,
  PlusSignIcon,
  Cancel01Icon,
  HammerIcon,
  MusicNote01Icon,
  PackageAddIcon,
  CalendarSearchIcon,
  NotificationOff01Icon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  ThreadsIcon,
  NewTwitterIcon,
  SpotifyIcon,
  Sun03Icon,
  Moon02Icon,
  ArrowUp02Icon,
  Image01Icon,
  Attachment02Icon,
} from '@hugeicons/core-free-icons'

// Ondel's icon vocabulary — Hugeicons, one entry per semantic role.
//
// This object is the ONLY place icons are chosen. The app never imports icons
// directly; it references these names via <Icon name="…" />. To move the whole
// product from the free stroke set to the Pro *solid* set, swap the import
// source above to `@hugeicons-pro/core-solid-rounded` (same export names) — no
// page-level edits required. See design-system/icons.md.
export const icons = {
  home: Home01Icon,
  releases: DiscIcon,
  timeline: Calendar03Icon,
  signals: Activity03Icon,
  campaigns: Megaphone01Icon,
  bell: Notification01Icon,
  logout: Logout01Icon,
  chevronDown: ArrowDown01Icon,
  arrowLeft: ArrowLeft01Icon,
  chevronLeft: ArrowLeft01Icon,
  chevronRight: ArrowRight01Icon,
  radio: Radio02Icon,
  check: CheckmarkCircle02Icon,
  plus: PlusSignIcon,
  close: Cancel01Icon,
  hammer: HammerIcon,
  music: MusicNote01Icon,
  newPost: PackageAddIcon,
  fillPlan: CalendarSearchIcon,
  quiet: NotificationOff01Icon,
  // Platform brand marks (used as white glyphs on brand-colour tiles)
  pInstagram: InstagramIcon,
  pTiktok: TiktokIcon,
  pYoutube: YoutubeIcon,
  pThreads: ThreadsIcon,
  pX: NewTwitterIcon,
  pSpotify: SpotifyIcon,
  sun: Sun03Icon,
  moon: Moon02Icon,
  arrowUp: ArrowUp02Icon,
  image: Image01Icon,
  attachment: Attachment02Icon,
} as const

export type IconName = keyof typeof icons

type IconProps = Omit<HugeiconsIconProps, 'icon'> & { name: IconName }

// Optical stroke scaling: small icons keep a legible weight, large icons go
// lighter/airier, so strokes read consistently across sizes rather than one
// value that's either faint when small or heavy when large.
//   ≤17px → 1.5   ·   18–21px → 1.4   ·   ≥22px → 1.2
function strokeFor(size: number) {
  const n = typeof size === 'number' ? size : parseFloat(String(size)) || 18
  if (n >= 22) return 1.2
  if (n >= 18) return 1.4
  return 1.5
}

// Defaults encode the system: 18px, size-aware stroke, currentColor. Colour is
// set by the parent's text colour (Tailwind `text-*`); size/stroke can be
// overridden per instance.
export function Icon({ name, size = 18, strokeWidth, ...rest }: IconProps) {
  return <HugeiconsIcon icon={icons[name]} size={size} strokeWidth={strokeWidth ?? strokeFor(size as number)} {...rest} />
}
