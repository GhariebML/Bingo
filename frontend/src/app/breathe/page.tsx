'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Square, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { recordBreathingSession } from '@/lib/api';



type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const INHALE_TIME = 4000;
const HOLD_IN_TIME = 7000;
const EXHALE_TIME = 8000;
const HOLD_OUT_TIME = 0; // standard 4-7-8 breathing

export default function BreathePage() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [cycle, setCycle] = useState(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    let timeout: NodeJS.Timeout;

    const runPhase = (currentPhase: Phase) => {
      setPhase(currentPhase);
      
      let duration = INHALE_TIME;
      let nextPhase: Phase = 'hold-in';

      switch (currentPhase) {
        case 'inhale':
          duration = INHALE_TIME;
          nextPhase = 'hold-in';
          break;
        case 'hold-in':
          duration = HOLD_IN_TIME;
          nextPhase = 'exhale';
          break;
        case 'exhale':
          duration = EXHALE_TIME;
          nextPhase = 'inhale'; // 4-7-8 usually skips hold-out
          break;
      }

      timeout = setTimeout(() => {
        if (nextPhase === 'inhale') setCycle(c => c + 1);
        runPhase(nextPhase);
      }, duration);
    };

    runPhase('inhale');

    return () => clearTimeout(timeout);
  }, [isActive]);

  const getCircleScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale': return 1.8;
      case 'hold-in': return 1.8;
      case 'exhale': return 1;
      case 'hold-out': return 1;
      default: return 1;
    }
  };

  const getPhaseText = () => {
    if (!isActive) return 'Ready';
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold-in': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'hold-out': return 'Hold...';
      default: return '';
    }
  };

  const getPhaseDuration = () => {
    switch (phase) {
      case 'inhale': return INHALE_TIME / 1000;
      case 'hold-in': return HOLD_IN_TIME / 1000;
      case 'exhale': return EXHALE_TIME / 1000;
      case 'hold-out': return HOLD_OUT_TIME / 1000;
      default: return 1;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <Wind size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Guided Breathing</h1>
          <p className="text-sm text-textSecondary">Lower stress using the 4-7-8 breathing technique.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Visualizer Column */}
        <Card className="flex flex-col items-center justify-center min-h-[500px] p-8 relative overflow-hidden bg-surface/50">
          {/* Animated Background Blob */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
             <motion.div
               animate={{ 
                 scale: isActive ? [1, 1.2, 1] : 1,
                 opacity: isActive ? [0.3, 0.6, 0.3] : 0.3
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-96 h-96 bg-primary/30 rounded-full blur-3xl"
             />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-12 w-full">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Expanding Circle */}
              <motion.div
                initial={false}
                animate={{ scale: getCircleScale() }}
                transition={{ 
                  duration: isActive ? getPhaseDuration() : 1, 
                  ease: phase === 'hold-in' || phase === 'hold-out' ? "linear" : "easeInOut" 
                }}
                className="absolute inset-0 bg-gradient-to-tr from-secondary/40 to-primary/40 rounded-full blur-sm"
              />
              
              <motion.div
                initial={false}
                animate={{ scale: getCircleScale() }}
                transition={{ 
                  duration: isActive ? getPhaseDuration() : 1, 
                  ease: phase === 'hold-in' || phase === 'hold-out' ? "linear" : "easeInOut" 
                }}
                className="absolute inset-4 bg-gradient-to-tr from-secondary to-primary rounded-full shadow-glass"
              />

              <div className="relative z-20 text-white font-bold text-2xl drop-shadow-md">
                {getPhaseText()}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-2"
                >
                  <p className="text-sm font-medium text-textSecondary uppercase tracking-widest">Cycles Completed</p>
                  <p className="text-4xl font-extrabold text-textPrimary font-heading">{cycle}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              onClick={() => {
                if (!isActive) {
                  startTimeRef.current = Date.now();
                  setIsActive(true);
                } else {
                  setIsActive(false);
                  const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
                  if (cycle > 0) {
                    recordBreathingSession({
                      duration_seconds: durationSeconds,
                      cycles: cycle
                    }).catch(err => console.error('Failed to log breathing session:', err));
                  }
                  setPhase('inhale');
                  setCycle(0);
                }
              }}
              variant={isActive ? "ghost" : "primary"}
              className="w-48 font-bold flex items-center gap-2 justify-center rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isActive ? <><Square size={18} /> Stop Session</> : <><Play size={18} /> Start Breathing</>}
            </Button>
          </div>
        </Card>

        {/* Info Column */}
        <div className="space-y-6">
          <Card title="How it Works" className="shadow-sm">
            <p className="text-sm text-textSecondary leading-relaxed mb-4">
              The 4-7-8 breathing technique, also known as "relaxing breath," involves breathing in for 4 seconds, holding the breath for 7 seconds, and exhaling for 8 seconds.
            </p>
            <ul className="space-y-3 text-sm text-textPrimary">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">1</span>
                Inhale quietly through nose (4s)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">2</span>
                Hold breath completely (7s)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">3</span>
                Exhale forcefully through mouth (8s)
              </li>
            </ul>
          </Card>

          <Card title="Benefits" className="shadow-sm">
            <ul className="space-y-2 text-sm text-textSecondary list-disc pl-4">
              <li>Reduces anxiety and stress</li>
              <li>Helps you get to sleep quicker</li>
              <li>Manages cravings and anger</li>
              <li>Improves heart rate variability</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
