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
import Timeline from './pages/Timeline'
import SignIn from './pages/SignIn'
import WorkspaceLayout from './components/WorkspaceLayout'
import BlankPage from './components/BlankPage'
import { isSignedIn } from './lib/auth'
import { applyTheme, getStoredTheme } from './lib/theme'

// Theme is scoped to the dashboard — the auth + onboarding flow (sign-in,
// manifesto, workspace) is always light. Apply before first paint to avoid flash.
{
  const p = window.location.pathname
  const authRoute = p.startsWith('/signin') || p.startsWith('/sso')
  applyTheme(authRoute ? 'light' : getStoredTheme())
}

// Auth is opt-in: with VITE_CLERK_PUBLISHABLE_KEY set, the OAuth buttons run the
// real Clerk redirect flow; without it, a persisted mock gate stands in.
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

// The workspace (and all its sub-pages) live behind the auth gate + shared shell.
function GuardedLayout() {
  if (!CLERK_KEY) return isSignedIn() ? <WorkspaceLayout /> : <Navigate to="/signin" replace />
  return (
    <>
      <SignedIn>
        <WorkspaceLayout />
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
        {/* Signed-in workspace shell — Home is Ask Ondie; sections are blank for now */}
        <Route element={<GuardedLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/releases" element={<BlankPage title="Releases" />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/signals" element={<BlankPage title="Signals" />} />
          <Route path="/campaigns" element={<BlankPage title="Campaigns" />} />
        </Route>
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
