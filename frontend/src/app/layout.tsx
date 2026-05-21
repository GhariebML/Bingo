import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = { title: 'Bingo', description: 'AI mental wellness companion' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Navbar /><main role="main" className="mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</main></body></html>;
}
