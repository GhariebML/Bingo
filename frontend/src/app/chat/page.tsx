import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { SafetyBanner } from '@/components/chat/SafetyBanner';

const quickStarts = [
 'I feel anxious',
 'I am overthinking',
 'I had a bad day',
 'I need motivation',
 'Help me calm down',
 'I need to make a difficult decision',
];

export default function Page() {
 return (
 <section className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
 <div className="space-y-5">
 <div>
 <p className="text-sm font-semibold uppercase tracking-wide text-muted">Bingo chat</p>
 <h1 className="mt-2 text-4xl font-bold text-textPrimary">A gentle place to start</h1>
 <p className="mt-3 max-w-2xl text-textSecondary">
 Bingo uses mock AI responses for now. It can support reflection and calming steps, but it cannot diagnose, treat, prescribe, or replace emergency help.
 </p>
 </div>
 <SafetyBanner />
 <Card>
 <ChatWindow quickPrompts={quickStarts} />
 </Card>
 </div>
  <aside className="hidden lg:block space-y-4">
    <Card className="overflow-hidden p-0">
      <div className="relative h-56">
        <Image alt="Bingo assistant avatar in an ocean scene" className="object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src="/bingo/bingo-avatar.png" />
      </div>
      <div className="p-5">
        <h2 className="font-semibold text-textPrimary">Bingo is listening</h2>
        <p className="mt-2 text-sm leading-6 text-textSecondary">The chat now sends messages to the local FastAPI backend and uses the safe mock provider.</p>
      </div>
    </Card>
    <Card title="Reflection tips">
      <ul className="space-y-3 text-xs leading-relaxed text-textSecondary">
        <li className="flex gap-2">
          <span className="text-primary font-bold">😌</span>
          <span>Take a slow breath before typing to settle your thoughts.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold">🏷️</span>
          <span>Name the specific emotions you feel to down-regulate stress.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold">🎯</span>
          <span>Focus on one small, safe next action you can take right now.</span>
        </li>
      </ul>
    </Card>
    <Card title="Safety note">
      <p className="text-sm leading-6">
        If you may hurt yourself, hurt someone else, or are in immediate danger, contact local emergency services now and reach a trusted person.
      </p>
    </Card>
  </aside>
 </section>
 );
}
