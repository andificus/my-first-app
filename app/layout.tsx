import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from './components/NavBar'
import ThemeProvider from './ThemeProvider'
import Footer from './components/Footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://andificus.com'),

  title: {
    default: 'Andificus',
    template: '%s | Andificus',
  },

  description:
    'Andificus is a modern personal web app built with Next.js, Supabase, and a focus on clean design, performance, and security.',

  openGraph: {
    title: 'Andificus',
    description:
      'A modern personal web app built with Next.js and Supabase.',
    url: 'https://andificus.com',
    siteName: 'Andificus',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Andificus',
    description:
      'A modern personal web app built with Next.js and Supabase.',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
