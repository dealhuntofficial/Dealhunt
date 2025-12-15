"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type Filters = {
  sort: string;
  rating: string;
  minPrice: string;
  maxPrice: string;
  subcategory: string;
  merchant: string;
};

type Props = { params: { slug: string } };

export default function CategoryDealsPage({ params }: Props) {
  const slug = params.slug;
  const category = categories.find(c => c.slug === slug);
  const subs = subCategories[slug] || subCategories.default;

  const [deals, setDeals] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const [filters, setFilters] = useState<Filters>({
    sort: "",
    rating: "",
    minPrice: "",
    maxPrice: "",
    subcategory: "",
    merchant: ""
  });

  useEffect(() => {
    const fetchDeals = async () => {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.RENDER_EXTERNAL_URL}`;

      const url = new URL("/api/deals", base);
      url.searchParams.set("category", slug);

      Object.entries(filters).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();

      setDeals(data.deals || []);
      setBrands(data.brands || []);
    };

    fetchDeals();
  }, [slug, filters]);

  if (!category) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* LEFT – SORT / PRICE / RATING */}
        <aside className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-3">Filters</h4>

          {/* SORT */}
          <select
            className="w-full mb-3 border rounded p-2"
            onChange={e =>
              setFilters(f => ({ ...f, sort: e.target.value }))
            }
          >
            <option value="">Sort</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="discount">Best Discount</option>
          </select>

          {/* PRICE RANGE */}
          <input
            type="number"
            placeholder="Min Price"
            className="w-full mb-2 border rounded p-2"
            onChange={e =>
              setFilters(f => ({ ...f, minPrice: e.target.value }))
            }
          />

          <input
            type="number"
            placeholder="Max Price"
            className="w-full mb-3 border rounded p-2"
            onChange={e =>
              setFilters(f => ({ ...f, maxPrice: e.target.value }))
            }
          />

          {/* RATING */}
          <select
            className="w-full border rounded p-2"
            onChange={e =>
              setFilters(f => ({ ...f, rating: e.target.value }))
            }
          >
            <option value="">Rating</option>
            <option value="1">1★ & above</option>
            <option value="2">2★ & above</option>
            <option value="3">3★ & above</option>
            <option value="4">4★ & above</option>
            <option value="5">5★ only</option>
          </select>
        </aside>

        {/* CENTER – SUBCATEGORIES */}
        <section className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-6">
            {subs.map(s => (
              <button
                key={s.slug}
                onClick={() =>
                  setFilters(f => ({
                    ...f,
                    subcategory: s.slug
                  }))
                }
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.length === 0 ? (
              <p className="text-gray-500">No deals found</p>
            ) : (
              deals.map(d => <DealCard key={d.id} deal={d} />)
            )}
          </div>
        </section>

        {/* RIGHT – REAL BRANDS */}
        <aside className="bg-white p-4 rounded-xl shadow">
          <h4 className="font-semibold mb-3">Real Brands</h4>

          {brands.map(b => (
            <button
              key={b}
              onClick={() =>
                setFilters(f => ({ ...f, merchant: b }))
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
