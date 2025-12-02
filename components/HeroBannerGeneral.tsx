"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* FIXED HEIGHT — Mobile to Desktop */}
      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[420px] lg:h-[520px]">

        <Image
          src="/images/banners/general-hero.jpg"
          alt="General Deals"
          fill
          priority
          className="object-cover object-center" 
          // object-center ensures center focus ALWAYS visible
        />
      </div>

      {/* CONTENT ON TOP OF IMAGE */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          Smart Deals for Everyday You 💙
        </h1>

        <p className="mt-1 text-sm sm:text-base md:text-lg font-semibold text-white opacity-90">
          Affordable • Trendy • Trusted
        </p>

        <p className="mt-1 text-xs sm:text-sm md:text-lg text-white opacity-90 max-w-xl">
          Discover best-value products — gadgets, fashion, lifestyle offers updated daily.
        </p>

        <a
          href="/products"
          className="mt-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg transition transform hover:scale-105"
        >
          Explore Deals
        </a>
      </div>

    </section>
  );
}
