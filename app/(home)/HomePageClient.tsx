"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import FeaturedProducts from "@/components/FeaturedProducts";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import FilterSidebar from "@/components/FilterSidebar";

export default function HomePageClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

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

        const dealsURL = new URL("/api/deals", base);
        qs.forEach((v, k) => dealsURL.searchParams.set(k, v));

        const dealsRes = await fetch(dealsURL.toString(), { cache: "no-store" });
        const dealsJson = await dealsRes.json();
        setDeals(dealsJson.deals || []);

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

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <FilterSidebar />
      </div>

      <HeroBannerGeneral />
      <BannerAdSection />

      <FeaturedDeals externalDeals={deals} />

      <CategoryGrid mode="general" />

      <CartToHeartSection />

      <FeaturedProducts mode="general" externalProducts={products} />

      <FloatingAIButtons />
    </main>
  );
}
