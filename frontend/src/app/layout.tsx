import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({
 subsets: ['latin'],
 variable: '--font-sans',
 display: 'swap',
});

import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
 title: 'Bingo · AI Mental Wellness Companion',
 description: 'A calm place to pause, reflect, and take one safe next step.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html lang="en" className={`${inter.variable} ${inter.variable}`} suppressHydrationWarning>
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
