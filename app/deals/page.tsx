"use client";

import BackButton from "@/components/BackButton";
import FilterSidebar from "@/components/FilterSidebar";
import { useEffect, useState } from "react";

export default function DealsPage({ searchParams }: any) {
  const [deals, setDeals] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // 🔥 Static Deals for Now (Replace with API Later)
  const staticDeals = [
    { id: 1, title: "Omega Seamaster", price: 2499, image: "/images/deals/deal1.jpg", rating: 4 },
    { id: 2, title: "Rolex Daytona", price: 12999, image: "/images/deals/deal2.jpg", rating: 5 },
    { id: 3, title: "Apple Watch Ultra", price: 799, image: "/images/deals/deal3.jpg", rating: 4 },
    { id: 4, title: "Tag Heuer Carrera", price: 3499, image: "/images/deals/deal4.jpg", rating: 5 },
  ];

  // 🔄 Apply Filters Locally (API ke bina bhi filter chalega)
  useEffect(() => {
    let filtered = [...staticDeals];

    // Price Filters
    if (searchParams?.minPrice) {
      filtered = filtered.filter((d) => d.price >= Number(searchParams.minPrice));
    }
    if (searchParams?.maxPrice) {
      filtered = filtered.filter((d) => d.price <= Number(searchParams.maxPrice));
    }

    // Rating Filter
    if (searchParams?.rating) {
      filtered = filtered.filter((d) => d.rating >= Number(searchParams.rating));
    }

    // Search Query Filter
    if (searchParams?.q) {
      filtered = filtered.filter((d) =>
        d.title.toLowerCase().includes(searchParams.q.toLowerCase())
      );
    }

    setDeals(filtered);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">

      <BackButton />

      {/* 🔘 Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        All Featured Deals
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <aside
          className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}
        >
          <FilterSidebar />
        </aside>

        {/* Deals Section */}
        <section className="lg:col-span-3">
          {deals.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No deals found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold">{deal.title}</h3>
                    <p className="text-yellow-600 font-bold">
                      ₹{deal.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">⭐ {deal.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
