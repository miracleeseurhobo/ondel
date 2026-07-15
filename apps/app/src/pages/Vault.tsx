import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon, type IconName } from '../components/ui/icon'
import { INK, SUBTLE, FAINT } from '../components/workspace-ui'

const HAIR = 'var(--ds-hair)'
const EASE = [0.23, 1, 0.32, 1] as const

type Asset = { id: string; name: string; kind: string; size: string; when: string; icon: IconName; hue: string }

const SEED: Asset[] = [
  { id: '1', name: 'Midnight Drive — Master.wav', kind: 'Master', size: '48.2 MB', when: 'Owned · May 2', icon: 'music', hue: '#3D82DE' },
  { id: '2', name: 'Cover Art.png', kind: 'Artwork', size: '6.1 MB', when: 'Owned · May 2', icon: 'image', hue: '#E1306C' },
  { id: '3', name: 'Stems.zip', kind: 'Stems', size: '210 MB', when: 'Owned · Apr 28', icon: 'music', hue: '#8A63E8' },
  { id: '4', name: 'Split Sheet.pdf', kind: 'Document', size: '240 KB', when: 'Owned · Apr 20', icon: 'attachment', hue: '#16a34a' },
]

const prettySize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes >= 1000) return `${Math.round(bytes / 1000)} KB`
  return `${bytes} B`
}

export default function Vault() {
  const [assets, setAssets] = useState<Asset[]>(SEED)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const add = (files: FileList | null) => {
    if (!files?.length) return
    const next: Asset[] = Array.from(files).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      kind: f.type.startsWith('audio') ? 'Audio' : f.type.startsWith('image') ? 'Artwork' : 'File',
      size: prettySize(f.size),
      when: 'Owned · just now',
      icon: f.type.startsWith('image') ? 'image' : f.type.startsWith('audio') ? 'music' : 'attachment',
      hue: f.type.startsWith('image') ? '#E1306C' : f.type.startsWith('audio') ? '#3D82DE' : '#16a34a',
    }))
    setAssets((a) => [...next, ...a])
  }

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
          Upload and secure the work you own — masters, artwork, stems and splits.
        </p>
      </motion.div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.4, ease: EASE }}
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
          add(e.dataTransfer.files)
        }}
        className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-9 text-center outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand/40"
        style={{ borderColor: dragging ? 'var(--ds-accent)' : 'var(--ds-border)', background: dragging ? 'var(--ds-surface-2)' : 'transparent' }}
      >
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => add(e.target.files)} />
        <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--ds-surface-2)' }}>
          <Icon name="upload" size={20} style={{ color: SUBTLE }} />
        </span>
        <div className="mt-3 text-[14px]" style={{ color: SUBTLE }}>
          Drag files here or{' '}
          <span className="font-medium underline underline-offset-2" style={{ color: INK }}>
            browse
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: FAINT }}>
          <Icon name="vault" size={13} />
          Encrypted and tied to your ownership record.
        </div>
      </motion.div>

      {/* Secured assets */}
      <div className="mt-6 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: FAINT }}>
        Secured · {assets.length}
      </div>
      <div className="mt-2.5 flex flex-col gap-2">
        {assets.map((a, i) => (
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
              <Icon name="vault" size={12} />
              Owned
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
