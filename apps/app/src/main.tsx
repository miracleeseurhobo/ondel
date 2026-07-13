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
import WorkspaceLayout from './components/WorkspaceLayout'
import Home from './pages/Home'
import Releases from './pages/Releases'
import Timeline from './pages/Timeline'
import Signals from './pages/Signals'
import Campaigns from './pages/Campaigns'
import { isSignedIn } from './lib/auth'

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
        {/* Signed-in workspace shell with nested pages */}
        <Route element={<GuardedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/campaigns" element={<Campaigns />} />
        </Route>
        {/* Prompt / new-release entry + onboarding flow */}
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
