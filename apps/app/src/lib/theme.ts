// Class-based theme (Tailwind darkMode: ['class']). The `dark` class lives on
// <html>; CSS variables in index.css flip the whole palette. Persisted to
// localStorage, defaulting to the OS preference on first visit.
export type Theme = 'light' | 'dark'

const KEY = 'ondel_theme'

export function getStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* ignore */
  }
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function setStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
  applyTheme(theme)
}
