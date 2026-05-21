'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { MoodChart } from '@/components/dashboard/MoodChart';
import { ProgressCards } from '@/components/dashboard/ProgressCards';
import { Button } from '@/components/ui/Button';
import { getDashboardSummary, mockLogin } from '@/lib/api';
import type { DashboardSummary } from '@/types/dashboard';

const fallbackMoodData = [
  { day: 'Mon', mood: 'Stressed', score: 4 },
  { day: 'Tue', mood: 'Anxious', score: 5 },
  { day: 'Wed', mood: 'Calmer', score: 6 },
  { day: 'Thu', mood: 'Hopeful', score: 7 },
];

export default function Page() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [status, setStatus] = useState('Loading dashboard summary...');

  async function load() {
    try {
      setSummary(await getDashboardSummary());
      setStatus('Dashboard loaded from backend APIs.');
    } catch {
      setStatus('Sign in or use demo login to load your dashboard summary.');
    }
  }

  async function startDemoSession() {
    await mockLogin();
    await load();
  }

  useEffect(() => {
    void load();
  }, []);

  const chartData = summary?.mood_trend?.length ? summary.mood_trend : fallbackMoodData;
  const emotions = summary?.most_common_emotions?.length ? summary.most_common_emotions : ['anxious', 'stressed', 'hopeful'];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-calm">Dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-ocean">Your reflection snapshot</h1>
        <p className="mt-3 max-w-2xl text-slate-700">Dashboard data now comes from the FastAPI summary layer.</p>
      </div>
      <ProgressCards />
      <Card title="Backend status">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-700">{status}</p>
          {status.includes('Sign in') ? <Button onClick={() => void startDemoSession()} variant="secondary">Demo login</Button> : null}
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[0.62fr_0.38fr]">
        <Card title="Mood trend">
          <MoodChart data={chartData} />
        </Card>
        <InsightPanel />
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.45fr_0.55fr]">
        <Card title="Suggested exercise">
          <p className="leading-7">{summary?.suggested_exercise ?? 'Try 4-7-8 breathing for two rounds before returning to the task.'}</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <p>Journal entries: {summary?.journal_entries ?? 0}</p>
            <p>Mood check-ins: {summary?.mood_checkins ?? 0}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-ocean">
            {emotions.map((tag) => <span key={tag} className="rounded-full bg-mint/50 px-3 py-1">{tag}</span>)}
          </div>
        </Card>
        <Card className="overflow-hidden p-0">
          <div className="grid items-center gap-4 sm:grid-cols-[0.45fr_0.55fr]">
            <div className="relative h-56">
              <Image alt="Bingo in an ocean wellness illustration" className="object-cover" fill sizes="(min-width: 1024px) 520px, 100vw" src="/bingo/bingo-calm.png" />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-ocean">Today&apos;s reflection</h2>
              <p className="mt-2 leading-7 text-slate-700">{summary?.today_reflection ?? 'Your saved check-ins help Bingo suggest slower pacing, fewer open loops, and one clear next step.'}</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
