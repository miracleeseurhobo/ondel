// The folder mark from the dashboard chat home (Index.tsx FolderStack), minus
// the floating photo cards — a static, compact version used as the upload
// affordance on the Create-your-studio step. Same sixsense assets, so the two
// surfaces share one folder identity.
const A = 'https://qclay.design/lovable/sixsense'

type Layer = { src: string; z: number; bottom: number; left: number; cx?: boolean; w: number; h: number }

// Folder body + light glows (the CARDS from the home hero are intentionally omitted).
const LAYERS: Layer[] = [
  { z: 1, src: 'blue-light-2.svg', bottom: 50, left: 54.6, cx: true, w: 104, h: 170 },
  { z: 2, src: 'blue-light.svg', bottom: 28, left: 54.6, cx: true, w: 104, h: 170 },
  { z: 3, src: 'light-1.svg', bottom: 35, left: 57.2, cx: true, w: 180.5, h: 124.5 },
  { z: 4, src: 'folder-3.svg', bottom: 60, left: 23.4, w: 69.71, h: 45 },
  { z: 5, src: 'small-light-2.svg', bottom: 55, left: 67.6, cx: true, w: 39, h: 17 },
  { z: 6, src: 'small-light.svg', bottom: 50, left: 44.2, cx: true, w: 39, h: 25 },
  { z: 7, src: 'folder-2.svg', bottom: 45, left: 18.98, w: 79, h: 51 },
  { z: 8, src: 'light-2.svg', bottom: 20, left: 57.2, cx: true, w: 109, h: 162.5 },
  { z: 9, src: 'folder-1.svg', bottom: 30, left: 13, w: 91, h: 58 },
  { z: 10, src: 'folder-0.svg?v=2', bottom: 0, left: 0, w: 113.67, h: 76.5 },
]

const BOX_W = 113.67
const BOX_H = 150 // glow beams above the folder; folder sits at the bottom

export default function StudioFolder({ scale = 0.72 }: { scale?: number }) {
  return (
    <div style={{ width: BOX_W * scale, height: BOX_H * scale, position: 'relative' }} aria-hidden>
      <div style={{ width: BOX_W, height: BOX_H, position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {LAYERS.map((l) => (
          <img
            key={l.z}
            src={`${A}/${l.src}`}
            alt=""
            style={{
              position: 'absolute',
              bottom: l.bottom,
              left: l.cx ? '50%' : l.left,
              transform: l.cx ? 'translateX(-50%)' : undefined,
              width: l.w,
              height: l.h,
              zIndex: l.z,
            }}
          />
        ))}
      </div>
    </div>
  )
}
