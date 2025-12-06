// components/FilterSidebar.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterSidebar({ initial = {} }: any) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(initial.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice || "");
  const [merchant, setMerchant] = useState(initial.merchant || "");
  const [sort, setSort] = useState(initial.sort || "");

  function applyFilters(categorySlug: string) {
    const params = new URLSearchParams();
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (merchant) params.set("merchant", merchant);
    if (sort) params.set("sort", sort);
    // keep current pathname; this component used inside pages where pathname contains category
    router.push(`${window.location.pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full md:w-72 p-4 bg-white rounded-lg shadow-sm">
      <h4 className="font-semibold mb-3">Filters</h4>

      <div className="mb-3">
        <label className="text-sm block mb-1">Min Price</label>
        <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
      </div>

      <div className="mb-3">
        <label className="text-sm block mb-1">Max Price</label>
        <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
      </div>

      <div className="mb-3">
        <label className="text-sm block mb-1">Merchant</label>
        <input value={merchant} onChange={(e) => setMerchant(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="e.g. Amazon" />
      </div>

      <div className="mb-3">
        <label className="text-sm block mb-1">Sort</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
          <option value="">Relevance</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="discount-desc">Highest Discount</option>
        </select>
      </div>

      <button onClick={() => applyFilters("")} className="w-full bg-blue-600 text-white py-2 rounded">Apply</button>
    </aside>
  );
      }
