"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section
      className="relative w-full overflow-hidden mt-6"
      style={{ height: "auto" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/banners/general-hero.jpg"
          alt="General Deals"
          fill
          priority
          className="object-contain md:object-cover"
        />
      </div>

      {/* Overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/20 z-0"></div>

      {/* Text Section */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-16 md:py-24 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Smart Deals for Everyday You 💙
        </h1>

        <p className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent">
          Affordable • Trendy • Trusted
        </p>

        <p className="text-lg md:text-xl mb-6 opacity-90">
          Discover best-value products — gadgets, fashion, and lifestyle offers
          updated daily.
        </p>

        <a
          href="/products"
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
        >
          Explore Deals
        </a>
      </div>
    </section>
  );
}
