'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const thoughtPairs = [
  { negative: "I'm not good enough", positive: "I am growing and learning every day" },
  { negative: "Nobody likes me", positive: "I have people who care about me" },
  { negative: "I'll never succeed", positive: "Every expert was once a beginner" },
  { negative: "I always mess up", positive: "Mistakes are how I learn and grow" },
  { negative: "I'm so stupid", positive: "I am capable and smart in my own way" },
  { negative: "Everything is my fault", positive: "I can only control my own actions" },
  { negative: "I can't do anything right", positive: "I have accomplished many things" },
  { negative: "Nobody understands me", positive: "I can share my feelings with someone I trust" },
  { negative: "I'm a burden", positive: "My presence matters to people around me" },
  { negative: "Things will never get better", positive: "Tough times are temporary, I can get through this" },
  { negative: "I don't deserve happiness", positive: "Everyone deserves to feel happy and safe" },
  { negative: "I'm all alone", positive: "Feeling lonely doesn't mean I am alone" },
];

interface Bubble {
  id: number;
  negative: string;
  positive: string;
  x: number;
}

let bubbleIdCounter = 0;

export default function BubblePopPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [activeBubbles, setActiveBubbles] = useState<Bubble[]>([]);
  const [currentReframe, setCurrentReframe] = useState<string | null>(null);

  const spawnBubble = useCallback(() => {
    setActiveBubbles((prev) => {
      if (prev.length >= 5) return prev;
      const pair = thoughtPairs[Math.floor(Math.random() * thoughtPairs.length)];
      const x = Math.floor(Math.random() * 70) + 10; // 10-80%
      bubbleIdCounter += 1;
      return [
        ...prev,
        {
          id: bubbleIdCounter,
          negative: pair.negative,
          positive: pair.positive,
          x,
        },
      ];
    });
  }, []);

  const removeBubble = useCallback((id: number) => {
    setActiveBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const popBubble = useCallback(
    (bubble: Bubble) => {
      removeBubble(bubble.id);
      setScore((s) => s + 1);
      setCurrentReframe(bubble.positive);
      setTimeout(() => {
        setCurrentReframe(null);
      }, 2500);
    },
    [removeBubble]
  );

  // Spawn bubbles on interval
  useEffect(() => {
    if (!isPlaying) return;
    spawnBubble(); // spawn first immediately
    const interval = setInterval(spawnBubble, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, spawnBubble]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setActiveBubbles([]);
    setCurrentReframe(null);
    bubbleIdCounter = 0;
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setActiveBubbles([]);
    setCurrentReframe(null);
    bubbleIdCounter = 0;
  };

  // Random float duration between 8-10s per bubble
  const getFloatDuration = () => 8 + Math.random() * 2;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-textSecondary hover:text-textPrimary hover:border-primary/40 transition-all duration-300"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
              <Zap size={22} className="text-primary" />
              Bubble Pop
            </h1>
            <p className="text-sm text-textSecondary">
              Pop negative thoughts &amp; discover positive reframes
            </p>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-4">
            <motion.div
              key={score}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="text-sm font-semibold text-textPrimary bg-surface border border-border rounded-full px-4 py-2 shadow-sm"
            >
              💥 {score} bubbles popped
            </motion.div>
            <button
              onClick={resetGame}
              className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-textSecondary hover:text-error hover:border-error/40 transition-all duration-300"
              title="Reset game"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Intro Card (shown when not playing) */}
      <AnimatePresence mode="wait">
        {!isPlaying && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card glass-card-interactive rounded-2xl p-8 mb-8 text-center"
          >
            <div className="text-5xl mb-4">🫧</div>
            <h2 className="text-xl font-bold text-textPrimary mb-3">
              Emotion Bubble Pop
            </h2>
            <p className="text-textSecondary text-sm leading-relaxed max-w-md mx-auto mb-6">
              Negative thought bubbles will float across the screen. Tap them to
              pop them and reveal a positive reframe! This exercise helps you
              practice recognising and reframing unhelpful thoughts — a core
              Cognitive Behavioural Therapy (CBT) technique.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-8 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap size={18} />
              Start Game
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-[500px] rounded-2xl bg-surface border border-border overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className="absolute bottom-20 right-16 w-40 h-40 bg-secondary/5 rounded-full blur-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            </div>

            {/* Floating Bubbles */}
            <AnimatePresence>
              {activeBubbles.map((bubble) => {
                const duration = getFloatDuration();
                return (
                  <motion.div
                    key={bubble.id}
                    initial={{ y: '100%', opacity: 0, scale: 0.3 }}
                    animate={{
                      y: '-100%',
                      opacity: [0, 1, 1, 1, 0],
                      scale: 1,
                      x: [0, 15, -15, 15, -15, 0],
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.3, ease: 'easeOut' },
                    }}
                    transition={{
                      y: { duration, ease: 'linear' },
                      opacity: {
                        duration,
                        times: [0, 0.05, 0.5, 0.9, 1],
                        ease: 'linear',
                      },
                      scale: {
                        duration: 0.5,
                        ease: 'backOut',
                      },
                      x: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      },
                    }}
                    onAnimationComplete={(definition) => {
                      // Remove bubble when it floats off the top
                      if (
                        typeof definition === 'object' &&
                        definition !== null &&
                        'y' in definition
                      ) {
                        removeBubble(bubble.id);
                      }
                    }}
                    onClick={() => popBubble(bubble)}
                    className="absolute cursor-pointer select-none"
                    style={{ left: `${bubble.x}%`, bottom: 0 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.6 }}
                      className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border border-blue-200/60 dark:border-blue-700/40 shadow-lg flex items-center justify-center backdrop-blur-sm relative group"
                    >
                      {/* Shine effect */}
                      <div className="absolute top-2 left-3 w-6 h-4 bg-white/40 dark:bg-white/10 rounded-full blur-sm rotate-[-30deg]" />

                      {/* Bubble ring */}
                      <div className="absolute inset-1 rounded-full border border-blue-300/30 dark:border-blue-600/30" />

                      <span className="text-xs font-medium text-center p-3 text-blue-800 dark:text-blue-200 leading-tight">
                        {bubble.negative}
                      </span>

                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-200" />
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Reframe Card Overlay */}
            <AnimatePresence>
              {currentReframe && (
                <motion.div
                  key="reframe"
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                >
                  <div className="bg-surface border border-success/30 rounded-2xl p-6 shadow-lg text-center max-w-xs mx-auto">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 10, -10, 5, -5, 0] }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl mb-3"
                    >
                      ✨
                    </motion.div>
                    <p className="text-textPrimary font-semibold text-base leading-relaxed">
                      {currentReframe}
                    </p>
                    <div className="mt-3 w-12 h-1 bg-success/40 rounded-full mx-auto" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state hint */}
            {activeBubbles.length === 0 && !currentReframe && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="text-textSecondary text-sm"
                >
                  Bubbles are on their way...
                </motion.p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
