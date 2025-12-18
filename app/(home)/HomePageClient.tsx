"use client";

import { useEffect, useState } from "react";
import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import FiltersBar from "@/components/FiltersBar";
import ProductsSection from "@/components/ProductsSection";

export default function HomePageClient() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.RENDER_EXTERNAL_URL}`;

      const dealsRes = await fetch(`${base}/api/deals`, { cache: "no-store" });
      const prodRes = await fetch(`${base}/api/products`, { cache: "no-store" });

      setDeals((await dealsRes.json()).deals || []);
      setProducts((await prodRes.json()).products || []);
    };

    fetchData();
  }, []);

  return (
    <main>
      <HeroBannerGeneral />
      <BannerAdSection />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      <CategoryGrid mode="general" />
      <CartToHeartSection />

      {/* PRODUCTS FILTER */}
      <FiltersBar category="others" />

      {/* PRODUCTS SECTION */}
      <section id="products">
        <ProductsSection externalProducts={products} />
      </section>

      <FloatingAIButtons />
    </main>
  );
      }
