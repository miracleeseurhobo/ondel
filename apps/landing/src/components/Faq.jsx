import * as Accordion from '@radix-ui/react-accordion'

// Answers may be a single string or an array of paragraphs.
const FAQS = [
  {
    q: 'How is Ondel different from Spotify for Artists?',
    a: "Spotify tells you what happened. Ondel helps you understand what's happening and what could happen next—before you release.",
  },
  {
    q: 'Can Ondel predict if my song will succeed?',
    a: 'No one can guarantee a hit. But every release sends signals. Ondel helps you discover audiences, playlist opportunities, and momentum that may otherwise go unnoticed.',
  },
  {
    q: 'Do I need an existing audience?',
    a: 'No. Ondel is designed for independent artists at every stage, from first releases to growing catalogs.',
  },
  {
    q: 'What does Ondie actually do?',
    a: 'Ondie is your AI release manager. Ask questions about your music, audience, playlists, or release plans and get recommendations tailored to your goals.',
  },
  {
    q: 'Which platforms does Ondel connect to?',
    a: "We're starting with Spotify and Apple Music, with social and creator platforms coming soon.",
  },
  {
    q: 'Is this another analytics dashboard?',
    a: "No. We're building release intelligence, not more charts. Ondel turns signals into decisions and decisions into better releases.",
  },
  {
    q: 'Who is Ondel for?',
    a: 'Independent artists, managers, and labels who want to stop guessing and release with more confidence.',
  },
  {
    q: 'Why did you build Ondel?',
    a: [
      'Because too many artists release incredible music without knowing where it belongs or what opportunities are already forming around it.',
      'We believe every song leaves clues about its future. Ondel exists to help artists see them first.',
    ],
  },
]

export default function Faq() {
  return (
    <section className="bg-[#fafafa] px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="text-mono-sm uppercase tracking-[0.2em] text-neutral-400">
            FAQ
          </p>
          <h2 className="mt-3 text-section text-neutral-900">
            Frequently asked questions
          </h2>
        </div>

        <Accordion.Root
          type="single"
          collapsible
          className="border-t border-black/[0.08]"
        >
          {FAQS.map((item, i) => {
            const paragraphs = Array.isArray(item.a) ? item.a : [item.a]
            return (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="border-b border-black/[0.08]"
              >
                <Accordion.Header className="flex">
                  <Accordion.Trigger className="group flex flex-1 items-center justify-between gap-6 rounded-sm py-5 text-left transition-colors hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60">
                    <span className="text-body font-medium text-neutral-900">
                      {item.q}
                    </span>
                    {/* Plus/minus mark — the vertical bar rotates into the
                        horizontal one, morphing + into − on the panel's easing. */}
                    <span
                      className="relative h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-800"
                      aria-hidden="true"
                    >
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-90 motion-reduce:transition-none" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-content">
                  <div className="flex flex-col gap-4 pb-6 pr-8">
                    {paragraphs.map((p, j) => (
                      <p key={j} className="text-body text-neutral-500">
                        {p}
                      </p>
                    ))}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            )
          })}
        </Accordion.Root>
      </div>
    </section>
  )
}
