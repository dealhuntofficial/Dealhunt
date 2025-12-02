"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section className="relative w-full mt-6 overflow-hidden">

      <div className="relative w-full h-[260px] md:h-[480px]">

        {/* MOBILE = COVER, DESKTOP = CONTAIN */}
        <Image
          src="/images/banners/general-hero.jpg"
          alt="General Deals"
          fill
          priority
          className="object-cover md:object-contain"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-black/10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-xl mb-3">
            Smart Deals for Everyday You 💙
          </h1>

          <p className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
            Affordable • Trendy • Trusted
          </p>

          <p className="text-md md:text-xl mb-5 text-white drop-shadow-lg">
            Discover best-value products — gadgets, fashion, and lifestyle offers updated daily.
          </p>

          <a
            href="/products"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Explore Deals
          </a>
        </div>

      </div>

    </section>
  );
}
