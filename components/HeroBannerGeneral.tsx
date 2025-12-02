"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section className="relative mt-6 overflow-hidden">

      {/* Background Image without fade */}
      <Image
        src="/images/banners/general-hero.jpg"
        alt="General Deals"
        fill
        priority
        className="object-cover object-center" 
      />

      {/* Optional subtle overlay (remove if not needed) */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center py-24 px-4 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-slideDown">
          Smart Deals for Everyday You 💙
        </h1>

        <p className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent animate-pulse">
          Affordable • Trendy • Trusted
        </p>

        <p className="text-lg md:text-xl mb-6 opacity-90 animate-fadeIn">
          Discover best-value products — gadgets, fashion, and lifestyle offers updated daily.
        </p>

        <a
          href="/products"
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105 animate-fadeIn delay-300"
        >
          Explore Deals
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

    </section>
  );
}
