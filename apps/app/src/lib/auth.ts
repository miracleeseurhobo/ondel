// Mock auth gate — a persisted "signed in" flag so the app requires sign-in
// before the dashboard, without a backend. Superseded by Clerk's real guard
// once VITE_CLERK_PUBLISHABLE_KEY is set (see main.tsx).
const KEY = 'ondel_signed_in'

export function isSignedIn(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function mockSignIn(): void {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    /* ignore (private mode etc.) */
  }
}

export function mockSignOut(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
