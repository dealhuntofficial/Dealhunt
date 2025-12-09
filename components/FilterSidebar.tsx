"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(true);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    partners: "",
    rating: "",
    sort: "",
  });

  // Load filter values from URL on first load
  useEffect(() => {
    setFilters({
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      partners: searchParams.get("partners") || "",
      rating: searchParams.get("rating") || "",
      sort: searchParams.get("sort") || "",
    });
  }, [searchParams]);

  function applyFilters() {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`${window.location.pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full md:w-72 p-4 bg-white rounded-lg shadow-sm">

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-200 py-2 rounded mb-4"
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {isOpen && (
        <div>
          <h4 className="font-semibold mb-3">Filters</h4>

          {/* Min Price */}
          <div className="mb-3">
            <label className="text-sm block mb-1">Min Price</label>
            <input
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Max Price */}
          <div className="mb-3">
            <label className="text-sm block mb-1">Max Price</label>
            <input
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Partners */}
          <div className="mb-3">
            <label className="text-sm block mb-1">Store / Partner</label>
            <input
              value={filters.partners}
              onChange={(e) => setFilters({ ...filters, partners: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Amazon, Flipkart"
            />
          </div>

          {/* Rating */}
          <div className="mb-3">
            <label className="text-sm block mb-1">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
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

          {/* Sort */}
          <div className="mb-3">
            <label className="text-sm block mb-1">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
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
            Apply Filters
          </button>
        </div>
      )}
    </aside>
  );
}
