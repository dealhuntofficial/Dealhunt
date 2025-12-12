"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type Props = { params: { slug: string; sub: string } };

export default function SubcategoryDealsPage({ params }: Props) {
  const { slug, sub } = params;

  // Category + Subcategory
  const category = categories.find((c) => c.slug === slug);
  const subCat =
    (subCategories[slug] || []).find((s) => s.slug === sub) || null;

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!category || !subCat) {
    return <div className="p-8 text-center">Not found</div>;
  }

  // --------------------------
  // 📌 FETCH DEALS (NO FILTERS)
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
        url.searchParams.set("category", slug);
        url.searchParams.set("subcategory", sub);

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
  }, [slug, sub]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* -------------------------------------- */}
        {/* EMPTY SIDEBAR (NO FILTERS NOW) */}
        {/* -------------------------------------- */}
        <aside className="lg:col-span-1">
          {/* removed filter sidebar */}
        </aside>

        {/* DEALS LIST */}
        <section className="lg:col-span-3">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {category.name} — {subCat.name}
            </h1>
            <p className="text-sm text-gray-500">All deals</p>
          </header>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No deals found.
            </div>
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
