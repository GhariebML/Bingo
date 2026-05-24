'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createMoodCheckIn } from '@/lib/api';

const moods = [
  { label: 'calm', emoji: '😌', text: 'Calm' },
  { label: 'anxious', emoji: '😰', text: 'Anxious' },
  { label: 'sad', emoji: '😢', text: 'Sad' },
  { label: 'stressed', emoji: '🤯', text: 'Stressed' },
  { label: 'hopeful', emoji: '✨', text: 'Hopeful' },
  { label: 'tired', emoji: '🥱', text: 'Tired' },
];

export function MoodCheckIn({ onSuccess }: { onSuccess: () => void }) {
  const [selectedMood, setSelectedMood] = useState<string>('calm');
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createMoodCheckIn({
        label: selectedMood,
        intensity: intensity,
        note: note.trim() || undefined,
      });
      setNote('');
      onSuccess();
    } catch {
      setError('Please log in or use quick demo login to save check-ins.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 shadow-soft space-y-4">
      <div>
        <h3 className="font-bold text-textPrimary text-base font-heading">How are you feeling right now?</h3>
        <p className="text-xs text-muted leading-relaxed">Name what you feel. Tracking over time helps reveal gentle trends.</p>
      </div>

      {/* Mood Selector Grid */}
      <div className="grid grid-cols-3 gap-2">
        {moods.map((m) => {
          const isSelected = selectedMood === m.label;
          const isWiggle = m.label === 'calm' || m.label === 'hopeful' || m.label === 'tired';
          const animClass = isWiggle ? 'group-hover:animate-emoji-wiggle' : 'group-hover:animate-emoji-bounce';
          
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => setSelectedMood(m.label)}
              className={`group flex flex-col items-center gap-1 rounded-xl border p-2.5 transition-all duration-300 transform active:scale-95 ${
                isSelected
                  ? 'border-primary bg-surface/50 text-textPrimary shadow-sm ring-2 ring-primary/5 scale-[1.02]'
                  : 'border-border bg-surface/30 text-textSecondary hover:bg-surface/50'
              }`}
            >
              <span className={`text-xl select-none transition-transform inline-block ${isSelected ? 'animate-emoji-bounce' : animClass}`}>
                {m.emoji}
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase">{m.text}</span>
            </button>
          );
        })}
      </div>

      {/* Intensity Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
          <label htmlFor="intensity-slider">Intensity</label>
          <span className="text-textPrimary font-extrabold font-heading text-sm">{intensity} / 10</span>
        </div>
        <input
          id="intensity-slider"
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[9px] text-muted font-bold select-none uppercase tracking-wide">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Intense</span>
        </div>
      </div>

      {/* Note input */}
      <div className="space-y-1">
        <label htmlFor="checkin-note" className="block text-xs font-bold uppercase tracking-wider text-muted">
          Add a quick reflection (Optional)
        </label>
        <input
          id="checkin-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Took a walk, felt better"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          ⚠️ {error}
        </p>
      )}

      <div className="flex justify-end pt-1">
        <Button disabled={loading} type="submit" className="text-xs px-5 py-2">
          {loading ? 'Logging...' : 'Log Mood'}
        </Button>
      </div>
    </form>
  );
}
