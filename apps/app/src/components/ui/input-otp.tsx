import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { INPUT_SHADOW } from '../../lib/authStyle'

// OTP input styled to the Lemni-Light sign-in: individual shadow-driven rounded
// slots (no connected borders). A ripple fires inside a slot the moment a digit
// lands in it — the "ripple on each number entered" effect.

const EASE = [0.23, 1, 0.32, 1] as const

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="input-otp-group" className={cn('flex items-center gap-2', className)} {...props} />
}

function InputOTPSlot({ index, className, ...props }: React.ComponentProps<'div'> & { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = ctx?.slots[index] ?? {}
  const reduced = useReducedMotion()

  // Spawn a ripple the moment this slot goes from empty → filled.
  const [ripples, setRipples] = React.useState<number[]>([])
  const prevChar = React.useRef<string | null | undefined>(char)
  const nextId = React.useRef(0)
  React.useEffect(() => {
    if (char && !prevChar.current && !reduced) {
      const id = nextId.current++
      setRipples((r) => [...r, id])
    }
    prevChar.current = char
  }, [char, reduced])

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'relative flex h-12 w-11 items-center justify-center overflow-hidden rounded-xl bg-surface text-[18px] font-medium text-ink outline-none transition-[box-shadow,transform]',
        'data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--ds-accent)]/35 data-[active=true]:z-10',
        className,
      )}
      style={{ boxShadow: INPUT_SHADOW }}
      {...props}
    >
      {char}

      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink" style={{ background: 'var(--ds-accent)' }} />
        </div>
      ) : null}

      {/* per-digit ripple */}
      <AnimatePresence>
        {ripples.map((id) => (
          <motion.span
            key={id}
            initial={{ scale: 0, opacity: 0.22 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onAnimationComplete={() => setRipples((r) => r.filter((x) => x !== id))}
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'var(--ds-accent)' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot }
