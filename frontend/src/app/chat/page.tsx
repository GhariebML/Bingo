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
 <aside className="space-y-4">
 <Card className="overflow-hidden p-0">
 <div className="relative h-56">
 <Image alt="Bingo assistant avatar in an ocean scene" className="object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src="/bingo/bingo-avatar.png" />
 </div>
 <div className="p-5">
 <h2 className="font-semibold text-textPrimary">Bingo is listening</h2>
 <p className="mt-2 text-sm leading-6 text-textSecondary">The chat now sends messages to the local FastAPI backend and uses the safe mock provider.</p>
 </div>
 </Card>
 <Card title="Quick starts">
 <div className="grid gap-2">
 {quickStarts.map((prompt) => (
 <div key={prompt} className="rounded-lg border border-border bg-background px-3 py-3 text-left text-sm font-semibold text-textPrimary">
 {prompt}
 </div>
 ))}
 </div>
 </Card>
 <Card title="Safety note">
 <p className="text-sm leading-6">
 If you may hurt yourself, hurt someone else, or are in immediate danger, contact local emergency services now and reach a trusted person.
 </p>
 </Card>
 <Button variant="secondary">Save reflection</Button>
 </aside>
 </section>
 );
}
