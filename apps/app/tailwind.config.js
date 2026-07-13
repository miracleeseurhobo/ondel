/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Design system: exactly two weights. Overriding (not extending) removes
    // `font-semibold`/`font-bold` so they can't be used by accident.
    // See design-system/typography.md.
    fontWeight: {
      normal: '400', // body text
      medium: '500', // headings & emphasis
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Single brand accent — primary CTAs, active nav, focus, links.
        // Everything else draws from Tailwind's built-in `neutral` scale.
        // See design-system/color.md.
        brand: {
          DEFAULT: '#3D82DE',
          fg: '#ffffff',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        // Design system: 8–12px only. --radius is 12px, so shadcn's
        // lg/md/sm land on 12/10/8. Explicit ds-* aliases document intent.
        'ds-sm': '8px',
        'ds-md': '10px',
        'ds-lg': '12px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
