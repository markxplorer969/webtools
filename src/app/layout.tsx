import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import HelmetWrapper from "@/components/HelmetWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MarkTools - Collection of Useful Web Tools",
  description: "MarkTools is a collection of useful web tools for developers, marketers, and everyday users. Features 2FA authenticator, username checkers, photo generator, and more.",
  keywords: ["MarkTools", "web tools", "developer tools", "online tools", "productivity tools", "2fa authenticator", "username checker", "photo generator"],
  authors: [{ name: "MarkXplorer" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MarkTools - Collection of Useful Web Tools",
    description: "Collection of useful web tools for developers, marketers, and everyday users",
    url: "https://tools.markxplorer.my.id",
    siteName: "MarkTools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkTools - Collection of Useful Web Tools",
    description: "Collection of useful web tools for developers, marketers, and everyday users",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <HelmetWrapper>
        <body
          className={`${inter.variable} font-sans antialiased bg-hue-background text-hue-paragraph`}
        >
          {children}
          <Toaster />
        </body>
      </HelmetWrapper>
    </html>
  );
}
