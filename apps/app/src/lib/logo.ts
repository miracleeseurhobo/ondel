// Logo.dev — company logo image URLs (https://www.logo.dev/docs/logo-images).
// Returns any company's logo as a cacheable CDN image; look up by domain, name,
// stock ticker, crypto symbol, or ISIN. No SDK — just point an <img> at the URL.
//
// The key is a *publishable* key (pk_…), safe to ship client-side.
//
// ⚠️ ATTRIBUTION: the free tier requires a visible "Logos provided by Logo.dev"
// link for commercial use, and Ondel is commercial. Deferred for now (pre-launch
// mock) — add the attribution link (or move to a paid plan) before launch.
const LOGO_DEV_KEY = 'pk_eqiOF_lmTK-EBWJEZyoB8w'

type LogoId =
  | { domain: string }
  | { name: string }
  | { ticker: string }
  | { crypto: string }
  | { isin: string }

type LogoOpts = {
  size?: number // px, default 128, max 800
  format?: 'jpg' | 'png' | 'webp'
  theme?: 'auto' | 'light' | 'dark'
  retina?: boolean
  greyscale?: boolean
  fallback?: 'monogram' | '404' // default monogram (returns a 200 letter tile)
}

// Build a logo.dev image URL. Pass exactly one identifier.
export function logoUrl(id: LogoId, opts: LogoOpts = {}): string {
  const path =
    'domain' in id ? encodeURIComponent(id.domain)
    : 'name' in id ? `name/${encodeURIComponent(id.name)}`
    : 'ticker' in id ? `ticker/${encodeURIComponent(id.ticker)}`
    : 'crypto' in id ? `crypto/${encodeURIComponent(id.crypto)}`
    : `isin/${encodeURIComponent(id.isin)}`

  const params = new URLSearchParams({ token: LOGO_DEV_KEY })
  if (opts.size) params.set('size', String(opts.size))
  if (opts.format) params.set('format', opts.format)
  if (opts.theme) params.set('theme', opts.theme)
  if (opts.retina) params.set('retina', 'true')
  if (opts.greyscale) params.set('greyscale', 'true')
  if (opts.fallback) params.set('fallback', opts.fallback)

  return `https://img.logo.dev/${path}?${params.toString()}`
}
