'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 animate-fade-in-up">
      <Card className="max-w-md w-full text-center space-y-6 py-10 px-8 border-error/20 bg-error/5 shadow-soft">
        <div className="flex justify-center">
          <div className="rounded-full bg-error/10 p-4">
            <AlertCircle size={48} className="text-error" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-textPrimary">Something went wrong</h2>
          <p className="text-sm leading-relaxed text-textSecondary">
            Bingoo encountered an unexpected hiccup. Don't worry, your progress is safe. We can try loading this again.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => reset()} className="w-full">
            Try again
          </Button>
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full">
              Return to safety
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
