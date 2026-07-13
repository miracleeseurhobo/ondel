// Mock release data — shared by the Releases list and the per-release detail
// page. Everything here is placeholder content (no backend yet).

export type Status = 'In progress' | 'Draft' | 'Scheduled' | 'Released'

export const STATUS_COLOR: Record<Status, { bg: string; fg: string }> = {
  'In progress': { bg: '#E8F1FF', fg: '#3D82DE' },
  Draft: { bg: 'rgba(13,27,75,0.06)', fg: 'rgba(13,27,75,0.55)' },
  Scheduled: { bg: '#EFE9FC', fg: '#8A63E8' },
  Released: { bg: '#E4F6EE', fg: '#22B27B' },
}

export type Task = { title: string; when: string; state: 'done' | 'active' | 'upcoming' }

export type Release = {
  id: string
  title: string
  type: string
  status: Status
  meta: string
  cover: string
  readiness: number
  tasks: Task[]
  playlists: { name: string; followers: string; match: number }[]
  stats: { label: string; value: string }[]
}

export const RELEASES: Release[] = [
  {
    id: 'midnight-bloom',
    title: 'Midnight Bloom',
    type: 'Single',
    status: 'In progress',
    meta: 'Release week in 12 days',
    cover: 'linear-gradient(135deg,#5B8DEF,#2F5F9E)',
    readiness: 64,
    tasks: [
      { title: 'Master & artwork finalized', when: '2 weeks ago', state: 'done' },
      { title: 'Delivered to stores', when: 'Last Friday', state: 'done' },
      { title: 'Pitch to editorial curators', when: 'Thursday', state: 'active' },
      { title: 'Release day', when: 'In 12 days', state: 'upcoming' },
    ],
    playlists: [
      { name: 'New Music Friday', followers: '4.1M', match: 94 },
      { name: 'Indie Pop Rising', followers: '82k', match: 89 },
      { name: 'Bedroom Pop', followers: '31k', match: 87 },
    ],
    stats: [
      { label: 'Pre-saves', value: '318' },
      { label: 'Playlist matches', value: '14' },
      { label: 'Days to release', value: '12' },
    ],
  },
  {
    id: 'neon-tide',
    title: 'Neon Tide',
    type: 'EP · 5 tracks',
    status: 'Draft',
    meta: 'No date set',
    cover: 'linear-gradient(135deg,#8A63E8,#5B3FB0)',
    readiness: 22,
    tasks: [
      { title: 'Finalize tracklist', when: 'This week', state: 'active' },
      { title: 'Book mastering', when: 'Not scheduled', state: 'upcoming' },
      { title: 'Set release date', when: 'Not scheduled', state: 'upcoming' },
    ],
    playlists: [{ name: 'Electronic Rising', followers: '210k', match: 78 }],
    stats: [
      { label: 'Tracks', value: '5' },
      { label: 'Readiness', value: '22%' },
    ],
  },
  {
    id: 'paper-skies',
    title: 'Paper Skies',
    type: 'Single',
    status: 'Scheduled',
    meta: 'Out Aug 8',
    cover: 'linear-gradient(135deg,#22B27B,#128a5c)',
    readiness: 88,
    tasks: [
      { title: 'Delivered to stores', when: 'Done', state: 'done' },
      { title: 'Pre-save live', when: 'Running', state: 'active' },
      { title: 'Release day', when: 'Aug 8', state: 'upcoming' },
    ],
    playlists: [
      { name: 'Chill Acoustic', followers: '640k', match: 91 },
      { name: 'Fresh Folk', followers: '54k', match: 85 },
    ],
    stats: [
      { label: 'Pre-saves', value: '1,204' },
      { label: 'Days to release', value: '26' },
    ],
  },
  {
    id: 'slow-river',
    title: 'Slow River',
    type: 'Single',
    status: 'Released',
    meta: '128k streams · 2 mo ago',
    cover: 'linear-gradient(135deg,#E8804F,#c85a2a)',
    readiness: 100,
    tasks: [
      { title: 'Released', when: '2 months ago', state: 'done' },
      { title: 'Playlist follow-ups', when: 'Ongoing', state: 'active' },
    ],
    playlists: [
      { name: 'Late Night Drive', followers: '320k', match: 88 },
      { name: 'Mellow Beats', followers: '120k', match: 82 },
    ],
    stats: [
      { label: 'Streams', value: '128k' },
      { label: 'Saves', value: '9.4k' },
      { label: 'Playlists', value: '22' },
    ],
  },
]

export const releaseById = (id?: string) => RELEASES.find((r) => r.id === id)
