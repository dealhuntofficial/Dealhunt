"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { subCategories } from "@/data/subcategories";

export default function FiltersBar({ category }: { category?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const [partners, setPartners] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [apiSubcategories, setApiSubcategories] = useState<string[]>([]);

  const detailsRefs = useRef<HTMLDetailsElement[]>([]);

  const activeCategory =
    category && category !== "all" ? category : "others";

  const closeAll = () => {
    detailsRefs.current.forEach(d => (d.open = false));
  };

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
    closeAll();
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
        setApiSubcategories(d.subcategories || []);
      });
  }, [category]);

  const visibleSubcategories =
    apiSubcategories.length > 0
      ? apiSubcategories
      : (subCategories[activeCategory] || []).map(s => s.slug);

  return (
    <div className="flex gap-3 overflow-x-auto py-3 sticky top-0 bg-gray-50 z-20">

      {/* SORT (includes price + partners) */}
      <details
        ref={el => el && detailsRefs.current.push(el)}
        className="bg-white rounded-xl shadow px-3 py-2 min-w-[220px]"
      >
        <summary className="font-medium cursor-pointer">Sort</summary>

        {/* sort */}
        <select
          className="w-full mt-2 border rounded p-1"
          onChange={e => setParam("sort", e.target.value)}
        >
          <option value="">Select</option>
          <option value="newest">Newest</option>
          <option value="price_low">Low → High</option>
          <option value="price_high">High → Low</option>
        </select>

        {/* manual price */}
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            placeholder="Min ₹"
            className="w-1/2 border rounded p-1 text-sm"
            onBlur={e => setParam("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max ₹"
            className="w-1/2 border rounded p-1 text-sm"
            onBlur={e => setParam("maxPrice", e.target.value)}
          />
        </div>

        {/* partners */}
        <div className="mt-3 space-y-1 max-h-32 overflow-auto">
          <p className="text-xs font-semibold text-gray-600">Partners</p>
          {partners.length === 0 ? (
            <p className="text-xs text-gray-400">No partners</p>
          ) : (
            partners.map(p => (
              <button
                key={p}
                className="block text-sm hover:underline"
                onClick={() => setParam("merchant", p)}
              >
                {p}
              </button>
            ))
          )}
        </div>
      </details>

      {/* BRAND */}
      <details
        ref={el => el && detailsRefs.current.push(el)}
        className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]"
      >
        <summary className="font-medium cursor-pointer">Brand</summary>
        <div className="mt-2 space-y-1">
          {brands.map(b => (
            <button
              key={b}
              className="block text-sm hover:underline"
              onClick={() => setParam("brand", b)}
            >
              {b}
            </button>
          ))}
        </div>
      </details>

      {/* SUBCATEGORIES */}
      <details
        ref={el => el && detailsRefs.current.push(el)}
        className="bg-white rounded-xl shadow px-3 py-2 min-w-[170px]"
      >
        <summary className="font-medium cursor-pointer">Filters</summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {visibleSubcategories.map(s => (
            <button
              key={s}
              className="text-xs px-2 py-1 bg-gray-100 rounded"
              onClick={() => setParam("subcategory", s)}
            >
              {s}
            </button>
          ))}
        </div>
      </details>

      {/* RATINGS (RESTORED) */}
      <details
        ref={el => el && detailsRefs.current.push(el)}
        className="bg-white rounded-xl shadow px-3 py-2 min-w-[140px]"
      >
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
