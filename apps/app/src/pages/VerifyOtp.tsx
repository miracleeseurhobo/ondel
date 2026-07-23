import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Icon } from '../components/ui/icon'
import OndieMark from '../components/OndieMark'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp'
import { mockSignIn } from '../lib/auth'
import { applyTheme, getStoredTheme } from '../lib/theme'
import { CTA_SHADOW } from '../lib/authStyle'

const LEN = 6

// OTP verification — reached after the email step on /signin. Mock verification
// (Clerk-ready): a full-length code signs in. Styled to the Lemni-Light sign-in;
// a ripple fires inside each slot as a digit is entered (see input-otp.tsx).
export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email ?? ''

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const submittedRef = useRef(false)

  // Auth flow is always light; dark mode is scoped to the dashboard. Force light
  // here (SignIn restores the stored theme on exit), restore it when we leave.
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    return () => applyTheme(getStoredTheme())
  }, [])

  // No email in flow state → send them back to sign in.
  useEffect(() => {
    if (!email) navigate('/signin', { replace: true })
  }, [email, navigate])

  // Resend cooldown tick.
  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000)
    return () => window.clearInterval(id)
  }, [cooldown])

  // The verification seam — swap for Clerk's attemptEmailAddressVerification later.
  const verify = async (value: string) => {
    if (submittedRef.current) return
    if (value.length < LEN) {
      setError('Enter the 6-digit code we emailed you.')
      return
    }
    submittedRef.current = true
    setSubmitting(true)
    setError(null)
    // Mock: accept any well-formed 6-digit code.
    window.setTimeout(() => {
      mockSignIn()
      navigate('/')
    }, 650)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    verify(code)
  }

  const resend = () => {
    if (cooldown > 0) return
    setCooldown(30)
    setError(null)
    // Mock no-op; Clerk later: prepareEmailAddressVerification({ strategy: 'email_code' })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app px-5 text-ink" style={{ paddingTop: 'max(4rem, env(safe-area-inset-top))', paddingBottom: 'max(4rem, env(safe-area-inset-bottom))' }}>
      <Link
        to="/signin"
        aria-label="Back to sign in"
        className="fixed z-20 flex h-11 w-11 items-center justify-center rounded-full text-subtle transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay/25"
        style={{ top: 'max(24px, env(safe-area-inset-top))', left: 24 }}
      >
        <Icon name="arrowLeft" size={20} aria-hidden />
      </Link>

      <form onSubmit={onSubmit} className="flex w-full max-w-[370px] flex-col items-center text-center">
        <OndieMark size={64} />

        <h1 className="mt-7 text-[32px] font-medium leading-[38.4px] tracking-[-0.32px] text-ink">
          Verify your email
        </h1>
        <p className="mt-2 text-[15px] leading-[21px] text-subtle">
          {email ? (
            <>
              Enter the 6-digit code we sent to <span className="font-medium text-ink">{email}</span>.
            </>
          ) : (
            'Enter the 6-digit code we emailed you.'
          )}
        </p>

        <div className="mt-7">
          <InputOTP
            maxLength={LEN}
            value={code}
            onChange={(v) => {
              setCode(v)
              if (error) setError(null)
            }}
            onComplete={verify}
            pattern={REGEXP_ONLY_DIGITS}
            autoFocus
            aria-label="One-time password"
            disabled={submitting}
          >
            <InputOTPGroup>
              {Array.from({ length: LEN }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="mt-2 h-4 text-[13px]" role="alert" aria-live="polite" style={{ color: '#dc2626' }}>
          {error}
        </div>

        <button
          type="submit"
          disabled={submitting || code.length < LEN}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-medium text-white transition-[transform,opacity] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:opacity-40"
          style={{ boxShadow: CTA_SHADOW }}
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Verifying…
            </>
          ) : (
            'Verify OTP'
          )}
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="mt-4 min-h-[44px] text-[14px] text-subtle transition-colors hover:text-ink disabled:cursor-default disabled:opacity-60 disabled:hover:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay/25 rounded-md px-2"
        >
          {cooldown > 0 ? (
            <>
              Resend code in <span className="tabular-nums">{cooldown}s</span>
            </>
          ) : (
            'Resend code'
          )}
        </button>

        <p className="mt-6 max-w-[320px] text-[13px] leading-[18px] text-faint">
          If you don&apos;t see anything after 2 minutes, we likely couldn&apos;t match the provided email to an account.
        </p>
      </form>
    </main>
  )
}
