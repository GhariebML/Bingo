import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Quicksand, Tajawal } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const cairo = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

const interHeading = Quicksand({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const interSans = Quicksand({
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
  title: 'Bingooo · AI Mental Wellness Companion',
  description: 'A calm place to pause, reflect, and take one safe next step. Bingooo offers warm emotional support, journaling prompts, and guided grounding exercises.',
  openGraph: {
    title: 'Bingooo · AI Mental Wellness Companion',
    description: 'A calm place to pause, reflect, and take one safe next step.',
    url: 'https://Bingoo-wellness.vercel.app',
    siteName: 'Bingooo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bingooo · AI Mental Wellness Companion',
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
          {/* Subtle elegant gradient background */}
          <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-50 dark:opacity-30 select-none bg-gradient-to-b from-background to-surface" />
          <div className="pointer-events-none fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent z-[-1]" />
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
