// Deterministic, lightly song-aware mock artifacts for the first-run reveal.
// No real audio/DSP analysis — this is a believable, stable demonstration of the
// pipeline (analysis → regions → playlists → content). Seeded by the song name /
// prompt so a given input always produces the same result.

export type Chip = { label: string; value: string }
export type Region = { city: string; country: string; fit: number; why: string }
export type PlaylistOpp = { kind: 'Editorial' | 'Curator' | 'Algorithmic'; name: string; reach: string; fit: number }
export type ContentPost = { title: string; day: string; platforms: string[] }

export type FirstRunPlan = {
  analysis: Chip[]
  refs: string[]
  regions: Region[]
  playlists: PlaylistOpp[]
  content: ContentPost[]
  summary: { posts: number; platforms: number; releaseDate: string }
}

export const PLATFORM_COLOR: Record<string, string> = {
  instagram: '#E1306C',
  tiktok: '#111111',
  youtube: '#FF0000',
  threads: '#111111',
  x: '#111111',
  spotify: '#1DB954',
  all: 'var(--ds-text-secondary)',
}

const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
const at = <T,>(arr: T[], seed: number, salt: number) => arr[(seed + salt) % arr.length]

const GENRES = ['Synth-pop', 'Alt-R&B', 'Indie pop', 'Bedroom pop', 'Dance-pop', 'Afro-fusion']
const MOODS = ['Nocturnal', 'Euphoric', 'Wistful', 'Hazy', 'Cinematic', 'Restless']
const ENERGY = ['Mid-high', 'Slow-burn', 'High', 'Laid-back']
const REFS = [
  ['The Weeknd', 'M83'],
  ['Dua Lipa', 'Robyn'],
  ['Clairo', 'Men I Trust'],
  ['Tame Impala', 'Glass Animals'],
  ['Rema', 'Wizkid'],
]

// Regions are ranked; the top one varies by seed, the rest stay cohesive.
const REGION_POOL: Region[] = [
  { city: 'Los Angeles', country: 'US', fit: 94, why: 'Strongest late-night listener base for this sound' },
  { city: 'London', country: 'UK', fit: 89, why: 'Synth-pop editorial support runs hot here' },
  { city: 'Toronto', country: 'CA', fit: 85, why: 'High save-rate on comparable artists' },
  { city: 'Berlin', country: 'DE', fit: 80, why: 'Club / alt crossover audience' },
  { city: 'Sydney', country: 'AU', fit: 76, why: 'Fast-emerging fanbase, low competition' },
]

export function buildFirstRunPlan(seedInput: string): FirstRunPlan {
  const seed = hash(seedInput || 'ondel')
  const genre = at(GENRES, seed, 0)
  const mood = at(MOODS, seed, 3)
  const energy = at(ENERGY, seed, 5)
  const bpm = 96 + (seed % 44) // 96–139
  const refs = at(REFS, seed, 2)

  const analysis: Chip[] = [
    { label: 'Genre', value: genre },
    { label: 'Mood', value: mood },
    { label: 'Tempo', value: `${bpm} BPM` },
    { label: 'Energy', value: energy },
  ]

  // Rotate the ranked regions so the lead varies but the set stays believable.
  const offset = seed % REGION_POOL.length
  const regions = REGION_POOL.map((_, i) => REGION_POOL[(i + offset) % REGION_POOL.length])
    .map((r, i) => ({ ...r, fit: 94 - i * 5 }))
    .slice(0, 4)

  const playlists: PlaylistOpp[] = [
    { kind: 'Editorial', name: 'New Music Friday', reach: '4.1M followers', fit: 92 },
    { kind: 'Curator', name: 'Indie / Synth Nights', reach: '82k followers', fit: 88 },
    { kind: 'Algorithmic', name: 'Release Radar reach', reach: '~120k listeners', fit: 79 },
  ]

  const content: ContentPost[] = [
    { title: 'Teaser clip', day: 'Day 1', platforms: ['instagram', 'tiktok'] },
    { title: 'Chorus preview', day: 'Day 3', platforms: ['tiktok', 'youtube'] },
    { title: 'Artwork reveal', day: 'Day 8', platforms: ['instagram'] },
    { title: 'Release Day', day: 'Day 24', platforms: ['all'] },
  ]

  return {
    analysis,
    refs,
    regions,
    playlists,
    content,
    summary: { posts: 30, platforms: 5, releaseDate: 'May 24' },
  }
}
