import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  ClerkProvider,
  AuthenticateWithRedirectCallback,
  useSignIn,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react'
import './index.css'
import Index from './pages/Index'
import SignIn from './pages/SignIn'
import Workspace from './pages/Workspace'
import { isSignedIn } from './lib/auth'

// Auth is opt-in: with VITE_CLERK_PUBLISHABLE_KEY set, the OAuth buttons run the
// real Clerk redirect flow; without it, the sign-in falls back to the UI-only
// mock (Siri-orb welcome). Either way the app builds and runs.
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

type OAuth = 'oauth_google' | 'oauth_apple' | 'oauth_spotify'

function ClerkSignIn() {
  const { signIn, isLoaded } = useSignIn()
  const onOAuth = (strategy: string) => {
    if (!isLoaded || !signIn) return
    void signIn.authenticateWithRedirect({
      strategy: strategy as OAuth,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    })
  }
  return <SignIn onOAuth={onOAuth} />
}

// Protect the workspace. With Clerk configured, use its real guard; otherwise
// fall back to the mock gate (localStorage) so the app still requires sign-in.
function WorkspaceRoute() {
  if (!CLERK_KEY) return isSignedIn() ? <Workspace /> : <Navigate to="/signin" replace />
  return (
    <>
      <SignedIn>
        <Workspace />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home = the signed-in workspace (Clerk-guarded when configured). */}
        <Route path="/" element={<WorkspaceRoute />} />
        {/* Prompt / new-release entry + onboarding flow. */}
        <Route path="/start" element={<Index />} />
        <Route path="/signin" element={CLERK_KEY ? <ClerkSignIn /> : <SignIn />} />
        {CLERK_KEY ? <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} /> : null}
      </Routes>
    </BrowserRouter>
  )
}

const tree = CLERK_KEY ? (
  <ClerkProvider publishableKey={CLERK_KEY}>
    <AppRouter />
  </ClerkProvider>
) : (
  <AppRouter />
)

createRoot(document.getElementById('root')!).render(<StrictMode>{tree}</StrictMode>)
