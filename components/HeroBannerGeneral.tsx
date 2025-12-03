"use client";
import Image from "next/image";

export default function HeroBannerGeneral() {
  return (
    <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden flex items-end justify-center">

      {/* Desktop Image */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src="/images/banners/hero-desktop.png"
          alt="DealHunt Desktop Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Mobile Image */}
      <div className="md:hidden absolute inset-0">
        <Image
          src="/images/banners/hero-mobile.png"
          alt="DealHunt Mobile Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* CTA Button */}
      <div className="relative z-10 mb-10">
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
