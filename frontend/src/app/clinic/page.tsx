'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const langCopy = {
  en: {
    title: '🏥 Clinic & Hospital Partnership Hub',
    tagline: 'Manage secure student referrals, configure triage availability, and schedule clinical sessions.',
    statusTitle: 'Triage Availability Status',
    statusActive: 'Active: Accepting Urgent Referrals',
    statusBusy: 'Busy: Referrals Only (No Walk-ins)',
    toggleStatus: 'Toggle Capacity Status',
    referralTitle: 'Student Referral Queue',
    referralDesc: 'Escalated well-being cases transferred from partnered school counseling teams (anonymized code names with consent).',
    refHeaders: ['Case ID', 'Triage Rating', 'Date Referred', 'Referral Source', 'Action'],
    referrals: [
      { id: 'CASE-771', triage: 'Urgent (Priority 1)', date: 'May 24, 2026', source: 'Greenfield Int School', color: 'text-error font-bold' },
      { id: 'CASE-348', triage: 'Standard (Priority 3)', date: 'May 23, 2026', source: 'St. Jude International', color: 'text-primary font-bold' }
    ],
    reviewBtn: 'Schedule Triage',
    profileTitle: 'Partner Clinic Profile',
    profileDesc: 'Details visible to school counselors for active referral routing.',
    clinicName: 'Cleopatra Hospital - Well-being Response Division',
    clinicDetails: 'Address: Nile Tower, Giza, Cairo | Phone: +20 2 3301 9999',
    bookTitle: 'Referral Calendar & Slots',
    bookBtn: 'Book Session',
    privacyNotice: '🔒 Health Privacy Notice: All clinic integrations adhere to healthcare confidentiality standards. Referrals are routed securely and encrypted.'
  },
  ar: {
    title: '🏥 المنصة الطبية للعيادات والمستشفيات الشريكة',
    tagline: 'إدارة متقدمة للتحويلات الطلابية، تصنيف الحالات، وجدولة المواعيد السريرية بمرونة وأمان.',
    statusTitle: 'مؤشر الجاهزية واستقبال الحالات (Triage)',
    statusActive: 'نشط: العيادة مستعدة لاستقبال الإحالات العاجلة',
    statusBusy: 'ممتلئ: استقبال الحالات المجدولة مسبقاً فقط',
    toggleStatus: 'تحديث حالة الجاهزية',
    referralTitle: 'سجل الإحالات الطلابية الطبية',
    referralDesc: 'حالات تم تقييمها وتصعيدها من قبل فرق الإرشاد المدرسي (تدفق بيانات آمن ومجهول الهوية).',
    refHeaders: ['معرف الحالة', 'تصنيف الخطورة الطبية', 'تاريخ الإحالة', 'الجهة المحولة', 'الإجراء الطبي'],
    referrals: [
      { id: 'CASE-771', triage: 'حالة عاجلة (درجة أولى)', date: '٢٤ مايو ٢٠٢٦', source: 'مدرسة جرينفيلد الدولية', color: 'text-error font-bold' },
      { id: 'CASE-348', triage: 'حالة مستقرة (متابعة قياسية)', date: '٢٣ مايو ٢٠٢٦', source: 'مدرسة سان جورج الدولية', color: 'text-primary font-bold' }
    ],
    reviewBtn: 'تحديد موعد للتقييم',
    profileTitle: 'الملف التعريفي للمنشأة الطبية',
    profileDesc: 'معلومات العيادة المتاحة لمرشدي ومستشاري المدارس الشريكة.',
    clinicName: 'مستشفى كليوباترا - قسم الرعاية النفسية والتدخل السريع',
    clinicDetails: 'العنوان: أبراج النيل، الجيزة، القاهرة | هاتف الطوارئ: ٩٩٩٩ ٣٣٠١ ٢ ٠٢+',
    bookTitle: 'إدارة المواعيد السريرية المتاحة',
    bookBtn: 'تأكيد الحجز',
    privacyNotice: '🔒 امتثال السرية الطبية: تخضع كافة بروتوكولات الربط لقوانين سرية المرضى. جميع الإحالات مشفرة ومعتمدة طبياً.'
  },
  eg: {
    title: '🏥 بوابة العيادات والمستشفيات الشريكة',
    tagline: 'استقبل تحويلات الطلبة، نظم مواعيد الكشف، وحدد جاهزيتك لحالات الطوارئ.',
    statusTitle: 'حالة العيادة واستقبال الحالات',
    statusActive: 'متاح: العيادة جاهزة للحالات الطارئة والمستعجلة',
    statusBusy: 'مشغول: بنستقبل الحجوزات القديمة بس حالياً',
    toggleStatus: 'تحديث حالة العيادة',
    referralTitle: 'طلبات الكشف والتحويلات المدرسية',
    referralDesc: 'حالات متوجهة ليك من الأخصائيين النفسيين في المدارس (ببيانات سرية وموافقة مسبقة).',
    refHeaders: ['كود الحالة السري', 'درجة الاستعجال', 'تاريخ التحويل', 'المدرسة', 'الإجراء المطلوب'],
    referrals: [
      { id: 'CASE-771', triage: 'طوارئ مستعجلة (أولوية أولى)', date: '٢٤ مايو ٢٠٢٦', source: 'مدرسة جرينفيلد الدولية', color: 'text-error font-bold' },
      { id: 'CASE-348', triage: 'كشف عادي (حالة مستقرة)', date: '٢٣ مايو ٢٠٢٦', source: 'مدرسة سان جورج الدولية', color: 'text-primary font-bold' }
    ],
    reviewBtn: 'تحديد ميعاد الكشف',
    profileTitle: 'بيانات العيادة أو المستشفى',
    profileDesc: 'المعلومات اللي بيشوفها الأخصائي في المدرسة عشان يقدر يحولك الحالات.',
    clinicName: 'مستشفيات كليوباترا - وحدة الدعم والتدخل النفسي',
    clinicDetails: 'العنوان: كورنيش النيل، الجيزة، القاهرة | تليفون: ٩٩٩٩ ٣٣٠١ ٢ ٠٢+',
    bookTitle: 'جدول المواعيد المتاحة للحجز',
    bookBtn: 'حجز الميعاد',
    privacyNotice: '🔒 سرية تامة للمرضى: كل بيانات التحويلات محمية ومتشفرة حسب قوانين خصوصية المرضى والصحة النفسية.'
  }
};

export function Page() {
  const [lang, setLang] = useState('en');
  const [isEmergencyActive, setIsEmergencyActive] = useState(true);

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
    <section className={`space-y-8 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-textPrimary">{copy.title}</h1>
        <p className="text-sm text-textSecondary mt-2 leading-relaxed max-w-xl">{copy.tagline}</p>
      </div>

      {/* Triage Status Trigger */}
      <Card className={`p-6 border-2 flex flex-col sm:flex-row items-center justify-between gap-6 transition ${
        isEmergencyActive ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'
      }`}>
        <div className="flex items-center gap-4">
          <span className="text-3xl">{isEmergencyActive ? '🟢' : '🟡'}</span>
          <div>
            <h3 className="font-bold text-textPrimary text-sm sm:text-base">{copy.statusTitle}</h3>
            <p className="text-xs text-textSecondary mt-1 leading-relaxed">
              {isEmergencyActive ? copy.statusActive : copy.statusBusy}
            </p>
          </div>
        </div>
        <Button variant="ghost" className="font-bold border-primary/20 px-3.5 py-1.5 text-xs" onClick={() => setIsEmergencyActive(!isEmergencyActive)}>
          {copy.toggleStatus}
        </Button>
      </Card>

      {/* Referrals Queue */}
      <Card className="p-6 bg-surface space-y-4">
        <div>
          <h3 className="text-base font-bold text-textPrimary">{copy.referralTitle}</h3>
          <p className="text-xs text-textSecondary mt-1 leading-relaxed">{copy.referralDesc}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" dir="ltr">
            <thead>
              <tr className="border-b border-border/60 text-textSecondary font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">{copy.refHeaders[0]}</th>
                <th className="py-3 px-4">{copy.refHeaders[1]}</th>
                <th className="py-3 px-4">{copy.refHeaders[2]}</th>
                <th className="py-3 px-4">{copy.refHeaders[3]}</th>
                <th className="py-3 px-4 text-right">{copy.refHeaders[4]}</th>
              </tr>
            </thead>
            <tbody>
              {copy.referrals.map((r, idx) => (
                <tr key={idx} className="border-b border-border/40 hover:bg-background/40 transition">
                  <td className="py-3 px-4 font-bold text-primary">{r.id}</td>
                  <td className={`py-3 px-4 ${r.color}`}>{r.triage}</td>
                  <td className="py-3 px-4 text-textSecondary">{r.date}</td>
                  <td className="py-3 px-4 text-textSecondary font-medium">{r.source}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" className="px-3.5 py-1.5 text-xs font-semibold" onClick={() => alert(`Scheduling triage session for ${r.id}...`)}>
                      {copy.reviewBtn}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Hospital details & Referral slots */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile */}
        <Card className="p-6 bg-surface space-y-4">
          <h3 className="text-base font-bold text-textPrimary">{copy.profileTitle}</h3>
          <p className="text-xs text-textSecondary mt-1">{copy.profileDesc}</p>
          
          <div className="space-y-3 pt-2 text-xs font-semibold text-textSecondary">
            <div>
              <span className="text-[10px] text-muted block uppercase">Hospital / Unit Name</span>
              <span className="text-textPrimary text-sm font-bold block mt-1">{copy.clinicName}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase">Location & Dispatch Contact</span>
              <span className="text-textPrimary block mt-1">{copy.clinicDetails}</span>
            </div>
          </div>
        </Card>

        {/* Appointment Scheduler */}
        <Card className="p-6 bg-surface space-y-4">
          <h3 className="text-base font-bold text-textPrimary">{copy.bookTitle}</h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <span className="font-bold text-textPrimary block">May 25 (Mon) - 10:00 AM</span>
                <span className="text-[10px] text-textSecondary">Triage Counselor Room B</span>
              </div>
              <Button variant="primary" className="px-3 py-1.5 text-xs font-semibold" onClick={() => alert('Booking verified. Notification dispatched.')}>
                {copy.bookBtn}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <span className="font-bold text-textPrimary block">May 26 (Tue) - 02:30 PM</span>
                <span className="text-[10px] text-textSecondary">Triage Counselor Room A</span>
              </div>
              <Button variant="primary" className="px-3 py-1.5 text-xs font-semibold" onClick={() => alert('Booking verified. Notification dispatched.')}>
                {copy.bookBtn}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy compliance badge */}
      <Card className="p-5 border border-primary/10 bg-surface text-textSecondary text-[11px] leading-relaxed">
        {copy.privacyNotice}
      </Card>
    </section>
  );
}
export default Page;
