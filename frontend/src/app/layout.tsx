import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

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
    <html lang="en" className={`${plusJakartaSans.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="relative min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main role="main" className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 md:py-10 z-0">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
