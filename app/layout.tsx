import "../styles/globals.css";
import { CompareProvider } from "@/context/CompareContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareStrip from "@/components/CompareStrip";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CompareProvider>
          <Navbar />
          <main>{children}</main>
          <CompareStrip />
          <Footer />
        </CompareProvider>
      </body>
    </html>
  );
}
