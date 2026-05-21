'use client';

import { Card } from '@/components/ui/Card';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { useJournal } from '@/hooks/useJournal';

const prompts = [
  'What happened today?',
  'What emotion was strongest?',
  'What thought kept repeating?',
  'What is one small step I can take?',
];

const tags = ['Anxious', 'Sad', 'Hopeful', 'Stressed', 'Calm', 'Proud', 'Tired'];

export default function Page() {
  const { entries, error, loading, removeEntry, saveEntry, startDemoSession } = useJournal();

  return (
    <section className="grid gap-6 lg:grid-cols-[0.66fr_0.34fr]">
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-calm">Journal</p>
          <h1 className="mt-2 text-4xl font-bold text-ocean">Make the thought visible</h1>
          <p className="mt-3 max-w-2xl text-slate-700">Use a prompt, tag the emotion, and choose one small step. Entries are stored only under the signed-in local MVP account.</p>
        </div>
        {error?.includes('log in') ? (
          <Card title="Sign in required">
            <p className="mb-4 text-sm text-slate-700">Journal entries are owner-scoped. Log in, create an account, or use demo login for local testing.</p>
            <button onClick={() => void startDemoSession()} className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white hover:bg-navy">
              Demo login
            </button>
          </Card>
        ) : null}
        <JournalEditor onSave={saveEntry} />
        {error ? <p className="rounded-lg bg-[#FFE8E8] p-3 text-sm text-[#7A2323]">{error}</p> : null}
        <Card title="Saved entries">
          {loading ? <p>Loading entries...</p> : null}
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id ?? entry.title} className="rounded-lg bg-foam p-4">
                <h2 className="font-semibold text-ocean">{entry.title}</h2>
                <p className="mt-1 text-sm leading-6">{entry.content}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.emotion_tags.map((tag) => <span key={tag} className="rounded-full bg-mint/40 px-2 py-1 text-xs text-ocean">{tag}</span>)}
                </div>
                {entry.id ? (
                  <button className="mt-3 text-xs font-semibold text-coral" onClick={() => void removeEntry(entry.id!)} type="button">
                    Delete entry
                  </button>
                ) : null}
              </div>
            ))}
            {!loading && entries.length === 0 ? <p>No saved entries yet. Your first entry will be stored under the demo user.</p> : null}
          </div>
        </Card>
      </div>
      <aside className="space-y-4">
        <Card title="Prompts">
          <div className="grid gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} className="rounded-lg bg-sand/70 px-3 py-3 text-left text-sm font-medium text-ocean hover:bg-sky/50">
                {prompt}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Emotion tags">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-mint/40 px-3 py-1 text-sm font-medium text-ocean">{tag}</span>
            ))}
          </div>
        </Card>
      </aside>
    </section>
  );
}
