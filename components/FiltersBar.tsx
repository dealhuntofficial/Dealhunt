"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { subCategories } from "@/data/subcategories";

interface Merchant {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function FiltersBar({
  category,
}: {
  category?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");

  /* ---------------- FETCH MERCHANTS ---------------- */
  useEffect(() => {
    if (!category) return;

    fetch(`/api/merchants?category=${category}`)
      .then((r) => r.json())
      .then((d) => setMerchants(d.merchants || []));
  }, [category]);

  /* ---------------- FETCH BRANDS ---------------- */
  useEffect(() => {
    if (!category) return;

    fetch(`/api/brands?category=${category}`)
      .then((r) => r.json())
      .then((d) => setBrands(d.brands || []));
  }, [category]);

  /* ---------------- UPDATE URL ---------------- */
  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`?${p.toString()}`);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex gap-3 overflow-x-auto px-4 py-3">

        {/* SORT */}
        <select
          className="filter-chip"
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>

          <optgroup label="Price Range">
            <option value="0-499">₹0 – ₹499</option>
            <option value="500-999">₹500 – ₹999</option>
            <option value="1000-1999">₹1000 – ₹1999</option>
          </optgroup>

          <optgroup label="Partners">
            {merchants.map((m) => (
              <option key={m.id} value={`merchant:${m.name}`}>
                {m.name}
              </option>
            ))}
          </optgroup>
        </select>

        {/* REAL BRAND */}
        <select
          className="filter-chip"
          onChange={(e) => updateParam("brand", e.target.value)}
        >
          <option value="">Real Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        {/* FILTERS (SUBCATEGORY) */}
        <select
          className="filter-chip"
          onChange={(e) => updateParam("subcategory", e.target.value)}
        >
          <option value="">Filters</option>
          {(subCategories[category || ""] || []).map((sc) => (
            <option key={sc.slug} value={sc.slug}>
              {sc.name}
            </option>
          ))}
        </select>

        {/* RATINGS */}
        <select
          className="filter-chip"
          onChange={(e) => updateParam("rating", e.target.value)}
        >
          <option value="">Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>
      </div>
    </div>
  );
}
