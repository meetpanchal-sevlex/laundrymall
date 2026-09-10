import type { Metadata } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import QueryProvider from "@/providers/QueryProvider";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laundrymall.in"),
  title: {
    default: "LaundryMall | Professional Laundry & Dry Cleaning Supplies",
    template: "%s | LaundryMall",
  },
  description: "The premier B2B supplier for commercial laundry, dry cleaning chemicals, packaging, and machinery.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "LaundryMall | Professional Laundry Supplies",
    description: "The premier B2B supplier for commercial laundry, dry cleaning chemicals, packaging, and machinery.",
    url: "https://laundrymall.in",
    siteName: "LaundryMall",
    images: [
      {
        url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "LaundryMall Supplies",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaundryMall | Professional Laundry & Dry Cleaning Supplies",
    description: "The premier B2B supplier for commercial laundry, dry cleaning chemicals, packaging, and machinery.",
    images: ["https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <SmoothScrollProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartDrawer />
            <MobileBottomNav />
            <Analytics />
            <SpeedInsights />
          </QueryProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
