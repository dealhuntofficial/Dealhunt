"use client";

import { useEffect, useState } from "react";

import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import GeneralDeals from "@/components/GeneralDeals";
import FiltersBar from '../../components/FiltersBar';

export default function HomePageClient() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL}`;

        const [dealsRes, prodRes] = await Promise.all([
          fetch(`${base}/api/deals`, { cache: "no-store" }),
          fetch(`${base}/api/products`, { cache: "no-store" }),
        ]);

        const dealsJson = await dealsRes.json();
        const prodJson = await prodRes.json();

        setDeals(dealsJson.deals || []);
        setProducts(prodJson.products || []);
      } catch (err) {
        console.error("Home fetch error", err);
        setDeals([]);
        setProducts([]);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative bg-gradient-to-b from-blue-50 to-white">
      {/* HERO + BANNERS */}
      <HeroBannerGeneral />
      <BannerAdSection />

      {/* FEATURED DEALS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      {/* CATEGORIES */}
      <CategoryGrid mode="general" />
      <CartToHeartSection />

      {/* 🔥 FIXED FILTER BAR (SAME AS CATEGORY PAGE) */}
      <FiltersBar context="general" />

      {/* GENERAL DEALS */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <GeneralDeals mode="general" externalProducts={products} />
      </div>

      <FloatingAIButtons />
    </main>
  );
}
