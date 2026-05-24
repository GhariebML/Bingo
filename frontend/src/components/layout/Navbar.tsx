'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';

const links = [
  { name: 'chat', label: 'Chat' },
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'journal', label: 'Journal' },
  { name: 'breathe', label: 'Breathe' },
  { name: 'games', label: '🎮 Games' },
  { name: 'school', label: '🏫 School' },
  { name: 'clinic', label: '🏥 Clinic' },
  { name: 'safety', label: 'Safety' },
  { name: 'settings', label: 'Settings' }
];

export function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('bingo_lang') || 'en';
    setLang(saved);
  }, []);

  const handleLangChange = (newLang: string) => {
    localStorage.setItem('bingo_lang', newLang);
    setLang(newLang);
    window.dispatchEvent(new Event('bingo_lang_changed'));
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link className="flex items-center gap-2 font-bold text-textPrimary" href="/">
          <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-surface shadow-sm">
            <Image alt="Bingo logo" fill sizes="36px" src="/bingo-logo.png" className="object-contain" priority />
          </span>
          Bingo
        </Link>
        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-textPrimary">
          Student Portal
        </span>
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden lg:flex items-center gap-1.5">
            {links.map((link) => (
              <Link
                key={link.name}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition hover:bg-surface hover:text-textPrimary ${pathname === `/${link.name}` ? 'bg-surface text-textPrimary shadow-sm' : 'text-textSecondary'}`}
                href={`/${link.name}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-surface px-2.5 py-1 pr-6 text-xs font-medium text-textPrimary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="eg">عامية مصرية</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-textSecondary">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
