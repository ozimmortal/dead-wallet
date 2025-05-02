import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logoImage from "@/public/logo-image.png"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'SolPluse | Analyze Wallet Activity & Transactions',
    template: '%s | SolPluse', // For dynamic titles
  },
  description: 'Check if a Solana wallet is active or dead. View transaction history, balance changes, and activity patterns for any SOL address. Get comprehensive analytics for Solana blockchain wallets.',
  keywords: [
    'Solana wallet checker', 
    'Solana transaction history',
    'SOL address analyzer',
    'crypto wallet analytics',
    'blockchain activity tracker',
    'Solana wallet activity',
    'dead wallet checker',
    'Solana balance changes'
  ],
  metadataBase: new URL('https://solpluse.com'), // Add your actual domain
  alternates: {
    canonical: '/', // Important for SEO
  },
  openGraph: {
    title: 'SolPluse | Solana Wallet Analytics',
    description: 'Comprehensive analytics for Solana wallets including transaction history and activity patterns',
    url: 'https://solpluse.com', // Add your actual domain
    siteName: 'SolPluse',
    images: [
      {
        url: logoImage.src,
        width: 800,
        height: 600,
        alt: 'SolPluse Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolPluse | Solana Wallet Analytics',
    description: 'Analyze any Solana wallet activity with comprehensive transaction insights',
    images: [logoImage.src],
    creator: '@ozimmortal', // Add your Twitter handle
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'cryptocurrency',
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
      </body>
    </html>
  );
}
