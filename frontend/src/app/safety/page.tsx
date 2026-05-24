'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const langCopy = {
  en: {
    title: 'Well-Being, Safety & Privacy Guidelines',
    subtitle: 'Clear boundaries ensure a safe, supportive space for students, families, and schools.',
    intro: 'Bingo is an emotional reflection companion, designed to support positive habits, self-reflection, and school well-being coordination. It does not replace therapists, doctors, or active crisis support.',
    crisisTitle: 'Crisis Guidance',
    immediateHelp: 'Immediate Help Needed?',
    crisisDesc: 'If you may hurt yourself, hurt someone else, or are in immediate danger, please contact national emergency services or talk to a trusted adult right away.',
    helpline: 'Regional Emergency Resource',
    notForTitle: 'Bingo is NOT a Medical Tool',
    notForList: [
      'Clinical Diagnosis (e.g. diagnosing depression)',
      'Medication Prescriptions or Advice',
      'Replacement for Professional Therapy',
      'Active Emergency Dispatch or Crisis Response'
    ],
    consentTitle: 'Consent & Privacy Management',
    consentDesc: 'Manage how your data is handled. We support role-based consent to keep you safe and in control.',
    studentConsent: 'I consent to share my anonymous mood trend with my school counselor to coordinate well-being support.',
    parentConsent: 'I confirm that a parent or legal guardian has approved my use of this platform (required for minors).',
    deleteLogsTitle: 'Secure Data Deletion',
    deleteLogsDesc: 'You have full ownership of your data. You can delete all logs, happy memories, and journal entries stored in this browser permanently.',
    deleteBtn: 'Purge All Local Data',
    deleteSuccess: 'All local data, journal entries, and mood logs have been permanently deleted.',
    saveConsentBtn: 'Save Preferences',
    consentSaved: 'Consent preferences updated successfully!',
    canHelpTitle: 'What Bingo can help with',
    canHelpDesc: 'Compassionate reflection, structured journaling, science-backed grounding exercises, clarifying questions, and finding one small positive next step.',
    seekCareTitle: 'When to seek professional care',
    seekCareDesc: 'If your distress feels overwhelming, continuous, disrupts your daily life, or if you feel unsafe. Please connect with a licensed local therapist or medical professional.'
  },
  ar: {
    title: 'إرشادات السلامة والخصوصية والرفاهية',
    subtitle: 'حدود واضحة تضمن توفير مساحة آمنة وداعمة للطلاب والعائلات والمدارس.',
    intro: 'بينجو هو رفيق للتأمل وبناء العادات الإيجابية والتنسيق المدرسي. هو ليس بديلاً عن المعالجين أو الأطباء أو خدمات الإسعاف والطوارئ.',
    crisisTitle: 'إرشادات الأزمات',
    immediateHelp: 'هل تحتاج إلى مساعدة فورية؟',
    crisisDesc: 'إذا كنت تفكر في إيذاء نفسك أو الآخرين، أو كنت في خطر مباشر، يرجى الاتصال بخدمات الطوارئ الوطنية أو التحدث لشخص تثق به على الفور.',
    helpline: 'خط الإغاثة الإقليمي',
    notForTitle: 'بينجو ليس أداة طبية',
    notForList: [
      'التشخيص السريري (مثل تشخيص الاكتئاب)',
      'وصف الأدوية أو النصائح الطبية',
      'بديل للعلاج النفسي التخصصي',
      'الاستجابة الفورية للأزمات الأمنية والطبية'
    ],
    consentTitle: 'إدارة الموافقة والخصوصية',
    consentDesc: 'تحكم في كيفية التعامل مع بياناتك. نحن ندعم الخصوصية القائمة على الأدوار لحمايتك.',
    studentConsent: 'أوافق على مشاركة منحنى حالتي المزاجية (دون كشف الهوية) مع الأخصائي النفسي بالمدرسة لمتابعة رفاهيتي.',
    parentConsent: 'أؤكد أن ولي أمري أو الوصي القانوني قد وافق على استخدامي للمنصة (مطلوب للقصر).',
    deleteLogsTitle: 'حذف البيانات الآمن',
    deleteLogsDesc: 'أنت تملك بياناتك بالكامل. يمكنك حذف جميع المحادثات والذكريات السعيدة واليوميات المخزنة في متصفحك بشكل نهائي.',
    deleteBtn: 'حذف جميع البيانات المحلية',
    deleteSuccess: 'تم مسح جميع البيانات المحلية واليوميات وسجلات الحالة المزاجية نهائياً.',
    saveConsentBtn: 'حفظ تفضيلات الموافقة',
    consentSaved: 'تم تحديث خيارات الموافقة بنجاح!',
    canHelpTitle: 'كيف يساعدك بينجو؟',
    canHelpDesc: 'التأمل الذاتي، وكتابة اليوميات المنظمة، وتمارين التنفس والتهدئة، وطرح أسئلة توضيحية، واقتراح خطوة إيجابية واحدة.',
    seekCareTitle: 'متى يجب استشارة مختص؟',
    seekCareDesc: 'إذا كان حزنك شديداً ومستمراً، ويعطل حياتك اليومية، أو إذا شعرت بعدم الأمان. يرجى التواصل مع طبيب أو معالج مرخص.'
  },
  eg: {
    title: 'إرشادات السلامة والخصوصية والأمان',
    subtitle: 'حدود واضحة بتضمن توفير مكان أمان وصالح للطلبة وأهاليهم ومدارسهم.',
    intro: 'بينجو هو صاحب ليك بيساعدك تفهم مشاعرك وتكتب يومياتك وتنظم مودك مع المدرسة. بس هو مش عيادة طبية ولا بديل عن الدكتور أو مستشفيات الطوارئ.',
    crisisTitle: 'طلب مساعدة مستعجلة',
    immediateHelp: 'محتاج مساعدة فورية؟',
    crisisDesc: 'لو بتفكر تؤذي نفسك أو غيرك، أو حاسس بخطر حقيقي، كلم فوراً أرقام الطوارئ أو كلم حد كبير بتثق فيه يقف جنبك دلوقتي.',
    helpline: 'رقم الإسعاف والدعم النفسي القريب',
    notForTitle: 'بينجو مش بيقدم خدمات طبية',
    notForList: [
      'التشخيص الطبي (زي تحديد لو عندك اكتئاب)',
      'كتابة أدوية أو روشتات طبية',
      'بديل عن الجلسات مع دكتورك النفسي',
      'الإسعاف الفوري أو التدخل في الأزمات الخطيرة'
    ],
    consentTitle: 'التحكم في الخصوصية والموافقة',
    consentDesc: 'تحكم في بياناتك وبرايفت محادثاتك. بنضمنلك أمان كامل عشان تحس بالراحة.',
    studentConsent: 'موافق أشارك المود بتاعي بشكل عام (من غير اسمي) مع أخصائي المدرسة عشان يطمن عليا.',
    parentConsent: 'بأكد إن والدي أو والدتي موافقين إني أستخدم بينجو (مهم للطلبة تحت السن القانوني).',
    deleteLogsTitle: 'مسح كل بياناتك نهائياً',
    deleteLogsDesc: 'أسرارك وكلامك ملكك لوحدك. تقدر تمسح كل الشات واليوميات والذكريات اللي كتبتها هنا من على المتصفح بضغطة واحدة.',
    deleteBtn: 'امسح كل بياناتي فوراً',
    deleteSuccess: 'تم مسح كل شات اليوميات والمود والذكريات من على متصفحك نهائياً.',
    saveConsentBtn: 'حفظ موافقات الخصوصية',
    consentSaved: 'تم حفظ تفضيلاتك بنجاح!',
    canHelpTitle: 'بينجو هيساعدك في إيه؟',
    canHelpDesc: 'الفضفضة، وكتابة اليوميات، وتمارين التنفس الرايقة، والأسئلة اللي تخليك تفهم نفسك، وخطوة إيجابية واحدة.',
    seekCareTitle: 'إمتى تروح لدكتور حقيقي؟',
    seekCareDesc: 'لو الزعل والتعب طول معاك، وبقى معطل دراستك وحياتك، أو حسيت بتهديد حقيقي. كلم فوراً دكتور أو معالج نفسي حقيقي يرشدك.'
  }
};

export default function Page() {
  const [lang, setLang] = useState('en');
  const [studentConsented, setStudentConsented] = useState(false);
  const [parentConsented, setParentConsented] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem('bingo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('bingo_lang_changed', updateLang);

    // Load initial consents from localStorage
    setStudentConsented(localStorage.getItem('bingo_counselor_consent') === 'true');
    setParentConsented(localStorage.getItem('bingo_parent_consent') === 'true');

    return () => window.removeEventListener('bingo_lang_changed', updateLang);
  }, []);

  const savePreferences = () => {
    localStorage.setItem('bingo_counselor_consent', String(studentConsented));
    localStorage.setItem('bingo_parent_consent', String(parentConsented));
    setSuccessMsg(langCopy[lang as keyof typeof langCopy]?.consentSaved || 'Saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const purgeAllData = () => {
    if (confirm(lang === 'en' ? 'Are you sure you want to permanently delete all journal entries and mood logs?' : 'هل أنت متأكد من رغبتك في حذف جميع المذكرات واليوميات نهائياً؟')) {
      localStorage.removeItem('bingo_future_notes');
      localStorage.removeItem('bingo_counselor_consent');
      localStorage.removeItem('bingo_parent_consent');
      localStorage.removeItem('bingo_msg_style');
      setStudentConsented(false);
      setParentConsented(false);
      setSuccessMsg(langCopy[lang as keyof typeof langCopy]?.deleteSuccess || 'Deleted!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;
  const isRtl = lang === 'ar' || lang === 'eg';

  return (
    <section className={`space-y-8 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-textSecondary font-heading">
          {lang === 'en' ? 'Support & Boundaries' : 'حدود الدعم والأمان'}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-textPrimary sm:text-5xl font-heading">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-textSecondary bg-background/50 p-4 rounded-xl border border-border/60">
          {copy.intro}
        </p>
      </div>

      {/* Connection status and success notifications */}
      {successMsg && (
        <Card className="p-4 border border-success/30 bg-success/5 text-success font-semibold text-xs animate-pulse">
          {successMsg}
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        
        {/* Column 1: Crisis Resource and Not For list */}
        <div className="space-y-6">
          
          {/* Crisis Guidance */}
          <Card className="border-t-4 border-t-error bg-surface p-6" title={copy.crisisTitle}>
            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-xl border border-error/30 bg-error/5 p-5 text-textPrimary shadow-sm">
                <div className="rounded-lg bg-error/20 p-2.5 text-error shrink-0">
                  <AlertTriangle className="" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-error text-base font-heading">{copy.immediateHelp}</h3>
                  <p className="text-xs leading-relaxed text-textSecondary">
                    {copy.crisisDesc}
                  </p>
                </div>
              </div>
              
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-2 font-heading">
                  {copy.helpline}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold">
                  <div>
                    <span className="text-textSecondary">{lang === 'en' ? 'Egypt Hotline' : 'الخط الساخن بمصر'}:</span>{' '}
                    <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-textPrimary">
                      16328
                    </span>
                  </div>
                  <div className="text-textPrimary flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {lang === 'en' ? 'Crisis support active 24/7' : 'دعم طوارئ يعمل 24 ساعة'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Bingo Will Not Provide */}
          <Card className="border-t-4 border-t-primary bg-surface p-6">
            <h3 className="text-base font-bold text-textPrimary mb-4">{copy.notForTitle}</h3>
            <ul className="space-y-3">
              {copy.notForList.map((item) => (
                <li key={item} className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-1.5 text-muted shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-xs font-semibold text-textSecondary">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Column 2: Consent and Data Management */}
        <div className="space-y-6">
          
          {/* Consent Switch Card */}
          <Card className="p-6 bg-surface space-y-4">
            <h3 className="text-base font-bold text-textPrimary">{copy.consentTitle}</h3>
            <p className="text-xs text-textSecondary leading-relaxed">{copy.consentDesc}</p>

            <div className="space-y-3 pt-2">
              {/* Student Counselor Consent */}
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-background rounded-xl border border-border/80 hover:bg-background/80 transition select-none">
                <input
                  type="checkbox"
                  checked={studentConsented}
                  onChange={(e) => setStudentConsented(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-textPrimary leading-relaxed">
                  {copy.studentConsent}
                </span>
              </label>

              {/* Parent Consent Verification */}
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-background rounded-xl border border-border/80 hover:bg-background/80 transition select-none">
                <input
                  type="checkbox"
                  checked={parentConsented}
                  onChange={(e) => setParentConsented(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-textPrimary leading-relaxed">
                  {copy.parentConsent}
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" className="px-3.5 py-1.5 text-xs font-semibold" onClick={savePreferences}>
                {copy.saveConsentBtn}
              </Button>
            </div>
          </Card>

          {/* Secure Note Deletion */}
          <Card className="p-6 bg-surface space-y-3">
            <h3 className="text-base font-bold text-textPrimary">{copy.deleteLogsTitle}</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              {copy.deleteLogsDesc}
            </p>
            <div className="pt-2">
              <Button className="bg-error hover:bg-error/90 text-white font-bold px-3.5 py-1.5 text-xs" onClick={purgeAllData}>
                {copy.deleteBtn}
              </Button>
            </div>
          </Card>
        </div>

      </div>

      {/* Informational Handoff Banner */}
      <Card className="overflow-hidden p-0 border-none shadow-soft">
        <div className="grid items-stretch md:grid-cols-[0.4fr_0.6fr]">
          <div className="relative min-h-[240px] md:min-h-full bg-primary/10">
            <Image 
              alt="Bingo in a serious but supportive ocean scene" 
              className="object-cover" 
              fill 
              priority 
              sizes="(min-width: 1024px) 520px, 100vw" 
              src="/bingo/bingo-support.png" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent"></div>
          </div>
          <div className="grid gap-6 p-6 md:p-8 sm:grid-cols-2 bg-surface/50 backdrop-blur-md">
            <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-border pb-6 sm:pb-0 sm:pr-6">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-textPrimary mb-2 font-bold">✓</div>
              <h2 className="text-lg font-bold text-textPrimary">{copy.canHelpTitle}</h2>
              <p className="text-xs leading-relaxed text-textSecondary">
                {copy.canHelpDesc}
              </p>
            </div>
            <div className="space-y-2 pt-2 sm:pt-0 sm:pl-2">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-error/20 text-error mb-2 font-bold">!</div>
              <h2 className="text-lg font-bold text-textPrimary">{copy.seekCareTitle}</h2>
              <p className="text-xs leading-relaxed text-textSecondary">
                {copy.seekCareDesc}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
