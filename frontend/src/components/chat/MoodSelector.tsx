'use client';

import { useState } from 'react';

const moods = [
 { label: 'Calm', emoji: '😌', bg: 'hover:bg-surface' },
 { label: 'Anxious', emoji: '😰', bg: 'hover:bg-error/20' },
 { label: 'Sad', emoji: '😢', bg: 'hover:bg-blue-50' },
 { label: 'Stressed', emoji: '🤯', bg: 'hover:bg-orange-50' },
 { label: 'Hopeful', emoji: '✨', bg: 'hover:bg-surface' },
 { label: 'Tired', emoji: '🥱', bg: 'hover:bg-surface' },
];

export function MoodSelector() {
 const [selected, setSelected] = useState<string | null>(null);

 return (
 <div className="space-y-2 select-none">
 <p className="text-[11px] font-bold uppercase tracking-wider text-muted">How are you feeling right now?</p>
 <div className="flex flex-wrap gap-2">
 {moods.map(({ label, emoji, bg }) => {
 const isSelected = selected === label;
 return (
 <button
 onClick={() => setSelected(isSelected ? null : label)}
 className={`flex items-center gap-2 rounded-full border px-4.5 py-2 text-xs font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm ${
 isSelected
 ? 'border-primary bg-surface text-textPrimary scale-[1.03] shadow-sm ring-2 ring-calm/10'
 : `border-slate-200 bg-white/60 backdrop-blur text-textPrimary/85 ${bg}`
 }`}
 key={label}
 type="button"
 >
 <span className="text-sm">{emoji}</span>
 <span>{label}</span>
 </button>
 );
 })}
 </div>
 </div>
 );
}
