import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon, type IconName } from '../components/ui/icon'
import Folder from '../components/Folder'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'

const HAIR = 'var(--ds-hair)'
const EASE = [0.23, 1, 0.32, 1] as const

type Asset = { id: string; name: string; kind: string; size: string; when: string; icon: IconName; hue: string }
type FolderData = { id: string; label: string; hint: string; assets: Asset[] }

const SEED: FolderData[] = [
  {
    id: 'masters',
    label: 'Masters',
    hint: 'Final mixes and masters',
    assets: [{ id: 'm1', name: 'Midnight Drive — Master.wav', kind: 'Master', size: '48.2 MB', when: 'Owned · May 2', icon: 'music', hue: '#3D82DE' }],
  },
  {
    id: 'artwork',
    label: 'Artwork',
    hint: 'Covers, promo images',
    assets: [{ id: 'a1', name: 'Cover Art.png', kind: 'Artwork', size: '6.1 MB', when: 'Owned · May 2', icon: 'image', hue: '#E1306C' }],
  },
  {
    id: 'stems',
    label: 'Stems',
    hint: 'Session stems and bounces',
    assets: [{ id: 's1', name: 'Stems.zip', kind: 'Stems', size: '210 MB', when: 'Owned · Apr 28', icon: 'music', hue: '#8A63E8' }],
  },
  { id: 'splits', label: 'Splits & Contracts', hint: 'Split sheets, agreements', assets: [] },
  { id: 'promo', label: 'Promo', hint: 'Press kit, canvas, visualisers', assets: [] },
]

const prettySize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes >= 1000) return `${Math.round(bytes / 1000)} KB`
  return `${bytes} B`
}
const iconFor = (t: string): IconName => (t.startsWith('image') ? 'image' : t.startsWith('audio') ? 'music' : 'attachment')
const hueFor = (t: string) => (t.startsWith('image') ? '#E1306C' : t.startsWith('audio') ? '#3D82DE' : '#16a34a')

export default function Vault() {
  const [folders, setFolders] = useState<FolderData[]>(SEED)
  const [openId, setOpenId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const open = folders.find((f) => f.id === openId) ?? null

  const addToOpen = (files: FileList | null) => {
    if (!files?.length || !openId) return
    const next: Asset[] = Array.from(files).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      kind: f.type.startsWith('audio') ? 'Audio' : f.type.startsWith('image') ? 'Artwork' : 'File',
      size: prettySize(f.size),
      when: 'Owned · just now',
      icon: iconFor(f.type),
      hue: hueFor(f.type),
    }))
    setFolders((list) => list.map((f) => (f.id === openId ? { ...f, assets: [...next, ...f.assets] } : f)))
  }

  /* ---------------- Folder detail view ---------------- */
  if (open) {
    return (
      <div className="w-full pb-10">
        <motion.button
          type="button"
          onClick={() => setOpenId(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-[color:var(--ds-text)]"
          style={{ color: SUBTLE }}
        >
          <Icon name="arrowLeft" size={16} />
          Vault
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mt-3">
          <h1 className="text-[26px] font-medium tracking-[-0.5px]" style={{ color: INK }}>
            {open.label}
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: SUBTLE }}>
            {open.hint} · secured under your ownership record.
          </p>
        </motion.div>

        {/* Upload scoped to this folder */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addToOpen(e.dataTransfer.files)
          }}
          className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-8 text-center outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand/40"
          style={{ borderColor: dragging ? 'var(--ds-accent)' : 'var(--ds-border)', background: dragging ? 'var(--ds-surface-2)' : 'transparent' }}
        >
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => addToOpen(e.target.files)} />
          <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--ds-surface-2)' }}>
            <Icon name="upload" size={20} style={{ color: SUBTLE }} />
          </span>
          <div className="mt-3 text-[14px]" style={{ color: SUBTLE }}>
            Drop files into {open.label} or{' '}
            <span className="font-medium underline underline-offset-2" style={{ color: INK }}>
              browse
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: FAINT }}>
            <Icon name="vault" size={13} /> Encrypted and tied to your ownership record.
          </div>
        </div>

        {open.assets.length ? (
          <>
            <div className="mt-6 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: FAINT }}>
              Secured · {open.assets.length}
            </div>
            <div className="mt-2.5 flex flex-col gap-2">
              {open.assets.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * i, duration: 0.35, ease: EASE }}
                  className="flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-[background-color] duration-150 hover:bg-[color:var(--ds-surface-2)]"
                  style={{ borderColor: HAIR, background: 'var(--ds-surface)' }}
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: a.hue }}>
                    <Icon name={a.icon} size={16} className="text-white" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium" style={{ color: INK }}>
                      {a.name}
                    </div>
                    <div className="text-[12px] tabular-nums" style={{ color: FAINT }}>
                      {a.kind} · {a.size} · {a.when}
                    </div>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium" style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>
                    <Icon name="vault" size={12} /> Owned
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center" style={{ borderColor: HAIR }}>
            <div className="text-[14px] font-medium" style={{ color: INK }}>
              Nothing in {open.label} yet
            </div>
            <div className="mt-1 max-w-xs text-[13px]" style={{ color: SUBTLE }}>
              Upload the files you own for this release — they stay private and provable.
            </div>
          </div>
        )}
      </div>
    )
  }

  /* ---------------- Folder grid ---------------- */
  const totalFiles = folders.reduce((n, f) => n + f.assets.length, 0)
  return (
    <div className="w-full pb-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: FAINT }}>
          Assets
        </div>
        <h1 className="mt-1 text-[26px] font-medium tracking-[-0.5px]" style={{ color: INK }}>
          Vault
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: SUBTLE }}>
          Your creative work, organised and secured — {totalFiles} file{totalFiles === 1 ? '' : 's'} across {folders.length} folders.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.4, ease: EASE }}
        className="mt-4 grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 xl:grid-cols-3"
      >
        {folders.map((f) => (
          <Folder key={f.id} label={f.label} count={f.assets.length} empty={f.assets.length === 0} onClick={() => setOpenId(f.id)} />
        ))}
      </motion.div>
    </div>
  )
}
