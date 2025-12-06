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

        // 🔥 API se auto partners extract
        const allPartners = [
          ...new Set(
            mapped.flatMap((p) =>
              p.comparison.map((c) => c.site?.trim()).filter(Boolean)
            )
          ),
        ];

        setPartners(allPartners);

        // Auto price range detection
        const prices = mapped.map((p) =>
          Number(String(p.price).replace(/[^0-9]/g, ""))
        );

        if (prices.length > 0) {
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [searchQuery, categoryParam]);

  // 🔄 Filtering Logic
  let filteredProducts = products.filter((p) => {
    const numPrice = Number(String(p.price).replace(/[^0-9]/g, ""));

    return (
      (selectedBrand === "all" || p.brand === selectedBrand) &&
      p.rating >= minRating &&
      numPrice >= priceRange[0] &&
      numPrice <= priceRange[1] &&
      (selectedPartners.length === 0 ||
        selectedPartners.some((partner) =>
          p.comparison.some((c) => c.site === partner)
        ))
    );
  });

  if (priceSort === "high") {
    filteredProducts.sort(
      (a, b) =>
        Number(b.price.replace(/[^0-9]/g, "")) -
        Number(a.price.replace(/[^0-9]/g, ""))
    );
  }

  if (priceSort === "low") {
    filteredProducts.sort(
      (a, b) =>
        Number(a.price.replace(/[^0-9]/g, "")) -
        Number(b.price.replace(/[^0-9]/g, ""))
    );
  }

  const togglePartner = (partner: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partner)
        ? prev.filter((p) => p !== partner)
        : [...prev, partner]
    );
  };

  // ---------------- UI START --------------------

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
        Showing results for{" "}
        <span className="text-yellow-600">{categoryParam || searchQuery}</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ==== FILTER SIDEBAR ==== */}
        <aside
          className={`bg-white rounded-xl shadow-md p-4 h-fit flex flex-col gap-4 md:w-64 md:static absolute w-10/12 z-20 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-lg font-semibold">Filters</h2>

          {/* Brand Filter */}
          <label>
            <span className="text-sm font-medium">Brand</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-2"
            >
              <option value="all">All</option>
              {[...new Set(products.map((p) => p.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>

          {/* Rating Filter */}
          <div>
            <span className="text-sm font-medium">Minimum Rating</span>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`px-3 py-1 rounded ${
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

          {/* Partners Auto–Generated */}
          <div>
            <span className="text-sm font-medium">Partners</span>
            <div className="flex flex-col gap-1 mt-2">
              {partners.length === 0 ? (
                <p className="text-xs text-gray-400">No partners found</p>
              ) : (
                partners.map((p) => (
                  <label key={p} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPartners.includes(p)}
                      onChange={() => togglePartner(p)}
                    />
                    {p}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Sort */}
          <label>
            <span className="text-sm font-medium">Sort by Price</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="w-full mt-1 border rounded px-2 py-2"
            >
              <option value="none">None</option>
              <option value="high">High → Low</option>
              <option value="low">Low → High</option>
            </select>
          </label>
        </aside>

        {/* ==== PRODUCT GRID ==== */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-4 animate-pulse"
                >
                  <div className="h-40 bg-gray-200 rounded" />
                  <div className="mt-3 h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </>
          ) : filteredProducts.length ? (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition"
              >
                <img
                  src={p.img}
                  className="w-full h-40 object-cover rounded-lg"
                  alt={p.name}
                />

                <h2 className="text-sm font-semibold mt-2 line-clamp-2">
                  {p.name}
                </h2>

                <p className="text-lg font-bold text-green-600">{p.price}</p>

                <button className="mt-3 w-full bg-yellow-500 text-white py-2 rounded-lg">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
