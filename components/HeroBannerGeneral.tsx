"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section className="w-full mt-6">
      
      {/* PERFECT NON-CROPPED IMAGE */}
      <div className="w-full relative">
        <Image
          src="/images/banners/general-hero.jpg"
          alt="General Deals"
          width={2000}
          height={1000}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* TEXT CONTENT (separate block, no overlay, no overlapping) */}
      <div className="text-center mt-4 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
          Smart Deals for Everyday You 💙
        </h1>

        <p className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 bg-clip-text text-transparent">
          Affordable • Trendy • Trusted
        </p>

        <p className="text-lg md:text-xl mb-5 opacity-90">
          Discover best-value products — gadgets, fashion, and lifestyle offers updated daily.
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
