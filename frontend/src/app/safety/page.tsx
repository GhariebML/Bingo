'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getSafetyDisclaimer, getSafetyResources } from '@/lib/api';
import type { SafetyDisclaimer, SafetyResources } from '@/types/safety';

export default function Page() {
  const [disclaimer, setDisclaimer] = useState<SafetyDisclaimer | null>(null);
  const [resources, setResources] = useState<SafetyResources | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [loadedDisclaimer, loadedResources] = await Promise.all([
          getSafetyDisclaimer(),
          getSafetyResources('Global'),
        ]);
        setDisclaimer(loadedDisclaimer);
        setResources(loadedResources);
      } catch {
        setDisclaimer(null);
      }
    }
    void load();
  }, []);

  const notFor = disclaimer?.not_for ?? ['diagnosis', 'medication advice', 'therapy replacement', 'emergency response'];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-calm">Safety</p>
        <h1 className="mt-2 text-4xl font-bold text-ocean">Clear boundaries keep Bingo supportive</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          {disclaimer?.message ?? 'Bingo can help with reflection, journaling, grounding, and gentle next steps. It is not a therapist, doctor, emergency responder, or crisis line.'}
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Crisis guidance">
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-coral/10 p-4 text-slate-800">
              <AlertTriangle className="mt-1 text-coral" size={22} />
              <p>{disclaimer?.crisis_guidance ?? 'If you might hurt yourself, hurt someone else, are being abused, or are in immediate danger, contact local emergency services now and reach a trusted person who can stay with you.'}</p>
            </div>
            {resources ? <p className="text-sm text-slate-700">Resource region: {resources.region ?? 'Global'} · {resources.crisis_line ?? resources.emergency ?? resources.note}</p> : null}
          </div>
        </Card>
        <Card title="Bingo will not">
          <ul className="space-y-3">
            {notFor.map((item) => (
              <li key={item} className="flex gap-3"><ShieldCheck className="text-calm" size={18} />{item}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="grid items-center gap-4 md:grid-cols-[0.35fr_0.65fr]">
          <div className="relative h-52">
            <Image alt="Bingo in a serious but supportive ocean scene" className="object-cover" fill priority sizes="(min-width: 1024px) 520px, 100vw" src="/bingo/bingo-support.png" />
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <h2 className="font-semibold text-ocean">What Bingo can help with</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">Reflection, journaling, grounding, gentle questions, and one small next step.</p>
            </div>
            <div>
              <h2 className="font-semibold text-ocean">When to seek professional help</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">If symptoms feel persistent, intense, unsafe, or disruptive, contact a qualified professional or local emergency service.</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
