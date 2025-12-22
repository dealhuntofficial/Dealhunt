import "../styles/globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstallButton from "@/components/InstallButton";

export const metadata: Metadata = {
  title: "DealHunt",
  description: "Luxury deals at your fingertips",
  manifest: "/manifest.json",
  themeColor: "#facc15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <InstallButton />
        </Providers>
      </body>
    </html>
  );
}
