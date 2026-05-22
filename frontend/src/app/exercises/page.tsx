'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Compass, Sparkles, Clock, Target } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getExercises } from '@/lib/api';
import type { Exercise } from '@/types/exercises';

export default function Page() {
 const [exercises, setExercises] = useState<Exercise[]>([]);
 const [active, setActive] = useState<string | null>(null);
 const [status, setStatus] = useState('Loading grounding practices...');

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
 <section className="space-y-8 ">
 {/* Header */}
 <div>
 <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-textPrimary border border-border">
 <Compass size={13} />
 Wellness Practices
 </div>
 <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-textPrimary">
 Short practices for difficult moments
 </h1>
 <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted">
 Gentle, non-clinical exercises designed to bring you back to the present moment when feeling overwhelmed or stressed.
 </p>
 </div>

 {/* Hero Banner */}
 <Card className="overflow-hidden p-0 border border-border shadow-soft">
 <div className="grid items-center gap-6 md:grid-cols-[0.4fr_0.6fr]">
 <div className="relative h-56 bg-surface">
 <Image 
 alt="Bingo in a calming underwater exercise scene" 
 className="object-cover transition-transform duration-500 hover:scale-105" 
 fill 
 sizes="(min-width: 1024px) 520px, 100vw" 
 src="/bingo/bingo-ocean.png" 
 />
 </div>
 <div className="p-6 space-y-2 select-none">
 <div className="flex items-center gap-2 text-muted font-bold text-sm uppercase tracking-wider">
 <Sparkles size={14} className="" />
 <span>Start small, stay safe</span>
 </div>
 <p className="text-sm leading-relaxed text-textSecondary">
 Taking just two minutes to focus on your breathing or look around the room can noticeably reset your nervous system.
 </p>
 <p className="text-[11px] font-bold text-slate-400">Status: {status}</p>
 </div>
 </div>
 </Card>

 {/* Grid List */}
 <div className="grid gap-6 md:grid-cols-2">
 {exercises.map((exercise) => {
 const isActive = active === exercise.id;
 return (
 <Card 
 key={exercise.id} 
 title={exercise.title}
 className={`flex flex-col justify-between transition-all duration-500 ${
 isActive ? 'ring-2 ring-calm/10 border-primary/20 scale-[1.01]' : ''
 }`}
 >
 <div className="space-y-4">
 {/* Meta Tags */}
 <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-wider select-none">
 <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-textPrimary border border-border">
 <Clock size={11} />
 {exercise.duration_minutes} Min
 </span>
 <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-textPrimary border border-border">
 <Target size={11} />
 {exercise.purpose}
 </span>
 </div>
 
 {/* Steps List */}
 <ol className="space-y-3.5">
 {(isActive ? exercise.steps : exercise.steps.slice(0, 2)).map((step, index) => (
 <li key={step} className="flex gap-3 text-sm leading-relaxed text-textSecondary transition-opacity duration-300">
 <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-mint/40 text-xs font-bold text-textPrimary border border-border shadow-sm select-none">
 {index + 1}
 </span>
 <span className="pt-0.5">{step}</span>
 </li>
 ))}
 {!isActive && exercise.steps.length > 2 ? (
 <li className="text-xs text-slate-400 font-semibold italic pl-9">
 + {exercise.steps.length - 2} more steps...
 </li>
 ) : null}
 </ol>
 </div>

 {/* Action Button */}
 <div className="mt-6 pt-4 border-t border-border flex justify-end">
 <Button 
 onClick={() => setActive(isActive ? null : exercise.id)} 
 variant="secondary"
 className="text-xs px-4 py-2"
 >
 {isActive ? 'Minimize Exercise' : 'Start Practice'}
 </Button>
 </div>
 </Card>
 );
 })}
 </div>
 </section>
 );
}
