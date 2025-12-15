"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";

type Filters = {
  sort: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  subcategory: string;
  merchant: string;
};

type Props = { params: { slug: string } };

export default function CategoryDealsPage({ params }: Props) {
  const slug = params.slug;
  const category = categories.find(c => c.slug === slug);

  const subs = subCategories[slug] || subCategories.default;

  const [deals, setDeals] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    sort: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    subcategory: "",
    merchant: ""
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        const url = new URL("/api/deals", base);
        url.searchParams.set("category", slug);

        Object.entries(filters).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value);
        });

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();

        setDeals(data.deals || []);
        setBrands(data.brands || []);
      } catch (err) {
        console.error("Category deals error:", err);
        setDeals([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [slug, filters]);

  if (!category) return <div className="p-8 text-center">Category not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BackButton />

      {/* ================= TOP FILTER BAR ================= */}
      <div className="sticky top-0 z-20 bg-white border-b py-3 mb-6">
        <div className="flex gap-3 overflow-x-auto text-sm">

          {/* SORT */}
          <select
            className="border rounded px-3 py-2"
            value={filters.sort}
            onChange={e =>
              setFilters(f => ({ ...f, sort: e.target.value }))
            }
          >
            <option value="">Sort</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="discount">Best Discount</option>
            <option value="newest">Newest</option>
          </select>

          {/* MANUAL PRICE */}
          <input
            type="number"
            placeholder="Min ₹"
            className="border rounded px-2 py-2 w-24"
            value={filters.minPrice}
            onChange={e =>
              setFilters(f => ({ ...f, minPrice: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Max ₹"
            className="border rounded px-2 py-2 w-24"
            value={filters.maxPrice}
            onChange={e =>
              setFilters(f => ({ ...f, maxPrice: e.target.value }))
            }
          />

          {/* RATINGS */}
          <select
            className="border rounded px-3 py-2"
            value={filters.rating}
            onChange={e =>
              setFilters(f => ({ ...f, rating: e.target.value }))
            }
          >
            <option value="">Ratings</option>
            <option value="1">1★ & above</option>
            <option value="2">2★ & above</option>
            <option value="3">3★ & above</option>
            <option value="4">4★ & above</option>
            <option value="5">5★ only</option>
          </select>

          {/* REAL BRANDS */}
          <select
            className="border rounded px-3 py-2"
            value={filters.merchant}
            onChange={e =>
              setFilters(f => ({ ...f, merchant: e.target.value }))
            }
          >
            <option value="">Real Brand</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= SUBCATEGORY FILTER ================= */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subs.slice(0, 15).map(sub => (
          <button
            key={sub.slug}
            onClick={() =>
              setFilters(f => ({
                ...f,
                subcategory: sub.slug === "real-brand" ? "real-brand" : sub.slug
              }))
            }
            className={`px-3 py-1 rounded text-sm border ${
              filters.subcategory === sub.slug
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* ================= DEALS GRID ================= */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading deals...</div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No deals found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {deals.map(deal => (
            <DealCard key={deal._id || deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
          }
