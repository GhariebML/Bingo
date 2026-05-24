'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Send, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

/* ─── Types ─── */
interface GardenFlower {
  id: string;
  text: string;
  emoji: string;
  createdAt: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
}

/* ─── Constants ─── */
const STORAGE_KEY = 'bingo_garden_flowers';

const FLOWER_TYPES: { emoji: string; name: string }[] = [
  { emoji: '🌸', name: 'rose' },
  { emoji: '🌷', name: 'tulip' },
  { emoji: '🌻', name: 'sunflower' },
  { emoji: '🌼', name: 'daisy' },
  { emoji: '💐', name: 'lily' },
];

const PARTICLE_COLORS = [
  '#f9a8d4', '#fbbf24', '#a78bfa', '#34d399',
  '#f87171', '#60a5fa', '#fb923c', '#e879f9',
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─── Particle burst component ─── */
function BloomParticles({ originId }: { originId: string }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: `${originId}-p-${i}`,
      x: 0,
      y: 0,
      color: randomPick(PARTICLE_COLORS),
      angle: (360 / 8) * i + (Math.random() * 30 - 15),
      distance: 40 + Math.random() * 35,
    }))
  );

  return (
    <AnimatePresence>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{
              width: 7,
              height: 7,
              backgroundColor: p.color,
            }}
          />
        );
      })}
    </AnimatePresence>
  );
}

/* ─── Main page ─── */
export default function GratitudeGardenPage() {
  const [flowers, setFlowers] = useState<GardenFlower[]>([]);
  const [input, setInput] = useState('');
  const [bloomingId, setBloomingId] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  /* ─ Load from localStorage ─ */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFlowers(JSON.parse(raw));
    } catch {
      /* ignore corrupt data */
    }
    setMounted(true);
  }, []);

  /* ─ Persist on change ─ */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowers));
  }, [flowers, mounted]);

  /* ─ Submit handler ─ */
  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newFlower: GardenFlower = {
      id: `flower-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: trimmed,
      emoji: randomPick(FLOWER_TYPES).emoji,
      createdAt: new Date().toISOString(),
    };

    setFlowers((prev) => [...prev, newFlower]);
    setInput('');
    setBloomingId(newFlower.id);

    // Clear particle effect after animation completes
    setTimeout(() => setBloomingId(null), 800);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* ─ Render ─ */
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-32 relative min-h-screen">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/games"
          className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-textSecondary hover:text-primary hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Flower2 size={20} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-textPrimary">Gratitude Garden</h1>
          <p className="text-sm text-textSecondary">
            Plant what you&rsquo;re grateful for and watch your garden bloom.
          </p>
        </div>

        {/* Counter badge */}
        <motion.div
          key={flowers.length}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1.5 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-semibold select-none"
        >
          <Sparkles size={13} />
          {flowers.length} gratitude{flowers.length !== 1 ? 's' : ''} planted 🌱
        </motion.div>
      </div>

      {/* ── Garden area ── */}
      <div className="rounded-2xl bg-surface border border-border min-h-[400px] p-6 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        {flowers.length === 0 && mounted && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-72 text-center text-textSecondary space-y-3"
          >
            <span className="text-6xl select-none">🌱</span>
            <p className="text-sm max-w-xs leading-relaxed">
              Your garden is empty! Type something you&rsquo;re grateful for below to plant your first flower.
            </p>
          </motion.div>
        )}

        {/* Flowers grid */}
        <div className="flex flex-wrap gap-4 relative z-10">
          <AnimatePresence>
            {flowers.map((flower) => (
              <motion.div
                key={flower.id}
                layout
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{
                  scale: 1,
                  rotate: [0, 8, -8, 4, 0],
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 18,
                  rotate: { delay: 0.15, duration: 0.5, ease: 'easeInOut' },
                }}
                className="relative flex flex-col items-center w-20 cursor-pointer group"
                onClick={() =>
                  setActiveTooltip((prev) =>
                    prev === flower.id ? null : flower.id
                  )
                }
                onMouseEnter={() => setActiveTooltip(flower.id)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Particle burst when blooming */}
                {bloomingId === flower.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BloomParticles originId={flower.id} />
                  </div>
                )}

                {/* Emoji */}
                <motion.span
                  className="text-4xl select-none drop-shadow-sm"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                >
                  {flower.emoji}
                </motion.span>

                {/* Truncated label always visible */}
                <span className="mt-1 text-[10px] text-textSecondary leading-tight text-center line-clamp-2 w-full break-words">
                  {flower.text}
                </span>

                {/* Tooltip overlay on hover/tap */}
                <AnimatePresence>
                  {activeTooltip === flower.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full mt-2 z-30 w-44 bg-background border border-border rounded-xl shadow-lg p-3 text-xs text-textPrimary leading-relaxed pointer-events-none"
                    >
                      <p className="font-medium mb-1 text-primary flex items-center gap-1">
                        <Sparkles size={10} /> Grateful for:
                      </p>
                      <p className="text-textSecondary">{flower.text}</p>
                      <p className="mt-1.5 text-[9px] text-textSecondary/60">
                        {new Date(flower.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Input area (fixed bottom) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 24 }}
            className="flex items-center gap-3 bg-surface/95 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-lg"
          >
            <span className="text-lg select-none">🌱</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I'm grateful for..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
              maxLength={200}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="bg-primary text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send size={15} />
              <span className="hidden sm:inline">Plant</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
