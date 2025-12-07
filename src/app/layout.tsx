import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: "https://marktools.web.id",
  title: "Mark Tools - Kumpulan Alat Instan untuk Produktivitas",
  description: "Kumpulan tools digital instan untuk meningkatkan produktivitas. QR Generator, Password Generator, 2FA Authenticator, Text Analyzer, URL Shortener, dan lainnya. Gratis, aman, dan mudah digunakan.",
  keywords: ["Mark Tools", "alat digital", "tools instan", "productivitas", "QR generator", "password generator", "2FA authenticator", "text analyzer", "URL shortener", "marktools.web.id"],
  authors: [{ name: "Mark Tools Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Mark Tools - Kumpulan Alat Instan untuk Produktivitas",
    description: "Kumpulan tools digital instan untuk meningkatkan produktivitas. Gratis, aman, dan mudah digunakan.",
    url: "https://marktools.web.id",
    siteName: "Mark Tools",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mark Tools - Kumpulan Alat Instan untuk Produktivitas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Tools",
    description: "Kumpulan tools digital instan untuk produktivitas",
    images: ["/twitter-image.jpg"],
    creator: "@marktools",
    site: "@marktools",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://marktools.web.id",
    languages: {
      "id-ID": "https://marktools.web.id",
      "en-US": "https://marktools.web.id/en",
    },
  },
  other: {
    "google-adsense-account": "ca-pub-8046841280254497",
    "google-site-verification": "your-verification-code",
  },
  verification: {
    google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8046841280254497"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
        style={{
          backgroundColor: '#121212',
          color: '#E0E0E0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        {/* Popunder Ads Script */}
        <Script
          src="//pl28207906.effectivegatecpm.com/5f/7f/76/5f7f76242297db38a4618877b37ba56c.js"
          strategy="afterInteractive"
        />
        
        <Header />
        <PageWrapper>
          {children}
        </PageWrapper>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
