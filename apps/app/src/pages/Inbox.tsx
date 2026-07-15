import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '../components/ui/icon'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'

const HAIR = 'var(--ds-hair)'
const EASE = [0.23, 1, 0.32, 1] as const

const PLATFORM: Record<string, string> = {
  tiktok: '#111111',
  instagram: '#E1306C',
  youtube: '#FF0000',
  spotify: '#1DB954',
}

type Collab = {
  id: string
  name: string
  handle: string
  platform: string
  followers: string
  hue: string
  pitch: string
  when: string
  status: 'pending' | 'accepted' | 'declined'
}

const SEED: Collab[] = [
  {
    id: '1',
    name: 'Maya Rivers',
    handle: '@maya.sounds',
    platform: 'tiktok',
    followers: '82k',
    hue: '#8A63E8',
    when: '2h ago',
    status: 'pending',
    pitch: "Loved the snippet of Midnight Drive — I'd like to use the chorus for a transition edit. My audience skews late-night indie listeners, big overlap with your sound.",
  },
  {
    id: '2',
    name: 'The Crate',
    handle: '@the.crate',
    platform: 'instagram',
    followers: '54k',
    hue: '#E1306C',
    when: '5h ago',
    status: 'pending',
    pitch: 'We run a weekly Reels series featuring one rising release. Would love to feature Midnight Drive next Friday — can send our media kit.',
  },
  {
    id: '3',
    name: 'lowkey.fm',
    handle: '@lowkeyfm',
    platform: 'tiktok',
    followers: '120k',
    hue: '#22B27B',
    when: 'Yesterday',
    status: 'accepted',
    pitch: 'In! Send me the pre-save link and any assets. Planning to post release week.',
  },
  {
    id: '4',
    name: 'Night Drive',
    handle: '@nightdrive',
    platform: 'instagram',
    followers: '38k',
    hue: '#3D82DE',
    when: '2 days ago',
    status: 'pending',
    pitch: 'Big fan of the direction. Open to a co-hosted IG Live listening session on release day?',
  },
]

const STATUS_LABEL = { pending: 'Pending', accepted: 'Accepted', declined: 'Declined' }
const STATUS_COLOR = { pending: '#ffb362', accepted: '#16a34a', declined: 'var(--ds-text-muted)' }

function CollabRow({ c, index, open, onToggle, onSet }: { c: Collab; index: number; open: boolean; onToggle: () => void; onSet: (s: Collab['status']) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.06, duration: 0.4, ease: EASE }}
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: HAIR, background: 'var(--ds-surface)' }}
    >
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)]">
        <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-medium text-white" style={{ background: c.hue }}>
          {c.name.slice(0, 1)}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2" style={{ background: PLATFORM[c.platform], ['--tw-ring-color' as string]: 'var(--ds-surface)' }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium" style={{ color: INK }}>
              {c.name}
            </span>
            <span className="text-[13px]" style={{ color: FAINT }}>
              {c.handle} · {c.followers}
            </span>
          </div>
          <div className="truncate text-[13px]" style={{ color: SUBTLE }}>
            {c.pitch}
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[12px] font-medium tabular-nums" style={{ color: STATUS_COLOR[c.status] }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[c.status] }} />
            {STATUS_LABEL[c.status]}
          </span>
          <span className="hidden text-[12px] sm:block" style={{ color: FAINT }}>
            {c.when}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26, ease: EASE }} style={{ overflow: 'hidden' }}>
            <div className="border-t px-3.5 py-3.5" style={{ borderColor: HAIR }}>
              <p className="text-[14px] leading-[21px]" style={{ color: INK }}>
                {c.pitch}
              </p>
              <div className="mt-3.5 flex items-center gap-2">
                {c.status === 'accepted' ? (
                  <span className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: '#16a34a' }}>
                    <Icon name="check" size={16} /> Collaboration accepted
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSet('accepted')}
                    className="h-9 rounded-lg px-3.5 text-[13px] font-medium transition-[transform] duration-150 active:scale-[0.96]"
                    style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}
                  >
                    Accept
                  </button>
                )}
                <button
                  type="button"
                  className="h-9 rounded-lg border px-3.5 text-[13px] font-medium transition-[transform,background-color] duration-150 hover:bg-[color:var(--ds-surface-2)] active:scale-[0.96]"
                  style={{ borderColor: HAIR, color: INK }}
                >
                  Message
                </button>
                {c.status !== 'declined' ? (
                  <button
                    type="button"
                    onClick={() => onSet('declined')}
                    className="ml-auto h-9 rounded-lg px-3 text-[13px] font-medium transition-[transform,color] duration-150 active:scale-[0.96]"
                    style={{ color: SUBTLE }}
                  >
                    Decline
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Inbox() {
  const [items, setItems] = useState<Collab[]>(SEED)
  const [openId, setOpenId] = useState<string | null>('1')

  const pending = items.filter((i) => i.status === 'pending').length
  const setStatus = (id: string, status: Collab['status']) => setItems((list) => list.map((i) => (i.id === id ? { ...i, status } : i)))

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: FAINT }}>
          Collaborations
        </div>
        <h1 className="mt-1 text-[26px] font-medium tracking-[-0.5px]" style={{ color: INK }}>
          Inbox
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: SUBTLE }}>
          {pending} pending request{pending === 1 ? '' : 's'} from creators.
        </p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-2.5">
        {items.map((c, i) => (
          <CollabRow key={c.id} c={c} index={i} open={openId === c.id} onToggle={() => setOpenId((o) => (o === c.id ? null : c.id))} onSet={(s) => setStatus(c.id, s)} />
        ))}
      </div>
    </div>
  )
}
