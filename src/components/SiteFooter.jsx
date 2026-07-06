import { ArrowRight } from 'lucide-react'
import BlueprintFrame from './BlueprintFrame'

const products = [
  { name: 'Ondie', desc: 'AI release manager' },
  { name: 'Signals', desc: 'Music intelligence' },
  { name: 'Radar', desc: 'Playlist opportunities' },
]

const groups = [
  { title: 'Company', links: ['About', 'Journal', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help', 'FAQ', 'Blog'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms', 'Cookies'] },
]

const socials = [
  {
    label: 'Instagram',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3',
  },
  {
    label: 'X/Twitter',
    path: 'M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z',
  },
  {
    label: 'Facebook',
    path: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95',
  },
]

const linkCls =
  'rounded text-body text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400'

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#fafafa] text-neutral-900">
      <BlueprintFrame color="#0a0a0a" inset={48} speed={1} />

      <div className="relative z-10 mx-auto max-w-[92rem] px-8 pb-10 pt-12 sm:px-16 sm:pt-16">
        {/* Giant wordmark */}
        <h2 className="font-inter font-bold leading-[0.8] tracking-[-0.04em] text-[clamp(4rem,19vw,15rem)]">
          Ondel
        </h2>

        <hr className="mb-10 mt-8 border-t border-neutral-300" />

        {/* Columns: newsletter + link groups */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-6">
          {/* Newsletter */}
          <div className="col-span-2">
            <p className="text-mono-md text-neutral-900">Newsletter</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex max-w-[18rem] items-center gap-2 border-b border-neutral-300 pb-2 focus-within:border-neutral-900"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@email.com"
                className="w-full bg-transparent text-body text-neutral-800 placeholder-neutral-400 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="-m-3.5 inline-flex items-center justify-center p-3.5 rounded text-neutral-900 transition-colors hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-3 text-mono-sm uppercase tracking-wider text-neutral-500">
              I accept the conditions
            </p>
            <div className="mt-4 flex gap-1 -ml-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Products — not shipped yet, so shown as non-clickable "Soon" items
              (descriptor kept as a tooltip) rather than dead links. */}
          <nav aria-label="Products">
            <p className="text-mono-md text-neutral-900">Products</p>
            <ul className="mt-4 space-y-2.5">
              {products.map((p) => (
                <li key={p.name} className="flex items-center gap-2">
                  <span title={p.desc} className="text-body text-neutral-400">
                    {p.name}
                  </span>
                  <span className="rounded-full border border-neutral-300 px-1.5 py-0.5 text-mono-sm uppercase tracking-wider text-neutral-400">
                    Soon
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Link groups */}
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="text-mono-md text-neutral-900">{g.title}</p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href="#" className={linkCls}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-14 text-mono-sm uppercase tracking-wider text-neutral-500">
          Copyright Ondel {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
