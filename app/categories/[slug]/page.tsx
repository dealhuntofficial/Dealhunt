"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";

type Filters = {
  sort: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  subcategory: string;
  merchant: string;
  realBrand: string;
};

export default function CategoryDealsPage({ params }: { params: { slug: string } }) {
  const category = categories.find(c => c.slug === params.slug);
  const subs = subCategories[params.slug] || subCategories.default;

  const [deals, setDeals] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    sort: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    subcategory: "",
    merchant: "",
    realBrand: ""
  });

  useEffect(() => {
    const fetchDeals = async () => {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.RENDER_EXTERNAL_URL}`;

      const url = new URL("/api/deals", base);
      url.searchParams.set("category", params.slug);

      Object.entries(filters).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();

      setDeals(data.deals || []);
      setMerchants(data.merchants || []);
    };

    fetchDeals();
  }, [filters, params.slug]);

  if (!category) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BackButton />

      {/* 🔥 FIXED FILTER BAR (MEESHO STYLE) */}
      <div className="sticky top-0 z-20 bg-white border-b py-2 overflow-x-auto flex gap-4 text-sm">
        
        {/* SORT */}
        <select onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
          <option value="">Sort</option>
          <option value="price_low">Low → High</option>
          <option value="price_high">High → Low</option>
          <option value="discount">Best Discount</option>
        </select>

        {/* MANUAL PRICE */}
        <input
          placeholder="Min ₹"
          className="border px-2 w-20"
          onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
        />
        <input
          placeholder="Max ₹"
          className="border px-2 w-20"
          onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
        />

        {/* PARTNERS */}
        <select onChange={e => setFilters(f => ({ ...f, merchant: e.target.value }))}>
          <option value="">Partners</option>
          {merchants.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* REAL BRAND */}
        <button
          onClick={() => setFilters(f => ({ ...f, realBrand: "1" }))}
          className="px-3 border rounded"
        >
          Real Brand
        </button>

        {/* RATINGS */}
        <select onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))}>
          <option value="">Rating</option>
          {[1,2,3,4,5].map(r => (
            <option key={r} value={r}>{r}★ & up</option>
          ))}
        </select>
      </div>

      {/* SUBCATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 my-4">
        {subs.map(s => (
          <button
            key={s.slug}
            onClick={() => setFilters(f => ({ ...f, subcategory: s.slug }))}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* DEALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map(d => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </div>
  );
        }
