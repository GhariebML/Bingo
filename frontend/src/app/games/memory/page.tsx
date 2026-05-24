'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Timer, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/* ─── Card pair data ─── */
const PAIRS: [string, string][] = [
  ['😰 Exam stress', '📝 Break into small study chunks'],
  ['😔 Feeling lonely', '💬 Reach out to a friend'],
  ['😤 Anger building', '🌬️ Take 5 deep breaths'],
  ['😟 Overthinking', '🚶 Go for a short walk'],
  ['😫 Overwhelmed', '📋 Write a simple to-do list'],
  ['😢 Feeling sad', '🎵 Listen to uplifting music'],
  ['😣 Can\'t focus', '⏱️ Try a 10-min focus sprint'],
  ['😩 Bad day', '📓 Write 3 good things that happened'],
];

interface CardData {
  id: number;
  pairIndex: number;
  type: 'problem' | 'solution';
  text: string;
}

function buildDeck(): CardData[] {
  const cards: CardData[] = [];
  PAIRS.forEach(([problem, solution], i) => {
    cards.push({ id: i * 2, pairIndex: i, type: 'problem', text: problem });
    cards.push({ id: i * 2 + 1, pairIndex: i, type: 'solution', text: solution });
  });
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/* ─── Confetti piece ─── */
function ConfettiPiece({ delay }: { delay: number }) {
  const x = Math.random() * 400 - 200;
  const y = -(Math.random() * 300 + 100);
  const rotation = Math.random() * 720 - 360;
  const colors = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-warning',
    'bg-accent', 'bg-error',
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 8 + 6;

  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
      }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        x: x,
        y: y,
        scale: [0, 1.2, 0.8],
        rotate: rotation,
      }}
      transition={{
        duration: 1.8,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
    />
  );
}

/* ─── Single card ─── */
function MemoryCard({
  card,
  isFlipped,
  isMatched,
  disabled,
  onClick,
}: {
  card: CardData;
  isFlipped: boolean;
  isMatched: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="aspect-square [perspective:600px]"
      onClick={() => !disabled && !isFlipped && !isMatched && onClick()}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={!isFlipped && !isMatched ? { scale: 1.05 } : {}}
      >
        {/* Back face (visible when NOT flipped) */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center text-2xl font-bold text-primary shadow-md transition-shadow duration-300 hover:shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          ?
        </div>

        {/* Front face (visible when flipped) */}
        <motion.div
          className={`absolute inset-0 rounded-xl flex items-center justify-center text-center p-2 transition-all duration-300 ${
            isMatched
              ? 'border-2 border-success bg-success/5'
              : 'bg-surface border border-border'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          animate={
            isMatched
              ? { scale: [1, 1.08, 1], transition: { duration: 0.5 } }
              : {}
          }
        >
          <span className="text-xs sm:text-sm font-semibold text-textPrimary leading-tight select-none">
            {card.text}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Main page ─── */
export default function MemoryMatchPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  /* Initialise / reset */
  const resetGame = useCallback(() => {
    setCards(buildDeck());
    setFlippedIndices([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setLocked(false);
    setShowCelebration(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  /* Persist best score */
  useEffect(() => {
    if (showCelebration) {
      const prev = localStorage.getItem('bingo_memory_best');
      if (!prev || moves < Number(prev)) {
        localStorage.setItem('bingo_memory_best', String(moves));
      }
    }
  }, [showCelebration, moves]);

  /* Handle card click */
  const handleCardClick = (index: number) => {
    if (locked) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.has(cards[index].pairIndex)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const [first, second] = newFlipped;
      const a = cards[first];
      const b = cards[second];

      if (a.pairIndex === b.pairIndex && a.type !== b.type) {
        // Match!
        setTimeout(() => {
          setMatchedPairs((prev) => {
            const next = new Set(prev);
            next.add(a.pairIndex);
            if (next.size === PAIRS.length) {
              setTimeout(() => setShowCelebration(true), 400);
            }
            return next;
          });
          setFlippedIndices([]);
          setLocked(false);
        }, 600);
      } else {
        // No match – flip back
        setTimeout(() => {
          setFlippedIndices([]);
          setLocked(false);
        }, 1000);
      }
    }
  };

  const bestScore = typeof window !== 'undefined'
    ? localStorage.getItem('bingo_memory_best')
    : null;

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/games"
            className="rounded-xl p-2 text-textSecondary hover:text-primary hover:bg-surface transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
              Memory Match
            </h1>
            <p className="text-xs text-textSecondary mt-0.5">
              Match each stressor with its coping strategy
            </p>
          </div>

          <Button variant="ghost" onClick={resetGame} className="gap-1.5">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        {/* ── Stats row ── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-textPrimary">
              {moves}
            </span>
            <span className="text-xs text-textSecondary">moves</span>
          </div>

          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" />
            <span className="text-sm font-semibold text-textPrimary">
              {matchedPairs.size}/{PAIRS.length}
            </span>
            <span className="text-xs text-textSecondary">matched</span>
          </div>

          {bestScore && (
            <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2 ml-auto">
              <Timer className="h-4 w-4 text-secondary" />
              <span className="text-xs text-textSecondary">
                Best: <span className="font-semibold text-textPrimary">{bestScore}</span>
              </span>
            </div>
          )}
        </div>

        {/* ── Card grid ── */}
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              card={card}
              isFlipped={flippedIndices.includes(index)}
              isMatched={matchedPairs.has(card.pairIndex)}
              disabled={locked}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </motion.div>

        {/* ── Matched pairs legend ── */}
        <AnimatePresence>
          {matchedPairs.size > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="text-sm font-semibold text-textSecondary mb-3">
                ✅ Matched pairs
              </h3>
              <div className="space-y-2">
                {Array.from(matchedPairs).map((pairIdx) => (
                  <motion.div
                    key={pairIdx}
                    className="glass-card rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 border border-success/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-xs font-semibold text-textPrimary">
                      {PAIRS[pairIdx][0]}
                    </span>
                    <span className="text-textSecondary text-xs">→</span>
                    <span className="text-xs font-semibold text-success">
                      {PAIRS[pairIdx][1]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Celebration overlay ── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <ConfettiPiece key={i} delay={i * 0.06} />
              ))}
            </div>

            <motion.div
              className="relative glass-card rounded-2xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center border border-success/30 shadow-2xl"
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            >
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Trophy className="h-16 w-16 text-warning mx-auto mb-4" />
              </motion.div>

              <h2 className="text-2xl font-bold text-textPrimary mb-2">
                🎉 Amazing!
              </h2>
              <p className="text-textSecondary text-sm mb-1">
                You matched all pairs!
              </p>
              <p className="text-textSecondary text-sm mb-6">
                Completed in{' '}
                <span className="font-bold text-primary">{moves}</span> moves
              </p>

              <div className="flex flex-col gap-3">
                <Button variant="primary" onClick={resetGame} className="w-full gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Play Again
                </Button>
                <Link href="/games" className="w-full">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Games
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
