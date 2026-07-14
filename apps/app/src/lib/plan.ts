// Mock "release plan" state — set when Ondie generates a plan from the Home
// prompt, read by the Calendar to switch between its empty state and the
// populated plan. Persisted so the plan survives navigation/refresh; cleared on
// a fresh sign-in so the generate loop is repeatable.
const KEY = 'ondel_plan'

export function hasPlan(): boolean {
  try {
    return localStorage.getItem(KEY) != null
  } catch {
    return false
  }
}

export function getPlanPrompt(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function setPlanGenerated(prompt: string) {
  try {
    localStorage.setItem(KEY, prompt.trim() || 'Release plan')
  } catch {
    /* ignore */
  }
}

export function clearPlan() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
