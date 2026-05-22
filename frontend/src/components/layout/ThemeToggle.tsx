'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" className="w-9 h-9 p-0 flex items-center justify-center" disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-9 h-9 p-0 flex items-center justify-center"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-textSecondary hover:text-textPrimary transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-textSecondary hover:text-textPrimary transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
