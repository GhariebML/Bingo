'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface VirtualTwinProps {
  currentMood?: string; // 'happy' | 'calm' | 'tired' | 'stressed' | 'energetic' | 'thoughtful'
}

const langCopy = {
  en: {
    title: 'Your Emotional Twin',
    tagline: 'Your twin grows and reflects with you.',
    energetic: 'Wow, you are full of sparks today! Let\'s channels this positive energy!',
    calm: 'You look peaceful and grounded. A perfect state for deep focus.',
    tired: 'Your twin noticed you seem a little tired today. Want to take a 2-minute reset?',
    stressed: 'Heavy feelings detected. Take a slow deep breath, we can take it step by step.',
    happy: 'Seeing you smile makes me glow! Keep sharing this happiness around.',
    thoughtful: 'In a reflecting mood? Writing in your journal might help clear your mind.',
    resetBtn: 'Start 2-min Reset',
    journalBtn: 'Write Journal',
    defaultMsg: 'Hello! I am here to reflect your wellness journey today. How are you feeling?'
  },
  ar: {
    title: 'مُرافقك الوجداني',
    tagline: 'يتفاعل مع مشاعرك وينمو معك.',
    energetic: 'طاقة إيجابية رائعة! لنستثمر هذا النشاط في تحقيق أهدافك اليوم.',
    calm: 'حالة من السكينة والتوازن. وقت مثالي للتركيز والعمل العميق.',
    tired: 'يبدو أنك بحاجة لالتقاط الأنفاس. ما رأيك في استراحة قصيرة لتجديد طاقتك؟',
    stressed: 'أشعر ببعض التوتر. تذكر أن تأخذ نفساً عميقاً؛ نحن هنا لنتجاوز ذلك معاً.',
    happy: 'ابتسامتك تضيء يومنا! استمتع بهذه اللحظات وشارك إيجابيتك.',
    thoughtful: 'يبدو أنك غارق في أفكارك. ربما يساعدك تدوينها على ترتيب ذهنك والشعور بالوضوح.',
    resetBtn: 'استراحة تجديد الطاقة',
    journalBtn: 'تدوين المشاعر',
    defaultMsg: 'أهلاً بك! أنا هنا لأرافقك في رحلتك نحو التوازن النفسي. كيف تشعر الآن؟'
  },
  eg: {
    title: 'مُرافقك النفسي',
    tagline: 'حاسس بيك ومكمل معاك.',
    energetic: 'ما شاء الله على الطاقة! يومك مليان نشاط، يلا نستغل الحماس ده صح.',
    calm: 'رايق وهادي النهاردة. أحسن وقت تنجز فيه وتركز.',
    tired: 'شكل اليوم كان طويل عليك. تحب نفصل دقيقتين وناخد نَفَسنا؟',
    stressed: 'حاسس بضغط؟ خد نَفَس عميق، وكل حاجة هتعدي وتتظبط خطوة بخطوة.',
    happy: 'الضحكة دي بتنور الدنيا! خليك دايماً مبسوط وشاركنا طاقتك الحلوة.',
    thoughtful: 'سرحان وبتفكر كتير؟ ما تيجي نكتب اللي شاغل بالك عشان تروّق دماغك.',
    resetBtn: 'نفصل دقيقتين',
    journalBtn: 'فضفض في يومياتك',
    defaultMsg: 'يا أهلاً! أنا هنا معاك خطوة بخطوة عشان أسمعك وأحس بيك. طمني عليك، أخبارك إيه؟'
  }
};

export function VirtualTwin({ currentMood = 'calm' }: VirtualTwinProps) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem('bingo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('bingo_lang_changed', updateLang);
    return () => window.removeEventListener('bingo_lang_changed', updateLang);
  }, []);

  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;

  // Custom visual components for different avatar states
  const renderAvatarSVG = () => {
    const baseColor = {
      happy: 'from-amber-400 to-emerald-400',
      calm: 'from-teal-400 to-blue-400',
      tired: 'from-slate-400 to-indigo-400',
      stressed: 'from-purple-400 to-red-400',
      energetic: 'from-yellow-400 to-pink-500',
      thoughtful: 'from-violet-400 to-fuchsia-400'
    }[currentMood] || 'from-teal-400 to-blue-400';

    return (
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* Abstract Particle Aura */}
        <div className="absolute inset-0 flex items-center justify-center animate-particle-drift opacity-60">
          <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr ${baseColor} blur-2xl opacity-40 animate-pulse-glow`} />
          <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-white blur-sm opacity-50" />
          <div className="absolute bottom-4 right-6 w-6 h-6 rounded-full bg-white blur-md opacity-40" />
          <div className="absolute top-8 right-2 w-3 h-3 rounded-full bg-white blur-sm opacity-60" />
        </div>
        
        {/* Main Droplet Body (Floating) */}
        <div className={`relative h-28 w-28 rounded-[40%] bg-gradient-to-br ${baseColor} shadow-glass flex items-center justify-center animate-avatar-bob border-[3px] border-white/40 overflow-hidden`}>
          {/* Inner glass highlight */}
          <div className="absolute inset-0 rounded-[40%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          
          {/* Face Elements Container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center mt-2">
            {/* Eyes */}
            <div className="flex gap-4 items-center">
              {currentMood === 'happy' && (
                <>
                  <div className="w-3 h-1.5 border-b-2 border-white rounded-full" />
                  <div className="w-3 h-1.5 border-b-2 border-white rounded-full" />
                </>
              )}
              {currentMood === 'calm' && (
                <>
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </>
              )}
              {currentMood === 'tired' && (
                <>
                  <div className="w-3 h-1 border-t-2 border-white/60 rounded-full mt-1" />
                  <div className="w-3 h-1 border-t-2 border-white/60 rounded-full mt-1" />
                </>
              )}
              {currentMood === 'stressed' && (
                <>
                  <div className="w-3 h-3 bg-white/90 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-white/90 rounded-full animate-pulse" />
                </>
              )}
              {currentMood === 'energetic' && (
                <>
                  <svg className="w-4 h-4 text-white animate-pulse-glow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z"/></svg>
                  <svg className="w-4 h-4 text-white animate-pulse-glow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z"/></svg>
                </>
              )}
              {currentMood === 'thoughtful' && (
                <>
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full translate-y-1" />
                </>
              )}
            </div>

            {/* Glowing Cheeks */}
            <div className="flex gap-8 mt-1.5 opacity-50">
              <div className="w-4 h-2 bg-pink-200 blur-sm rounded-full" />
              <div className="w-4 h-2 bg-pink-200 blur-sm rounded-full" />
            </div>

            {/* Mouth */}
            <div className="mt-2">
              {currentMood === 'happy' && <div className="w-4 h-2 border-b-2 border-white rounded-full" />}
              {currentMood === 'calm' && <div className="w-3 h-0.5 bg-white/80 rounded-full" />}
              {currentMood === 'tired' && <div className="w-2 h-2 border-2 border-white/50 rounded-full" />}
              {currentMood === 'stressed' && <div className="w-4 h-0.5 bg-white/80 rounded-full rotate-3" />}
              {currentMood === 'energetic' && <div className="w-4 h-3 border-b-2 border-white rounded-full" />}
              {currentMood === 'thoughtful' && <div className="w-2 h-2 bg-white/80 rounded-full" />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSubtext = () => {
    return copy[currentMood as keyof typeof copy] || copy.defaultMsg;
  };

  return (
    <Card className="flex flex-col md:flex-row items-center gap-6 p-6 glass-card-interactive bg-surface">
      <div className="flex-shrink-0">
        {renderAvatarSVG()}
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <h3 className="text-lg font-bold text-textPrimary">{copy.title}</h3>
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-success animate-ping" />
        </div>
        <p className="text-xs text-textSecondary mb-3">{copy.tagline}</p>
        <p className="text-sm text-textPrimary font-medium leading-relaxed bg-background/50 p-4 rounded-xl border border-border/60">
          "{getSubtext()}"
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
          {currentMood === 'tired' || currentMood === 'stressed' ? (
            <Button variant="primary" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => { window.location.href = '/exercises'; }}>
              {copy.resetBtn}
            </Button>
          ) : null}
          <Button variant="ghost" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => { window.location.href = '/journal'; }}>
            {copy.journalBtn}
          </Button>
        </div>
      </div>
    </Card>
  );
}
