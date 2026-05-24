'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, LayoutDashboard, BookOpen, Compass, Gamepad2, ShieldCheck, Settings } from 'lucide-react';

const tabs = [
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/exercises', label: 'Exercises', icon: Compass },
  { href: '/safety', label: 'Safety', icon: ShieldCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/90 backdrop-blur-md pb-safe-bottom shadow-lg select-none">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 ${
                isActive
                  ? 'text-primary scale-[1.05]'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <div
                className={`relative flex items-center justify-center rounded-xl p-1.5 transition-all duration-300 ${
                  isActive ? 'bg-surface border border-border shadow-sm' : ''
                }`}
              >
                <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              </div>
              <span className={`text-[10px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
