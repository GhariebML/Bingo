'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const langCopy = {
  en: {
    title: '🏫 Counselor & School Well-Being Hub',
    tagline: 'Monitor student body wellness trends, manage cases securely, and run aggregated reports.',
    analyticsTitle: 'School-Wide Well-Being Analytics (Anonymous)',
    analyticsDesc: 'Aggregated mood distribution for the current week (Middle & High School levels). No individual chats are visible.',
    moodDistribution: 'Mood Distribution',
    consentTitle: 'Consent & Permissions Analytics',
    counselorConsent: 'Students consenting to counselor outreach',
    parentConsent: 'Parental approvals verified',
    caseTitle: 'Secured Well-Being Cases',
    caseDesc: 'Student wellness alerts flagged for counselor check-in based on stress triggers and student consent.',
    caseHeaders: ['Anonymized Code', 'Flag Reason', 'Status', 'Action'],
    cases: [
      { code: 'STUDENT-884A', reason: 'Repeated high stress logs & late-night activity', status: 'Awaiting Outreach', color: 'text-warning' },
      { code: 'STUDENT-129C', reason: 'Low energy & explicit help request', status: 'In Outreach', color: 'text-primary' },
      { code: 'STUDENT-399F', reason: 'Self-reported tired trend', status: 'Resolved', color: 'text-success' }
    ],
    outreachBtn: 'Coordinate Check-in',
    reportsTitle: 'Leadership Report Builder',
    reportsDesc: 'Export anonymous well-being snapshots to present to school boards or parents.',
    generateBtn: 'Generate PDF Report',
    privacyNotice: '🔒 Privacy Standard: Counselor hubs follow international student data privacy guidelines. Personal logs and transcripts are encrypted and cannot be viewed by administrators.'
  },
  ar: {
    title: '🏫 بوابة الإرشاد ومراقبة الرفاهية المدرسية',
    tagline: 'لوحة تحكم إحصائية لمتابعة المؤشرات النفسية العامة، إدارة الحالات بخصوصية تامة، وإصدار تقارير الأداء المجمعة.',
    analyticsTitle: 'التحليلات الشاملة للرفاهية الطلابية (بيانات معماة)',
    analyticsDesc: 'توزيع مجمع للأنماط الوجدانية للطلاب خلال الأسبوع الحالي. النظام يضمن سرية المحادثات الشخصية بالكامل.',
    moodDistribution: 'مؤشرات التوزيع الوجداني',
    consentTitle: 'إحصائيات الموافقة وبروتوكولات الخصوصية',
    counselorConsent: 'نسبة تفويض الطلاب لتدخل الإرشاد النفسي',
    parentConsent: 'معدل التصديق والموافقات الأسرية',
    caseTitle: 'سجل الحالات المشمولة بالرعاية',
    caseDesc: 'نظام تنبيهات للحالات التي تُظهر مؤشرات إجهاد مرتفعة، وتتطلب تدخلاً مبكراً وفقاً لموافقة الطالب الصريحة.',
    caseHeaders: ['المعرف المجهول (الكود)', 'دافع التنبيه', 'حالة التدخل', 'الإجراء المطلوب'],
    cases: [
      { code: 'STUDENT-884A', reason: 'معدلات إجهاد تراكمية مع نشاط ليلي مكثف', status: 'قيد انتظار التدخل', color: 'text-warning' },
      { code: 'STUDENT-129C', reason: 'انخفاض حاد في الحيوية وطلب دعم استشاري', status: 'التدخل جارٍ', color: 'text-primary' },
      { code: 'STUDENT-399F', reason: 'مؤشرات توتر سابقة تمت معالجتها', status: 'تم الاحتواء', color: 'text-success' }
    ],
    outreachBtn: 'تنسيق جلسة استشارة',
    reportsTitle: 'وحدة إصدار تقارير الإدارة والمجالس',
    reportsDesc: 'إنشاء تقارير إحصائية مجمعة لعرض مؤشرات الرفاهية النفسية على الإدارات التعليمية والمجالس الاستشارية.',
    generateBtn: 'إصدار تقرير إحصائي (PDF)',
    privacyNotice: '🔒 معيار الخصوصية: البوابة مصممة للامتثال لبروتوكولات سرية البيانات. كافة المحادثات مشفرة تماماً ولا صلاحية لأي جهة بالاطلاع عليها.'
  },
  eg: {
    title: '🏫 مكتب الأخصائي ودعم الرفاهية للطلبة',
    tagline: 'تابع الحالة النفسية العامة للمدرسة، ونظم الحالات اللي محتاجة دعم بهدوء، وجهز تقاريرك الإدارية.',
    analyticsTitle: 'مؤشرات الصحة النفسية العامة (بدون أسماء)',
    analyticsDesc: 'شكل المود العام للطلبة الأسبوع ده. سرية الطلبة محفوظة ومحدش يقدر يشوف محادثاتهم الخاصة.',
    moodDistribution: 'خريطة المود العام في المدرسة',
    consentTitle: 'أرقام الموافقات وبروتوكول الأمان',
    counselorConsent: 'طلبة موافقين إن الأخصائي يتواصل معاهم لو لزم الأمر',
    parentConsent: 'موافقات أولياء الأمور المعتمدة',
    caseTitle: 'حالات التدخل والدعم النفسي',
    caseDesc: 'إشارات سريعة للطلبة اللي سجلوا ضغط عالي ووافقوا إن فريق الدعم يقف جنبهم.',
    caseHeaders: ['كود الطالب السري', 'سبب التنبيه', 'وصلنا لإيه؟', 'الخطوة الجاية'],
    cases: [
      { code: 'STUDENT-884A', reason: 'توتر عالي متكرر وسهر وتفكير كتير', status: 'محتاجين نتكلم معاه', color: 'text-warning' },
      { code: 'STUDENT-129C', reason: 'طاقة قليلة جداً وطلب حد يسمعه', status: 'بدأنا معاه خطوة', color: 'text-primary' },
      { code: 'STUDENT-399F', reason: 'كان متوتر بس دلوقتي أحسن', status: 'اتطمنا عليه', color: 'text-success' }
    ],
    outreachBtn: 'حدد ميعاد استشارة',
    reportsTitle: 'تقارير إدارة المدرسة والأهالي',
    reportsDesc: 'استخرج تقارير عامة عشان تناقش الوضع النفسي في المدرسة مع الإدارة أو أولياء الأمور بثقة.',
    generateBtn: 'حمل تقرير الـ PDF',
    privacyNotice: '🔒 سرية تامة: المنصة دي بتحترم أسرار الطلبة. الشات كله متشفر ولا مدير ولا أخصائي يقدر يفتحه أو يقرأ حرف منه.'
  }
};

export default function Page() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem('Bingoo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('Bingoo_lang_changed', updateLang);
    return () => window.removeEventListener('Bingoo_lang_changed', updateLang);
  }, []);

  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;
  const isRtl = lang === 'ar' || lang === 'eg';

  return (
    <section className={`space-y-8 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-textPrimary">{copy.title}</h1>
        <p className="text-sm text-textSecondary mt-2 leading-relaxed max-w-xl">{copy.tagline}</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Analytics Distribution */}
        <Card className="p-6 bg-surface space-y-4">
          <h3 className="text-base font-bold text-textPrimary">{copy.analyticsTitle}</h3>
          <p className="text-xs text-textSecondary leading-relaxed">{copy.analyticsDesc}</p>

          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">{copy.moodDistribution}</h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>😌 Calm / Peace</span>
                  <span className="font-bold">42%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>🤯 Stressed / Overwhelmed</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>🥱 Tired / Fatigued</span>
                  <span className="font-bold">18%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>😊 Happy / Energetic</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Consents & Approvals */}
        <Card className="p-6 bg-surface space-y-5">
          <h3 className="text-base font-bold text-textPrimary">{copy.consentTitle}</h3>
          
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-textSecondary">{copy.counselorConsent}</span>
                <span className="font-bold text-primary">68%</span>
              </div>
              <div className="h-2.5 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-textSecondary">{copy.parentConsent}</span>
                <span className="font-bold text-secondary">82%</span>
              </div>
              <div className="h-2.5 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            {/* Privacy Shield */}
            <div className="p-4 bg-background border border-border/80 rounded-xl text-[11px] text-textSecondary leading-relaxed">
              {copy.privacyNotice}
            </div>
          </div>
        </Card>
      </div>

      {/* Case Alerts Table */}
      <Card className="p-6 bg-surface space-y-4">
        <div>
          <h3 className="text-base font-bold text-textPrimary">{copy.caseTitle}</h3>
          <p className="text-xs text-textSecondary mt-1">{copy.caseDesc}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" dir="ltr">
            <thead>
              <tr className="border-b border-border/60 text-textSecondary font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">{copy.caseHeaders[0]}</th>
                <th className="py-3 px-4">{copy.caseHeaders[1]}</th>
                <th className="py-3 px-4">{copy.caseHeaders[2]}</th>
                <th className="py-3 px-4 text-right">{copy.caseHeaders[3]}</th>
              </tr>
            </thead>
            <tbody>
              {copy.cases.map((c, idx) => (
                <tr key={idx} className="border-b border-border/40 hover:bg-background/40 transition">
                  <td className="py-3 px-4 font-bold text-primary">{c.code}</td>
                  <td className="py-3 px-4 text-textSecondary font-medium">{c.reason}</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={c.color}>{c.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => alert(`Starting outreach workflow for ${c.code}. A secure, anonymized notification will be coordinated.`)}>
                      {copy.outreachBtn}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Report Builder */}
      <Card className="p-6 bg-surface flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-textPrimary">{copy.reportsTitle}</h3>
          <p className="text-xs text-textSecondary leading-relaxed">{copy.reportsDesc}</p>
        </div>
        <Button onClick={() => alert('Compiling school well-being analytics report... PDF compiled successfully.')}>
          {copy.generateBtn}
        </Button>
      </Card>
    </section>
  );
}
