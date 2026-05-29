'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  disabled?: boolean;
  onSend: (message: string) => void;
}

const copyData = {
  en: {
    placeholder: "Share what is on your mind...",
    send: "Send",
    sending: "Sending...",
    hesitationPrompt: "Finding it hard to put into words? Feel free to type just one word, and we can start from there.",
    privacyBadge: "Privacy First: We analyze typing patterns locally only to offer support. Your drafts are never sent or saved.",
  },
  ar: {
    placeholder: "شاركنا ما تشعر به الآن...",
    send: "إرسال",
    sending: "جاري الإرسال...",
    hesitationPrompt: "قد يكون من الصعب إيجاد الكلمات المناسبة. ابدأ بكلمة واحدة فقط، وسنكمل معاً.",
    privacyBadge: "الخصوصية والأمان: نقوم بمعالجة أنماط الكتابة محلياً على جهازك لتقديم الدعم الأمثل. خصوصيتك تامة ولا يتم حفظ مسوداتك إطلاقاً.",
  },
  eg: {
    placeholder: "فضفض وقول اللي جواك...",
    send: "إرسال",
    sending: "بيتبعت...",
    hesitationPrompt: "الكلام تقيل ومش عارف تبدأ منين؟ اكتب كلمة واحدة بس وهتلاقينا معاك خطوة بخطوة.",
    privacyBadge: "سرية تامة: إحنا بنفهم بس طريقة كتابتك على جهازك عشان نساعدك أحسن، مسوداتك كلها في أمان ومش بتتسجل.",
  }
};

export function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [lang, setLang] = useState('en');
  
  // Hesitation states
  const [backspaces, setBackspaces] = useState(0);
  const [typingStart, setTypingStart] = useState<number | null>(null);
  const [lastTypeTime, setLastTypeTime] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const prevValueLength = useRef(0);

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem('Bingoo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('Bingoo_lang_changed', updateLang);
    return () => window.removeEventListener('Bingoo_lang_changed', updateLang);
  }, []);

  // Monitor typing patterns
  useEffect(() => {
    if (!value.trim()) {
      // Reset if empty
      setBackspaces(0);
      setTypingStart(null);
      setLastTypeTime(null);
      setShowPrompt(false);
      prevValueLength.current = 0;
      return;
    }

    const timer = setInterval(() => {
      if (lastTypeTime && typingStart) {
        const now = Date.now();
        const inactiveTime = now - lastTypeTime;
        const totalDuration = now - typingStart;

        // Triggers: 7s pause OR 20s typing duration OR 7+ deletions
        if (inactiveTime > 7000 || totalDuration > 20000 || backspaces > 6) {
          setShowPrompt(true);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [value, lastTypeTime, typingStart, backspaces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const now = Date.now();

    // Check if character was deleted
    if (newValue.length < prevValueLength.current) {
      setBackspaces((prev) => prev + 1);
    }

    if (!typingStart) {
      setTypingStart(now);
    }
    setLastTypeTime(now);
    prevValueLength.current = newValue.length;
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    onSend(value);
    
    // Reset all tracking
    setValue('');
    setBackspaces(0);
    setTypingStart(null);
    setLastTypeTime(null);
    setShowPrompt(false);
    prevValueLength.current = 0;
  };

  const copy = copyData[lang as keyof typeof copyData] || copyData.en;

  return (
    <div className="w-full space-y-2">
      {/* Hesitation Sub-prompt with Privacy Tip */}
      {showPrompt && (
        <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/15 animate-fade-in-up flex flex-col gap-1.5 text-xs">
          <p className="text-textPrimary font-medium leading-relaxed">
            💡 {copy.hesitationPrompt}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-textSecondary border-t border-border/40 pt-1.5">
            <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{copy.privacyBadge}</span>
          </div>
        </div>
      )}

      <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <input
          value={value}
          onChange={handleInputChange}
          className="min-h-12 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-textPrimary placeholder:text-muted outline-none focus:ring-1 focus:ring-primary shadow-sm"
          disabled={disabled}
          placeholder={copy.placeholder}
        />
        <Button disabled={disabled || !value.trim()} type="submit">
          {disabled ? copy.sending : copy.send}
        </Button>
      </form>
    </div>
  );
}
