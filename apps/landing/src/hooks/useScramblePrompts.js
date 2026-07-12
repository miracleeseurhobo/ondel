import { useState, useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './useScrollProgress'

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// Cycles through `prompts`, revealing each next sentence with a scramble
// transition (same algorithm as the TextScramble component). Only runs while
// `active` is true — pass active = (field empty && not focused) so it animates
// only when the user isn't typing. Returns the current string for a placeholder.
export function useScramblePrompts(
  prompts,
  active,
  { holdMs = 2200, duration = 0.9, speed = 0.04, characterSet = defaultChars } = {},
) {
  const [display, setDisplay] = useState(prompts[0] ?? '')
  const idxRef = useRef(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    // Freeze on a clean sentence while the user is interacting — or entirely
    // when reduced motion is preferred (the scramble is continuous motion).
    if (!active || reduced || prompts.length === 0) {
      setDisplay(prompts[idxRef.current] ?? '')
      return
    }

    let cancelled = false
    let timer
    let interval

    const scrambleTo = (target, done) => {
      const steps = duration / speed
      let step = 0
      interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval)
          return
        }
        const progress = step / steps
        let scrambled = ''
        for (let i = 0; i < target.length; i++) {
          if (target[i] === ' ') {
            scrambled += ' '
          } else if (progress * target.length > i) {
            scrambled += target[i]
          } else {
            scrambled += characterSet[Math.floor(Math.random() * characterSet.length)]
          }
        }
        setDisplay(scrambled)
        step++
        if (step > steps) {
          clearInterval(interval)
          setDisplay(target)
          done?.()
        }
      }, speed * 1000)
    }

    const loop = () => {
      timer = setTimeout(() => {
        if (cancelled) return
        idxRef.current = (idxRef.current + 1) % prompts.length
        scrambleTo(prompts[idxRef.current], loop)
      }, holdMs)
    }

    setDisplay(prompts[idxRef.current] ?? '')
    loop()

    return () => {
      cancelled = true
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [active, reduced, prompts, holdMs, duration, speed, characterSet])

  return display
}
