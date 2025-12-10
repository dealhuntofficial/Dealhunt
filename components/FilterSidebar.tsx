"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function FilterSidebar({ mobile = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [merchant, setMerchant] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  // ❌ REMOVE OPEN STATE (homepage already controls show/hide)
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMerchant(searchParams.get("merchant") || "");
    setSort(searchParams.get("sort") || "");
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (merchant) params.set("merchant", merchant);
    if (sort) params.set("sort", sort);
    if (query) params.set("q", query);

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setMinPrice("");
    setMaxPrice("");
    setMerchant("");
    setSort("");
    setQuery("");
  };

  return (
    <>
      {/* NO TOGGLE BUTTON — HOMEPAGE HAS ITS OWN BUTTON */}

      <div className="bg-white p-4 rounded-lg shadow transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>

        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={query}
            placeholder="Search title..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 border rounded p-2"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 border rounded p-2"
            />
          </div>
        </div>

        {/* Merchant */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Merchant</label>
          <input
            type="text"
            placeholder="Amazon, Flipkart..."
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Sort */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Default</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="latest">Latest</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={applyFilters}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Apply
          </button>

          <button
            onClick={clearFilters}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}
