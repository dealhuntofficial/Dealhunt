"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import FilterSidebar from "@/components/FilterSidebar";

interface ComparisonItem {
  site: string;
  price: string;
  rating: number;
}

interface Product {
  id: number | string;
  title: string;
  name?: string;
  priceNow?: number;
  price?: string;
  img?: string;
  image?: string;
  comparison?: ComparisonItem[];
  brand?: string;
  merchant?: string;
  rating?: number;
}

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();

  const searchQuery = params.get("search") || params.get("q") || "";
  const categoryParam = params.get("category") || "";

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const minPriceParam = params.get("minPrice") || "";
  const maxPriceParam = params.get("maxPrice") || "";
  const partnersParam = params.get("partners") || "";
  const ratingParam = params.get("rating") || "";
  const sortParam = params.get("sort") || params.get("sortBy") || "";

  const partnersArray = useMemo(
    () =>
      partnersParam
        ? partnersParam
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [partnersParam]
  );

  const apiUrl = useMemo(() => {
    const q = new URLSearchParams();

    if (categoryParam) q.set("category", categoryParam);
    if (searchQuery) q.set("q", searchQuery);
    if (minPriceParam) q.set("minPrice", minPriceParam);
    if (maxPriceParam) q.set("maxPrice", maxPriceParam);
    if (partnersParam) q.set("partners", partnersParam);
    if (ratingParam) q.set("rating", ratingParam);
    if (sortParam) q.set("sort", sortParam);

    return `/api/deals?${q.toString()}`;
  }, [
    categoryParam,
    searchQuery,
    minPriceParam,
    maxPriceParam,
    partnersParam,
    ratingParam,
    sortParam,
  ]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const load = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          if (!mounted) return;
          setProducts([]);
          setLoading(false);
          return;
        }
        const json = await res.json();
        const list: any[] = json.deals || [];

        const mapped: Product[] = list.map((it: any, idx: number) => ({
          id: it.id ?? idx,
          title: it.title ?? it.name ?? `Product ${idx + 1}`,
          name: it.title ?? it.name,
          priceNow: typeof it.priceNow === "number" ? it.priceNow : undefined,
          price: it.price ?? (it.priceNow ? `₹${it.priceNow}` : undefined),
          img: it.image ?? it.img ?? "/images/placeholder.png",
          image: it.image ?? it.img,
          comparison: it.comparison ?? [],
          brand: it.brand ?? it.merchant ?? "Unknown",
          merchant: it.merchant,
          rating: it.rating ?? 4,
        }));

        if (!mounted) return;
        setProducts(mapped);
      } catch (err) {
        console.error("Products fetch error:", err);
        if (!mounted) return;
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  const minPriceNum = Number(minPriceParam || 0);
  const maxPriceNum = maxPriceParam ? Number(maxPriceParam) : Number.POSITIVE_INFINITY;
  const minRatingNum = ratingParam ? Number(ratingParam) : 0;

  // ✅ FIXED: Added parentheses around (a ?? b)
  const clientFiltered = useMemo(() => {
    return products
      .filter((p) => {
        const price =
          (p.priceNow ?? Number(String(p.price ?? "").replace(/[^0-9]/g, ""))) ||
          0;

        if (minPriceParam && price < minPriceNum) return false;
        if (maxPriceParam && price > maxPriceNum) return false;

        if (minRatingNum && (p.rating ?? 0) < minRatingNum) return false;

        if (partnersArray.length > 0) {
          const lowerPartners = partnersArray.map((x) => x.toLowerCase());
          const brandOk = p.brand ? lowerPartners.includes(p.brand.toLowerCase()) : false;
          const compOk = (p.comparison || []).some((c) =>
            lowerPartners.includes((c.site || "").toLowerCase())
          );
          if (!brandOk && !compOk) return false;
        }

        return true;
      })
      .slice();
  }, [
    products,
    minPriceParam,
    maxPriceParam,
    minPriceNum,
    maxPriceNum,
    minRatingNum,
    partnersArray,
  ]);

  const finalList = useMemo(() => {
    const arr = clientFiltered.slice();

    if (
      sortParam === "price-asc" ||
      sortParam === "price-ascending"
    ) {
      arr.sort((a, b) => {
        const pa =
          (a.priceNow ??
            Number(String(a.price ?? "").replace(/[^0-9]/g, ""))) || 0;
        const pb =
          (b.priceNow ??
            Number(String(b.price ?? "").replace(/[^0-9]/g, ""))) || 0;
        return pa - pb;
      });
    } else if (
      sortParam === "price-desc" ||
      sortParam === "price-descending"
    ) {
      arr.sort((a, b) => {
        const pa =
          (a.priceNow ??
            Number(String(a.price ?? "").replace(/[^0-9]/g, ""))) || 0;
        const pb =
          (b.priceNow ??
            Number(String(b.price ?? "").replace(/[^0-9]/g, ""))) || 0;
        return pb - pa;
      });
    }

    return arr;
  }, [clientFiltered, sortParam]);

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      <div className="flex items-center justify-between gap-4 mt-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="md:hidden bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm"
            aria-expanded={showFilters}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={clearFilters}
            className="hidden sm:inline-block text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {finalList.length} result{finalList.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative">
        <aside
          className={`bg-white rounded-xl shadow-md p-4 h-fit md:w-72 absolute md:static top-0 left-0 w-11/12 mx-auto transition-all duration-300 z-20 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <FilterSidebar />
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
          ) : finalList.length > 0 ? (
            finalList.map((p) => {
              const priceLabel =
                p.priceNow !== undefined
                  ? `₹${p.priceNow}`
                  : p.price ?? "₹0";

              const imageSrc = p.img ?? p.image ?? "/images/placeholder.png";

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition"
                >
                  <img
                    src={imageSrc}
                    alt={p.title || p.name || String(p.id)}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <h2 className="mt-2 text-base font-semibold line-clamp-2">
                    {p.title ?? p.name}
                  </h2>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-green-600">{priceLabel}</p>
                    <p className="text-sm text-yellow-600">⭐ {p.rating ?? 4}</p>
                  </div>

                  <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 rounded-lg">
                    View Details
                  </button>
                </div>
              );
            })
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
