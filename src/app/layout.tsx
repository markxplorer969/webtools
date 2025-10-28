import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Mark Tools",
  description: "Mark Tools - Professional Tools Platform",
  keywords: ["Mark Tools", "Productivity", "Tools"],
  authors: [{ name: "Mark Tools Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Mark Tools",
    description: "Professional Tools Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Tools",
    description: "Professional Tools Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col antialiased bg-gray-950 text-gray-100"
      >
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
