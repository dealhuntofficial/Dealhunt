"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

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
  } catch {
    categoryParam = "";
    searchQuery = "";
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [priceSort, setPriceSort] = useState<"high" | "low" | "none">("none");

  const [partners, setPartners] = useState<string[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [showFilters, setShowFilters] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (categoryParam) params.set("category", categoryParam);
    else if (searchQuery) params.set("q", searchQuery);

    if (selectedPartners.length > 0)
      params.set("partners", selectedPartners.join(","));

    const apiUrl = `/api/deals?${params.toString()}`;

    const loadProducts = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const json = await res.json();
        const list = json.deals || [];

        const mapped: Product[] = list.map((it: any, idx: number) => ({
          id: it.id || idx,
          name: it.title || it.name,
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

        if (prices.length > 0)
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchQuery, categoryParam, selectedPartners]);

  // FETCH MERCHANTS
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const q = new URLSearchParams();
        if (categoryParam) q.set("category", categoryParam);

        const res = await fetch(`/api/merchants?${q.toString()}`);
        const json = await res.json();

        const arr = (json.merchants || []).map((m: any) => m.name);
        setPartners(arr);
      } catch {
        setPartners([]);
      }
    };

    loadPartners();
  }, [categoryParam, searchQuery]);

  // LOCAL FILTERING
  let filteredProducts = products.filter((p) => {
    const numericPrice = Number(String(p.price).replace(/[^0-9]/g, ""));
    return (
      (selectedBrand === "all" || p.brand === selectedBrand) &&
      p.rating >= minRating &&
      numericPrice >= priceRange[0] &&
      numericPrice <= priceRange[1] &&
      (selectedPartners.length === 0 ||
        selectedPartners.some(
          (partner) =>
            p.brand?.toLowerCase() === partner.toLowerCase() ||
            p.comparison.some(
              (c) =>
                (c.site || "").toLowerCase() === partner.toLowerCase()
            )
        ))
    );
  });

  // PRICE SORT
  if (priceSort === "low") {
    filteredProducts.sort((a, b) => {
      const pa = Number(a.price.replace(/[^0-9]/g, ""));
      const pb = Number(b.price.replace(/[^0-9]/g, ""));
      return pa - pb;
    });
  }

  if (priceSort === "high") {
    filteredProducts.sort((a, b) => {
      const pa = Number(a.price.replace(/[^0-9]/g, ""));
      const pb = Number(b.price.replace(/[^0-9]/g, ""));
      return pb - pa;
    });
  }

  const togglePartner = (p: string) => {
    setSelectedPartners((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // UI
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      <div className="mb-4 flex justify-end items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Showing results for:{" "}
        <span className="text-yellow-600">
          {categoryParam || searchQuery || "All"}
        </span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6 relative">
        <aside
          className={`bg-white rounded-xl shadow-md p-4 h-fit flex flex-col gap-4 md:w-64 md:static absolute top-0 left-0 w-11/12 mx-auto transition-all duration-300 z-20 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-lg font-semibold mb-3">Filters</h2>

          <label>
            <span className="text-sm font-medium">Brand</span>
            <select
              className="w-full border mt-1 rounded px-3 py-2"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All</option>
              {[...new Set(products.map((p) => p.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm font-medium">Min Rating</span>
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

          <label>
            <span className="text-sm font-medium">Sort by Price</span>
            <select
              className="w-full border mt-1 rounded px-3 py-2"
              value={priceSort}
              onChange={(e) =>
                setPriceSort(e.target.value as "high" | "low" | "none")
              }
            >
              <option value="none">None</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
            </select>
          </label>
        </aside>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
              >
                <div className="w-full h-40 bg-gray-200 rounded"></div>
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <h2 className="mt-2 text-base font-semibold line-clamp-2">
                  {p.name}
                </h2>

                <p className="text-lg font-bold text-green-600">{p.price}</p>

                <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 rounded-lg">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
