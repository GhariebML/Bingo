'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { SafetyBanner } from '@/components/chat/SafetyBanner';

const langCopy = {
  en: {
    badge: 'Bingo Chat',
    title: 'A gentle place to start',
    desc: 'Bingo provides supportive, non-clinical responses. It is not a therapist, doctor, or emergency service, and cannot diagnose mental health conditions.',
    sidebarTitle: 'Bingo is listening',
    sidebarDesc: 'The chat uses safe emotional validation and suggests one small, actionable grounding step at a time.',
    tipsTitle: 'Reflection Tips',
    tips: [
      { emoji: '😌', text: 'Take a slow breath before typing to settle your thoughts.' },
      { emoji: '🏷️', text: 'Name the specific emotion you feel to down-regulate stress.' },
      { emoji: '🎯', text: 'Focus on one small, safe action you can take right now.' }
    ],
    safetyTitle: 'Safety Alert',
    safetyDesc: 'If you may hurt yourself, hurt someone else, or are in immediate danger, please reach out to emergency services or talk to a trusted adult immediately.',
    quickStarts: [
      'I feel anxious',
      'I am overthinking',
      'I had a bad day',
      'I need motivation',
      'Help me calm down',
      'I feel overwhelmed'
    ]
  },
  ar: {
    badge: 'محادثة بينجو',
    title: 'مساحة هادئة للفضفضة والراحة',
    desc: 'يقدم بينجو ردوداً داعمة وغير طبية. هو ليس معالجاً أو طبيباً أو خدمة طوارئ، ولا يقدم تشخيصاً للحالات النفسية.',
    sidebarTitle: 'بينجو يستمع إليك',
    sidebarDesc: 'تستخدم المحادثة مسارات مصادقة عاطفية آمنة وتقترح خطوة واحدة صغيرة وقابلة للتطبيق للتهدئة.',
    tipsTitle: 'نصائح للتأمل',
    tips: [
      { emoji: '😌', text: 'خذ نفساً بطيئاً قبل الكتابة لتهدئة أفكارك المشوشة.' },
      { emoji: '🏷️', text: 'قم بتسمية مشاعرك بدقة لتقليل هرمونات التوتر.' },
      { emoji: '🎯', text: 'ركز على فعل واحد صغير وآمن يمكنك القيام به الآن.' }
    ],
    safetyTitle: 'تنبيه أمان',
    safetyDesc: 'إذا كنت تفكر في إيذاء نفسك أو الآخرين، أو كنت في خطر مباشر، يرجى الاتصال فوراً برقم الطوارئ أو التحدث لشخص تثق به.',
    quickStarts: [
      'أشعر بالقلق والتوتر',
      'أفكر أكثر من اللازم',
      'يومي كان سيئاً وصعباً',
      'أحتاج لبعض التحفيز',
      'ساعدني على الهدوء',
      'أشعر بضغط شديد'
    ]
  },
  eg: {
    badge: 'فضفض مع بينجو',
    title: 'مكان هادي تفضفض فيه وتريح بالك',
    desc: 'بينجو بيرد عليك بكلام ودود وبيشجعك، بس هو مش دكتور ولا بديل عن المستشفيات أو الأخصائي النفسي بالمدرسة.',
    sidebarTitle: 'بينجو سامعك وحاسس بيك',
    sidebarDesc: 'الكلام هنا بيساعدك تفرغ شحنة الزعل، وبيشجعك تاخد خطوة واحدة بسيطة تريح دماغك.',
    tipsTitle: 'شوية نصائح تفيدك',
    tips: [
      { emoji: '😌', text: 'خد نفس طويل وهادي قبل ما تبدأ تكتب عشان ترتاح.' },
      { emoji: '🏷️', text: 'قول لروحك أنت حاسس ب إيه بالظبط، تسمية الوجع بتخففه.' },
      { emoji: '🎯', text: 'ركز في حاجة واحدة بس تقدر تعملها دلوقتي تلطف يومك.' }
    ],
    safetyTitle: 'تنبيه أمان وسلامة',
    safetyDesc: 'لو حاسس بضغط يخليك تأذي نفسك أو اللي حواليك، ياريت تطلب مساعدة فورية من أرقام الطوارئ أو تتواصل مع الأخصائي النفسي بالمدرسة.',
    quickStarts: [
      'حاسس بقلق وتوتر',
      'دماغي مش بتوقف تفكير',
      'يومي كان متعب أوي',
      'محتاج تشجيع وطاقة',
      'ساعدني أهدى شوية',
      'حاسس بتقل فوق كتافي'
    ]
  }
};

export default function Page() {
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
  const isRtl = lang === 'ar' || lang === 'eg';

  return (
    <section className={`grid gap-6 lg:grid-cols-[1fr_0.35fr] animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-textSecondary">
            {copy.badge}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-textPrimary">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-xs md:text-sm text-textSecondary leading-relaxed bg-background/40 p-4 rounded-xl border border-border/60">
            {copy.desc}
          </p>
        </div>

        <SafetyBanner />
        
        <Card className="p-6 bg-surface">
          <ChatWindow quickPrompts={copy.quickStarts} />
        </Card>
      </div>

      {/* Sidebar Info */}
      <aside className="hidden lg:block space-y-4">
        <Card className="overflow-hidden p-0 bg-surface">
          <div className="relative h-56">
            <Image 
              alt="Bingo assistant avatar in an ocean scene" 
              className="object-cover" 
              fill 
              priority 
              sizes="(min-width: 1024px) 520px, 100vw" 
              src="/bingo/bingo-avatar.png" 
            />
          </div>
          <div className="p-5">
            <h2 className="font-bold text-textPrimary text-sm">{copy.sidebarTitle}</h2>
            <p className="mt-2 text-xs leading-relaxed text-textSecondary">
              {copy.sidebarDesc}
            </p>
          </div>
        </Card>

        {/* Reflection Tips */}
        <Card className="p-5 bg-surface">
          <h3 className="font-bold text-textPrimary text-sm mb-3">{copy.tipsTitle}</h3>
          <ul className="space-y-3 text-xs leading-relaxed text-textSecondary">
            {copy.tips.map((tip, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <span className="text-sm leading-none shrink-0">{tip.emoji}</span>
                <span className="font-medium text-textPrimary">{tip.text}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Safety Disclaimer Card */}
        <Card className="p-5 border border-error/30 bg-error/5 text-error rounded-2xl">
          <h3 className="font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            ⚠️ {copy.safetyTitle}
          </h3>
          <p className="text-xs leading-relaxed text-textPrimary font-medium">
            {copy.safetyDesc}
          </p>
        </Card>
      </aside>
    </section>
  );
}
