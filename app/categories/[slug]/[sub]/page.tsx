// app/categories/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";

type Props = {
  params: { slug: string };
};

type Filters = {
  sort: string;
};

export default function CategoryDealsPage({ params }: Props) {
  const { slug } = params;

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    return <div className="p-8 text-center">Category not found</div>;
  }

  const subs = subCategories[slug] || subCategories.default || [];

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    sort: "",
  });

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

        if (filters.sort) {
          url.searchParams.set("sort", filters.sort);
        }

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();

        setDeals(data.deals || []);
      } catch {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [slug, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h4 className="font-semibold mb-3">Sort</h4>
            <select
              className="w-full mb-3 border rounded p-2"
              onChange={(e) =>
                setFilters((prev: Filters) => ({
                  ...prev,
                  sort: e.target.value,
                }))
              }
              value={filters.sort}
            >
              <option value="">Default</option>
              <option value="price_low">Price: Low → High</option>
              <option value="price_high">Price: High → Low</option>
              <option value="discount">Best Discount</option>
              <option value="newest">Newest</option>
            </select>
          </div>

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

        {/* DEALS */}
        <section className="lg:col-span-3">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {category.name} — Best Deals
            </h1>
            <p className="text-sm text-gray-500">
              Mixed deals across subcategories
            </p>
          </header>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No deals found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
