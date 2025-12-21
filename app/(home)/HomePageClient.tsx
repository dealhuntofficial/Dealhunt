"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import FiltersBar from "@/components/FiltersBar";
import ProductsSection from "@/components/ProductsSection";
import CompareStrip from "@/components/CompareStrip";

const CHUNK = 12;

export default function HomePageClient() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [visible, setVisible] = useState(CHUNK);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const compare = searchParams.get("compare");

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

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(v => Math.min(v + CHUNK, products.length));
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [products]);

  return (
    <main className={compare ? "pb-40" : ""}>
      <HeroBannerGeneral />
      <BannerAdSection />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      <CategoryGrid mode="general" />
      <CartToHeartSection />

      <FiltersBar category="others" />

      <section id="products">
        <ProductsSection externalProducts={products.slice(0, visible)} />
        <div ref={loaderRef} className="h-10" />
      </section>

      {/* CompareStrip now reads from context / searchParams internally */}
      {compare && <CompareStrip />}

      <FloatingAIButtons />
    </main>
  );
}
