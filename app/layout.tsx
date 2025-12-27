import type { Metadata } from 'next';
import { Space_Mono, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap', 
  preload: true,
});

export const metadata: Metadata = {
  title: 'ZEROGRID  | Enterprise Cyber Defense',
  description: 'Elite cybersecurity infrastructure. Cloud Security, VAPT, and Red Team operations.',
  metadataBase: new URL('https://zerogrid.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ZEROGRID  | Enterprise Cyber Defense',
    description: 'Elite cybersecurity infrastructure.',
    type: 'website',
  },
};

export const viewport = {
  themecolor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-[#050505]" suppressHydrationWarning>
      <body 
        className={`
          ${manrope.variable} 
          ${spaceMono.variable} 
          font-sans 
          bg-[#050505] 
          text-[#e0e0e0] 
          antialiased 
          selection:bg-[#ccff00] 
          selection:text-black
          overflow-x-hidden
        `}
      >
        {children}
      </body>
    </html>
  );
}