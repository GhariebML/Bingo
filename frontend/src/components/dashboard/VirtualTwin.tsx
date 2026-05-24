'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Palette, Sparkles, X, Settings2 } from 'lucide-react';

interface VirtualTwinProps {
  currentMood?: string; // 'happy' | 'calm' | 'tired' | 'stressed' | 'energetic' | 'thoughtful'
}

interface Customizations {
  colorOverride: string; // 'auto' | 'teal' | 'pink' | 'purple' | 'gold' | 'emerald' | 'sunset'
  shape: string; // 'droplet' | 'circle' | 'squircle' | 'flower'
  auraSpeed: string; // 'calm' | 'active' | 'still'
}

const langCopy = {
  en: {
    title: 'Your Emotional Twin',
    tagline: 'Your twin grows and reflects with you.',
    energetic: 'Wow, you are full of sparks today! Let\'s channel this positive energy!',
    calm: 'You look peaceful and grounded. A perfect state for deep focus.',
    tired: 'Your twin noticed you seem a little tired today. Want to take a 2-minute reset?',
    stressed: 'Heavy feelings detected. Take a slow deep breath, we can take it step by step.',
    happy: 'Seeing you smile makes me glow! Keep sharing this happiness around.',
    thoughtful: 'In a reflecting mood? Writing in your journal might help clear your mind.',
    resetBtn: 'Start 2-min Reset',
    journalBtn: 'Write Journal',
    customizeBtn: 'Customize 🎨',
    defaultMsg: 'Hello! I am here to reflect your wellness journey today. How are you feeling?',
    modalTitle: 'Customize Your Twin',
    colorLabel: 'Aura Color Scheme',
    shapeLabel: 'Avatar Shape',
    speedLabel: 'Aura Movement',
    saveBtn: 'Save Settings',
    autoOption: 'Auto (Mood-based)',
    teal: 'Ocean Calm (Teal)',
    pink: 'Sakura Joy (Pink)',
    purple: 'Mystic Mind (Purple)',
    gold: 'Spark Energy (Gold)',
    emerald: 'Forest Peace (Green)',
    sunset: 'Warm Sunset (Orange)',
    shapeDroplet: 'Droplet',
    shapeCircle: 'Circle',
    shapeSquircle: 'Squircle',
    shapeFlower: 'Flower Star',
    speedCalm: 'Calm',
    speedActive: 'Active',
    speedStill: 'Still'
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
    customizeBtn: 'تخصيص 🎨',
    defaultMsg: 'أهلاً بك! أنا هنا لأرافقك في رحلتك نحو التوازن النفسي. كيف تشعر الآن؟',
    modalTitle: 'تخصيص مرافقك',
    colorLabel: 'نظام ألوان الهالة',
    shapeLabel: 'شكل المرافق',
    speedLabel: 'حركة الهالة',
    saveBtn: 'حفظ التغييرات',
    autoOption: 'تلقائي (حسب المزاج)',
    teal: 'هدوء المحيط (أزرق)',
    pink: 'بهجة الساكورا (وردي)',
    purple: 'العقل الغامض (بنفسجي)',
    gold: 'طاقة الحماس (ذهبي)',
    emerald: 'سلام الغابة (أخضر)',
    sunset: 'غروب دافئ (برتقالي)',
    shapeDroplet: 'قطرة',
    shapeCircle: 'دائرة',
    shapeSquircle: 'مربع ناعم',
    shapeFlower: 'نجمة وردية',
    speedCalm: 'هادئ',
    speedActive: 'نشط',
    speedStill: 'ثابت'
  },
  eg: {
    title: 'مُرافقك النفسي',
    tagline: 'حاسس بيك ومكمل معاك.',
    energetic: 'ما شاء الله على الطاقة! يومك مليان نشاط، يلا نستغل الحماس ده صح.',
    calm: 'رايق وهادي النهاردة. أحسن وقت تنجز فيه وتركز.',
    tired: 'شكل اليوم كان طويل عليك. تحب نفصل دقيقتين وناخد نَفَسنا؟',
    stressed: 'حاسس بضغط؟ خد نَفَس عميق، وكل حاجة هتعدي وتتظبط خطوة بخطوة.',
    happy: 'الضحكة دي بتنور الدنيا! خليك دايماً مبسوط وشاركنا طاقتك الحلوة.',
    thoughtful: 'سرحان وبتفكر كتير? ما تيجي نكتب اللي شاغل بالك عشان تروّق دماغك.',
    resetBtn: 'نفصل دقيقتين',
    journalBtn: 'فضفض في يومياتك',
    customizeBtn: 'تعديل الشكل 🎨',
    defaultMsg: 'يا أهلاً! أنا هنا معاك خطوة بخطوة عشان أسمعك وأحس بيك. طمني عليك، أخبارك إيه؟',
    modalTitle: 'عدل شكل توأمك',
    colorLabel: 'ألوان الهالة والنور',
    shapeLabel: 'الشكل',
    speedLabel: 'حركة النور',
    saveBtn: 'تأكيد الحفظ',
    autoOption: 'على حسب المود (تلقائي)',
    teal: 'هدوء البحر (لبني)',
    pink: 'فرحة الورد (بمبي)',
    purple: 'تأمل هادي (موف)',
    gold: 'كهربا ونشاط (أصفر)',
    emerald: 'رايقة وخضرا (أخضر)',
    sunset: 'غروب دافي (برتقالي)',
    shapeDroplet: 'نقطة مياه',
    shapeCircle: 'دايرة',
    shapeSquircle: 'مربع ناعم',
    shapeFlower: 'نجمة كرتون',
    speedCalm: 'هادي',
    speedActive: 'بيتحرك',
    speedStill: 'ثابت'
  }
};

const STORAGE_KEY = 'bingo_twin_customizations';

export function VirtualTwin({ currentMood = 'calm' }: VirtualTwinProps) {
  const [lang, setLang] = useState('en');
  const [showModal, setShowModal] = useState(false);
  const [customs, setCustoms] = useState<Customizations>({
    colorOverride: 'auto',
    shape: 'droplet',
    auraSpeed: 'calm',
  });

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem('bingo_lang') || 'en');
    };
    updateLang();
    window.addEventListener('bingo_lang_changed', updateLang);

    // Load customizations from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCustoms(JSON.parse(saved));
      }
    } catch {
      /* fallback */
    }

    return () => window.removeEventListener('bingo_lang_changed', updateLang);
  }, []);

  const copy = langCopy[lang as keyof typeof langCopy] || langCopy.en;

  const saveCustomizations = (newCustoms: Customizations) => {
    setCustoms(newCustoms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCustoms));
    setShowModal(false);
  };

  const getAuraColorClass = () => {
    const color = customs.colorOverride === 'auto' ? currentMood : customs.colorOverride;
    switch (color) {
      case 'happy':
      case 'gold':
        return 'from-amber-400 to-yellow-500';
      case 'calm':
      case 'teal':
        return 'from-teal-400 to-blue-400';
      case 'tired':
      case 'slate':
        return 'from-slate-400 to-indigo-400';
      case 'stressed':
      case 'sunset':
        return 'from-red-400 to-orange-400';
      case 'energetic':
      case 'pink':
        return 'from-pink-400 to-rose-400';
      case 'thoughtful':
      case 'purple':
        return 'from-purple-400 to-indigo-500';
      case 'emerald':
        return 'from-emerald-400 to-teal-500';
      default:
        return 'from-teal-400 to-blue-400';
    }
  };

  const getShapeClass = () => {
    switch (customs.shape) {
      case 'circle':
        return 'rounded-full';
      case 'squircle':
        return 'rounded-[2rem]';
      case 'flower':
        return 'rounded-[60%_40%_60%_40%/_40%_60%_40%_60%]';
      case 'droplet':
      default:
        return 'rounded-[40%]';
    }
  };

  const getAuraSpeedClass = () => {
    switch (customs.auraSpeed) {
      case 'active':
        return 'animate-float-orb-2 scale-110';
      case 'still':
        return 'opacity-20';
      case 'calm':
      default:
        return 'animate-particle-drift opacity-60';
    }
  };

  // Render SVG graphics
  const renderAvatarSVG = () => {
    const baseColor = getAuraColorClass();
    const shapeClass = getShapeClass();
    const auraSpeedClass = getAuraSpeedClass();

    return (
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* Abstract Particle Aura */}
        <div className={`absolute inset-0 flex items-center justify-center ${auraSpeedClass}`}>
          <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr ${baseColor} blur-2xl opacity-40 animate-pulse-glow`} />
          <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-white blur-sm opacity-50" />
          <div className="absolute bottom-4 right-6 w-6 h-6 rounded-full bg-white blur-md opacity-40" />
          <div className="absolute top-8 right-2 w-3 h-3 rounded-full bg-white blur-sm opacity-60" />
        </div>
        
        {/* Main Body (Floating with custom shape) */}
        <div className={`relative h-28 w-28 bg-gradient-to-br ${baseColor} shadow-glass flex items-center justify-center animate-avatar-bob border-[3px] border-white/40 overflow-hidden ${shapeClass}`}>
          {/* Inner glass highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          
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

  const isRtl = lang === 'ar' || lang === 'eg';

  return (
    <>
      <Card className="flex flex-col md:flex-row items-center gap-6 p-6 glass-card-interactive bg-surface">
        <div className="flex-shrink-0">
          {renderAvatarSVG()}
        </div>
        <div className={`flex-1 text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
          <div className={`flex items-center justify-center ${isRtl ? 'md:justify-start flex-row-reverse' : 'md:justify-start'} gap-2 mb-1`}>
            <h3 className="text-lg font-bold text-textPrimary">{copy.title}</h3>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-success animate-ping" />
          </div>
          <p className="text-xs text-textSecondary mb-3">{copy.tagline}</p>
          <p className="text-sm text-textPrimary font-medium leading-relaxed bg-background/50 p-4 rounded-xl border border-border/60">
            &ldquo;{getSubtext()}&rdquo;
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
            <Button variant="ghost" className="px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1 border-primary/20" onClick={() => setShowModal(true)}>
              <Palette size={13} />
              {copy.customizeBtn}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Customization Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div 
            className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
                <Settings2 size={18} className="text-primary" />
                {copy.modalTitle}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-textSecondary hover:bg-background hover:text-textPrimary transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* 1. Color scheme */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">
                  {copy.colorLabel}
                </label>
                <select
                  value={customs.colorOverride}
                  onChange={(e) => setCustoms({ ...customs, colorOverride: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="auto">{copy.autoOption}</option>
                  <option value="teal">{copy.teal}</option>
                  <option value="pink">{copy.pink}</option>
                  <option value="purple">{copy.purple}</option>
                  <option value="gold">{copy.gold}</option>
                  <option value="emerald">{copy.emerald}</option>
                  <option value="sunset">{copy.sunset}</option>
                </select>
              </div>

              {/* 2. Shape */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">
                  {copy.shapeLabel}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'droplet', label: copy.shapeDroplet, emoji: '💧' },
                    { key: 'circle', label: copy.shapeCircle, emoji: '🔵' },
                    { key: 'squircle', label: copy.shapeSquircle, emoji: '⬜' },
                    { key: 'flower', label: copy.shapeFlower, emoji: '🌸' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setCustoms({ ...customs, shape: s.key })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:bg-background ${
                        customs.shape === s.key 
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' 
                          : 'border-border text-textSecondary bg-surface'
                      }`}
                    >
                      <span className="text-lg select-none mb-1">{s.emoji}</span>
                      <span className="text-[10px] font-bold text-center leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Aura speed */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">
                  {copy.speedLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'calm', label: copy.speedCalm },
                    { key: 'active', label: copy.speedActive },
                    { key: 'still', label: copy.speedStill },
                  ].map((sp) => (
                    <button
                      key={sp.key}
                      onClick={() => setCustoms({ ...customs, auraSpeed: sp.key })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        customs.auraSpeed === sp.key 
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' 
                          : 'border-border text-textSecondary bg-background/40'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-background/50 border-t border-border/60 px-6 py-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button variant="primary" onClick={() => saveCustomizations(customs)} className="text-xs">
                {copy.saveBtn}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
