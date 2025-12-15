"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */
type Filters = {
  minPrice: string;
  rating: string;
  sort: string;
  subcategory: string;
  merchant: string;
};

type Props = {
  params: { slug: string };
};

export default function CategoryDealsPage({ params }: Props) {
  const slug = params.slug;
  const category = categories.find(c => c.slug === slug);

  const subs = subCategories[slug] || subCategories.default;

  const [deals, setDeals] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const [filters, setFilters] = useState<Filters>({
    minPrice: "",
    rating: "",
    sort: "",
    subcategory: "",
    merchant: ""
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL}`;

        const url = new URL("/api/deals", base);
        url.searchParams.set("category", slug);

        (Object.entries(filters) as [keyof Filters, string][])
          .forEach(([k, v]) => {
            if (v) url.searchParams.set(k, v);
          });

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();

        setDeals(data.deals || []);
        setBrands(data.brands || []);
      } catch (e) {
        console.error(e);
        setDeals([]);
        setBrands([]);
      }
    };

    fetchDeals();
  }, [slug, filters]);

  if (!category) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* LEFT */}
        <aside className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-3">Sort & Rating</h4>

          <select
            className="w-full mb-3 border rounded p-2"
            value={filters.sort}
            onChange={e =>
              setFilters(prev => ({ ...prev, sort: e.target.value }))
            }
          >
            <option value="">Sort</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="discount">Best Discount</option>
          </select>

          <select
            className="w-full border rounded p-2"
            value={filters.rating}
            onChange={e =>
              setFilters(prev => ({ ...prev, rating: e.target.value }))
            }
          >
            <option value="">Rating</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
          </select>
        </aside>

        {/* MIDDLE */}
        <section className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-6">
            {subs.map(s => (
              <button
                key={s.slug}
                onClick={() =>
                  setFilters(prev => ({ ...prev, subcategory: s.slug }))
                }
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No deals found
              </div>
            ) : (
              deals.map(d => <DealCard key={d._id} deal={d} />)
            )}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-3">Real Brands</h4>

          {brands.map(b => (
            <button
              key={b}
              onClick={() =>
                setFilters(prev => ({ ...prev, merchant: b }))
              }
              className="block w-full text-left text-sm py-1 hover:underline"
            >
              {b}
            </button>
          ))}
        </aside>

      </div>
    </div>
  );
            }
