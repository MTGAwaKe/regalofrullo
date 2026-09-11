import type { Metadata, Viewport } from 'next';
import { Fredoka, Poppins, Space_Mono } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Per Frullino',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1231',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="it" className={`${fredoka.variable} ${poppins.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
