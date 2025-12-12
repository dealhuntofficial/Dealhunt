"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

interface ComparisonItem {
  site: string;
  price: string;
  rating: number;
}

interface Product {
  id: number | string;
  title: string;
  name?: string;
  priceNow?: number;
  price?: string;
  img?: string;
  image?: string;
  comparison?: ComparisonItem[];
  brand?: string;
  merchant?: string;
  rating?: number;
}

export const dynamic = "force-dynamic";

export default function ProductsPageClient() {
  const params = useSearchParams();

  // Basic query params (NO FILTERS)
  const searchQuery = params.get("search") || params.get("q") || "";
  const categoryParam = params.get("category") || "";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Build API Query
  const queryObject: Record<string, string> = {};
  if (categoryParam) queryObject.category = categoryParam;
  if (searchQuery) queryObject.q = searchQuery;

  const apiUrl = `/api/deals?${new URLSearchParams(queryObject)}`;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const load = async () => {
      try {
        const res = await fetch(apiUrl, { cache: "no-store" });

        if (!res.ok) {
          if (mounted) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        const json = await res.json();
        const list: any[] = json.deals || [];

        const mapped: Product[] = list.map((it, idx) => ({
          id: it.id ?? idx,
          title: it.title ?? it.name ?? `Product ${idx + 1}`,
          name: it.title ?? it.name,
          priceNow: typeof it.priceNow === "number" ? it.priceNow : undefined,
          price: it.price ?? (it.priceNow ? `₹${it.priceNow}` : undefined),
          img: it.image ?? it.img ?? "/images/placeholder.png",
          image: it.image ?? it.img,
          comparison: it.comparison ?? [],
          brand: it.brand ?? it.merchant ?? "Unknown",
          merchant: it.merchant,
          rating: it.rating ?? 4,
        }));

        if (mounted) setProducts(mapped);
      } catch (error) {
        console.error("Products fetch error:", error);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mt-4 mb-6">
        <h1 className="text-lg font-semibold">Products</h1>
        <div className="text-sm text-gray-600">
          {products.length} result{products.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Skeleton */}
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded"></div>
              <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((p) => {
            const priceLabel =
              p.priceNow !== undefined ? `₹${p.priceNow}` : p.price ?? "₹0";

            const imageSrc = p.img ?? p.image ?? "/images/placeholder.png";

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition"
              >
                <img
                  src={imageSrc}
                  alt={p.title || p.name || String(p.id)}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <h2 className="mt-2 text-base font-semibold line-clamp-2">
                  {p.title ?? p.name}
                </h2>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold text-green-600">{priceLabel}</p>
                  <p className="text-sm text-yellow-600">⭐ {p.rating}</p>
                </div>

                <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 rounded-lg">
                  View Details
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center">No products found.</p>
        )}

      </div>
    </div>
  );
