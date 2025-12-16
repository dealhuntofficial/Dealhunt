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

  const subs =
    (category && subCategories[category]) || subCategories.default || [];

  /* ---------------- FETCH PARTNERS ---------------- */
  useEffect(() => {
    if (!category) return;
    fetch(`/api/deals?category=${category}`)
      .then(r => r.json())
      .then(d => {
        setPartners(d.merchants || []);
        setBrands(d.realBrands || []);
      });
  }, [category]);

  const updateParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b">
      <div className="flex gap-3 overflow-x-auto px-4 py-3">

        {/* SORT */}
        <details className="filter-box">
          <summary>Sort</summary>
          <select onChange={e => updateParam("sort", e.target.value)}>
            <option value="">Select</option>
            <option value="newest">Newest</option>
            <option value="price_low">Price ↑</option>
            <option value="price_high">Price ↓</option>
          </select>

          {/* MANUAL PRICE */}
          <div className="flex gap-2 mt-2">
            <input
              placeholder="Min"
              onBlur={e => updateParam("minPrice", e.target.value)}
            />
            <input
              placeholder="Max"
              onBlur={e => updateParam("maxPrice", e.target.value)}
            />
          </div>

          {/* PARTNERS */}
          <select onChange={e => updateParam("merchant", e.target.value)}>
            <option value="">Partners</option>
            {partners.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </details>

        {/* REAL BRAND */}
        <details className="filter-box">
          <summary>Real Brand</summary>
          {brands.map(b => (
            <button
              key={b}
              onClick={() => updateParam("merchant", b)}
            >
              {b}
            </button>
          ))}
        </details>

        {/* ✅ SUBCATEGORIES – FIXED */}
        <details className="filter-box">
          <summary>Filters</summary>
          <div className="flex flex-wrap gap-2 mt-2">
            {subs.map(s => (
              <button
                key={s.slug}
                onClick={() => updateParam("subcategory", s.slug)}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {s.name}
              </button>
            ))}
          </div>
        </details>

        {/* RATINGS – FULL */}
        <details className="filter-box">
          <summary>Ratings</summary>
          {[5,4,3,2,1].map(r => (
            <button
              key={r}
              onClick={() => updateParam("rating", String(r))}
            >
              {r}★ & above
            </button>
          ))}
        </details>
      </div>
    </div>
  );
                    }
