"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import FeaturedProducts from "@/components/FeaturedProducts";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import FilterSidebar from "@/components/FilterSidebar";
import GeneralDeals from "@/components/GeneralDeals"; // ⭐ Add this

export default function HomePageClient() {
  const params = useSearchParams();

  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false); // ⭐ For show/hide

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qs = new URLSearchParams();

        if (params.get("minPrice")) qs.set("minPrice", params.get("minPrice")!);
        if (params.get("maxPrice")) qs.set("maxPrice", params.get("maxPrice")!);
        if (params.get("rating")) qs.set("rating", params.get("rating")!);
        if (params.get("sort")) qs.set("sort", params.get("sort")!);
        if (params.get("partners")) qs.set("partners", params.get("partners")!);

        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        // DEALS FETCH
        const dealsURL = new URL("/api/deals", base);
        qs.forEach((v, k) => dealsURL.searchParams.set(k, v));
        const dealsRes = await fetch(dealsURL.toString(), { cache: "no-store" });
        const dealsJson = await dealsRes.json();
        setDeals(dealsJson.deals || []);

        // PRODUCTS FETCH
        const prodURL = new URL("/api/products", base);
        qs.forEach((v, k) => prodURL.searchParams.set(k, v));
        const prodRes = await fetch(prodURL.toString(), { cache: "no-store" });
        const prodJson = await prodRes.json();
        setProducts(prodJson.products || []);

      } catch {
        setDeals([]);
        setProducts([]);
      }
    };

    fetchData();
  }, [params]);

  return (
    <main className="relative bg-gradient-to-b from-blue-50 to-white text-gray-900">

      {/* HERO + ADS */}
      <HeroBannerGeneral />
      <BannerAdSection />

      {/* CATEGORY + CART TO HEART */}
      <CategoryGrid mode="general" />
      <CartToHeartSection />

      {/* ⭐ FEATURED DEALS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      {/* ⭐ GENERAL DEALS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <GeneralDeals mode="general" externalProducts={products} />
      </div>

      {/* ⭐⭐ FILTERS – EXACTLY BELOW FEATURED PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">

        {/* Toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full md:w-auto"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Desktop + Mobile Filters */}
        {showFilters && (
          <div className="mt-4">
            <div className="hidden md:block">
              <FilterSidebar />
            </div>
            <div className="md:hidden">
              <FilterSidebar mobile />
            </div>
          </div>
        )}
      </div>

      {/* ⭐⭐ GENERAL DEALS (Infinite Scroll) */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <GeneralDeals />
      </div>

      <FloatingAIButtons />
    </main>
  );
}
