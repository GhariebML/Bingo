'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Message {
  text: string;
}

const messagesDatabase = {
  calm: [
    { text: 'Take a deep breath. You do not have to figure everything out today.' },
    { text: 'It is okay to slow down and rest. Your worth is not defined by constant achievements.' },
    { text: 'One step, one moment, one breath at a time. You are doing enough.' },
    { text: 'Give yourself credit for how far you have come. Rest is productive too.' }
  ],
  funny: [
    { text: 'Remember: even a broken clock is right twice a day. You are already doing way better than that!' },
    { text: 'If you feel overwhelmed, remember dinosaurs did not do homework, and look where they ended up... Wait, bad example, but you get the point!' },
    { text: 'Smile! It confuses your brain into thinking you have everything 100% under control.' },
    { text: 'Drink some water. You cannot solve the world\'s problems while looking like a dehydrated raisin.' }
  ],
  motivational: [
    { text: 'Your effort matters, even on the days it feels small or invisible.' },
    { text: 'Every challenge you face is just a setup for your future growth. Keep showing up.' },
    { text: 'You are stronger, more resilient, and more capable than you give yourself credit for.' },
    { text: 'Keep going. The effort you put in today builds the strength you will have tomorrow.' }
  ],
  inspirational: [
    { text: 'Peace lies within you, not in the noise of outer expectations.' },
    { text: 'Every new dawn brings another chance to reflect, heal, and start fresh.' },
    { text: 'Trust the process of your growth. Beautiful things take time to bloom.' },
    { text: 'Your presence in this world matters. Be kind to yourself as you navigate it.' }
  ],
  egyptian: [
    { text: 'خد نفس بالراحة كده.. أنت مش محتاج تسبق الزمن، كل حاجة هتمشي في وقتها.' },
    { text: 'مجهودك بيفرق حتى في الأيام اللي بتحس فيها إنك مش قادر، فخورين بيك.' },
    { text: 'مشاعرك ليها حق عليك، عبر عنها وماتكتمهاش جوّاك، الفضفضة دايماً بتريح القلب.' },
    { text: 'عادي جداً تغلط أو تقع شوية، المهم إنك دايماً بتعرف تقف على رجلك تاني وتكمل.' },
    { text: 'اليوم الصعب مسيره يعدي ويبقى ذكرى، بكرة يوم جديد وبداية ألطف إن شاء الله.' }
  ]
};

const langCopy = {
  en: {
    cardTitle: '✨ Daily Spark',
    styleLabel: 'Message Style:',
    nextBtn: 'Next Message',
    styles: {
      calm: 'Calm',
      funny: 'Funny',
      motivational: 'Motivational',
      inspirational: 'Inspirational',
      egyptian: 'Egyptian Arabic Dialect'
    }
  },
  ar: {
    cardTitle: '✨ إشراقة يومية',
    styleLabel: 'طابع الرسائل:',
    nextBtn: 'الرسالة التالية',
    styles: {
      calm: 'سكينة وهدوء',
      funny: 'مرح ولطافة',
      motivational: 'تحفيز وقوة',
      inspirational: 'إلهام وتأمل',
      egyptian: 'لهجة مصرية قريبة للقلب'
    }
  },
  eg: {
    cardTitle: '✨ جرعة طاقة ليك',
    styleLabel: 'طريقة الكلام:',
    nextBtn: 'هات رسالة كمان',
    styles: {
      calm: 'رايق وهادي',
      funny: 'فرفوش وبيضحك',
      motivational: 'بيشجع وبيدي زقة',
      inspirational: 'كلام بيطمن القلب',
      egyptian: 'كلامنا البلدي الجميل'
    }
  }
};

export function PositiveMessages() {
  const [lang, setLang] = useState('en');
  const [msgStyle, setMsgStyle] = useState<'calm' | 'funny' | 'motivational' | 'inspirational' | 'egyptian'>('calm');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Sync language
    const updateLang = () => {
      const currentLang = localStorage.getItem('Bingoo_lang') || 'en';
      setLang(currentLang);
      // Default style based on language
      if (currentLang === 'eg') {
        setMsgStyle('egyptian');
      }
    };
    updateLang();
    window.addEventListener('Bingoo_lang_changed', updateLang);

    // Sync saved style preference
    const savedStyle = localStorage.getItem('Bingoo_msg_style');
    if (savedStyle) {
      setMsgStyle(savedStyle as any);
    }

    return () => window.removeEventListener('Bingoo_lang_changed', updateLang);
  }, []);

  const handleStyleChange = (style: typeof msgStyle) => {
    setMsgStyle(style);
    setCurrentIndex(0);
    localStorage.setItem('Bingoo_msg_style', style);
  };

  const getNextMessage = () => {
    const list = messagesDatabase[msgStyle];
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;
  const currentMessageList = messagesDatabase[msgStyle] || messagesDatabase.calm;
  const currentMessage = currentMessageList[currentIndex] || currentMessageList[0];

  return (
    <Card className="p-6 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-bold text-textPrimary flex items-center gap-1.5">
          {copy.cardTitle}
        </h3>
        
        {/* Style Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-textSecondary font-semibold uppercase">
            {copy.styleLabel}
          </span>
          <select
            value={msgStyle}
            onChange={(e) => handleStyleChange(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-textPrimary focus:outline-none cursor-pointer"
          >
            <option value="calm">{copy.styles.calm}</option>
            <option value="funny">{copy.styles.funny}</option>
            <option value="motivational">{copy.styles.motivational}</option>
            <option value="inspirational">{copy.styles.inspirational}</option>
            <option value="egyptian">{copy.styles.egyptian}</option>
          </select>
        </div>
      </div>

      <div className="min-h-[70px] flex items-center justify-center p-4 bg-background/50 border border-border/60 rounded-xl">
        <p className="text-sm text-center font-medium text-textPrimary leading-relaxed transition-all duration-300">
          "{currentMessage?.text}"
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="ghost" className="px-3.5 py-1.5 text-xs font-semibold" onClick={getNextMessage}>
          {copy.nextBtn}
        </Button>
      </div>
    </Card>
  );
}
