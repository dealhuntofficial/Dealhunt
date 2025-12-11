"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type Props = { params: { slug: string } };

export default function CategoryDealsPage({ params }: Props) {
  const [deals, setDeals] = useState<any[]>([]);
  const slug = params.slug;

  // Get category object
  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    return <div className="p-8 text-center">Category not found</div>;
  }

  // Subcategories
  const subs = subCategories[slug] || subCategories.default || [];

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // API Base URL
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        const url = new URL("/api/deals", base);
        url.searchParams.set("category", slug);

        const res = await fetch(url.toString(), { cache: "no-store" });

        if (!res.ok) {
          setDeals([]);
          return;
        }

        const data = await res.json();
        setDeals(data.deals || []);
      } catch (error) {
        console.error("Deals fetch error:", error);
        setDeals([]);
      }
    };

    fetchDeals();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* --- Sidebar: Only Subcategories --- */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow">
            <h4 className="font-semibold mb-3">Subcategories</h4>

            <div className="flex flex-wrap gap-2">
              {subs.map((s) => (
                <a
                  key={s.slug}
                  href={`/categories/${slug}/${s.slug}`}
                  className="text-sm px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* --- Deals Section --- */}
        <section className="lg:col-span-3">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">{category.name} — Best Deals</h1>
            <p className="text-sm text-gray-500">Mixed deals across subcategories</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No deals found.
              </div>
            ) : (
              deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
