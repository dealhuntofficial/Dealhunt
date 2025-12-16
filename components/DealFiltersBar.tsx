"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DealFiltersBar() {
  const router = useRouter();
  const params = useSearchParams();

  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [merchant, setMerchant] = useState(params.get("merchant") || "");
  const [sort, setSort] = useState(params.get("sort") || "");

  const applyFilters = () => {
    const search = new URLSearchParams(params.toString());

    minPrice ? search.set("minPrice", minPrice) : search.delete("minPrice");
    maxPrice ? search.set("maxPrice", maxPrice) : search.delete("maxPrice");
    merchant ? search.set("merchant", merchant) : search.delete("merchant");
    sort ? search.set("sort", sort) : search.delete("sort");

    router.push(`?${search.toString()}`);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Sort</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
          <option value="newest">Newest</option>
        </select>

        {/* MIN PRICE */}
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 w-24 text-sm"
        />

        {/* MAX PRICE */}
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 w-24 text-sm"
        />

        {/* MERCHANT */}
        <input
          type="text"
          placeholder="Partner"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          className="border rounded-lg px-3 py-2 w-32 text-sm"
        />

        {/* APPLY */}
        <button
          onClick={applyFilters}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
