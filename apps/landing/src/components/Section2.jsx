import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Paperclip, SlidersHorizontal, Mic, ArrowUp, ChevronDown } from 'lucide-react'
import Reveal from './Reveal'
import RevealText from './RevealText'
import ShimmeringText from './ShimmeringText'
import DisplayCards from './DisplayCards'
import ChatBubbles from './ChatBubbles'
import BeamConnect from './BeamConnect'
import ProgressiveBlur from './ProgressiveBlur'
import { useScramblePrompts } from '../hooks/useScramblePrompts'

// Staggered "bouncing dots" bob for the analyzing logos.
const bounce = { y: [0, -7, 0] }
const bounceTransition = (delay) => ({
  duration: 0.6,
  repeat: Infinity,
  delay,
  ease: 'easeInOut',
})

const promptSuggestions = [
  'What should I release next?',
  'What opportunities am I missing?',
  'What would you do if you were my manager?',
]

const clamp01 = (t) => Math.min(Math.max(t, 0), 1)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// One alternating feature row: text on one side, illustration on the other.
// `reverse` swaps the sides on desktop (mobile always stacks text → art).
// Heading uses the overflow word-reveal; body fades up just after.
// `reveal` false → content is shown by default (no scroll-in), for the first
// row after the hero. `tall` false → compact height so it fills promptly.
function FeatureRow({ reverse = false, heading, body, art, reveal = true, tall = true }) {
  const textAlign = reverse
    ? 'lg:order-2 lg:items-start'
    : 'lg:order-1 lg:items-end lg:text-left'
  const artAlign = reverse ? 'lg:order-1 lg:justify-end' : 'lg:order-2 lg:justify-start'
  const headingCls = 'text-section text-neutral-900'
  const bodyCls = 'mt-6 text-body text-neutral-500 max-w-[380px]'

  return (
    <div
      className={`grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16 ${tall ? 'lg:min-h-[52vh]' : ''}`}
    >
      {/* Text — vertically centered, aligned toward the middle gutter */}
      <div className={`flex flex-col ${textAlign}`}>
        <div className="w-full max-w-[420px]">
          {reveal ? (
            <RevealText as="h2" text={heading} className={headingCls} />
          ) : (
            <h2 className={headingCls}>{heading}</h2>
          )}
          {reveal ? (
            <Reveal as="p" delay={260} className={bodyCls}>
              {body}
            </Reveal>
          ) : (
            <p className={bodyCls}>{body}</p>
          )}
        </div>
      </div>
      {/* Illustration — centered in its half, next to the text */}
      {reveal ? (
        <Reveal
          delay={180}
          className={`flex items-center justify-center ${artAlign}`}
        >
          <div className="w-full max-w-[480px]">{art}</div>
        </Reveal>
      ) : (
        <div className={`flex items-center justify-center ${artAlign}`}>
          <div className="w-full max-w-[480px]">{art}</div>
        </div>
      )}
    </div>
  )
}

export default function Section2({ progress = 1, reduced = false, hideChatbox = false }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const idle = !focused && value === ''
  const placeholder = useScramblePrompts(promptSuggestions, idle)

  // Row 1 is scroll-linked to the hero's white-out (0.88 → 1), so the same
  // scroll that drives the headset transition carries straight into content —
  // no empty white to scroll past after the parallax. Overlaps the hero's white
  // tail; sized to one viewport so everything below starts at the hero's end.
  const introP = reduced ? 1 : easeOut(clamp01((progress - 0.88) / 0.12))

  // Chatbox reveal/hide is driven by IntersectionObserver (visibility), not
  // scroll polling — per the fixing-motion-performance skill (rule 4). It shows
  // once Section 2's content block is in view (past the hero) and hides again
  // as the carousel approaches. Animated via opacity only (a compositor prop).
  const contentRef = useRef(null)
  const [contentInView, setContentInView] = useState(false)
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setContentInView(entry.isIntersecting),
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const chatboxVisible = reduced || (contentInView && !hideChatbox)

  return (
    <section
      className={`relative z-10 text-neutral-800 px-5 sm:px-10 lg:px-16 ${reduced ? 'bg-[#fafafa]' : '-mt-[100dvh]'}`}
    >
      <div className="relative mx-auto max-w-6xl">
        {/* Row 1 — scroll-linked; rises out of the hero white-out, one viewport
            tall so it consumes the overlap and the rest starts at the hero end */}
        <div
          className="flex min-h-dvh items-center"
          style={{
            opacity: introP,
            transform: `translateY(${(1 - introP) * 40}px)`,
            pointerEvents: introP < 0.05 ? 'none' : 'auto',
            willChange: 'opacity, transform',
          }}
        >
          <div className="w-full">
            <FeatureRow
              reveal={false}
              tall={false}
              heading="Your music has more potential than you think."
              body="Ondel AI analyzes your unreleased music, audience signals, and marketplace opportunities—so you can make smarter decisions before you release."
              art={
                <div className="overflow-x-clip py-6">
                  <DisplayCards />
                </div>
              }
            />
          </div>
        </div>

        {/* Rows 2+ and the pinned chatbox share a block that starts BELOW Row 1,
            so the sticky chatbox (and its blur) can never pin over the hero
            overlap — regardless of scroll speed. Observed for chatbox reveal. */}
        <div ref={contentRef} className="relative">
        {/* Row 2 — beam-connect: streaming logos flow into the Ondel mark (reversed) */}
        <FeatureRow
          reverse
          heading="We connect the dots. You make better decisions."
          body="We connect the signals shaping your next release and turn them into clear decisions."
          art={<BeamConnect />}
        />

        {/* Row 3 — Ask Ondie Anything: last row before the chatbox hides */}
        <FeatureRow
          heading="Ask Ondie Anything"
          body="Ask questions about your music, audience, and next release—and get recommendations tailored to your career."
          art={<ChatBubbles />}
        />

        {/* Pinned chatbox — sticks to the bottom while rows scroll up, then
            releases at the end of the section. Hidden until the hero has fully
            released (progress === 1) so it can never flash inside the hero,
            even on a fast scroll. */}
        <div
          className="sticky bottom-6 z-20 pb-8 transition-opacity duration-300"
          style={{
            opacity: chatboxVisible ? 1 : 0,
            pointerEvents: chatboxVisible ? 'auto' : 'none',
          }}
        >
          {/* Frosted dissolve band above the chatbox — content blurs out as it
              approaches, so it never overlaps the chatbox. */}
          <ProgressiveBlur className="absolute inset-x-0 bottom-full h-40" />
          {/* Solid backdrop behind the chatbox (matches the #fafafa section, so
              it's invisible) that hides scrolling content directly behind it. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -bottom-10 bg-[#fafafa]" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
              <div className="flex items-center -space-x-2">
                <motion.span
                  className="relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#1db954] text-white shadow-sm ring-2 ring-[#fafafa] hover:z-20"
                  whileHover={reduced ? undefined : bounce}
                  transition={reduced ? undefined : bounceTransition(0)}
                >
                  <SpotifyIcon className="h-4 w-4" />
                </motion.span>
                <motion.span
                  className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#fb5c74] to-[#fa233b] text-white shadow-sm ring-2 ring-[#fafafa] hover:z-20"
                  whileHover={reduced ? undefined : bounce}
                  transition={reduced ? undefined : bounceTransition(0)}
                >
                  <AppleMusicIcon className="h-4 w-4" />
                </motion.span>
              </div>
              <ShimmeringText text="Ondie is analyzing" className="text-body-sm" />
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-[28px] bg-white p-3 shadow-sm ring-1 ring-black/[0.06]"
            >
                <label htmlFor="ondie-input" className="sr-only">
                  Ask Ondie anything about your music
                </label>
                <input
                  id="ondie-input"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={placeholder}
                  className="w-full min-h-[44px] rounded-md bg-transparent px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label="Attach file" className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
                      <Paperclip className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Settings" className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
                      <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="flex h-11 items-center gap-1 rounded-full px-3 text-body-sm-medium text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
                      Pro <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Voice input" className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
                      <Mic className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button type="submit" aria-label="Send message" className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      <ArrowUp className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

const SpotifyIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
)

const AppleMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z" />
  </svg>
)
