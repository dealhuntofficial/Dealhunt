"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden flex items-center justify-center">
      
      {/* Desktop Image */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src="public/images/banners/hero-desktop.jpg"
          alt="DealHunt Desktop Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Mobile Image */}
      <div className="md:hidden absolute inset-0">
        <Image
          src="public/images/banners/hero-mobile.jpg"
          alt="DealHunt Mobile Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 text-center px-5 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight
                       bg-gradient-to-r from-purple-600 via-blue-600 to-blue-400 
                       bg-clip-text text-transparent drop-shadow-md">
          Smart Deals<br />for Everyday You 💙
        </h1>

        <p className="text-white text-lg font-semibold mb-4 drop-shadow">
          Affordable • Trendy • Trusted
        </p>

        <a
          href="/products"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold 
                     px-7 py-3 rounded-full shadow-lg transition transform 
                     hover:scale-105 inline-block"
        >
          Explore Deals
        </a>
      </div>
    </section>
  );
}
