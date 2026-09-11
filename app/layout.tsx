import type { Metadata, Viewport } from 'next';
import { Big_Shoulders_Stencil, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

// Display face for sheet titles and the title-block lettering — a real
// stencil face, the way a hand-drafted technical drawing is captioned.
const stencil = Big_Shoulders_Stencil({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-stencil',
});

// Body copy. Paired with its own mono cut for anything genuinely numeric or
// technical (sheet numbers, piece counts) — the two are one coordinated
// type system rather than two unrelated typefaces.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'Per Frullino',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B2E4A',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="it" className={`${stencil.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
