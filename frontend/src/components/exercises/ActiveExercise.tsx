'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle, ArrowRight, Save, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createJournalEntry } from '@/lib/api';

interface ActiveExerciseProps {
  exerciseId: string;
  category: string;
  title: string;
  steps: string[];
  durationMinutes: number;
  onClose: () => void;
}

export function ActiveExercise({ exerciseId, category, title, steps, durationMinutes, onClose }: ActiveExerciseProps) {
  const [completed, setCompleted] = useState(false);

  // 1. Breathing Exercise State
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4); // seconds left in current phase
  const [breathCycle, setBreathCycle] = useState(1);
  const totalBreathCycles = 4;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 2. Grounding Checklist State
  const [groundingStep, setGroundingStep] = useState(0); // 0 = 5 see, 1 = 4 feel, etc.
  const [groundingInputs, setGroundingInputs] = useState<string[][]>([
    ['', '', '', '', ''], // 5 see
    ['', '', '', ''],     // 4 feel
    ['', '', ''],         // 3 hear
    ['', ''],             // 2 smell
    [''],                 // 1 taste
  ]);

  // 3. Thought Reframing State
  const [thoughtStep, setThoughtStep] = useState(0);
  const [originalThought, setOriginalThought] = useState('');
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [reframedThought, setReframedThought] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [journalError, setJournalError] = useState<string | null>(null);

  // 4. Worry Parking State
  const [worryText, setWorryText] = useState('');
  const [worryTime, setWorryTime] = useState('8:00 PM');
  const [presentTask, setPresentTask] = useState('');

  // 5. One Small Step State
  const [stepGoal, setStepGoal] = useState('');
  const [stepParts, setStepParts] = useState(['', '', '']);
  const [microAction, setMicroAction] = useState('');

  // Web Audio Refs for Hum Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const startAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.002, ctx.currentTime);
      gainNodeRef.current = gain;

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime); // Calming theta frequency 150 Hz
      oscRef.current = osc;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setSoundEnabled(true);
  };

  const stopAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setSoundEnabled(false);
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Clean up breathing timers & audio on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Breathing Timer Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else {
              // 'exhale' finished
              if (breathCycle >= totalBreathCycles) {
                setIsActive(false);
                setCompleted(true);
                return 0;
              } else {
                setBreathCycle((c) => c + 1);
                setBreathPhase('inhale');
                return 4;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, breathPhase, breathCycle]);

  // Audio gain swell volume modulator based on breathing phases
  useEffect(() => {
    if (soundEnabled && isActive && gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const gain = gainNodeRef.current;
      const now = ctx.currentTime;

      gain.gain.cancelScheduledValues(now);

      if (breathPhase === 'inhale') {
        gain.gain.linearRampToValueAtTime(0.07, now + 4);
      } else if (breathPhase === 'hold') {
        gain.gain.setValueAtTime(0.07, now);
      } else if (breathPhase === 'exhale') {
        gain.gain.linearRampToValueAtTime(0.005, now + 8);
      }
    } else if (gainNodeRef.current && audioCtxRef.current) {
      const gain = gainNodeRef.current;
      gain.gain.setValueAtTime(0.002, audioCtxRef.current.currentTime);
    }
  }, [breathPhase, isActive, soundEnabled]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setBreathPhase('inhale');
    setBreathTimer(4);
    setBreathCycle(1);
    setCompleted(false);
  };

  // Grounding Handlers
  const handleGroundingInput = (stepIndex: number, itemIndex: number, value: string) => {
    const nextInputs = [...groundingInputs];
    nextInputs[stepIndex][itemIndex] = value;
    setGroundingInputs(nextInputs);
  };

  const isGroundingStepValid = () => {
    return groundingInputs[groundingStep].every(val => val.trim() !== '');
  };

  const nextGroundingStep = () => {
    if (groundingStep < 4) {
      setGroundingStep(g => g + 1);
    } else {
      setCompleted(true);
    }
  };

  const prevGroundingStep = () => {
    if (groundingStep > 0) {
      setGroundingStep(g => g - 1);
    }
  };

  // Thought Reframing Handlers
  const saveReframeToJournal = async () => {
    setJournalError(null);
    try {
      await createJournalEntry({
        title: `Thought Reframing: ${originalThought.slice(0, 30)}...`,
        content: `Original thought: "${originalThought}"\n\nEvidence for: "${evidenceFor}"\nEvidence against: "${evidenceAgainst}"\n\nKind reframed thought: "${reframedThought}"`,
        mood: 'calm',
        emotion_tags: ['calm', 'proud'],
      });
      setJournalSaved(true);
    } catch {
      setJournalError('Demo session inactive. Log in or save in Demo Mode to save journal reflections.');
    }
  };

  // Worry Parking Handler
  const parkWorryToJournal = async () => {
    setJournalError(null);
    try {
      await createJournalEntry({
        title: `Worry Parked: ${worryText.slice(0, 30)}...`,
        content: `Parked worry: "${worryText}"\nReview time scheduled: ${worryTime}\nPresent moment task: "${presentTask}"`,
        mood: 'calm',
        emotion_tags: ['calm', 'hopeful'],
      });
      setJournalSaved(true);
    } catch {
      setJournalError('Demo session inactive. Log in or save in Demo Mode to save journal reflections.');
    }
  };

  // One Small Step Handler
  const commitStepToJournal = async () => {
    setJournalError(null);
    try {
      await createJournalEntry({
        title: `One Small Step: ${stepGoal.slice(0, 30)}...`,
        content: `Target Goal: "${stepGoal}"\n\nBite-sized breakdown:\n1. ${stepParts[0]}\n2. ${stepParts[1]}\n3. ${stepParts[2]}\n\nMicro-action committed: "${microAction}"`,
        mood: 'hopeful',
        emotion_tags: ['hopeful', 'proud'],
      });
      setJournalSaved(true);
    } catch {
      setJournalError('Demo session inactive. Log in or save in Demo Mode to save journal reflections.');
    }
  };

  // Render Completed State
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 blur-lg animate-pulse"></div>
          <CheckCircle className="relative text-primary h-16 w-16 stroke-[1.5]" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-extrabold text-textPrimary">Well done, you have completed it</h3>
          <p className="text-sm text-textSecondary leading-relaxed">
            Take a moment to notice how your breathing, shoulders, and chest feel right now compared to when you started.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={onClose} variant="ghost" className="px-6 py-2.5 text-xs">
            Return to list
          </Button>
          {exerciseId.includes('breathing') && (
            <Button onClick={resetBreathing} className="px-6 py-2.5 text-xs">
              Do it again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // A. RENDER BREATHING TIMER
  if (exerciseId === '4-7-8-breathing' || exerciseId === 'box-breathing') {
    const isHold = breathPhase === 'hold';
    const isInhale = breathPhase === 'inhale';
    const isExhale = breathPhase === 'exhale';

    // Calculate animation scales
    let scaleClass = 'scale-100';
    if (isActive) {
      if (isInhale) scaleClass = 'scale-125 transition-transform duration-[4000ms] ease-out';
      if (isHold) scaleClass = 'scale-125 duration-1000';
      if (isExhale) scaleClass = 'scale-100 transition-transform duration-[8000ms] ease-in-out';
    }

    return (
      <div className="flex flex-col items-center py-6 space-y-8 animate-scale-in">
        <div className="flex justify-between w-full border-b border-border pb-3">
          <h3 className="font-bold text-textPrimary text-base">{title} Practice</h3>
          <button onClick={onClose} className="text-muted hover:text-textPrimary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Breathing Circle */}
        <div className="relative h-64 w-full flex items-center justify-center">
          {/* Concentric Breathing Ripples */}
          {isActive && (
            <>
              <div className="absolute h-40 w-40 rounded-full bg-primary/10 border border-primary/20 animate-ripple-expand pointer-events-none" />
              <div className="absolute h-40 w-40 rounded-full bg-primary/10 border border-primary/20 animate-ripple-expand delay-2000 pointer-events-none" />
            </>
          )}
          {/* Calm background indicator */}
          <div
            className={`absolute h-48 w-48 rounded-full border border-primary/5 bg-primary/5 transition-all duration-1000 ${
              isActive && isHold ? 'scale-[1.15] opacity-50 bg-secondary/10 border-secondary/10' : ''
            }`}
          />
          {/* Animated Circle */}
          <div
            className={`h-40 w-40 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-colors duration-1000 ${scaleClass} ${
              isHold
                ? 'bg-secondary text-white'
                : isInhale
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-textPrimary'
            }`}
          >
            <span className="text-lg font-bold capitalize select-none tracking-wide">
              {isActive ? breathPhase : 'Ready'}
            </span>
            <span className="text-2xl font-extrabold mt-1 select-none font-sans">
              {isActive ? breathTimer : '4s'}
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div className="text-center space-y-2">
          <p className="text-xs text-textSecondary max-w-xs leading-relaxed font-semibold">
            {isInhale && 'Breathe in slowly through your nose...'}
            {isHold && 'Gently hold your breath. Soften your jaw.'}
            {isExhale && 'Let the breath fall away through your mouth...'}
            {!isActive && 'Click Start when you are sitting comfortably.'}
          </p>
          <span className="inline-block rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-bold text-textPrimary">
            Cycle {breathCycle} of {totalBreathCycles}
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">
          <Button onClick={resetBreathing} variant="ghost" className="p-3 rounded-full hover:bg-slate-100 shadow-sm" title="Reset">
            <RotateCcw size={16} className="text-textSecondary" />
          </Button>
          <Button
            onClick={toggleBreathing}
            className={`h-14 w-14 rounded-full flex items-center justify-center p-0 shadow-lg ${
              isActive ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/95'
            }`}
            title={isActive ? 'Pause' : 'Start'}
          >
            {isActive ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
          </Button>
          <Button
            onClick={toggleSound}
            variant="ghost"
            className={`p-3 rounded-full hover:bg-slate-100 shadow-sm ${soundEnabled ? 'text-primary' : 'text-textSecondary'}`}
            title={soundEnabled ? 'Disable Ambient Hum' : 'Enable Ambient Hum'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Button>
          <Button onClick={onClose} variant="ghost" className="p-3 rounded-full hover:bg-slate-100 shadow-sm" title="Close">
            <X size={16} className="text-textSecondary" />
          </Button>
        </div>
      </div>
    );
  }

  // B. RENDER 5-4-3-2-1 GROUNDING WIZARD
  if (exerciseId === 'five-four-three-two-one') {
    const titles = [
      'Name 5 things you can see',
      'Name 4 things you can feel or touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
    ];
    const placeholders = [
      ['Window', 'My hands', 'Laptop', 'A plant', 'Chair'],
      ['My socks on my feet', 'Warm sun on skin', 'Desk surface', 'Cozy shirt'],
      ['Hum of traffic', 'AC fan', 'A distant bird'],
      ['Morning coffee aroma', 'Rain outside'],
      ['Fresh peppermint mint'],
    ];

    return (
      <div className="space-y-6 animate-scale-in py-3">
        <div className="flex justify-between w-full border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-textPrimary text-base">{title}</h3>
            <p className="text-xs text-muted">Step {groundingStep + 1} of 5</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-textPrimary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step inputs */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-textPrimary uppercase tracking-wide">{titles[groundingStep]}</h4>
          <div className="grid gap-2.5">
            {groundingInputs[groundingStep].map((val, idx) => (
              <input
                key={idx}
                type="text"
                value={val}
                onChange={(event) => handleGroundingInput(groundingStep, idx, event.target.value)}
                placeholder={`e.g. ${placeholders[groundingStep][idx] || ''}`}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button onClick={prevGroundingStep} disabled={groundingStep === 0} variant="ghost" className="text-xs px-4 py-2">
            Back
          </Button>
          <Button onClick={nextGroundingStep} disabled={!isGroundingStepValid()} className="text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-sm">
            <span>{groundingStep === 4 ? 'Complete' : 'Continue'}</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    );
  }

  // C. RENDER THOUGHT REFRAMING WIZARD
  if (exerciseId === 'thought-reframing') {
    if (journalSaved) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-scale-in">
          <CheckCircle className="text-primary h-14 w-14 stroke-[1.5]" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-textPrimary">Reframed Thought Saved!</h3>
            <p className="text-sm text-textSecondary max-w-xs leading-relaxed">
              Your reflection has been added to your grounding journal. You can view it under the Journal tab.
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" className="px-6 py-2.5 text-xs">
            Return to practices
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-scale-in py-2">
        <div className="flex justify-between w-full border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-textPrimary text-base">{title} Wizard</h3>
            <p className="text-xs text-muted">Step {thoughtStep + 1} of 3</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-textPrimary transition-colors">
            <X size={18} />
          </button>
        </div>

        {thoughtStep === 0 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              Identify the Unhelpful Thought
            </label>
            <p className="text-xs text-textSecondary leading-relaxed">
              What repeating thought is weighing on your mind or causing stress right now? Write it out clearly.
            </p>
            <textarea
              value={originalThought}
              onChange={(event) => setOriginalThought(event.target.value)}
              placeholder="e.g. I am failing my classes and will never succeed."
              className="min-h-[120px] w-full rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {thoughtStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-textPrimary">Analyze the Facts</h4>
            <p className="text-xs text-textSecondary leading-relaxed">
              Let's look at the evidence objectively. What facts support this thought, and what facts contradict it?
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted font-heading">
                  Facts Supporting It
                </label>
                <textarea
                  value={evidenceFor}
                  onChange={(event) => setEvidenceFor(event.target.value)}
                  placeholder="I missed one assignment deadline yesterday."
                  className="min-h-[100px] w-full rounded-xl border border-border bg-surface p-3.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted font-heading">
                  Facts Against It
                </label>
                <textarea
                  value={evidenceAgainst}
                  onChange={(event) => setEvidenceAgainst(event.target.value)}
                  placeholder="I have passed all my previous exams, and the teacher said I can catch up."
                  className="min-h-[100px] w-full rounded-xl border border-border bg-surface p-3.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {thoughtStep === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              Formulate a Kinder, Balanced Perspective
            </label>
            <p className="text-xs text-textSecondary leading-relaxed">
              Based on the objective facts, write a replacement thought that is realistic, supportive, and kind.
            </p>
            <textarea
              value={reframedThought}
              onChange={(event) => setReframedThought(event.target.value)}
              placeholder="e.g. Missing one deadline is a setback, but it does not mean I am failing. I have a solid track record and can catch up."
              className="min-h-[120px] w-full rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {journalError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            ⚠️ {journalError}
          </p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            onClick={() => setThoughtStep((s) => s - 1)}
            disabled={thoughtStep === 0}
            variant="ghost"
            className="text-xs px-4 py-2"
          >
            Back
          </Button>

          {thoughtStep < 2 ? (
            <Button
              onClick={() => setThoughtStep((s) => s + 1)}
              disabled={thoughtStep === 0 ? !originalThought.trim() : !evidenceFor.trim() || !evidenceAgainst.trim()}
              className="text-xs px-5 py-2.5 flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </Button>
          ) : (
            <Button
              onClick={saveReframeToJournal}
              disabled={!reframedThought.trim()}
              className="text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <Save size={14} />
              <span>Save to Journal</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // D. RENDER WORRY PARKING WIZARD
  if (exerciseId === 'worry-parking') {
    if (journalSaved) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-scale-in">
          <CheckCircle className="text-primary h-14 w-14 stroke-[1.5]" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-textPrimary">Worry Parked Successfully!</h3>
            <p className="text-sm text-textSecondary max-w-xs leading-relaxed">
              Your worry is now parked. A reminder reflection was saved in your private journal.
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" className="px-6 py-2.5 text-xs">
            Return to practices
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-scale-in py-2">
        <div className="flex justify-between w-full border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-textPrimary text-base">{title}</h3>
            <p className="text-xs text-muted">A constructive boundary for intrusive thoughts</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-textPrimary transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              1. What is the worry?
            </label>
            <input
              type="text"
              value={worryText}
              onChange={(e) => setWorryText(e.target.value)}
              placeholder="e.g. Worried about not finishing my slides for tomorrow's meeting."
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              2. Choose a later time to review it
            </label>
            <input
              type="text"
              value={worryTime}
              onChange={(e) => setWorryTime(e.target.value)}
              placeholder="e.g. 7:30 PM tonight for 15 minutes"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              3. Identify one present task to return to
            </label>
            <input
              type="text"
              value={presentTask}
              onChange={(e) => setPresentTask(e.target.value)}
              placeholder="e.g. Reading the introductory chapter of the handbook."
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {journalError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            ⚠️ {journalError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button onClick={onClose} variant="ghost" className="text-xs px-4 py-2">
            Cancel
          </Button>
          <Button
            onClick={parkWorryToJournal}
            disabled={!worryText.trim() || !presentTask.trim()}
            className="text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-sm"
          >
            <Save size={14} />
            <span>Park Worry</span>
          </Button>
        </div>
      </div>
    );
  }

  // E. RENDER ONE SMALL STEP PLANNING
  if (exerciseId === 'one-small-step') {
    if (journalSaved) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-scale-in">
          <CheckCircle className="text-primary h-14 w-14 stroke-[1.5]" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-textPrimary">Micro-Action Logged!</h3>
            <p className="text-sm text-textSecondary max-w-xs leading-relaxed">
              Your committed micro-action and project breakdown have been saved as a reference entry in your journal.
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" className="px-6 py-2.5 text-xs">
            Return to practices
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-scale-in py-2">
        <div className="flex justify-between w-full border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-textPrimary text-base">{title} Planner</h3>
            <p className="text-xs text-muted">Break overwhelming goals down into microscopic wins</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-textPrimary transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              1. What is the larger goal that feels heavy?
            </label>
            <input
              type="text"
              value={stepGoal}
              onChange={(e) => setStepGoal(e.target.value)}
              placeholder="e.g. Studying for my midterm exam next week."
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              2. Break it down into 3 simple pieces
            </label>
            <div className="grid gap-2">
              {stepParts.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const nextParts = [...stepParts];
                    nextParts[idx] = e.target.value;
                    setStepParts(nextParts);
                  }}
                  placeholder={`Step ${idx + 1}`}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted font-heading">
              3. Identify a micro-action you can do in 5 minutes
            </label>
            <input
              type="text"
              value={microAction}
              onChange={(e) => setMicroAction(e.target.value)}
              placeholder="e.g. Open the syllabus and write down exam dates."
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {journalError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            ⚠️ {journalError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button onClick={onClose} variant="ghost" className="text-xs px-4 py-2">
            Cancel
          </Button>
          <Button
            onClick={commitStepToJournal}
            disabled={!stepGoal.trim() || !microAction.trim() || stepParts.some(p => !p.trim())}
            className="text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span>Commit to Step</span>
          </Button>
        </div>
      </div>
    );
  }

  // F. GENERAL DEFAULT STEP-BY-STEP FLOW (For other practices: body scan, study reset, etc.)
  return (
    <div className="space-y-6 animate-scale-in py-2">
      <div className="flex justify-between w-full border-b border-border pb-3">
        <h3 className="font-bold text-textPrimary text-base">{title}</h3>
        <button onClick={onClose} className="text-muted hover:text-textPrimary transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-surface border border-border p-5 text-sm leading-relaxed text-textSecondary shadow-sm space-y-4">
          <p className="font-semibold text-textPrimary">Guided steps:</p>
          <ol className="space-y-3.5">
            {steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-textPrimary border border-border">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <span className="text-xs text-muted font-medium">Duration: {durationMinutes} min practice</span>
        <div className="flex gap-2">
          <Button onClick={onClose} variant="ghost" className="text-xs px-4 py-2">
            Cancel
          </Button>
          <Button onClick={() => setCompleted(true)} className="text-xs px-5 py-2.5 shadow-sm">
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
}
