"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import DealCard from "@/components/DealCard";
import { categories } from "@/data/categories";

type Filters = {
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  merchants?: string[];
  subcategory?: string;
  rating?: string;
  realBrand?: boolean;
};

export default function CategoryDealsPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = categories.find(c => c.slug === params.slug);

  const [deals, setDeals] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "sort" | "realbrand" | "filters" | "rating"
  >("sort");

  const [filters, setFilters] = useState<Filters>({
    merchants: [],
  });

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `https://${process.env.RENDER_EXTERNAL_URL}`;

  // ---------------- FETCH DEALS ----------------
  useEffect(() => {
    const fetchDeals = async () => {
      const url = new URL("/api/deals", base);
      url.searchParams.set("category", params.slug);

      if (filters.sort) url.searchParams.set("sort", filters.sort);
      if (filters.minPrice) url.searchParams.set("minPrice", filters.minPrice);
      if (filters.maxPrice) url.searchParams.set("maxPrice", filters.maxPrice);
      if (filters.rating) url.searchParams.set("rating", filters.rating);
      if (filters.subcategory)
        url.searchParams.set("subcategory", filters.subcategory);
      if (filters.realBrand)
        url.searchParams.set("subcategory", "real-brand");

      filters.merchants?.forEach(m =>
        url.searchParams.append("merchant", m)
      );

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();

      setDeals(data.deals || []);
      setBrands(data.brands || []);
      setSubcategories(data.subcategories || []);
    };

    fetchDeals();
  }, [filters, params.slug]);

  if (!category) return null;

  // ---------------- UI ----------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BackButton />

      {/* ---------- FIXED FILTER BAR ---------- */}
      <div className="flex gap-3 overflow-x-auto py-3 sticky top-0 bg-white z-10">
        {[
          { key: "sort", label: "Sort" },
          { key: "realbrand", label: "Real Brand" },
          { key: "filters", label: "Filters" },
          { key: "rating", label: "Ratings" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------- FILTER PANELS ---------- */}
      <div className="bg-white rounded-xl p-4 shadow mb-6">
        {/* SORT */}
        {activeTab === "sort" && (
          <div className="space-y-4">
            <select
              className="w-full border p-2 rounded"
              onChange={e =>
                setFilters(f => ({ ...f, sort: e.target.value }))
              }
            >
              <option value="">Sort By</option>
              <option value="price_low">Price Low → High</option>
              <option value="price_high">Price High → Low</option>
              <option value="discount">Best Discount</option>
              <option value="newest">Newest</option>
            </select>

            {/* MANUAL PRICE */}
            <div className="flex gap-2">
              <input
                placeholder="Min"
                className="border p-2 w-full rounded"
                onChange={e =>
                  setFilters(f => ({ ...f, minPrice: e.target.value }))
                }
              />
              <input
                placeholder="Max"
                className="border p-2 w-full rounded"
                onChange={e =>
                  setFilters(f => ({ ...f, maxPrice: e.target.value }))
                }
              />
            </div>

            {/* PARTNERS */}
            <div>
              <p className="font-semibold mb-2">Partners</p>
              {brands.map(b => (
                <label key={b} className="block text-sm">
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={e =>
                      setFilters(f => ({
                        ...f,
                        merchants: e.target.checked
                          ? [...(f.merchants || []), b]
                          : f.merchants?.filter(x => x !== b),
                      }))
                    }
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* REAL BRAND */}
        {activeTab === "realbrand" && (
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={() => setFilters(f => ({ ...f, realBrand: true }))}
          >
            Show Real Brand Deals
          </button>
        )}

        {/* FILTERS (SUBCATEGORIES) */}
        {activeTab === "filters" && (
          <div className="flex flex-wrap gap-2">
            {subcategories.map(s => (
              <button
                key={s.slug}
                onClick={() =>
                  setFilters(f => ({ ...f, subcategory: s.slug }))
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {/* RATINGS */}
        {activeTab === "rating" && (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                onClick={() =>
                  setFilters(f => ({ ...f, rating: String(r) }))
                }
                className="block w-full text-left px-3 py-2 bg-gray-100 rounded"
              >
                {r}★ & above
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- DEALS ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map(d => (
          <DealCard key={d._id || d.id} deal={d} />
        ))}
      </div>
    </div>
  );
                                            }
