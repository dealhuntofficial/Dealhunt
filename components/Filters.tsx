// File: components/Filters.tsx
"use client";

import React from "react";

interface FiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  const partnersList = [
    "Amazon",
    "Flipkart",
    "Meesho",
    "Myntra",
    "Ajio",
    "TataCliq",
    "Croma",
    "RelianceDigital",
    "Snapdeal",
  ];

  const ratingList = [
    { label: "1 ★ & above", value: 1 },
    { label: "2 ★ & above", value: 2 },
    { label: "3 ★ & above", value: 3 },
    { label: "4 ★ & above", value: 4 },
    { label: "5 ★ only", value: 5 },
  ];

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md space-y-4">

      {/* Price Filter */}
      <div>
        <label className="font-semibold">Price Range</label>
        <div className="flex gap-3 mt-2">
          <input
            type="number"
            placeholder="Min"
            className="border p-2 rounded w-1/2"
            value={filters.minPrice || ""}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="border p-2 rounded w-1/2"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
        </div>
      </div>

      {/* Partners Filter */}
      <div>
        <label className="font-semibold">Partners</label>
        <select
          className="w-full border p-2 rounded mt-2"
          value={filters.partner || ""}
          onChange={(e) =>
            setFilters({ ...filters, partner: e.target.value })
          }
        >
          <option value="">All Partners</option>
          {partnersList.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Ratings Filter */}
      <div>
        <label className="font-semibold">Minimum Rating</label>
        <select
          className="w-full border p-2 rounded mt-2"
          value={filters.minRating || ""}
          onChange={(e) =>
            setFilters({ ...filters, minRating: Number(e.target.value) })
          }
        >
          <option value="">Any Rating</option>
          {ratingList.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
