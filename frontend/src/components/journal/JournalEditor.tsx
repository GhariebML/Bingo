'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
      className="space-y-4 rounded-lg border border-white bg-white/90 p-5 shadow-soft"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!title.trim() || !content.trim()) return;
        await onSave({ title, content, mood, emotion_tags: tags });
        setTitle('');
        setContent('');
      }}
    >
      <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-lg border border-sky px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-mint" placeholder="Entry title" />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-64 w-full rounded-lg border border-sky p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-mint"
        placeholder="Write privately. Start with what happened, what emotion was strongest, and one small step..."
      />
      <select value={mood} onChange={(event) => setMood(event.target.value)} className="w-full rounded-lg border border-sky px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-mint">
        {['calm', 'anxious', 'sad', 'stressed', 'hopeful', 'tired', 'grateful', 'confused'].map((option) => <option key={option}>{option}</option>)}
      </select>
      <div className="flex flex-wrap gap-2">
        {['calm', 'anxious', 'sad', 'stressed', 'hopeful', 'tired', 'grateful', 'confused'].map((tag) => (
          <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1 text-sm font-medium ${tags.includes(tag) ? 'bg-ocean text-white' : 'bg-mint/40 text-ocean'}`}>
            {tag}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save entry</Button>
      </div>
    </form>
  );
}
