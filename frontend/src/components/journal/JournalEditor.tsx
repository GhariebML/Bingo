'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CreateJournalEntry } from '@/types/journal';

export function JournalEditor({ onSave }: { onSave: (entry: CreateJournalEntry) => Promise<void> }) {
 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [mood, setMood] = useState('calm');
 const [tags, setTags] = useState<string[]>(['calm']);

 const toggleTag = (tag: string) => {
 setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
 };

 return (
 <form
 className="glass-card rounded-2xl p-6 shadow-soft space-y-5"
 onSubmit={async (event) => {
 event.preventDefault();
 if (!title.trim() || !content.trim()) return;
 await onSave({ title, content, mood, emotion_tags: tags });
 setTitle('');
 setContent('');
 }}
 >
 <div className="space-y-4">
 <Input 
 value={title} 
 onChange={(event) => setTitle(event.target.value)} 
 placeholder="Entry title" 
 required
 />
 
 <textarea
 value={content}
 onChange={(event) => setContent(event.target.value)}
 className="min-h-56 w-full rounded-xl border border-slate-200 bg-white/70 p-4 text-sm leading-relaxed placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-calm/10 resize-y"
 placeholder="Write privately here. What is on your mind? What emotion is strongest, and what is one small step you can take today?"
 required
 />
 
 <div className="grid gap-3 sm:grid-cols-2 items-center">
 <div className="space-y-1.5">
 <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Primary Mood</label>
 <select 
 value={mood} 
 onChange={(event) => setMood(event.target.value)} 
 className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-calm/10 cursor-pointer"
 >
 {['calm', 'anxious', 'sad', 'stressed', 'hopeful', 'tired', 'grateful', 'confused'].map((option) => (
 <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
 ))}
 </select>
 </div>
 
 <div className="space-y-1.5">
 <label className="text-[11px] font-bold uppercase tracking-wider text-muted">Select Emotion Tags</label>
 <div className="flex flex-wrap gap-1.5">
 {['calm', 'anxious', 'sad', 'stressed', 'hopeful', 'tired'].map((tag) => {
 const isSelected = tags.includes(tag);
 return (
 <button 
 key={tag} 
 type="button" 
 onClick={() => toggleTag(tag)} 
 className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 transform active:scale-95 border ${
 isSelected 
 ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm' 
 : 'bg-white/50 text-textPrimary border-slate-200 hover:bg-white'
 }`}
 >
 {tag}
 </button>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 
 <div className="flex justify-end pt-2 border-t border-border">
 <Button type="submit">Save Entry</Button>
 </div>
 </form>
 );
}
