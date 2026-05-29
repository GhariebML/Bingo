'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Square, Settings2, Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { recordBreathingSession } from '@/lib/api';

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const presets = {
  sleep: { name: '4-7-8 Sleep', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  box: { name: 'Box Breathing', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  resonant: { name: 'Resonant Calm', inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
  custom: { name: 'Custom Builder', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
};

const langCopy = {
  en: {
    title: 'Guided Breathing',
    tagline: 'Choose a pattern or customize your breathing to release tension.',
    cyclesCompleted: 'Cycles Completed',
    stopBtn: 'Stop Session',
    startBtn: 'Start Breathing',
    presetLabel: 'Breathing Pattern',
    audioToggle: 'Synth Sound Guide',
    inhaleLabel: 'Inhale Time',
    holdInLabel: 'Hold In Time',
    exhaleLabel: 'Exhale Time',
    holdOutLabel: 'Hold Out Time',
    howItWorks: 'How it Works',
    benefits: 'Benefits',
    benefitsList: [
      'Reduces anxiety and somatic stress',
      'Balances the autonomic nervous system',
      'Aids transition into sleep and rest',
      'Provides a quiet moment of mindfulness'
    ],
    phaseInhale: 'Breathe In...',
    phaseHoldIn: 'Hold Breath...',
    phaseExhale: 'Breathe Out...',
    phaseHoldOut: 'Pause & Hold...',
    phaseReady: 'Ready to breathe'
  },
  ar: {
    title: 'تمارين التنفس الموجهة',
    tagline: 'اختر النمط المناسب لك أو قم بتخصيص فترات الشهيق والزفير لتهدئة ذهنك.',
    cyclesCompleted: 'الدورات المكتملة',
    stopBtn: 'إنهاء الجلسة',
    startBtn: 'ابدأ التمرين',
    presetLabel: 'نمط التنفس',
    audioToggle: 'الموجه الصوتي (نغمة هادئة)',
    inhaleLabel: 'وقت الشهيق',
    holdInLabel: 'وقت كتم النفس (داخل)',
    exhaleLabel: 'وقت الزفير',
    holdOutLabel: 'وقت كتم النفس (خارج)',
    howItWorks: 'كيف يعمل التمرين',
    benefits: 'الفوائد الصحية',
    benefitsList: [
      'يقلل من التوتر والقلق الجسدي',
      'يعيد التوازن للجهاز العصبي اللاإرادي',
      'يساعد على الاستغراق في النوم',
      'يوفر لحظات من الهدوء والتركيز الواعي'
    ],
    phaseInhale: 'شهيق...',
    phaseHoldIn: 'أمسك النفس...',
    phaseExhale: 'زفير...',
    phaseHoldOut: 'توقف وأمسك النفس...',
    phaseReady: 'استعد للبدء'
  },
  eg: {
    title: 'تمارين التنفس المريحة',
    tagline: 'اختار النمط اللي يريحك أو ظبط الوقت على مزاجك عشان تفصل.',
    cyclesCompleted: 'مرات التمرين',
    stopBtn: 'فصل وإنهاء',
    startBtn: 'يلا نبدأ',
    presetLabel: 'شكل التنفس',
    audioToggle: 'نغمة صوتية تساعدك',
    inhaleLabel: 'شهيق (دخل الهوا)',
    holdInLabel: 'اكتم النفس جوة',
    exhaleLabel: 'زفير (خرج الهوا)',
    holdOutLabel: 'اكتم النفس برة',
    howItWorks: 'الفكرة إيه؟',
    benefits: 'التمرين ده بيفيد في إيه؟',
    benefitsList: [
      'بيقلل الإجهاد والتوتر في جسمك',
      'بيهدّي ضربات القلب ويخليك رايق',
      'بيساعدك تنام بسرعة بالليل',
      'بيديك وقت تفصل دماغك من الدوشة'
    ],
    phaseInhale: 'خد نَفَس (شهيق)...',
    phaseHoldIn: 'اكتم النفس جوة...',
    phaseExhale: 'طلع نَفَس (زفير)...',
    phaseHoldOut: 'استنى قبل النَفَس التاني...',
    phaseReady: 'جاهز تبدأ؟'
  }
};

export default function BreathePage() {
  const [lang, setLang] = useState('en');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof presets>('sleep');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Custom timings state (seconds)
  const [timings, setTimings] = useState({
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
  });

  const startTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

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

  // Apply preset times
  const applyPreset = (key: keyof typeof presets) => {
    setSelectedPreset(key);
    setTimings({
      inhale: presets[key].inhale,
      holdIn: presets[key].holdIn,
      exhale: presets[key].exhale,
      holdOut: presets[key].holdOut,
    });
  };

  // Start Audio Synthesis
  const startAudioSynth = () => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft triangle wave for ambient drone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gainNode;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  };

  // Modulate Audio Pitch & Gain based on Breathing Phase
  const updateAudioForPhase = (currentPhase: Phase, durationMs: number) => {
    const ctx = audioContextRef.current;
    const osc = oscillatorRef.current;
    const gain = gainNodeRef.current;

    if (!ctx || !osc || !gain || !audioEnabled) return;

    const now = ctx.currentTime;
    const durationSec = durationMs / 1000;

    switch (currentPhase) {
      case 'inhale':
        // Ramp up frequency (ascending breath pitch) and slowly increase volume
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 1.0); // smooth fade in

        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(osc.frequency.value, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + durationSec);
        break;

      case 'hold-in':
        // Keep pitch high, slightly pulse volume to simulate air-retention
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.15, now + durationSec / 2);
        gain.gain.linearRampToValueAtTime(0.2, now + durationSec);

        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(280, now);
        break;

      case 'exhale':
        // Ramp down frequency (descending calm pitch) and fade out volume
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.02, now + durationSec);

        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(osc.frequency.value, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + durationSec);
        break;

      case 'hold-out':
        // Fully silent during empty-lung retention
        gain.gain.cancelScheduledValues(now);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.3);
        break;
    }
  };

  // Stop Audio Synthesis
  const stopAudioSynth = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        /* already stopped */
      }
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
  };

  // Main timer loop
  useEffect(() => {
    if (!isActive) {
      stopAudioSynth();
      return;
    }

    let timeout: NodeJS.Timeout;
    startAudioSynth();

    const runCycle = (currentPhase: Phase) => {
      setPhase(currentPhase);
      
      let durationMs = 4000;
      let nextPhase: Phase = 'hold-in';

      // Load timings
      switch (currentPhase) {
        case 'inhale':
          durationMs = timings.inhale * 1000;
          nextPhase = timings.holdIn > 0 ? 'hold-in' : 'exhale';
          break;
        case 'hold-in':
          durationMs = timings.holdIn * 1000;
          nextPhase = 'exhale';
          break;
        case 'exhale':
          durationMs = timings.exhale * 1000;
          nextPhase = timings.holdOut > 0 ? 'hold-out' : 'inhale';
          break;
        case 'hold-out':
          durationMs = timings.holdOut * 1000;
          nextPhase = 'inhale';
          break;
      }

      // Trigger audio update
      updateAudioForPhase(currentPhase, durationMs);

      timeout = setTimeout(() => {
        if (nextPhase === 'inhale') {
          setCycle((c) => c + 1);
        }
        runCycle(nextPhase);
      }, durationMs);
    };

    runCycle('inhale');

    return () => {
      clearTimeout(timeout);
      stopAudioSynth();
    };
  }, [isActive, timings]);

  const getCircleScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale':
        return 1.8;
      case 'hold-in':
        return 1.8;
      case 'exhale':
        return 1.0;
      case 'hold-out':
      default:
        return 1.0;
    }
  };

  const getPhaseText = () => {
    if (!isActive) return copy.phaseReady;
    switch (phase) {
      case 'inhale':
        return copy.phaseInhale;
      case 'hold-in':
        return copy.phaseHoldIn;
      case 'exhale':
        return copy.phaseExhale;
      case 'hold-out':
        return copy.phaseHoldOut;
      default:
        return '';
    }
  };

  const getPhaseDuration = () => {
    switch (phase) {
      case 'inhale':
        return timings.inhale;
      case 'hold-in':
        return timings.holdIn;
      case 'exhale':
        return timings.exhale;
      case 'hold-out':
        return timings.holdOut;
      default:
        return 1;
    }
  };

  const handleStartStop = () => {
    if (!isActive) {
      startTimeRef.current = Date.now();
      setIsActive(true);
    } else {
      setIsActive(false);
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (cycle > 0) {
        recordBreathingSession({
          duration_seconds: durationSeconds,
          cycles: cycle,
        }).catch((err) => console.error('Failed to log breathing session:', err));
      }
      setPhase('inhale');
      setCycle(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className={`flex items-center gap-3 mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <Wind size={20} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-textPrimary">{copy.title}</h1>
          <p className="text-sm text-textSecondary">{copy.tagline}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ── Visualizer Panel ── */}
        <Card className="flex flex-col items-center justify-center min-h-[500px] p-8 relative overflow-hidden bg-surface">
          {/* Animated Ambient Circle Behind */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
            <motion.div
              animate={{
                scale: isActive ? [1, 1.25, 1] : 1,
                opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-96 h-96 bg-primary/30 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-12 w-full">
            {/* Pulsing Core Bubble */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div
                initial={false}
                animate={{ scale: getCircleScale() }}
                transition={{
                  duration: isActive ? getPhaseDuration() : 1,
                  ease: phase === 'hold-in' || phase === 'hold-out' ? 'linear' : 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-primary/30 rounded-full blur-sm"
              />

              <motion.div
                initial={false}
                animate={{ scale: getCircleScale() }}
                transition={{
                  duration: isActive ? getPhaseDuration() : 1,
                  ease: phase === 'hold-in' || phase === 'hold-out' ? 'linear' : 'easeInOut',
                }}
                className="absolute inset-3 bg-gradient-to-tr from-secondary to-primary rounded-full shadow-glass border border-white/20"
              />

              <div className="relative z-20 text-white font-bold text-center text-lg px-4 drop-shadow-md select-none">
                {getPhaseText()}
              </div>
            </div>

            {/* Cycles counter */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-1"
                >
                  <p className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                    {copy.cyclesCompleted}
                  </p>
                  <p className="text-3xl font-extrabold text-textPrimary font-heading">{cycle}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start/Stop Button */}
            <Button
              onClick={handleStartStop}
              variant={isActive ? 'ghost' : 'primary'}
              className="w-52 font-bold flex items-center gap-2 justify-center rounded-full shadow-md transition-all duration-300 hover:shadow-lg active:scale-98"
            >
              {isActive ? (
                <>
                  <Square size={16} /> {copy.stopBtn}
                </>
              ) : (
                <>
                  <Play size={16} /> {copy.startBtn}
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* ── Settings Panel & Info ── */}
        <div className="space-y-6">
          {/* Preset Customizer Controls */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-textPrimary flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
              <Settings2 size={16} className="text-primary" />
              {copy.presetLabel}
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => (
                <button
                  key={key}
                  disabled={isActive}
                  onClick={() => applyPreset(key)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedPreset === key
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-textSecondary hover:bg-background disabled:opacity-50'
                  }`}
                >
                  {presets[key].name}
                </button>
              ))}
            </div>

            {/* If Custom selected, render sliders */}
            {selectedPreset === 'custom' && (
              <div className="space-y-4 border-t border-border/40 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold mb-2">
                  <Sliders size={13} />
                  <span>Configure Custom Cycle (seconds)</span>
                </div>

                {[
                  { key: 'inhale', label: copy.inhaleLabel, min: 2, max: 8 },
                  { key: 'holdIn', label: copy.holdInLabel, min: 0, max: 10 },
                  { key: 'exhale', label: copy.exhaleLabel, min: 2, max: 10 },
                  { key: 'holdOut', label: copy.holdOutLabel, min: 0, max: 10 },
                ].map((s) => (
                  <div key={s.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-textSecondary">
                      <span>{s.label}</span>
                      <span className="font-bold text-textPrimary">
                        {timings[s.key as keyof typeof timings]}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      disabled={isActive}
                      value={timings[s.key as keyof typeof timings]}
                      onChange={(e) =>
                        setTimings({ ...timings, [s.key]: parseInt(e.target.value) })
                      }
                      className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Audio synthesiser toggle */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-6">
              <span className="text-xs font-bold text-textSecondary flex items-center gap-2">
                {audioEnabled ? (
                  <Volume2 size={16} className="text-primary" />
                ) : (
                  <VolumeX size={16} className="text-muted" />
                )}
                {copy.audioToggle}
              </span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={audioEnabled}
                  onChange={(e) => setAudioEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </Card>

          {/* Benefits Info Card */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-textPrimary flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
              <Sparkles size={16} className="text-secondary" />
              {copy.benefits}
            </h3>
            <ul className={`space-y-2.5 text-xs text-textSecondary ${isRtl ? 'list-none pr-1' : 'list-disc pl-4'}`}>
              {copy.benefitsList.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
