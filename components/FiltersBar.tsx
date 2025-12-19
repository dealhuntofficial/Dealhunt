"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { subCategories as STATIC_SUBS } from "@/data/subcategories";

type SubCat = {
  slug: string;
  name: string;
};

type Props = {
  category?: string;
  subcategories?: SubCat[]; // ✅ NEW (optional)
};

export default function FiltersBar({ category, subcategories }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [partners, setPartners] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const activeCategory =
    category && category !== "all" ? category : "others";

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
  };

  useEffect(() => {
    if (!category) return;

    const url = new URL("/api/deals", window.location.origin);
    if (category !== "all") url.searchParams.set("category", category);

    fetch(url.toString())
      .then(r => r.json())
      .then(d => {
        setPartners(d.merchants || []);
        setBrands(d.brands || []);
      });
  }, [category]);

  const finalSubCategories =
    subcategories && subcategories.length > 0
      ? subcategories
      : STATIC_SUBS[activeCategory] || [];

  return (
    <div className="flex gap-3 overflow-x-auto py-3 sticky top-0 bg-gray-50 z-20">

      {/* SORT + PRICE + MERCHANT */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[170px]">
        <summary className="font-medium cursor-pointer">Sort</summary>

        <select
          className="w-full mt-2 border rounded p-1"
          onChange={e => setParam("sort", e.target.value)}
        >
          <option value="">Select</option>
          <option value="newest">Newest</option>
          <option value="price_low">Low → High</option>
          <option value="price_high">High → Low</option>
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
            <option key={p}>{p}</option>
          ))}
        </select>
      </details>

      {/* BRAND */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Brand</summary>
        <div className="mt-2 space-y-1">
          {brands.length === 0 ? (
            <div className="text-xs text-gray-500">
              No brands available
            </div>
          ) : (
            brands.map(b => (
              <button
                key={b}
                className="block text-sm hover:underline"
                onClick={() => setParam("brand", b)}
              >
                {b}
              </button>
            ))
          )}
        </div>
      </details>

      {/* SUBCATEGORIES */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Filters</summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {finalSubCategories.length === 0 ? (
            <span className="text-xs text-gray-400">
              No subcategories found
            </span>
          ) : (
            finalSubCategories.map(s => (
              <button
                key={s.slug}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
                onClick={() => setParam("subcategory", s.slug)}
              >
                {s.name}
              </button>
            ))
          )}
        </div>
      </details>

      {/* RATINGS */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[140px]">
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
