'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FutureNote {
  id: string;
  text: string;
  date: string;
  mood: string;
}

const langCopy = {
  en: {
    title: '✉️ Message to Future Me',
    desc: 'Write down a happy memory or positive thought today. We will show it to you when your energy feels low.',
    inputPlaceholder: 'E.g. I aced my math exam today! Remember that you can achieve anything you set your mind to...',
    saveBtn: 'Save Message',
    countLabel: 'Saved Positive Memories',
    emptyMsg: 'No messages saved yet. Write one when you are in a happy mood!',
    reassureTitle: '💖 Note from Happy You',
    reassureDesc: 'You wrote this positive message to yourself on a better day:',
    dismissBtn: 'Thanks, I needed that',
    dateLabel: 'Saved on'
  },
  ar: {
    title: '✉️ رسالة إلى نفسي',
    desc: 'دوّن لحظة سعيدة أو فكرة إيجابية اليوم. سنعيدها إليك عندما تحتاج إلى بعض الإلهام والطمأنينة.',
    inputPlaceholder: 'مثال: اجتزت اختبار الرياضيات بنجاح اليوم! تذكر دائماً أنك قادر على تجاوز أي تحدٍ...',
    saveBtn: 'حفظ الذكرى',
    countLabel: 'الذكريات الإيجابية المحفوظة',
    emptyMsg: 'لا توجد ذكريات مدوّنة بعد. ابدأ بكتابة أولى أفكارك الإيجابية اليوم!',
    reassureTitle: '💖 تذكير من أيامك السعيدة',
    reassureDesc: 'رسالة إيجابية كتبتها لنفسك لتكون داعماً لك في أوقاتك الصعبة:',
    dismissBtn: 'شكراً، لقد شعرت بالتحسن',
    dateLabel: 'تاريخ التدوين'
  },
  eg: {
    title: '✉️ جواب لنفسي وقت الضيقة',
    desc: 'اكتب لحظة حلوة أو إنجاز فرحك النهاردة، عشان نفكرك بيه وقت ما تكون محتاج زقة وطاقة إيجابية.',
    inputPlaceholder: 'مثلاً: النهاردة كان يوم عظيم وقدرت أحل كويس! افتكر دايماً إنك بطل وتقدر تعدي أي حاجة...',
    saveBtn: 'شيل الذكرى دي',
    countLabel: 'الذكريات الحلوة اللي شايلها',
    emptyMsg: 'لسه ما كتبتش حاجة. جرب تكتب رسالة حلوة لنفسك دلوقتي!',
    reassureTitle: '💖 طبطبة من نفسك الرايقة',
    reassureDesc: 'جواب كتبته لنفسك في يوم جميل عشان يسندك النهاردة:',
    dismissBtn: 'شكراً، الرسالة دي فرقت معايا',
    dateLabel: 'اتكتبت يوم'
  }
};

interface FutureMeNotesProps {
  currentMood?: string;
}

export function FutureMeNotes({ currentMood = 'calm' }: FutureMeNotesProps) {
  const [lang, setLang] = useState('en');
  const [notes, setNotes] = useState<FutureNote[]>([]);
  const [inputText, setInputText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupNote, setPopupNote] = useState<FutureNote | null>(null);

  useEffect(() => {
    // Sync language
    const updateLang = () => {
      setLang(localStorage.getItem('bingo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('bingo_lang_changed', updateLang);

    // Sync saved notes
    const saved = localStorage.getItem('bingo_future_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }

    return () => window.removeEventListener('bingo_lang_changed', updateLang);
  }, []);

  // Monitor mood changes to trigger a positive note popup
  useEffect(() => {
    if ((currentMood === 'stressed' || currentMood === 'tired') && notes.length > 0) {
      const randomIndex = Math.floor(Math.random() * notes.length);
      setPopupNote(notes[randomIndex]);
      setShowPopup(true);
    }
  }, [currentMood, notes]);

  const handleSave = () => {
    if (!inputText.trim()) return;
    const newNote: FutureNote = {
      id: Date.now().toString(),
      text: inputText.trim(),
      date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG'),
      mood: currentMood
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('bingo_future_notes', JSON.stringify(updated));
    setInputText('');
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter(note => note.id !== id);
    setNotes(updated);
    localStorage.setItem('bingo_future_notes', JSON.stringify(updated));
  };

  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;

  return (
    <div className="space-y-6">
      {/* Reassurance Modal/Banner if triggered */}
      {showPopup && popupNote && (
        <Card className="p-5 border border-primary/20 bg-primary/5 dark:bg-primary/10 rounded-2xl animate-fade-in-up">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💖</span>
            <div className="flex-1">
              <h4 className="font-bold text-textPrimary text-sm md:text-base flex items-center gap-2">
                {copy.reassureTitle}
                <span className="text-xs text-textSecondary font-normal">
                  ({copy.dateLabel}: {popupNote.date})
                </span>
              </h4>
              <p className="text-xs text-textSecondary mt-0.5">{copy.reassureDesc}</p>
              <div className="mt-3 p-4 bg-surface rounded-xl border border-border italic text-textPrimary text-sm font-medium shadow-sm leading-relaxed">
                "{popupNote.text}"
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="primary" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => setShowPopup(false)}>
                  {copy.dismissBtn}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main card */}
      <Card className="p-6 bg-surface">
        <h3 className="text-base font-bold text-textPrimary flex items-center gap-2">
          {copy.title}
        </h3>
        <p className="text-xs text-textSecondary mt-1 leading-relaxed">
          {copy.desc}
        </p>

        <div className="mt-4 space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={copy.inputPlaceholder}
            className="w-full min-h-[80px] text-xs md:text-sm p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-textPrimary placeholder:text-muted transition resize-none"
          />
          <div className="flex justify-end">
            <Button variant="primary" className="px-3.5 py-1.5 text-xs font-semibold" onClick={handleSave} disabled={!inputText.trim()}>
              {copy.saveBtn}
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              {copy.countLabel} ({notes.length})
            </span>
          </div>

          {notes.length === 0 ? (
            <p className="text-xs text-muted text-center py-4">{copy.emptyMsg}</p>
          ) : (
            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2.5">
              {notes.map((note) => (
                <div key={note.id} className="p-3 rounded-xl bg-background border border-border flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-textPrimary leading-relaxed font-medium">"{note.text}"</p>
                    <span className="text-[10px] text-textSecondary block">
                      {copy.dateLabel}: {note.date}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-muted hover:text-error transition p-1"
                    title="Delete Note"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
