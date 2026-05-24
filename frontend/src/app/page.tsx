'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const langCopy = {
  en: {
    heroBadge: '✨ Student Well-Being Companion',
    heroTitle: 'A safe, friendly space for students to understand their emotions.',
    heroDesc: 'Not every struggle needs to become a crisis before someone listens. Bingo is an early-awareness, reflection, positive habit-building, and school well-being companion.',
    ctaPrimary: 'Start Your Check-in',
    ctaSecondary: 'For Schools & Partners',
    twinTitle: 'Meet Your Virtual Twin',
    twinDesc: 'Every student gets a friendly twin avatar that reflects their emotional journey, mood, and progress in a warm, non-judgmental way. It helps you recognize when to take a 2-minute breathing break or write down your thoughts.',
    positioningTitle: 'Our Safety Positioning',
    positioningDesc: 'Bingo is not a medical diagnosis tool and is not a replacement for doctors, therapists, or school counselors. We focus on early awareness, reflection, and responsible escalation to human professionals when needed.',
    featuresTitle: 'Built for Student Safety & Reflection',
    features: [
      { title: '✉️ Message to Future Me', body: 'Save positive thoughts and happy memories when you feel great. Surfaced automatically to lift you up on heavy days.' },
      { title: '⚡ Mood & Energy Tracker', body: 'Follow your stress, energy, and sleep patterns. Detects early signs of fatigue and guides you to healthy choices.' },
      { title: '🔒 Local Writing Analyzer', body: 'Safe local tracking triggers supportive prompts if you hesitate or struggle to type, keeping your drafts fully private.' },
      { title: '📞 Responsible Escalation', body: 'Detects high-risk keywords and instantly shows crisis support, emergency contacts, and partner clinic booking options.' }
    ],
    partnersTitle: 'Our Well-Being Partnership Network',
    partners: [
      { role: 'For Schools', benefit: 'An anonymous school-wide trend analytics dashboard for counselors. Sets up safe, secure alerts and coordinates student checks while fully protecting private conversations.' },
      { role: 'For Parents', benefit: 'Ensures minor safety and parent consent flows. Offers home well-being reflection tools to foster open communication without exposing private logs.' },
      { role: 'For Clinics & Hospitals', benefit: 'Referral integration loops. Partnered mental health clinics receive direct escalated requests and provide appointment booking scheduling.' },
      { role: 'For Counselors', benefit: 'Get early wellness indicators. Counselors can follow consented case alerts, handle escalation cases, and customize positive micro-messages.' }
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'Is student data shared with school staff?', a: 'Private chat logs are strictly private and never shared. School counselors only receive anonymized trend metrics and risk alerts if a student triggers safety thresholds and consents.' },
      { q: 'Is this a diagnostic tool?', a: 'No. Bingo does not diagnose clinical conditions like depression or anxiety. It is a reflection companion for positive habits.' }
    ]
  },
  ar: {
    heroBadge: '✨ الرفيق النفسي لطلاب المدارس',
    heroTitle: 'مساحة آمنة وداعمة تُعزز الوعي الوجداني لدى الطلاب.',
    heroDesc: 'لا ينبغي أن ينتظر الدعم النفسي حدوث أزمة. يُعد "بينجو" رفيقاً تربوياً مصمماً لتعزيز التفكير الإيجابي، والوعي المبكر، والرفاهية النفسية داخل البيئة المدرسية.',
    ctaPrimary: 'ابدأ جلستك التقييمية',
    ctaSecondary: 'للمؤسسات التعليمية والشركاء',
    twinTitle: 'تعرف على مُرافقك الوجداني',
    twinDesc: 'يحصل كل طالب على صورة رمزية تفاعلية تعكس رحلته العاطفية، ومستويات طاقته، وحالته المزاجية بأسلوب علمي ومريح، مما يُشجعه على ممارسة التأمل الذاتي أو أخذ استراحات ذهنية.',
    positioningTitle: 'رؤيتنا المهنية للسلامة النفسية',
    positioningDesc: 'هذه المنصة لا تُقدم تشخيصاً سريرياً ولا تُغني عن الاستشارة الطبية أو دور الأخصائي النفسي المدرسي. يتركز دورنا في الرصد المبكر والتوجيه الآمن نحو قنوات الدعم المختصة.',
    featuresTitle: 'صُمم وفقاً لمعايير الرعاية الطلابية والتأمل الإدراكي',
    features: [
      { title: '✉️ رسائل الذاكرة الإيجابية', body: 'منظومة لحفظ الذكريات والأفكار المُحفزة وإعادة توجيهها للطالب خلال أوقات الضغط النفسي لتعزيز المرونة الوجدانية.' },
      { title: '⚡ تحليل مؤشرات الطاقة والتوتر', body: 'تتبع مستمر لمعدلات الإرهاق وجودة النوم لتوفير توصيات صحية تستند إلى منهجيات الرعاية الذاتية.' },
      { title: '🔒 خصوصية التحليل المحلي', body: 'تقنية آمنة تعمل محلياً لتحليل أنماط التردد أثناء الكتابة وتقديم دعم فوري، مع التزام تام بعدم تخزين أو مشاركة أي مسودات.' },
      { title: '📞 بروتوكول التدخل الآمن', body: 'نظام رصد الكلمات عالية الخطورة وتفعيل فوري لقوائم الطوارئ المعتمدة وخيارات التدخل العاجل.' }
    ],
    partnersTitle: 'الشبكة التكاملية للرفاهية النفسية',
    partners: [
      { role: 'للإدارات المدرسية', benefit: 'لوحات تحليل بيانات مجمعة تكشف المؤشرات النفسية العامة للطلاب، مما يُسهم في صياغة سياسات دعم فعّالة مع الحفاظ التام على خصوصية الأفراد.' },
      { role: 'لأولياء الأمور', benefit: 'أدوات توجيه أسري مصممة لتعزيز التواصل الإيجابي في المنزل، متوافقة مع معايير حماية القصر وموافقة الوالدين.' },
      { role: 'للعيادات والمراكز الطبية', benefit: 'قنوات ربط مباشرة وموثوقة لاستقبال الإحالات العاجلة وتنظيم مواعيد الدعم السريري المتخصص.' },
      { role: 'للأخصائيين النفسيين', benefit: 'منظومة رصد مبكر ترسل إشعارات للحالات التي تتطلب دعماً، وتُتيح توجيه رسائل إرشادية مُخصصة للطلاب.' }
    ],
    faqTitle: 'الأسئلة الشائعة والشفافية',
    faqs: [
      { q: 'هل تُشارك المنصة سجلات المحادثات الخاصة مع المدرسة؟', a: 'مطلقاً. جميع المحادثات مشفرة وسرية بالكامل. ما يتلقاه الأخصائي المدرسي هو فقط تقارير إحصائية عامة أو إشعارات طوارئ مشروطة بموافقة الطالب.' },
      { q: 'هل يمكن الاستعاضة بالمنصة عن التقييم الطبي؟', a: 'لا. المنصة تُعد رفيقاً للتأمل والدعم الوقائي، ولا تصدر أي تشخيصات طبية كالاكتئاب أو القلق السريري.' }
    ]
  },
  eg: {
    heroBadge: '✨ صاحبك في رحلة الصحة النفسية',
    heroTitle: 'مساحة آمنة وودودة للطلبة عشان يفهموا نفسهم ويرتاحوا.',
    heroDesc: 'مش لازم نستنى المشكلة تكبر عشان نلاقي اللي يسمعنا. "بينجو" هنا عشان يعودك على الفضفضة، ويبني معاك عادات إيجابية تدعم صحتك النفسية كل يوم في المدرسة.',
    ctaPrimary: 'ابدأ الفضفضة دلوقتي',
    ctaSecondary: 'بوابة المدارس والمستشفيات',
    twinTitle: 'مين هو التوأم الشعوري؟',
    twinDesc: 'توأمك هو صورة افتراضية بتعكس حالتك ومودك من غير أي حكم عليك. بيكون معاك خطوة بخطوة، وبيفكرك تاخد نفس عميق أو تكتب اللي شاغل بالك وقت اللزوم.',
    positioningTitle: 'إحنا هنا عشان ندعمك مش نشخصك',
    positioningDesc: '"بينجو" مش دكتور ولا بديل للأخصائي النفسي في مدرستك. دورنا إننا نكون صاحب بيسندك، وبنوجهك للناس اللي تقدر تساعدك بجد لو حسيت بضغط كبير.',
    featuresTitle: 'خدمات مصممة مخصوص لسلامتك النفسية',
    features: [
      { title: '✉️ رسايل من قلبك لنفسك', body: 'اكتب لحظاتك الحلوة وأنت رايق، وهنخلي توأمك يفكرك بيها في الأيام اللي تحس فيها إن طاقتك خلصانة.' },
      { title: '⚡ مؤشرات المود وتتبع طاقتك', body: 'بنتابع معاك مستويات الضغط، نشاطك، ونومك عشان ننبهك لو محتاج تريح أو تاخد خطوة لنفسك.' },
      { title: '🔒 خصوصية تامة وأمان', body: 'بندعمك لو حسينا إنك متردد في الكتابة، بس بنعمل ده على جهازك أنت بس. مفيش أي حاجة بتتسجل أو بتوصل لحد.' },
      { title: '📞 تدخل سريع وقت الأزمات', body: 'لو كلامك فيه قلق كبير، بنعرضلك فوراً أرقام الطوارئ ودكاترة متخصصين تقدر تتواصل معاهم في لحظتها.' }
    ],
    partnersTitle: 'شبكة شركاء الدعم النفسي',
    partners: [
      { role: 'بوابة المدارس', benefit: 'تقارير عامة للإدارة عشان يفهموا الحالة النفسية للطلبة بشكل عام، من غير ما نكشف أسرار ومحادثات أي طالب.' },
      { role: 'بوابة الآباء', benefit: 'بنوفر أدوات ومصادر تساعد الأهل يفتحوا كلام مع ولادهم ويدعموهم، مع احترام كامل لخصوصية مساحتهم الشخصية.' },
      { role: 'العيادات الطبية', benefit: 'طريق مباشر وأمان للطلبة اللي محتاجين رعاية متخصصة عشان يحجزوا مع دكاترة وعيادات شريكة.' },
      { role: 'الأخصائيين بالمدارس', benefit: 'إشارات سريعة للحالات اللي محتاجة طمأنينة واهتمام، مع إمكانية إرسال رسايل دعم قريبة للقلب.' }
    ],
    faqTitle: 'أسئلة بنسمعها كتير',
    faqs: [
      { q: 'هي المحادثات دي ممكن حد في المدرسة يشوفها؟', a: 'مستحيل. كلامك وفضفضتك في أمان تام. المدرسة بس بيوصلها إحصائيات عامة، وتنبيهات أمان لو أنت وافقت عليها.' },
      { q: 'ينفع أعتبر بينجو دكتور نفسي؟', a: 'لا خالص. بينجو صاحب بيشجعك وبيدعمك، بس مش بيشخص أمراض زي الاكتئاب أو غيره.' }
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
    <section className={`space-y-16 py-4 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-textPrimary border border-border">
            {copy.heroBadge}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.15] text-textPrimary">
              {copy.heroTitle}
            </h1>
            <p className="max-w-xl text-md leading-relaxed text-textSecondary/90">
              {copy.heroDesc}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/chat">
              <Button className="px-8 py-3 text-base">{copy.ctaPrimary}</Button>
            </Link>
            <Link href="/school">
              <Button variant="ghost" className="px-6 py-3 text-base border-primary/20">
                {copy.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Illustration / Preview */}
        <Card className="overflow-hidden p-0 border border-border shadow-soft animate-fade-in-up delay-100 bg-surface">
          <div className="relative h-64 w-full bg-surface">
            <Image 
              alt="Bingo Virtual Twin Preview" 
              className="object-cover transition-transform duration-500 hover:scale-102" 
              fill 
              priority 
              sizes="(min-width: 1024px) 520px, 100vw" 
              src="/bingo/bingo-hero.png" 
            />
          </div>
          
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-textPrimary">{copy.twinTitle}</h3>
            <p className="text-sm leading-relaxed text-textSecondary">
              {copy.twinDesc}
            </p>
          </div>
        </Card>
      </div>

      {/* Value Proposition / Safety Positioning */}
      <Card className="p-8 border-2 border-primary/10 bg-primary/5 dark:bg-primary/10 rounded-3xl animate-fade-in-up delay-200">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <span className="text-4xl">🛡️</span>
          <div>
            <h2 className="text-xl font-bold text-textPrimary mb-2">{copy.positioningTitle}</h2>
            <p className="text-sm leading-relaxed text-textSecondary font-medium">
              {copy.positioningDesc}
            </p>
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="space-y-8 animate-fade-in-up delay-300">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-textPrimary">{copy.featuresTitle}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {copy.features.map((feature) => (
            <Card key={feature.title} className="p-6 glass-card-interactive bg-surface">
              <h3 className="text-base font-bold text-textPrimary mb-2">{feature.title}</h3>
              <p className="text-xs text-textSecondary leading-relaxed">{feature.body}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Partnerships Section */}
      <div className="space-y-8 animate-fade-in-up delay-400">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-textPrimary">{copy.partnersTitle}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {copy.partners.map((partner) => (
            <Card key={partner.role} className="p-5 flex flex-col justify-between glass-card-interactive bg-surface">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                  {partner.role}
                </span>
                <p className="text-xs text-textSecondary leading-relaxed mt-2">{partner.benefit}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40">
                <Link href={partner.role.includes('School') || partner.role.includes('مدارس') || partner.role.includes('الأخصائيين') || partner.role.includes('Counselors') ? '/school' : '/clinic'}>
                  <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">
                    {lang === 'en' ? 'Learn More →' : 'تفاصيل أكثر ←'}
                  </span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-in-up delay-500">
        <h2 className="text-2xl font-extrabold text-textPrimary text-center">{copy.faqTitle}</h2>
        <div className="space-y-4">
          {copy.faqs.map((faq) => (
            <Card key={faq.q} className="p-5 bg-surface">
              <h4 className="text-xs font-bold text-textPrimary mb-1.5">{faq.q}</h4>
              <p className="text-xs text-textSecondary leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
