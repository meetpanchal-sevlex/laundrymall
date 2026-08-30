import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LaundryMall | Professional Laundry & Dry Cleaning Supplies",
  description: "The premier B2B supplier for commercial laundry, dry cleaning chemicals, packaging, and machinery.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        <QueryProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
          <MobileBottomNav />
          <Analytics />
          <SpeedInsights />
        </QueryProvider>
      </body>
    </html>
  );
}
