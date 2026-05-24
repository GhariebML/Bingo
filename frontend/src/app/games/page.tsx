'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gamepad2, Flower2, CircleDot, Brain, Clock, ArrowRight, Sparkles } from 'lucide-react';

const games = [
  {
    emoji: '🌸',
    icon: Flower2,
    title: 'Gratitude Garden',
    description:
      'Plant virtual flowers by writing what you\'re grateful for. Watch your garden grow!',
    tags: ['Gratitude', 'Calm'],
    time: '3-5 min',
    href: '/games/garden',
    gradient: 'from-pink-400 to-rose-500',
    shadowColor: 'shadow-pink-500/20',
    tagColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  },
  {
    emoji: '💭',
    icon: CircleDot,
    title: 'Bubble Pop',
    description:
      'Pop floating negative thoughts and discover positive reframes underneath.',
    tags: ['Reframing', 'Focus'],
    time: '2-4 min',
    href: '/games/bubbles',
    gradient: 'from-blue-400 to-cyan-500',
    shadowColor: 'shadow-blue-500/20',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    emoji: '🧠',
    icon: Brain,
    title: 'Memory Match',
    description:
      'Match stressful scenarios with their healthy coping strategies.',
    tags: ['Mindfulness', 'Learning'],
    time: '3-6 min',
    href: '/games/memory',
    gradient: 'from-purple-400 to-violet-500',
    shadowColor: 'shadow-purple-500/20',
    tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 16 },
  },
} as const;

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 14 },
  },
} as const;

export default function GamesHub() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      {/* ─── Hero Header ─── */}
      <motion.div
        className="mx-auto max-w-4xl text-center"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={headerVariants} className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Gamepad2 className="h-4 w-4" />
          Mini-Games
        </motion.div>

        <motion.h1
          variants={headerVariants}
          className="text-4xl font-extrabold tracking-tight text-textPrimary sm:text-5xl lg:text-6xl"
        >
          Wellness{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Games
          </span>
        </motion.h1>

        <motion.p
          variants={headerVariants}
          className="mx-auto mt-4 max-w-2xl text-base text-textSecondary sm:text-lg"
        >
          Fun activities designed to shift your mood and build positive habits
        </motion.p>

        <motion.div variants={headerVariants} className="mx-auto mt-3 flex items-center justify-center gap-1.5 text-xs text-textSecondary/70">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Pick a game below and start feeling better</span>
        </motion.div>
      </motion.div>

      {/* ─── Game Cards Grid ─── */}
      <motion.div
        className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div key={game.title} variants={cardVariants}>
              <Link href={game.href} className="group block h-full">
                <motion.div
                  className={`glass-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border transition-shadow duration-300 hover:${game.shadowColor} hover:shadow-xl`}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Gradient top border */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${game.gradient}`}
                  />

                  <div className="flex flex-1 flex-col p-6">
                    {/* Emoji + Icon */}
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-4xl leading-none">{game.emoji}</span>
                      <div className={`rounded-xl bg-gradient-to-br ${game.gradient} p-2 text-white shadow-md`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-textPrimary group-hover:text-primary transition-colors duration-200">
                      {game.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-textSecondary">
                      {game.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${game.tagColor}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer: time + CTA */}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{game.time}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                        Play Now
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── Bottom decorative note ─── */}
      <motion.p
        className="mx-auto mt-14 max-w-md text-center text-xs text-textSecondary/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        More games coming soon! Your progress is saved automatically.
      </motion.p>
    </div>
  );
}
