import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";

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
  title: "Mark Tools - Elegant Digital Utilities",
  description: "Minimalist suite of elegant digital tools designed for modern creators. Experience the beauty of simplicity with powerful functionality.",
  keywords: ["Mark Tools", "digital tools", "minimalist", "utilities", "productivity", "elegant design"],
  authors: [{ name: "Mark Tools Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Mark Tools - Elegant Digital Utilities",
    description: "Minimalist suite of elegant digital tools designed for modern creators",
    url: "https://marktools.com",
    siteName: "Mark Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Tools",
    description: "Minimalist suite of elegant digital tools",
  },
  other: {
    'google-adsense-account': 'ca-pub-8046841280254497',
    'google-site-verification': 'your-verification-code',
  },
  verification: {
    google: 'your-verification-code',
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
