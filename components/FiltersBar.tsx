"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FiltersBar({ category }: { category?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const search = params.get("search") || "";

  const [partners, setPartners] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [subcats, setSubcats] = useState<string[]>([]);

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
  };

  useEffect(() => {
    const url = new URL("/api/deals", window.location.origin);

    if (category && category !== "all") url.searchParams.set("category", category);
    if (search) url.searchParams.set("search", search);

    fetch(url.toString())
      .then(r => r.json())
      .then(d => {
        setPartners(d.merchants || []);
        setBrands(d.brands || []);
        setSubcats(
          Array.from(
            new Set((d.deals || []).map((x: any) => x.subcategory).filter(Boolean))
          )
        );
      });
  }, [category, search]);

  return (
    <div className="flex gap-3 overflow-x-auto py-3 bg-gray-50 sticky top-0 z-20">

      {/* SORT */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[170px]">
        <summary>Sort</summary>
        <select onChange={e => setParam("sort", e.target.value)}>
          <option value="">Select</option>
          <option value="newest">Newest</option>
          <option value="price_low">Low → High</option>
          <option value="price_high">High → Low</option>
        </select>
      </details>

      {/* BRAND */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary>Brand</summary>
        {brands.length === 0 ? (
          <div className="text-xs text-gray-500">No brands available</div>
        ) : (
          brands.map(b => (
            <button key={b} onClick={() => setParam("brand", b)}>
              {b}
            </button>
          ))
        )}
      </details>

      {/* SUBCATEGORIES – 🔥 DYNAMIC */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary>Filters</summary>
        <div className="flex flex-wrap gap-2">
          {subcats.length === 0 ? (
            <span className="text-xs text-gray-400">No filters</span>
          ) : (
            subcats.map(s => (
              <button
                key={s}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
                onClick={() => setParam("subcategory", s)}
              >
                {s}
              </button>
            ))
          )}
        </div>
      </details>
    </div>
  );
    }
