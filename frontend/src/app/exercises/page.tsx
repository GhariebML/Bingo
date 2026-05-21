'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getExercises } from '@/lib/api';
import type { Exercise } from '@/types/exercises';

export default function Page() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [status, setStatus] = useState('Loading exercises from backend...');

  useEffect(() => {
    async function load() {
      try {
        setExercises(await getExercises());
        setStatus('Exercises loaded from backend APIs.');
      } catch {
        setStatus('Could not load exercises from the backend.');
      }
    }
    void load();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-calm">Exercises</p>
        <h1 className="mt-2 text-4xl font-bold text-ocean">Short practices for difficult moments</h1>
        <p className="mt-3 max-w-2xl text-slate-700">These are general wellness exercises, not clinical treatment plans.</p>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="grid items-center gap-4 md:grid-cols-[0.4fr_0.6fr]">
          <div className="relative h-56">
            <Image alt="Bingo in a calming underwater exercise scene" className="object-cover" fill sizes="(min-width: 1024px) 520px, 100vw" src="/bingo/bingo-ocean.png" />
          </div>
          <div className="p-5">
            <h2 className="text-xl font-semibold text-ocean">Start small, stay safe</h2>
            <p className="mt-2 leading-7 text-slate-700">{status}</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {exercises.map((exercise) => (
          <Card key={exercise.id} title={exercise.title}>
            <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-ocean">
              <span className="rounded-full bg-sky/70 px-3 py-1">{exercise.duration_minutes} min</span>
              <span className="rounded-full bg-mint/50 px-3 py-1">{exercise.purpose}</span>
            </div>
            <ol className="space-y-2">
              {(active === exercise.id ? exercise.steps : exercise.steps.slice(0, 2)).map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky text-xs font-bold text-ocean">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Button className="mt-4" onClick={() => setActive(active === exercise.id ? null : exercise.id)} variant="secondary">
              {active === exercise.id ? 'Collapse' : 'Start exercise'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
