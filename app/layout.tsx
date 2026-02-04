import type { Metadata } from 'next';
import './globals.css';
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'BB Outlands Contest Drawing',
  description: 'Prize drawing system for Ultima Online Outlands guild members',
  openGraph: {
    title: 'BB Outlands Contest Drawing',
    description: 'Prize drawing system for Ultima Online Outlands guild members',
    type: 'website',
    siteName: 'UO Outlands Guild Drawings',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
