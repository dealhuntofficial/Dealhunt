import "../styles/globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstallButton from "@/components/InstallButton";

export const metadata: Metadata = {
  title: "DealHunt",
  description: "Luxury deals at your fingertips",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-gray-50">
      <head>
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e9b300" /> {/* Golden yellow */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>

      <body className="min-h-screen flex flex-col text-gray-900 w-full">
        <Providers>
          <Navbar />

          {/* Main content */}
          <main className="flex-1 w-full">{children}</main>

          <Footer />

          {/* Floating Install Button */}
          <InstallButton />
        </Providers>
      </body>
    </html>
  );
}
