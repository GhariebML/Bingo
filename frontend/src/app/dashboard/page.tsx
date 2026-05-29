'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Wifi, LogIn } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { WellnessGrid } from '@/components/dashboard/WellnessGrid';
import { ProgressCards } from '@/components/dashboard/ProgressCards';
import { Button } from '@/components/ui/Button';
import { getDashboardSummary, mockLogin, listMoodEntries } from '@/lib/api';
import type { DashboardSummary } from '@/types/dashboard';
import type { MoodEntry } from '@/types/mood';
import dynamic from 'next/dynamic';

const MoodChart = dynamic(
  () => import('@/components/dashboard/MoodChart').then((mod) => mod.MoodChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] w-full bg-background rounded-lg mt-4 flex items-center justify-center text-textSecondary text-xs animate-pulse">
        Loading chart...
      </div>
    ),
  }
);

// Import new well-being components
import { VirtualTwin } from '@/components/dashboard/VirtualTwin';
import { FutureMeNotes } from '@/components/dashboard/FutureMeNotes';
import { PositiveMessages } from '@/components/dashboard/PositiveMessages';

const fallbackMoodData = [
  { day: 'Mon', mood: 'Stressed', score: 4 },
  { day: 'Tue', mood: 'Anxious', score: 5 },
  { day: 'Wed', mood: 'Calmer', score: 6 },
  { day: 'Thu', mood: 'Hopeful', score: 7 },
];

const langCopy = {
  en: {
    dashboardTitle: 'Student Well-Being Dashboard',
    tagline: 'Reflect on your emotional patterns, track energy levels, and build positive habits.',
    guestMode: 'Offline / Guest Mode',
    connectedMode: 'School Network Connected',
    indicatorsTitle: 'Energy & Stress Indicators',
    moodToday: 'Mood Today',
    energyLabel: 'Energy Level',
    stressLabel: 'Stress Level',
    sleepWarningTitle: '🌙 Late-Night Sentry Alert',
    sleepWarningDesc: 'Activity logged after 11:00 PM. High-quality rest is key to maintaining emotional energy.',
    positiveMoments: 'Saved Positive Memories',
    momentsSuffix: 'moments saved',
    demoLogin: 'Quick Demo Login',
    demoDesc: 'Simulate connection to your school well-being server'
  },
  ar: {
    dashboardTitle: 'لوحة قياس الرفاهية النفسية',
    tagline: 'منصة لتحليل الأنماط الوجدانية، إدارة مستويات الطاقة، وتعزيز المرونة النفسية.',
    guestMode: 'وضع التصفح المؤقت / غير متصل',
    connectedMode: 'اتصال آمن بشبكة الدعم المدرسي',
    indicatorsTitle: 'المؤشرات الحيوية للطاقة والضغط النفسي',
    moodToday: 'الحالة الوجدانية اليوم',
    energyLabel: 'مؤشر الحيوية والطاقة',
    stressLabel: 'مؤشر الإجهاد والتوتر',
    sleepWarningTitle: '🌙 تنبيه الساعات المتأخرة',
    sleepWarningDesc: 'تم رصد نشاط متأخر بعد الساعة 11:00 مساءً. نذكرك بأن جودة النوم تُعد الركيزة الأساسية للتعافي الذهني والجسدي.',
    positiveMoments: 'رصيد الذكريات المعرفية الإيجابية',
    momentsSuffix: 'لحظة إيجابية محفوظة',
    demoLogin: 'دخول تجريبي للمنصة',
    demoDesc: 'محاكاة الاتصال الآمن مع خوادم الدعم النفسي بالمدرسة'
  },
  eg: {
    dashboardTitle: 'لوحة المتابعة النفسية',
    tagline: 'راقب مشاعرك، افهم طاقتك، وابني عادات تخلي يومك أحسن.',
    guestMode: 'وضع التجربة / أوفلاين',
    connectedMode: 'متصل بأمان بشبكة مدرستك',
    indicatorsTitle: 'مؤشرات الضغط النفسي والطاقة',
    moodToday: 'الحالة المزاجية النهاردة',
    energyLabel: 'مستوى النشاط والطاقة',
    stressLabel: 'مستوى الإجهاد والضغط',
    sleepWarningTitle: '🌙 تنبيه السهر والإرهاق',
    sleepWarningDesc: 'سجلنا نشاط بعد 11 بالليل. افتكر إن نومك الكفاية هو اللي بيشحن طاقتك ويصفي ذهنك لليوم الجديد.',
    positiveMoments: 'رصيد لحظاتك الحلوة',
    momentsSuffix: 'ذكرى إيجابية شيلناها عشانك',
    demoLogin: 'دخول تجريبي سريع',
    demoDesc: 'جرب تربط حسابك بشكل افتراضي بسيستم المدرسة'
  }
};

export default function Page() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [status, setStatus] = useState('Loading dashboard summary...');
  const [lang, setLang] = useState('en');
  const [momentsCount, setMomentsCount] = useState(0);

  async function load() {
    try {
      const [sum, history] = await Promise.all([getDashboardSummary(), listMoodEntries()]);
      setSummary(sum);
      setMoodHistory(history);
      setStatus('Connected to backend API. Dashboard loaded from backend APIs.');
    } catch {
      setStatus('Sign in or use demo login to synchronize your reflection dashboard.');
    }

    // Sync saved positive moments count
    const saved = localStorage.getItem('Bingoo_future_notes');
    if (saved) {
      setMomentsCount(JSON.parse(saved).length);
    }
  }

  async function startDemoSession() {
    await mockLogin();
    await load();
  }

  useEffect(() => {
    void load();

    const updateLang = () => {
      setLang(localStorage.getItem('Bingoo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('Bingoo_lang_changed', updateLang);

    return () => window.removeEventListener('Bingoo_lang_changed', updateLang);
  }, []);

  const chartData = summary?.mood_trend?.length ? summary.mood_trend : fallbackMoodData;
  const isConnected = status.includes('Connected');
  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;
  const isRtl = lang === 'ar' || lang === 'eg';

  // Extract latest mood state for Virtual Twin and Indicators
  const latestEntry = moodHistory[0];
  const activeMoodRaw = latestEntry?.label?.toLowerCase() || 'calm';
  const activeMood = ['happy', 'calm', 'tired', 'stressed', 'energetic', 'thoughtful'].includes(activeMoodRaw)
    ? activeMoodRaw
    : 'calm';

  // Calculate dynamic energy and stress levels
  const getEnergyLevel = () => {
    switch (activeMood) {
      case 'energetic': return 90;
      case 'happy': return 80;
      case 'calm': return 65;
      case 'thoughtful': return 50;
      case 'stressed': return 40;
      case 'tired': return 20;
      default: return 60;
    }
  };

  const getStressLevel = () => {
    switch (activeMood) {
      case 'stressed': return 85;
      case 'tired': return 60;
      case 'thoughtful': return 40;
      case 'happy': case 'energetic': return 20;
      case 'calm': return 10;
      default: return 30;
    }
  };

  // Check for sleep activity warning (e.g. log between 11 PM and 5 AM)
  const hasSleepWarning = moodHistory.some(m => {
    if (!m.created_at) return false;
    const hour = new Date(m.created_at).getHours();
    return hour >= 23 || hour < 5;
  });

  return (
    <section className={`space-y-8 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-textPrimary border border-border">
            <LayoutDashboard size={13} />
            {copy.dashboardTitle}
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-textPrimary">
            {lang === 'en' ? 'Welcome back!' : lang === 'ar' ? 'مرحبًا بك مجددًا!' : 'يا هلا بيك تاني!'}
          </h1>
          <p className="mt-2 text-sm text-textSecondary leading-relaxed max-w-xl">
            {copy.tagline}
          </p>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold border transition-colors select-none ${
          isConnected 
            ? 'bg-surface border-success/40 text-textPrimary' 
            : 'bg-surface border-border text-textPrimary'
        }`}>
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span>{copy.connectedMode}</span>
            </>
          ) : (
            <>
              <Wifi size={14} className="text-muted" />
              <span>{copy.guestMode}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] items-start">
        
        {/* Left Column: Avatar & Interactive Tracking */}
        <div className="space-y-6">
          {/* 1. Virtual Twin Avatar */}
          <VirtualTwin currentMood={activeMood} />

          {/* 2. Mood check-in and wellness grid */}
          <div className="grid gap-6 sm:grid-cols-1">
            <MoodCheckIn onSuccess={load} />
            <WellnessGrid moodHistory={moodHistory} />
          </div>

          {/* 3. Trend chart */}
          <Card className="p-6 bg-surface">
            <h3 className="text-base font-bold text-textPrimary mb-4">
              {lang === 'en' ? 'Emotional Trends (Weekly)' : 'منحنى الحالة المزاجية (أسبوعي)'}
            </h3>
            <MoodChart data={chartData} />
          </Card>
        </div>

        {/* Right Column: Health Indicators, Future Note saving, and Positive alerts */}
        <div className="space-y-6">
          
          {/* 1. Mood, Energy & Stress Level Indicators */}
          <Card className="p-6 bg-surface space-y-5">
            <h3 className="text-base font-bold text-textPrimary border-b border-border/60 pb-2">
              {copy.indicatorsTitle}
            </h3>
            
            {/* Mood Today Indicator */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-textSecondary">{copy.moodToday}</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary capitalize font-bold">
                {activeMood === 'happy' && '😊 Happy'}
                {activeMood === 'calm' && '😌 Calm'}
                {activeMood === 'tired' && '🥱 Tired'}
                {activeMood === 'stressed' && '🤯 Stressed'}
                {activeMood === 'energetic' && '⚡ Energetic'}
                {activeMood === 'thoughtful' && '🧠 Thoughtful'}
              </span>
            </div>

            {/* Energy Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-textSecondary">{copy.energyLabel}</span>
                <span className="font-bold text-textPrimary">{getEnergyLevel()}%</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary transition-all duration-1000 rounded-full" 
                  style={{ width: `${getEnergyLevel()}%` }}
                />
              </div>
            </div>

            {/* Stress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-textSecondary">{copy.stressLabel}</span>
                <span className="font-bold text-textPrimary">{getStressLevel()}%</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${
                    getStressLevel() > 70 ? 'bg-error' : 'bg-primary'
                  }`} 
                  style={{ width: `${getStressLevel()}%` }}
                />
              </div>
            </div>

            {/* Positive moments saved */}
            <div className="flex justify-between items-center text-xs border-t border-border/60 pt-4">
              <span className="font-semibold text-textSecondary">{copy.positiveMoments}</span>
              <span className="font-bold text-primary">
                {momentsCount} {copy.momentsSuffix}
              </span>
            </div>

            {/* Late-Night Sentry Warning Banner */}
            {hasSleepWarning && (
              <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 text-xs flex gap-3 items-start animate-pulse">
                <span className="text-xl">⚠️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-textPrimary">{copy.sleepWarningTitle}</h4>
                  <p className="text-textSecondary leading-relaxed">{copy.sleepWarningDesc}</p>
                </div>
              </div>
            )}
          </Card>

          {/* 2. Positive Micro-Messages card */}
          <PositiveMessages />

          {/* 3. Future Me Notes module */}
          <FutureMeNotes currentMood={activeMood} />
        </div>

      </div>

      {/* Connection Actions if guest */}
      {!isConnected ? (
        <Card className="p-6 border border-primary/10 bg-surface flex flex-wrap items-center justify-between gap-4 rounded-2xl">
          <div className="space-y-1">
            <p className="font-bold text-textPrimary text-sm">{copy.demoLogin}</p>
            <p className="text-xs text-textSecondary">{copy.demoDesc}</p>
          </div>
          <Button onClick={() => void startDemoSession()} className="flex items-center gap-2 text-xs py-2 px-4">
            <LogIn size={14} />
            <span>{copy.demoLogin}</span>
          </Button>
        </Card>
      ) : null}

      <div className="pt-2">
        <ProgressCards 
          journals={summary?.journal_entries}
          moods={summary?.mood_checkins}
          exercises={summary?.exercises_tried}
        />
      </div>
    </section>
  );
}
