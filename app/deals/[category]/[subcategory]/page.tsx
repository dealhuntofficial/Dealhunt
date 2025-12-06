"use client";

import { useEffect, useState } from "react";
import Filters from "@/components/Filters";

export default function DealsPage({ params }: any) {
  const { category, subcategory } = params;

  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    partner: "",
    minRating: "",
  });

  // Fetch Deals
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch(
          `/api/deals?category=${category}&subcategory=${subcategory}`
        );
        const data = await res.json();
        setDeals(data);
        setFilteredDeals(data);
      } catch (err) {
        console.log("Fetch Error:", err);
      }
    }

    loadDeals();
  }, [category, subcategory]);

  // Filtering logic
  useEffect(() => {
    if (!deals.length) return;

    let temp = [...deals];

    // Min Price
    if (filters.minPrice)
      temp = temp.filter((d: any) => d.price >= Number(filters.minPrice));

    // Max Price
    if (filters.maxPrice)
      temp = temp.filter((d: any) => d.price <= Number(filters.maxPrice));

    // Partner (Amazon, Flipkart etc)
    if (filters.partner)
      temp = temp.filter(
        (d: any) =>
          d.partner?.toLowerCase() === filters.partner.toLowerCase()
      );

    // Rating filter
    if (filters.minRating)
      temp = temp.filter(
        (d: any) => (d.rating || 0) >= Number(filters.minRating)
      );

    setFilteredDeals(temp);
  }, [filters, deals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <h1 className="text-3xl font-bold mb-4 capitalize">
        {subcategory.replace(/-/g, " ")}
      </h1>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Deals List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
        {filteredDeals.length ? (
          filteredDeals.map((deal: any) => (
            <div
              key={deal.id}
              className="border rounded-lg p-3 shadow hover:shadow-lg"
            >
              <img
                src={deal.image}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="font-semibold mt-2">{deal.title}</h2>
              <p className="text-sm text-gray-600">{deal.partner}</p>
              <p className="text-lg font-bold text-green-600">₹{deal.price}</p>
              <p className="text-yellow-500 text-sm">
                ⭐ {deal.rating || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-8 text-center col-span-full">
            No deals found.
          </p>
        )}
      </div>
    </div>
  );
  }
