// app/categories/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";

type Props = { params: { slug: string } };

type Filters = {
  sort: string;
  minPrice: string;
  maxPrice: string;
  merchant: string;
  rating: string;
  subcategory: string;
  realBrand: boolean;
};

export default function CategoryDealsPage({ params }: Props) {
  const slug = params.slug;
  const category = categories.find(c => c.slug === slug);
  const subs = subCategories[slug] || subCategories.default || [];

  const [deals, setDeals] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    sort: "",
    minPrice: "",
    maxPrice: "",
    merchant: "",
    rating: "",
    subcategory: "",
    realBrand: false,
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL}`;

        const url = new URL("/api/deals", base);
        url.searchParams.set("category", slug);

        if (filters.sort) url.searchParams.set("sort", filters.sort);
        if (filters.minPrice) url.searchParams.set("minPrice", filters.minPrice);
        if (filters.maxPrice) url.searchParams.set("maxPrice", filters.maxPrice);
        if (filters.merchant) url.searchParams.set("merchant", filters.merchant);
        if (filters.rating) url.searchParams.set("rating", filters.rating);
        if (filters.subcategory)
          url.searchParams.set("subcategory", filters.subcategory);
        if (filters.realBrand)
          url.searchParams.set("subcategory", "real-brand");

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();

        setDeals(data.deals || []);
        setMerchants(data.brands || []);
      } catch (e) {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [slug, filters]);

  if (!category) return <div className="p-8 text-center">Not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      {/* FILTER BAR */}
      <div className="sticky top-0 z-20 bg-white py-3 mb-6 overflow-x-auto">
        <div className="flex gap-3 min-w-max">

          {/* SORT */}
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={filters.sort}
            onChange={e =>
              setFilters(f => ({ ...f, sort: e.target.value }))
            }
          >
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="discount">Best Discount</option>
          </select>

          {/* MANUAL PRICE */}
          <input
            type="number"
            placeholder="Min ₹"
            className="border rounded-lg px-3 py-2 w-24 text-sm"
            value={filters.minPrice}
            onChange={e =>
              setFilters(f => ({ ...f, minPrice: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Max ₹"
            className="border rounded-lg px-3 py-2 w-24 text-sm"
            value={filters.maxPrice}
            onChange={e =>
              setFilters(f => ({ ...f, maxPrice: e.target.value }))
            }
          />

          {/* PARTNERS / MERCHANTS */}
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={filters.merchant}
            onChange={e =>
              setFilters(f => ({ ...f, merchant: e.target.value }))
            }
          >
            <option value="">Partners</option>
            {merchants.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* REAL BRAND */}
          <button
            onClick={() =>
              setFilters(f => ({ ...f, realBrand: !f.realBrand }))
            }
            className={`px-4 py-2 rounded-lg text-sm border ${
              filters.realBrand
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            Real Brand
          </button>

          {/* RATINGS */}
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={filters.rating}
            onChange={e =>
              setFilters(f => ({ ...f, rating: e.target.value }))
            }
          >
            <option value="">Ratings</option>
            <option value="5">5 ★ & above</option>
            <option value="4">4 ★ & above</option>
            <option value="3">3 ★ & above</option>
            <option value="2">2 ★ & above</option>
            <option value="1">1 ★ & above</option>
          </select>

        </div>
      </div>

      {/* SUBCATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subs.map(s => (
          <button
            key={s.slug}
            onClick={() =>
              setFilters(f => ({ ...f, subcategory: s.slug }))
            }
            className={`px-3 py-1 rounded-lg text-sm ${
              filters.subcategory === s.slug
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* DEALS */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Loading deals...
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No deals found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(d => (
            <DealCard key={d._id || d.id} deal={d} />
          ))}
        </div>
      )}
    </div>
  );
                             }
