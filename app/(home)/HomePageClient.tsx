"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import BannerAdSection from "@/components/BannerAdSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDeals from "@/components/FeaturedDeals";
import CartToHeartSection from "@/components/CartToHeartSection";
import FloatingAIButtons from "@/components/FloatingAIButtons";
import HeroBannerGeneral from "@/components/HeroBannerGeneral";
import FiltersBar from "@/components/FiltersBar";
import ProductsSection from "@/components/ProductsSection";

const CHUNK = 12;

export default function HomePageClient() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [visible, setVisible] = useState(CHUNK);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const params = useSearchParams();
  const router = useRouter();

  const compareQuery = params.get("compare");

  /* ================= FETCH ================= */
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

  /* ================= INFINITE SCROLL ================= */
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

  /* ================= COMPARE STRIP DATA ================= */
  const compareProducts = useMemo(() => {
    if (!compareQuery) return [];
    const q = compareQuery.toLowerCase();

    return products.filter(p =>
      p.name.toLowerCase().includes(q)
    );
  }, [compareQuery, products]);

  const clearCompare = () => {
    const p = new URLSearchParams(params.toString());
    p.delete("compare");
    router.push(`?${p.toString()}`);
  };

  return (
    <main>
      <HeroBannerGeneral />
      <BannerAdSection />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <FeaturedDeals externalDeals={deals} />
      </div>

      <CategoryGrid mode="general" />
      <CartToHeartSection />

      <FiltersBar category="others" />

      {/* PRODUCTS */}
      <section id="products">
        <ProductsSection externalProducts={products.slice(0, visible)} />
        <div ref={loaderRef} className="h-10" />
      </section>

      {/* ================= COMPARE STRIP ================= */}
      {compareQuery && compareProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">
                Comparing: <span className="text-red-600">{compareQuery}</span>
              </h3>
              <button
                onClick={clearCompare}
                className="text-xs text-gray-500"
              >
                Clear ✕
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {compareProducts.map(p => (
                <div
                  key={p.id}
                  className="min-w-[200px] border rounded-xl p-3"
                >
                  <p className="text-sm font-medium line-clamp-2">
                    {p.name}
                  </p>
                  <p className="text-red-600 font-bold mt-1">
                    ₹{p.price}
                  </p>

                  {/* TEMP BUY (backend ke baad merchant wise hoga) */}
                  <a
                    href="#"
                    className="block mt-2 text-center bg-red-600 text-white rounded-lg py-1 text-sm"
                  >
                    Buy
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <FloatingAIButtons />
    </main>
  );
}
