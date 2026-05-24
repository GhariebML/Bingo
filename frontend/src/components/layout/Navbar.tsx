'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/layout/ThemeToggle';

const links = ['chat', 'dashboard', 'journal', 'exercises', 'safety', 'settings'];

export function Navbar() {
 const pathname = usePathname();

 return (
 <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
 <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
 <Link className="flex items-center gap-2 font-bold text-textPrimary" href="/">
 <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface shadow-sm">
 <Image alt="Bingo logo" fill sizes="40px" src="/bingo-logo.png" className="object-contain" priority />
 </span>
 Bingo
 </Link>
 <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-textPrimary">
 Demo Mode
 </span>
 <div className="flex flex-1 items-center justify-end gap-2">
 <div className="hidden md:flex items-center gap-2">
 {links.map((link) => (
 <Link
 key={link}
 className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition hover:bg-surface hover:text-textPrimary ${pathname === `/${link}` ? 'bg-surface text-textPrimary shadow-sm' : 'text-textSecondary'}`}
 href={`/${link}`}
 >
 {link}
 </Link>
 ))}
 </div>
 <ThemeToggle />
 </div>
 </div>
 </nav>
 );
}
