"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type Props = { params: { slug: string; sub: string } };

export default function SubcategoryDealsPage({ params }: Props) {
  const { slug, sub } = params;

  // Category + Subcategory
  const category = categories.find((c) => c.slug === slug);
  const subCat = (subCategories[slug] || []).find((s) => s.slug === sub) || null;

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --------------------------
  // 🔥 FILTER STATES
  // --------------------------
  const [sort, setSort] = useState("");
  const [discount, setDiscount] = useState("");
  const [store, setStore] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  if (!category || !subCat) {
    return <div className="p-8 text-center">Not found</div>;
  }

  // --------------------------
  // 📌 FETCH DEALS
  // --------------------------
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        const url = new URL("/api/deals", base);

        url.searchParams.set("category", slug);
        url.searchParams.set("subcategory", sub);

        if (sort) url.searchParams.set("sort", sort);
        if (discount) url.searchParams.set("discount", discount);
        if (store) url.searchParams.set("store", store);
        if (rating) url.searchParams.set("rating", rating);
        if (inStock) url.searchParams.set("inStock", "true");
        if (minPrice) url.searchParams.set("minPrice", minPrice);
        if (maxPrice) url.searchParams.set("maxPrice", maxPrice);

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();

        setDeals(data.deals || []);
      } catch (err) {
        console.error("Subcategory fetching error:", err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [slug, sub, sort, discount, store, rating, inStock, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        
        {/* -------------------------------------- */}
        {/* 🧿 LEFT SIDEBAR FILTERS */}
        {/* -------------------------------------- */}
        <aside className="bg-white p-4 rounded shadow h-fit lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          {/* Sort */}
          <div className="mb-4">
            <label className="font-medium">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full mt-1 border rounded p-2"
            >
              <option value="">Default</option>
              <option value="latest">Latest</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="font-medium">Minimum Discount</label>
            <select
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full mt-1 border rounded p-2"
            >
              <option value="">Any</option>
              <option value="10">10%+</option>
              <option value="30">30%+</option>
              <option value="50">50%+</option>
              <option value="70">70%+</option>
            </select>
          </div>

          {/* Store */}
          <div className="mb-4">
            <label className="font-medium">Store</label>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="w-full mt-1 border rounded p-2"
            >
              <option value="">All</option>
              <option value="amazon">Amazon</option>
              <option value="flipkart">Flipkart</option>
              <option value="myntra">Myntra</option>
              <option value="ajio">Ajio</option>
              <option value="meesho">Meesho</option>
            </select>
          </div>

          {/* Ratings */}
          <div className="mb-4">
            <label className="font-medium">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full mt-1 border rounded p-2"
            >
              <option value="">Any</option>
              <option value="3">3★+</option>
              <option value="4">4★+</option>
              <option value="4.5">4.5★+</option>
            </select>
          </div>

          {/* In Stock */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={inStock}
              onChange={() => setInStock(!inStock)}
              className="mr-2"
            />
            <label className="font-medium">In Stock Only</label>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="font-medium">Price Range</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 border p-2 rounded"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 border p-2 rounded"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

        </aside>

        {/* -------------------------------------- */}
        {/* DEALS LIST */}
        {/* -------------------------------------- */}
        <section className="lg:col-span-3">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {category.name} — {subCat.name}
            </h1>
            <p className="text-sm text-gray-500">Filtered deals</p>
          </header>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No deals found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
