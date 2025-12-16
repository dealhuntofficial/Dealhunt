"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import FiltersBar from "@/components/FiltersBar";

export default function ProductsPageClient() {
  const params = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = `/api/deals?${params.toString()}`;

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setProducts(json.deals || []))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BackButton />

      {/* 🔥 FIXED FILTER BAR */}
      <FiltersBar />

      <div className="flex justify-between mt-6 mb-4">
        <h1 className="font-semibold text-lg">Products</h1>
        <span className="text-sm text-gray-600">
          {products.length} results
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((p, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow">
              <img
                src={p.image || "/images/placeholder.png"}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="mt-2 font-semibold line-clamp-2">
                {p.title}
              </h3>
              <div className="flex justify-between mt-2">
                <span className="font-bold text-green-600">
                  ₹{p.priceNow || p.price}
                </span>
                <span className="text-yellow-600">⭐ {p.rating || 4}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
