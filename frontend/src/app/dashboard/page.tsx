'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LayoutDashboard, Wifi, LogIn, ArrowRight } from 'lucide-react';
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
 setStatus('Connected to backend API. Dashboard loaded from backend APIs.');
 } catch {
 setStatus('Sign in or use demo login to synchronize your reflection dashboard.');
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
 const isConnected = status.includes('Connected');

 return (
 <section className="space-y-8 animate-fade-in">
 {/* Header */}
 <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
 <div>
 <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-textPrimary border border-border">
 <LayoutDashboard size={13} />
 Reflection Dashboard
 </div>
 <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-textPrimary">
 Your reflection snapshot
 </h1>
 <p className="mt-2 text-sm text-muted leading-relaxed max-w-xl">
 Gentle progress tracking, common emotional vocabulary, and personalized wellness suggestions from your recent check-ins.
 {isConnected && (
 <span className="block mt-2 text-xs text-success font-semibold ">
 ✓ Dashboard loaded from backend APIs
 </span>
 )}
 </p>
 </div>

 {/* Dynamic Status Badge */}
 <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold border transition-colors select-none ${
 isConnected 
 ? 'bg-surface border-success/40 text-textPrimary' 
 : 'bg-surface border-border text-textPrimary'
 }`}>
 {isConnected ? (
 <>
 <span className="relative flex h-2 w-2">
 <span className=" absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
 </span>
 <span>Backend Connected</span>
 </>
 ) : (
 <>
 <Wifi size={14} className="text-muted " />
 <span>Offline / Guest Mode</span>
 </>
 )}
 </div>
 </div>

 <div className="animate-fade-in-up delay-100">
 <ProgressCards />
 </div>

 {/* Connection Actions if guest */}
 {!isConnected ? (
 <Card className="border border-sand bg-surface py-5 px-6 shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-4 animate-fade-in-up delay-100">
 <div className="space-y-1">
 <p className="font-bold text-textPrimary text-sm">Demo session not started</p>
 <p className="text-xs text-muted">{status}</p>
 </div>
 <Button onClick={() => void startDemoSession()} className="flex items-center gap-2 text-xs py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm">
 <LogIn size={14} />
 <span>Quick Demo Login</span>
 </Button>
 </Card>
 ) : null}

 <div className="grid gap-6 lg:grid-cols-[0.62fr_0.38fr] animate-fade-in-up delay-200">
 <Card title="Mood Over Time">
 <MoodChart data={chartData} />
 </Card>
 <InsightPanel />
 </div>

 <div className="grid gap-6 lg:grid-cols-[0.45fr_0.55fr] animate-fade-in-up delay-300">
 <Card title="Recommended Pacing">
 <p className="text-sm leading-relaxed text-textSecondary font-medium">
 &ldquo;{summary?.suggested_exercise ?? 'Try 4-7-8 breathing for two rounds before returning to your current work task.'}&rdquo;
 </p>
 <div className="mt-4 pt-3 border-t border-border grid gap-2 text-xs text-muted font-semibold select-none">
 <div className="flex justify-between border-b border-border pb-1">
 <span>Saved Journal Entries:</span>
 <span className="text-textPrimary font-bold">{summary?.journal_entries ?? 3}</span>
 </div>
 <div className="flex justify-between">
 <span>Mood Check-ins logged:</span>
 <span className="text-textPrimary font-bold">{summary?.mood_checkins ?? 5}</span>
 </div>
 </div>
 <div className="mt-4 flex flex-wrap gap-1.5">
 {emotions.map((tag) => (
 <span key={tag} className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-textPrimary">
 {tag}
 </span>
 ))}
 </div>
 </Card>

 <Card className="overflow-hidden p-0 border border-border">
 <div className="grid items-center gap-4 sm:grid-cols-[0.45fr_0.55fr]">
 <div className="relative h-56 bg-surface">
 <Image 
 alt="Bingo in an ocean wellness illustration" 
 className="object-cover transition-transform duration-500 hover:scale-105" 
 fill 
 sizes="(min-width: 1024px) 520px, 100vw" 
 src="/bingo/bingo-calm.png" 
 />
 </div>
 <div className="p-6 space-y-2">
 <h2 className="text-lg font-bold text-textPrimary">Today&apos;s reflection</h2>
 <p className="text-xs leading-relaxed text-muted">
 {summary?.today_reflection ?? 'Your saved check-ins help Bingo suggest slower pacing, fewer open loops, and one clear, calming next step.'}
 </p>
 </div>
 </div>
 </Card>
 </div>
 </section>
 );
}
