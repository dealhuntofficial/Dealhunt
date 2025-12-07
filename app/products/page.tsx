"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ComparisonItem {
  site: string;
  price: string;
  rating: number;
}

interface Product {
  id: number | string;
  name: string;
  price: string;
  img: string;
  comparison: ComparisonItem[];
  brand: string;
  rating: number;
}

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  let searchQuery = "";
  let categoryParam = "";

  try {
    const params = useSearchParams();
    categoryParam = params?.get("category") || "";
    searchQuery = params?.get("search") || categoryParam || "";
  } catch (err) {
    searchQuery = "";
    categoryParam = "";
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [priceSort, setPriceSort] = useState<"high" | "low" | "none">("none");

  // partners will now be populated from /api/merchants
  const [partners, setPartners] = useState<string[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (categoryParam) params.set("category", categoryParam);
    else if (searchQuery) params.set("q", searchQuery);

    const apiUrl = `/api/deals?${params.toString()}`;

    const fetchDeals = async () => {
      try {
        const res = await fetch(apiUrl);

        if (!res.ok) {
          setProducts([]);
          setPartners([]);
          setLoading(false);
          return;
        }

        const json = await res.json();
        const items = json.deals || [];

        const mapped: Product[] = items.map((it: any, idx: number) => ({
          id: it.id || idx,
          name: it.title || it.name || "Unknown Product",
          price: it.priceNow ? `₹${it.priceNow}` : it.price || "₹0",
          img: it.image || "/images/placeholder.png",
          comparison: it.comparison || [],
          brand: it.brand || it.merchant || "Unknown",
          rating: it.rating || 4,
        }));

        setProducts(mapped);

        const prices = mapped.map((p) =>
          Number(String(p.price).replace(/[^0-9]/g, ""))
        );
        if (prices.length > 0) setPriceRange([Math.min(...prices), Math.max(...prices)]);
      } catch (err) {
        console.error("Fetch deals error:", err);
        setProducts([]);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [searchQuery, categoryParam]);

  // NEW: fetch partners (merchants) from our new server route
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const q = new URLSearchParams();
        if (categoryParam) q.set("category", categoryParam);
        const url = `/api/merchants?${q.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          setPartners([]);
          return;
        }
        const json = await res.json();
        const arr = (json.merchants || []).map((m: any) => m.name || m);
        setPartners(arr);
      } catch (err) {
        console.error("fetch merchants error:", err);
        setPartners([]);
      }
    };
    fetchMerchants();
  }, [categoryParam, searchQuery]);

  // Apply filters
  let filteredProducts = products.filter((p) => {
    const numericPrice = Number(String(p.price).replace(/[^0-9]/g, ""));

    return (
      (selectedBrand === "all" || p.brand === selectedBrand) &&
      p.rating >= minRating &&
      numericPrice >= priceRange[0] &&
      numericPrice <= priceRange[1] &&
      (selectedPartners.length === 0 ||
        selectedPartners.some((partner) =>
          // check either top-level brand/merchant or in comparison sites
          p.brand?.toLowerCase() === partner.toLowerCase() ||
          p.comparison.some((c) => (c.site || "").toLowerCase() === partner.toLowerCase())
        ))
    );
  });

  if (priceSort === "high")
    filteredProducts.sort(
      (a, b) =>
        Number(String(b.price).replace(/[^0-9]/g, "")) -
        Number(String(a.price).replace(/[^0-9]/g, ""))
    );
  else if (priceSort === "low")
    filteredProducts.sort(
      (a, b) =>
        Number(String(a.price).replace(/[^0-9]/g, "")) -
        Number(String(b.price).replace(/[^0-9]/g, ""))
    );

  const togglePartner = (partner: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partner)
        ? prev.filter((p) => p !== partner)
        : [...prev, partner]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <Link
          href="/"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md"
        >
          ← Back to Home
        </Link>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Showing results for:{" "}
        <span className="text-yellow-600">{categoryParam || searchQuery || "All"}</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Filters Sidebar */}
        <aside
          className={`bg-white rounded-xl shadow-md p-4 h-fit flex flex-col gap-4 md:w-64 md:static absolute top-0 left-0 w-11/12 mx-auto transition-all duration-300 z-20 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-lg font-semibold mb-3">Filters</h2>

          {/* Brand Filter */}
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Brand</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              {[...new Set(products.map((p) => p.brand))].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          {/* Rating Filter */}
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">
              Minimum Rating
            </span>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`px-2 py-1 rounded ${
                    minRating >= star
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {star}⭐
                </button>
              ))}
            </div>
          </div>

          {/* Partners (from /api/merchants) */}
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-700">Partners</span>
            <div className="flex flex-col gap-1 mt-2">
              {partners.length === 0 ? (
                <p className="text-xs text-gray-400">No partners found</p>
              ) : (
                partners.map((partner) => (
                  <label key={partner} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPartners.includes(partner)}
                      onChange={() => togglePartner(partner)}
                    />
                    {partner}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Sort */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Sort by Price
            </span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="none">None</option>
              <option value="high">High to Low</option>
              <option value="low">Low to High</option>
            </select>
          </label>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
              >
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h2 className="text-base font-semibold mt-2 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-lg font-bold text-green-600">
                  {product.price}
                </p>

                <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 rounded-lg">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No products found matching your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
    }
