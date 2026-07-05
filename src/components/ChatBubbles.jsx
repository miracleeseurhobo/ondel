import { memo } from 'react'
import { AudioLines } from 'lucide-react'
import Reveal from './Reveal'

function UserBubble({ children, delay = 0 }) {
  return (
    <Reveal delay={delay} className="self-end max-w-[85%]">
      <div className="rounded-3xl rounded-tr-lg bg-[#eaf1fe] px-5 py-3.5">
        <p className="text-body text-neutral-800">{children}</p>
      </div>
    </Reveal>
  )
}

function OndieBubble({ children, delay = 0 }) {
  return (
    <Reveal delay={delay} className="max-w-[90%]">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          <AudioLines className="h-4 w-4 text-indigo-500" />
        </span>
        <span className="text-body-sm-medium text-neutral-800">Ondie</span>
      </div>
      <div className="rounded-3xl rounded-tl-lg bg-white px-5 py-3.5 shadow-sm ring-1 ring-black/5">
        <p className="text-body text-neutral-700">{children}</p>
      </div>
    </Reveal>
  )
}

function ChatBubbles() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4 text-left">
      <UserBubble>What should I release next?</UserBubble>
      <OndieBubble delay={120}>
        An upbeat indie-pop single fits your growing audience. Aim for the next 3 weeks—release competition is low.
      </OndieBubble>
      <UserBubble delay={240}>Which playlists should I pitch?</UserBubble>
      <OndieBubble delay={360}>
        14 editorial and indie playlists match your sound. I can draft the pitches for you.
      </OndieBubble>
    </div>
  )
}

// Memoized so it doesn't reconcile on every scroll-driven parent re-render.
export default memo(ChatBubbles)
