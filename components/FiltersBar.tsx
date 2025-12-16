"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { subCategories } from "@/data/subcategories";

export default function FiltersBar({
  category,
}: {
  category?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [partners, setPartners] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
  };

  /* ---------- FETCH PARTNERS ---------- */
  useEffect(() => {
    if (!category) return;

    fetch(`/api/deals?category=${category}`)
      .then(r => r.json())
      .then(d => {
        setPartners(d.merchants || []);
        setBrands(d.realBrands || []);
      });
  }, [category]);

  return (
    <div className="flex gap-3 overflow-x-auto py-3 sticky top-0 bg-gray-50 z-20">

      {/* SORT */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Sort</summary>

        <select
          className="w-full mt-2 border rounded p-1"
          onChange={e => setParam("sort", e.target.value)}
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
            onBlur={e => setParam("minPrice", e.target.value)}
          />
          <input
            placeholder="Max"
            className="w-1/2 border rounded p-1 text-sm"
            onBlur={e => setParam("maxPrice", e.target.value)}
          />
        </div>

        <select
          className="w-full mt-2 border rounded p-1"
          onChange={e => setParam("merchant", e.target.value)}
        >
          <option value="">Partners</option>
          {partners.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </details>

      {/* REAL BRAND */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Real Brand</summary>
        <div className="mt-2 space-y-1">
          {brands.map(b => (
            <button
              key={b}
              className="block text-sm hover:underline"
              onClick={() => setParam("merchant", b)}
            >
              {b}
            </button>
          ))}
        </div>
      </details>

      {/* FILTERS */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Filters</summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {(subCategories[category || ""] || []).map(s => (
            <button
              key={s.slug}
              className="text-xs px-2 py-1 bg-gray-100 rounded"
              onClick={() => setParam("subcategory", s.slug)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </details>

      {/* RATINGS */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Ratings</summary>
        {[4, 3, 2].map(r => (
          <button
            key={r}
            className="block text-sm hover:underline"
            onClick={() => setParam("rating", String(r))}
          >
            {r}★ & above
          </button>
        ))}
      </details>
    </div>
  );
        }
