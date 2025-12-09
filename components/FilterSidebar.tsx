"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  // Controlled Filter States
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [partners, setPartners] = useState(params.get("partners") || "");
  const [rating, setRating] = useState(params.get("rating") || "");
  const [sort, setSort] = useState(params.get("sort") || "");

  // Sync with URL Changes
  useEffect(() => {
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setPartners(params.get("partners") || "");
    setRating(params.get("rating") || "");
    setSort(params.get("sort") || "");
  }, [params]);

  function applyFilters() {
    const url = new URLSearchParams();

    if (minPrice) url.set("minPrice", minPrice);
    if (maxPrice) url.set("maxPrice", maxPrice);
    if (partners) url.set("partners", partners);
    if (rating) url.set("rating", rating);
    if (sort) url.set("sort", sort);

    router.push(`${window.location.pathname}?${url.toString()}`);
    setIsOpen(false);
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        <SlidersHorizontal size={22} />
      </button>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:block w-72 p-4 bg-white rounded-xl shadow-md h-fit sticky top-24">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        <FilterInputs
          minPrice={minPrice}
          maxPrice={maxPrice}
          partners={partners}
          rating={rating}
          sort={sort}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setPartners={setPartners}
          setRating={setRating}
          setSort={setSort}
        />

        <button
          onClick={applyFilters}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
        >
          Apply Filters
        </button>
      </aside>

      {/* Mobile Slide-over Filters */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden transition">
          <div className="bg-white w-80 h-full p-4 absolute right-0 shadow-xl animate-slideLeft">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <FilterInputs
              minPrice={minPrice}
              maxPrice={maxPrice}
              partners={partners}
              rating={rating}
              sort={sort}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setPartners={setPartners}
              setRating={setRating}
              setSort={setSort}
            />

            <button
              onClick={applyFilters}
              className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Separate Filter Input Component (Clean & Reusable) --- */
function FilterInputs({
  minPrice,
  maxPrice,
  partners,
  rating,
  sort,
  setMinPrice,
  setMaxPrice,
  setPartners,
  setRating,
  setSort,
}: any) {
  return (
    <div className="space-y-4">
      {/* Min Price */}
      <div>
        <label className="text-sm font-medium">Min Price</label>
        <input
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
          placeholder="₹0"
        />
      </div>

      {/* Max Price */}
      <div>
        <label className="text-sm font-medium">Max Price</label>
        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
          placeholder="₹5000"
        />
      </div>

      {/* Partners */}
      <div>
        <label className="text-sm font-medium">Partner</label>
        <input
          value={partners}
          onChange={(e) => setPartners(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
          placeholder="Amazon, Flipkart"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
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
      <div>
        <label className="text-sm font-medium">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
        >
          <option value="">Relevance</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="discount-desc">Highest Discount</option>
        </select>
      </div>
    </div>
  );
}
