"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    partners: "",
    rating: "",
    sort: "",
  });

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

    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    router.push(`${window.location.pathname}?${params.toString()}`);
  }

  return (
    <div className="w-full">
      {/* Mobile Accordion */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full bg-gray-200 py-2 rounded mb-3"
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className={`${isOpen ? "block" : "hidden"} md:block bg-white rounded-lg p-4 shadow`}>
        <h3 className="font-semibold text-lg mb-3">Filters</h3>

        {/* Min Price */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Min Price</label>
          <input
            className="border w-full rounded px-2 py-1"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </div>

        {/* Max Price */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Max Price</label>
          <input
            className="border w-full rounded px-2 py-1"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        {/* Partners */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Store / Partner</label>
          <input
            className="border w-full rounded px-2 py-1"
            placeholder="Amazon, Flipkart"
            value={filters.partners}
            onChange={(e) => setFilters({ ...filters, partners: e.target.value })}
          />
        </div>

        {/* Rating */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Rating</label>
          <select
            className="border w-full rounded px-2 py-1"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">All</option>
            <option value="5">⭐⭐⭐⭐⭐ 5+</option>
            <option value="4">⭐⭐⭐⭐ 4+</option>
            <option value="3">⭐⭐⭐ 3+</option>
          </select>
        </div>

        {/* Sort */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Sort</label>
          <select
            className="border w-full rounded px-2 py-1"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="">Relevance</option>
            <option value="price-asc">Low → High</option>
            <option value="price-desc">High → Low</option>
            <option value="discount-desc">Highest Discount</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
