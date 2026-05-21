import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const steps = [
  { title: 'Set your intention', body: 'Choose what you need today: calm, clarity, reflection, or a small next step.' },
  { title: 'Talk with Bingo', body: 'Use supportive mock chat responses that validate, reflect, ask, and suggest one action.' },
  { title: 'Track patterns', body: 'Capture moods and journal notes so future product work can reveal gentle trends.' },
];

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-sky/70 px-4 py-2 text-sm font-semibold text-ocean">
            AI mental wellness companion
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-bold leading-tight text-ocean">
              Meet Bingo, a calm place to pause, reflect, and take one safe next step.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              Bingo offers warm emotional support, journaling prompts, mood reflection, and guided exercises. It is not a therapist, doctor, or emergency service.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/chat"><Button>Start chat</Button></Link>
            <Link href="/safety"><Button variant="ghost">Read safety boundaries</Button></Link>
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="relative h-72 w-full">
            <Image alt="Bingo floating in a calm ocean scene" className="object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src="/bingo/bingo-hero.png" />
          </div>
          <div className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-ocean">Welcome from Bingo</h2>
            <p className="text-lg leading-8">
              Hi, I am Bingo. I can sit with you for a moment, help name what feels heavy, and suggest one gentle step. You do not have to solve everything at once.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Chat', MessageCircle],
                ['Journal', BookOpen],
                ['Safety first', ShieldCheck],
                ['Small steps', Sparkles],
              ].map(([label, Icon]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-lg bg-sand/60 p-3 text-sm font-semibold text-ocean">
                  <Icon size={18} />
                  {label as string}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title} title={`${index + 1}. ${step.title}`}>
            <p>{step.body}</p>
          </Card>
        ))}
      </div>
      <Link className="inline-flex items-center gap-2 font-semibold text-ocean" href="/dashboard">
        View the MVP dashboard <ArrowRight size={18} />
      </Link>
    </section>
  );
}
