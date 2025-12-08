"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterSidebar({ initial = {} }: any) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true); // show/hide filters

  const [minPrice, setMinPrice] = useState(initial.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice || "");
  const [partners, setPartners] = useState(initial.partners || "");
  const [rating, setRating] = useState(initial.rating || "");
  const [sort, setSort] = useState(initial.sort || "");

  function applyFilters() {
    const params = new URLSearchParams();
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (partners) params.set("partners", partners);
    if (rating) params.set("rating", rating);
    if (sort) params.set("sort", sort);

    router.push(`${window.location.pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full md:w-72 p-4 bg-white rounded-lg shadow-sm">

      {/* toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-200 py-2 rounded mb-4"
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {isOpen && (
        <div>
          <h4 className="font-semibold mb-3">Filters</h4>

          <div className="mb-3">
            <label className="text-sm block mb-1">Min Price</label>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm block mb-1">Max Price</label>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm block mb-1">Partners</label>
            <input
              value={partners}
              onChange={(e) => setPartners(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="e.g. Amazon"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm block mb-1">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5+</option>
              <option value="4">⭐⭐⭐⭐ 4+</option>
              <option value="3">⭐⭐⭐ 3+</option>
              <option value="2">⭐⭐ 2+</option>
              <option value="1">⭐ 1+</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="text-sm block mb-1">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="">Relevance</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="discount-desc">Highest Discount</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Apply
          </button>
        </div>
      )}
    </aside>
  );
}
