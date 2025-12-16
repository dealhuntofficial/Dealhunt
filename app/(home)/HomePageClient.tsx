"use client";

import { useEffect, useState } from "react";

import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import GeneralDeals from "@/components/GeneralDeals";
import FiltersBar from "@/components/FiltersBar";

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

        setDeals((await dealsRes.json()).deals || []);
        setProducts((await prodRes.json()).products || []);
      } catch {
        setDeals([]);
        setProducts([]);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative bg-gradient-to-b from-blue-50 to-white">
      <HeroBannerGeneral />
      <BannerAdSection />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      <CategoryGrid mode="general" />
      <CartToHeartSection />

      {/* ✅ FILTER BAR FOR GENERAL DEALS */}
      <FiltersBar category="general" />

      <div className="max-w-7xl mx-auto px-4 mt-4">
        <GeneralDeals mode="general" externalProducts={products} />
      </div>

      <FloatingAIButtons />
    </main>
  );
      }
