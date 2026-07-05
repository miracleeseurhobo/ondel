import MagicText from './MagicText'

// Manifesto statement between Section 2 and the carousel — the chatbox vanishes
// into this, then the words resolve into focus.
export default function SignalStatement() {
  return (
    <section className="bg-[#fafafa] px-6 py-28 sm:py-36">
      <MagicText
        text="Every song leaves clues about its future—who it will resonate with, where it belongs, and the opportunities quietly taking shape around it. Ondel reveals those hidden signals so you can make better decisions before you release."
        className="mx-auto max-w-4xl text-center font-display leading-[1.3] tracking-tight text-neutral-900 text-[clamp(1.6rem,3vw,2.5rem)]"
      />
    </section>
  )
}
