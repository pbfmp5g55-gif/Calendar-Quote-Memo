import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Calendar Quote Memo',
  description: 'Manage your days and find inspiration with daily quotes.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CalQuote',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-background text-foreground transition-colors duration-300 antialiased overflow-x-hidden">
        {/* Ambient Background Effect */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent opacity-80 pointer-events-none" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent opacity-80 pointer-events-none" />

        {children}
      </body>
    </html>
  );
}
