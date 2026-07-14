import { useState } from 'react'
import { Icon } from './ui/icon'
import { getStoredTheme, setStoredTheme, type Theme } from '../lib/theme'

// Compact light/dark switcher — a segmented pill with a sliding knob, matching
// the app's toggle language (Month/Week). Persists + flips the `dark` class.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  const choose = (t: Theme) => {
    setTheme(t)
    setStoredTheme(t)
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="relative flex items-center rounded-lg p-0.5"
      style={{ background: 'var(--ds-surface-2)' }}
    >
      {/* sliding knob */}
      <span
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md transition-transform duration-200 ease-out"
        style={{ background: 'var(--ds-surface)', boxShadow: '0 1px 2px rgba(0,0,0,0.10)', transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0)' }}
        aria-hidden
      />
      {(['light', 'dark'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => choose(t)}
          aria-pressed={theme === t}
          aria-label={t === 'light' ? 'Light theme' : 'Dark theme'}
          className="relative z-10 flex h-7 flex-1 items-center justify-center rounded-md transition-colors"
          style={{ color: theme === t ? 'var(--ds-text)' : 'var(--ds-text-muted)' }}
        >
          <Icon name={t === 'light' ? 'sun' : 'moon'} size={15} />
        </button>
      ))}
    </div>
  )
}
