"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FiltersBar({ category }: { category?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const [brands, setBrands] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
  };

  useEffect(() => {
    const url = new URL("/api/deals", window.location.origin);
    if (category && category !== "all") {
      url.searchParams.set("category", category);
    }

    fetch(url.toString())
      .then(r => r.json())
      .then(d => {
        setBrands(d.brands || []);
        setPartners(d.merchants || []);
        setSubcategories(d.subcategories || []);
      });
  }, [category]);

  return (
    <div className="flex gap-3 overflow-x-auto py-3 sticky top-0 bg-gray-50 z-20">

      {/* SUBCATEGORIES */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Subcategory</summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {subcategories.map(s => (
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

      {/* BRAND */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Brand</summary>
        {brands.map(b => (
          <button
            key={b}
            className="block text-sm"
            onClick={() => setParam("brand", b)}
          >
            {b}
          </button>
        ))}
      </details>

      {/* PARTNERS */}
      <details className="bg-white rounded-xl shadow px-3 py-2 min-w-[160px]">
        <summary className="font-medium cursor-pointer">Partners</summary>
        {partners.map(p => (
          <button
            key={p}
            className="block text-sm"
            onClick={() => setParam("merchant", p)}
          >
            {p}
          </button>
        ))}
      </details>
    </div>
  );
}
