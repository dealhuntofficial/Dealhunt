"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";

type Props = { params: { slug: string } };

type Deal = {
  _id: string;
};

export default function CategoryDealsPage({ params }: Props) {
  const slug = params.slug;
  const category = categories.find(c => c.slug === slug);
  const subs = subCategories[slug] || subCategories.others;

  const [deals, setDeals] = useState<Deal[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<{
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    subcategory?: string;
    merchant?: string;
    brand?: string;
  }>({});

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

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
        setPartners(data.merchants || []);
        setBrands(data.brands || []);
      } catch {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [slug, filters]);

  if (!category) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BackButton />

      <div className="flex gap-3 overflow-x-auto py-3 sticky top-0 bg-gray-50 z-20">
        <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
          <summary className="font-medium cursor-pointer">Sort</summary>
          <select
            className="w-full mt-2 border rounded p-1"
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
          >
            <option value="">Select</option>
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
          <div className="mt-2 flex gap-2">
            <input
              placeholder="Min"
              className="w-1/2 border rounded p-1 text-sm"
              onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            />
            <input
              placeholder="Max"
              className="w-1/2 border rounded p-1 text-sm"
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            />
          </div>
          <select
            className="w-full mt-2 border rounded p-1"
            onChange={e => setFilters(f => ({ ...f, merchant: e.target.value }))}
          >
            <option value="">Partners</option>
            {partners.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </details>

        <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
          <summary className="font-medium cursor-pointer">Brand</summary>
          <div className="mt-2 space-y-1">
            {brands.length === 0 ? (
              <div className="text-xs text-gray-500">
                No brands available for selected merchant
              </div>
            ) : (
              brands.map(b => (
                <button
                  key={b}
                  className="block text-sm hover:underline"
                  onClick={() => setFilters(f => ({ ...f, brand: b }))}
                >
                  {b}
                </button>
              ))
            )}
          </div>
        </details>

        <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
          <summary className="font-medium cursor-pointer">Filters</summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {subs.map(s => (
              <button
                key={s.slug}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
                onClick={() => setFilters(f => ({ ...f, subcategory: s.slug }))}
              >
                {s.name}
              </button>
            ))}
          </div>
        </details>

        <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
          <summary className="font-medium cursor-pointer">Ratings</summary>
          {[1, 2, 3, 4, 5].map(r => (
            <button
              key={r}
              className="block text-sm hover:underline"
              onClick={() => setFilters(f => ({ ...f, rating: String(r) }))}
            >
              {r}★ & above
            </button>
          ))}
        </details>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No deals found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {deals.map(d => (
            <DealCard key={d._id} deal={d} />
          ))}
        </div>
      )}
    </div>
  );
}
