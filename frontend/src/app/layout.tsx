import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bingo · AI Mental Wellness Companion',
  description: 'A calm place to pause, reflect, and take one safe next step.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${manrope.variable}`}>
      <body className="relative min-h-screen">
        {/* Decorative Floating Orbs */}
        <div className="glow-orb animate-float-slow bg-sky/50 w-[32rem] h-[32rem] top-[-10rem] left-[-10rem]" />
        <div className="glow-orb animate-float-medium bg-mint/40 w-[28rem] h-[28rem] bottom-[15rem] right-[-5rem]" />
        <div className="glow-orb animate-float-slow bg-sand/30 w-[24rem] h-[24rem] top-[30%] left-[40%]" />

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main role="main" className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 md:py-10 z-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
