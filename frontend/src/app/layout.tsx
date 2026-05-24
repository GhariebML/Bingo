import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Inter, Cairo } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const interHeading = Inter({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const interSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1020' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Bingo · AI Mental Wellness Companion',
  description: 'A calm place to pause, reflect, and take one safe next step. Bingo offers warm emotional support, journaling prompts, and guided grounding exercises.',
  openGraph: {
    title: 'Bingo · AI Mental Wellness Companion',
    description: 'A calm place to pause, reflect, and take one safe next step.',
    url: 'https://bingo-wellness.vercel.app',
    siteName: 'Bingo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bingo · AI Mental Wellness Companion',
    description: 'A calm place to pause, reflect, and take one safe next step.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interHeading.variable} ${interSans.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="relative min-h-screen overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Calming Aurora background orbs */}
          <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-30 dark:opacity-20 select-none">
            <div className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-sky-400/20 blur-[120px] animate-float-orb-1" />
            <div className="absolute top-[40%] -right-[10%] h-[45vw] w-[45vw] rounded-full bg-emerald-400/15 blur-[100px] animate-float-orb-2" />
            <div className="absolute -bottom-[10%] left-[20%] h-[55vw] w-[55vw] rounded-full bg-rose-400/10 blur-[130px] animate-float-orb-3" />
          </div>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main role="main" className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 md:py-10 pb-24 md:pb-10 z-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
