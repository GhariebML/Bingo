'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const copyData = {
  en: {
    title: '❤️ Your Safety is Our Priority',
    message: 'I am so sorry you are feeling this way. Please know you do not have to carry this alone. Your safety and well-being are what matter most. We highly encourage you to reach out to a trusted professional or adult immediately.',
    emergencyTitle: 'Immediate Help Contacts',
    hotlineLabel: 'National Mental Health Helpline',
    counselorLabel: 'School Well-being Team / Counselor',
    hospitalLabel: 'Partnered Hospital (Urgent Support)',
    hospitalDesc: 'Vanguard International Clinic - 24/7 Crisis Response Unit',
    bookSupportBtn: 'Book Urgent Session',
    contactCounselorBtn: 'Email School Counselor',
    callEmergencyBtn: 'Call Emergency Contact',
    safeBtn: 'I am feeling safer now',
    disclaimer: 'This platform is an emotional reflection companion and cannot replace medical treatment or active crisis support.'
  },
  ar: {
    title: 'تنبيه سلامة: أمانك هو أولويتنا القصوى',
    message: 'نحن نتفهم صعوبة المشاعر التي تمر بها حالياً. سلامتك النفسية والجسدية بالغة الأهمية بالنسبة لنا. يرجى العلم أن هذا الشعور مؤقت وأن هناك دعماً احترافياً متاحاً لك الآن. نوصي وبشدة بالتواصل الفوري مع أحد مختصي الدعم التاليين.',
    emergencyTitle: 'قنوات الدعم والتدخل السريع',
    hotlineLabel: 'الخط الساخن الوطني للصحة النفسية (طوارئ)',
    counselorLabel: 'أخصائي الدعم النفسي والإرشاد المدرسي',
    hospitalLabel: 'وحدة الرعاية النفسية العاجلة (شريك طبي)',
    hospitalDesc: 'مراكز الرعاية المتقدمة - فريق الاستجابة للأزمات متاح 24/7',
    bookSupportBtn: 'طلب تدخل فورى',
    contactCounselorBtn: 'التواصل مع الإرشاد المدرسي',
    callEmergencyBtn: 'الاتصال بفرق الطوارئ',
    safeBtn: 'أشعر بالاستقرار والأمان الآن',
    disclaimer: 'إخلاء مسؤولية: هذه المنصة مصممة للتوجيه التربوي والدعم الوجداني الأولي، ولا تُعد بديلاً بأي حال من الأحوال عن التشخيص أو العلاج النفسي والتدخل الطبي المباشر.'
  },
  eg: {
    title: 'تنبيه أمان: حياتك وسلامتك تهمنا',
    message: 'إحنا حاسين باللي بتمر بيه ومقدرين صعوبته جداً. سلامتك أهم من أي حاجة تانية. أرجوك تفتكر إنك مش لوحدك وإن فيه ناس متخصصة جاهزة تقف جنبك وتدعمك حالاً. خطوة واحدة ممكن تغير كل حاجة، تواصل مع حد من جهات الدعم دي دلوقتي.',
    emergencyTitle: 'أرقام وجهات الدعم النفسي السريع',
    hotlineLabel: 'الأمانة العامة للصحة النفسية (مصر - طوارئ)',
    counselorLabel: 'الأخصائي النفسي بمدرستك',
    hospitalLabel: 'مستشفى الطوارئ النفسية الشريك',
    hospitalDesc: 'وحدات التدخل النفسي العاجل - جاهزة لمساعدتك 24 ساعة',
    bookSupportBtn: 'احجز جلسة طوارئ',
    contactCounselorBtn: 'بلغ الأخصائي النفسي',
    callEmergencyBtn: 'اطلب مساعدة الطوارئ',
    safeBtn: 'أنا بقيت أحسن وفي أمان دلوقتي',
    disclaimer: 'تنبيه مهم: المنصة دي للمساندة النفسية والفضفضة، لكنها أبداً مش بديل عن الدكاترة المتخصصين أو مستشفيات الطوارئ للتدخل العاجل.'
  }
};

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem('bingo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('bingo_lang_changed', updateLang);
    return () => window.removeEventListener('bingo_lang_changed', updateLang);
  }, []);

  if (!isOpen) return null;

  const copy = copyData[lang as keyof typeof copyData] || copyData.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl animate-scale-in">
        <Card className="p-6 border-2 border-error bg-surface shadow-2xl relative">
          
          {/* Header */}
          <div className="flex items-center gap-3 text-error mb-4 border-b border-border/80 pb-4">
            <svg className="w-8 h-8 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold">{copy.title}</h2>
          </div>

          {/* Description */}
          <p className="text-sm text-textPrimary leading-relaxed mb-6 font-medium">
            {copy.message}
          </p>

          {/* Action List Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider">
              {copy.emergencyTitle}
            </h3>

            {/* 1. National Hotline */}
            <div className="p-4 rounded-xl bg-background border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold text-textSecondary">{copy.hotlineLabel}</span>
                <p className="text-sm font-bold text-primary mt-0.5">📞 16328 (Egypt) | 988 (International)</p>
              </div>
              <a href="tel:16328">
                <Button variant="ghost" className="border-primary text-primary hover:bg-primary/5 px-3 py-1.5 text-xs font-semibold">
                  Call Now
                </Button>
              </a>
            </div>

            {/* 2. Partner Hospital Booking */}
            <div className="p-4 rounded-xl bg-background border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold text-textSecondary">{copy.hospitalLabel}</span>
                <p className="text-xs text-textPrimary font-semibold mt-1">{copy.hospitalDesc}</p>
              </div>
              <Button variant="primary" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => alert('Referral request generated. Routing to booking system...')}>
                {copy.bookSupportBtn}
              </Button>
            </div>

            {/* 3. Counselor contact */}
            <div className="p-4 rounded-xl bg-background border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold text-textSecondary">{copy.counselorLabel}</span>
                <p className="text-xs text-textPrimary font-semibold mt-1">Email: counselor@schoolwellbeing.edu</p>
              </div>
              <Button variant="ghost" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => alert('Initiating secure well-being request to your school counselor...')}>
                {copy.contactCounselorBtn}
              </Button>
            </div>
          </div>

          {/* Actions & Footer */}
          <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-muted max-w-sm text-center sm:text-left leading-relaxed">
              ⚠️ {copy.disclaimer}
            </span>
            <Button variant="ghost" className="bg-success/10 border-success text-success hover:bg-success/20 font-bold px-4 py-2 text-xs" onClick={onClose}>
              {copy.safeBtn}
            </Button>
          </div>

        </Card>
      </div>
    </div>
  );
}
