"use client";

import { useEffect, useState } from "react";

import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import GeneralDeals from "@/components/GeneralDeals";

export default function HomePageClient() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        // ⭐ FETCH FEATURED DEALS
        const dealsURL = new URL("/api/deals", base);
        const dealsRes = await fetch(dealsURL.toString(), { cache: "no-store" });
        const dealsJson = await dealsRes.json();
        setDeals(dealsJson.deals || []);

        // ⭐ FETCH GENERAL DEALS
        const prodURL = new URL("/api/products", base);
        const prodRes = await fetch(prodURL.toString(), { cache: "no-store" });
        const prodJson = await prodRes.json();
        setProducts(prodJson.products || []);

      } catch (error) {
        console.error("Home fetch error:", error);
        setDeals([]);
        setProducts([]);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* HERO + TOP BANNERS */}
      <HeroBannerGeneral />
      <BannerAdSection />

      {/* ⭐ FEATURED DEALS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      {/* ⭐ CATEGORIES + CART TO HEART */}
      <CategoryGrid mode="general" />
      <CartToHeartSection />

      {/* ⭐ GENERAL DEALS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <GeneralDeals mode="general" externalProducts={products} />
      </div>

      {/* AI BUTTONS */}
      <FloatingAIButtons />
    </main>
  );
}
