import Reveal from './Reveal'

// Deterministic bar heights (no Math.random — keeps SSR/reloads stable).
const BARS = [46, 62, 38, 71, 54, 83, 49, 66, 92, 58, 74, 44]

// Dashboard-width placeholder: a framed window with a monochrome skeleton that
// reads as a real product shot. Swap the body for a screenshot when ready.
function DashboardMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.08] shadow-[0_40px_100px_-50px_rgba(15,15,25,0.35)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="ml-3 text-mono-sm text-neutral-400">ondel · creator plan</span>
      </div>

      {/* body skeleton — decorative placeholder */}
      <div className="flex gap-4 p-4 sm:gap-6 sm:p-6" aria-hidden="true">
        {/* sidebar */}
        <div className="hidden w-40 shrink-0 flex-col gap-3 sm:flex">
          <div className="h-8 w-full rounded-lg bg-neutral-100" />
          {[80, 65, 90, 70, 60].map((w, i) => (
            <div key={i} className="h-4 rounded bg-neutral-100" style={{ width: `${w}%` }} />
          ))}
          <div className="mt-auto h-16 w-full rounded-lg bg-neutral-100" />
        </div>

        {/* main */}
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          {/* stat cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3 ring-1 ring-black/[0.04] sm:p-4"
              >
                <div className="h-3 w-1/2 rounded bg-neutral-200" />
                <div className="h-5 w-2/3 rounded bg-neutral-200" />
              </div>
            ))}
          </div>

          {/* chart card */}
          <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-black/[0.04]">
            <div className="mb-4 h-3 w-1/4 rounded bg-neutral-200" />
            <div className="flex h-28 items-end gap-1.5 sm:h-36 sm:gap-2">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-[#96d9ff]/25 to-[#96d9ff]/55"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatorPlan() {
  return (
    <section className="bg-[#fafafa] px-5 py-24 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <div className="mb-12 max-w-3xl text-center sm:mb-16">
          <Reveal as="h2" className="text-display text-neutral-900">
            Turn one song into weeks of content.
          </Reveal>
          <div className="mt-6 flex flex-col gap-4">
            <Reveal as="p" className="text-body text-neutral-500">
              Every release has stories waiting to be told—moments in the lyrics,
              hooks people replay, and emotions fans want to share.
            </Reveal>
            <Reveal as="p" className="text-body text-neutral-500">
              Ondel turns those signals into a personalized creator plan, helping
              you know what to post, when to post it, and why it matters.
            </Reveal>
          </div>
        </div>

        <Reveal className="w-full">
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  )
}
