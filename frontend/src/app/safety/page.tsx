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
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-calm font-outfit">Support & Boundaries</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-ocean sm:text-5xl font-outfit">
          Clear boundaries keep Bingo supportive
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          {disclaimer?.message ?? 'Bingo can help with reflection, journaling, grounding, and gentle next steps. It is not a therapist, doctor, emergency responder, or crisis line.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-t-4 border-t-coral" title="Crisis guidance">
          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-xl border border-coral/30 bg-coral/5 p-5 text-slate-800 transition-all duration-300 hover:border-coral/50 shadow-sm">
              <div className="rounded-lg bg-coral/10 p-2.5 text-coral shrink-0">
                <AlertTriangle className="animate-pulse-subtle" size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-coral text-base font-outfit">Immediate Help Needed?</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  {disclaimer?.crisis_guidance ?? 'If you might hurt yourself, hurt someone else, are being abused, or are in immediate danger, contact local emergency services now and reach a trusted person who can stay with you.'}
                </p>
              </div>
            </div>
            
            {resources ? (
              <div className="rounded-xl border border-sky/40 bg-white/40 p-4 transition-all duration-300 hover:bg-white/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-calm mb-2 font-outfit">Your Regional Resources</h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">Region:</span>{' '}
                    <span className="inline-flex items-center rounded-full bg-sky px-2.5 py-0.5 text-xs font-semibold text-ocean">
                      {resources.region ?? 'Global'}
                    </span>
                  </div>
                  <div className="text-ocean font-semibold font-outfit flex items-center gap-1.5 bg-sky/50 px-3 py-1.5 rounded-lg border border-sky/30">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {resources.crisis_line ?? resources.emergency ?? resources.note}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                Loading regional crisis contact numbers...
              </div>
            )}
          </div>
        </Card>

        <Card className="border-t-4 border-t-calm" title="Bingo will not provide">
          <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
            {notFor.map((item) => (
              <li key={item} className="flex items-center gap-3.5 bg-white/40 border border-white/50 rounded-xl px-4 py-3 shadow-sm hover:bg-white/70 transition-all duration-200">
                <div className="rounded-full bg-calm/10 p-1.5 text-calm shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700 capitalize tracking-tight font-outfit">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="overflow-hidden p-0 border-none shadow-soft">
        <div className="grid items-stretch md:grid-cols-[0.4fr_0.6fr]">
          <div className="relative min-h-[240px] md:min-h-full bg-ocean/10">
            <Image 
              alt="Bingo in a serious but supportive ocean scene" 
              className="object-cover transition-transform duration-500 hover:scale-105" 
              fill 
              priority 
              sizes="(min-width: 1024px) 520px, 100vw" 
              src="/bingo/bingo-support.png" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/50 via-transparent to-transparent"></div>
          </div>
          <div className="grid gap-6 p-6 md:p-8 sm:grid-cols-2 bg-white/50 backdrop-blur-md">
            <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-slate-100 pb-6 sm:pb-0 sm:pr-6">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky text-ocean mb-2 font-bold font-outfit">✓</div>
              <h2 className="text-lg font-bold text-ocean font-outfit font-semibold">What Bingo can help with</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Compassionate reflection, structured journaling, science-backed grounding exercises, clarifying questions, and finding one small positive next step.
              </p>
            </div>
            <div className="space-y-2 pt-2 sm:pt-0 sm:pl-2">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-coral/10 text-coral mb-2 font-bold font-outfit">!</div>
              <h2 className="text-lg font-bold text-ocean font-outfit font-semibold">When to seek professional care</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                If your distress feels overwhelming, continuous, disrupts your daily life, or if you feel unsafe. Please connect with a licensed local therapist or medical professional.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
