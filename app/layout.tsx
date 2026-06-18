import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import ScoresBar from '@/components/ScoresBar';
import Ticker from '@/components/Ticker';
import NavDropdown from '@/components/NavDropdown';
import { getScoresBarMatches, getCurrentMatchdayMatches } from '@/lib/football';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Cam's Corner | World Cup 2026",
  description: 'World Cup 2026 previews, reviews, standings, and schedule.',
};

export const revalidate = 300;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [barMatches, tickerMatches] = await Promise.all([
    getScoresBarMatches().catch(() => []),
    getCurrentMatchdayMatches().catch(() => []),
  ]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen flex flex-col`}>

        {/* Header + Nav */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-2xl">⚽</span>
              <div className="flex items-start gap-2">
                <div>
                  <h1 className="text-xl font-bold text-white leading-none">Cam&apos;s Corner</h1>
                  <p className="text-xs text-yellow-400 font-medium tracking-widest uppercase">World Cup 2026</p>
                </div>
                <span className="mt-0.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-yellow-400 text-gray-900 rounded-full leading-none">
                  Beta
                </span>
              </div>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                Home
              </Link>
              <NavDropdown />
            </nav>
          </div>
        </header>

        {/* Sticky scores bar — yesterday + today in Central Time, with live polling */}
        <div className="sticky top-[61px] z-20">
          <ScoresBar matches={barMatches} />
        </div>

        {/* Page content */}
        <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-2 text-center text-xs text-gray-600">
          Data provided by football-data.org
        </footer>

        {/* Sticky bottom ticker — full current matchday */}
        <div className="sticky bottom-0 z-20">
          <Ticker matches={tickerMatches} />
        </div>

      </body>
    </html>
  );
}
