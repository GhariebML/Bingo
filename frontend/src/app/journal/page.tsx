'use client';

import { Trash2, Sparkles, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { useJournal } from '@/hooks/useJournal';

const prompts = [
  'What went well today?',
  'What emotion was strongest?',
  'What thought kept repeating?',
  'What is one small step I can take?',
];

const tags = ['Anxious', 'Sad', 'Hopeful', 'Stressed', 'Calm', 'Proud', 'Tired'];

export default function Page() {
  const { entries, error, loading, removeEntry, saveEntry, startDemoSession } = useJournal();

  return (
    <section className="grid gap-8 lg:grid-cols-[0.68fr_0.32fr] animate-pulse-subtle">
      {/* Main Column */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky/75 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ocean border border-white/40">
            <BookOpen size={13} />
            Grounding Journal
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ocean">
            Make the thought visible
          </h1>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-500">
            Use a prompt, tag the emotion, and choose one small step. Entries are stored privately under your authenticated session.
          </p>
        </div>

        {error?.includes('log in') ? (
          <Card className="border border-coral/30 bg-coral/5 p-6 rounded-2xl" title="Sign in required">
            <p className="mt-2 mb-4 text-sm leading-relaxed text-slate-600">
              Journal entries are safely isolated per user. Log in, create an account, or use demo login for local testing.
            </p>
            <Button onClick={() => void startDemoSession()}>
              Demo login
            </Button>
          </Card>
        ) : null}

        <JournalEditor onSave={saveEntry} />

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-700 shadow-sm animate-pulse-subtle">
            ⚠️ {error}
          </p>
        ) : null}

        <Card title="Saved Reflections" className="shadow-sm">
          {loading ? (
            <div className="py-8 text-center text-sm font-medium text-calm animate-pulse">
              Loading saved entries...
            </div>
          ) : null}

          <div className="space-y-4">
            {entries.map((entry) => (
              <div 
                key={entry.id ?? entry.title} 
                className="relative group rounded-xl bg-gradient-to-r from-sky/10 to-foam p-5 border border-white/60 transition-all duration-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-ocean text-base">{entry.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{entry.content}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {entry.emotion_tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="rounded-full bg-mint/55 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ocean border border-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {entry.id ? (
                    <button 
                      className="text-slate-400 hover:text-coral transition-colors p-1.5 rounded-lg hover:bg-coral/5 shrink-0" 
                      onClick={() => void removeEntry(entry.id!)} 
                      title="Delete Entry"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            {!loading && entries.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 select-none">
                <Sparkles size={24} className="mx-auto mb-2 text-calm/50 animate-bounce" />
                No reflections saved yet. Your first entry will appear here.
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Sidebar Column */}
      <aside className="space-y-5">
        <Card title="Reflective Prompts" className="shadow-sm">
          <p className="text-xs text-slate-500 mb-4">Click a prompt to spark your focus for journaling:</p>
          <div className="grid gap-2">
            {prompts.map((prompt) => (
              <button 
                key={prompt} 
                className="rounded-xl border border-sky/30 bg-sky/5 px-4 py-3 text-left text-xs font-semibold text-ocean transition-all duration-300 hover:bg-sky/40 hover:-translate-y-0.5 active:translate-y-0 select-none"
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Emotion Lexicon" className="shadow-sm">
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">Name what you feel. Tagging emotions helps down-regulate stress centers in the brain.</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="rounded-full bg-mint/40 px-3 py-1.5 text-xs font-bold text-ocean border border-white/40 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </aside>
    </section>
  );
}
