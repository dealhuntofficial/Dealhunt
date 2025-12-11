"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type Props = { params: { slug: string; sub: string } };

export default function SubcategoryDealsPage({ params }: Props) {
  const { slug, sub } = params;

  // Category
  const category = categories.find((c) => c.slug === slug);

  // Subcategory
  const subCat =
    (subCategories[slug] || []).find((s) => s.slug === sub) || null;

  const [deals, setDeals] = useState<any[]>([]);

  if (!category || !subCat) {
    return <div className="p-8 text-center">Not found</div>;
  }

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Base URL fallback system
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        // Final URL (NO FILTERS AT ALL)
        const url = new URL("/api/deals", base);
        url.searchParams.set("category", slug);
        url.searchParams.set("subcategory", sub);

        const res = await fetch(url.toString(), { cache: "no-store" });

        if (!res.ok) {
          console.error("Subcategory fetch error:", res.status);
          setDeals([]);
          return;
        }

        const data = await res.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error("Server fetch error for subcategory deals:", err);
        setDeals([]);
      }
    };

    fetchDeals();
  }, [slug, sub]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* Sidebar removed entirely */}

        {/* Deals Section */}
        <section className="lg:col-span-4">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {category.name} — {subCat.name}
            </h1>
            <p className="text-sm text-gray-500">
              Deals filtered to this subcategory only
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No deals found.
              </div>
            ) : (
              deals.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
