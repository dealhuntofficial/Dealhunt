"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";
import useFilters from "@/hooks/useFilters";
import FilterSidebar from "@/components/FilterSidebar";

type Props = { params: { slug: string; sub: string } };

export default function SubcategoryDealsPage({ params }: Props) {
  const { slug, sub } = params;

  // Category + Subcategory
  const category = categories.find((c) => c.slug === slug);
  const subCat = (subCategories[slug] || []).find((s) => s.slug === sub) || null;

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW FILTER SYSTEM
  const { read } = useFilters();
  const filters = read(); // { q, minPrice, maxPrice, merchant, sort, ... }

  if (!category || !subCat) {
    return <div className="p-8 text-center">Not found</div>;
  }

  // --------------------------
  // 📌 FETCH DEALS (NOW USING GLOBAL FILTERS)
  // --------------------------
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        const url = new URL("/api/deals", base);

        // Required
        url.searchParams.set("category", slug);
        url.searchParams.set("subcategory", sub);

        // GLOBAL FILTERS (auto applied)
        if (filters.q) url.searchParams.set("q", filters.q);
        if (filters.minPrice) url.searchParams.set("minPrice", filters.minPrice);
        if (filters.maxPrice) url.searchParams.set("maxPrice", filters.maxPrice);
        if (filters.merchant) url.searchParams.set("merchant", filters.merchant);
        if (filters.sort) url.searchParams.set("sort", filters.sort);
        if (filters.minDiscount) url.searchParams.set("minDiscount", filters.minDiscount);
        if (filters.maxDiscount) url.searchParams.set("maxDiscount", filters.maxDiscount);
        if (filters.rating) url.searchParams.set("rating", filters.rating);

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();

        setDeals(data.deals || []);
      } catch (err) {
        console.error("Subcategory fetching error:", err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [
    slug,
    sub,
    filters.q,
    filters.minPrice,
    filters.maxPrice,
    filters.merchant,
    filters.sort,
    filters.minDiscount,
    filters.maxDiscount,
    filters.rating,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* -------------------------------------- */}
        {/* 🧿 LEFT SIDEBAR FILTERS (REPLACED WITH NEW) */}
        {/* -------------------------------------- */}
        <aside className="h-fit lg:col-span-1">
          <FilterSidebar />
        </aside>

        {/* -------------------------------------- */}
        {/* DEALS LIST */}
        {/* -------------------------------------- */}
        <section className="lg:col-span-3">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {category.name} — {subCat.name}
            </h1>
            <p className="text-sm text-gray-500">Filtered deals</p>
          </header>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No deals found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
