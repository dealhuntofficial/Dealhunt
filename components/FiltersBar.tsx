"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FiltersBar({
  showCategoryFilters = false,
}: {
  showCategoryFilters?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [merchant, setMerchant] = useState("");

  const updateParam = (key: string, value: string) => {
    const q = new URLSearchParams(params.toString());
    value ? q.set(key, value) : q.delete(key);
    router.push(`?${q.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex gap-3 overflow-x-auto px-4 py-3 no-scrollbar">

        {/* SORT */}
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => updateParam("sort", e.target.value)}
          defaultValue=""
        >
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
        </select>

        {/* REAL BRAND */}
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => updateParam("brand", e.target.value)}
          defaultValue=""
        >
          <option value="">Real Brand</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
          <option value="puma">Puma</option>
        </select>

        {/* FILTERS */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            className="w-20 border rounded-lg px-2 py-2 text-sm"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateParam("minPrice", minPrice)}
          />
          <input
            type="number"
            placeholder="Max ₹"
            className="w-20 border rounded-lg px-2 py-2 text-sm"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateParam("maxPrice", maxPrice)}
          />
        </div>

        {/* PARTNERS */}
        <input
          type="text"
          placeholder="Partner"
          className="border rounded-lg px-3 py-2 text-sm"
          value={merchant}
          onChange={(e) => {
            setMerchant(e.target.value);
            updateParam("merchant", e.target.value);
          }}
        />

        {/* RATINGS */}
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => updateParam("rating", e.target.value)}
          defaultValue=""
        >
          <option value="">Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>
      </div>
    </div>
  );
}
