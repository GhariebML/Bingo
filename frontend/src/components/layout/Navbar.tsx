'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = ['chat', 'dashboard', 'journal', 'exercises', 'safety', 'settings'];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b border-white/70 bg-foam/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
        <Link className="flex items-center gap-2 font-bold text-ocean" href="/">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-white shadow-sm">
            <Image alt="Bingo logo" fill sizes="40px" src="/bingo-logo.png" className="object-contain" priority />
          </span>
          Bingo
        </Link>
        <span className="rounded-full border border-ocean/10 bg-mint/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ocean">
          Demo Mode
        </span>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          {links.map((link) => (
            <Link
              key={link}
              className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition hover:bg-white hover:text-ocean ${pathname === `/${link}` ? 'bg-white text-ocean shadow-sm' : 'text-slate-700'}`}
              href={`/${link}`}
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
