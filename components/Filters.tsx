// components/Filters.tsx
"use client";

import React, { useState, useEffect } from "react";
import useFilters, { FiltersState } from "@/hooks/useFilters";

type Props = {
  initial?: Partial<FiltersState>;
  onApply?: (f: Partial<FiltersState>) => void;
  onClose?: () => void;
  showClose?: boolean;
};

export default function Filters({ initial = {}, onApply, onClose, showClose = true }: Props) {
  const { read, apply } = useFilters();
  const urlState = read();

  // initialize from URL (urlState) and optionally initial prop
  const [q, setQ] = useState(initial.q ?? urlState.q ?? "");
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? urlState.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? urlState.maxPrice ?? "");
  const [merchant, setMerchant] = useState(initial.merchant ?? urlState.merchant ?? "");
  const [sort, setSort] = useState(initial.sort ?? urlState.sort ?? "");
  const [minDiscount, setMinDiscount] = useState(initial.minDiscount ?? urlState.minDiscount ?? "");
  const [maxDiscount, setMaxDiscount] = useState(initial.maxDiscount ?? urlState.maxDiscount ?? "");
  const [rating, setRating] = useState(initial.rating ?? urlState.rating ?? "");

  // when URL changes (external), sync inputs
  useEffect(() => {
    const s = read();
    setQ(s.q ?? "");
    setMinPrice(s.minPrice ?? "");
    setMaxPrice(s.maxPrice ?? "");
    setMerchant(s.merchant ?? "");
    setSort(s.sort ?? "");
    setMinDiscount(s.minDiscount ?? "");
    setMaxDiscount(s.maxDiscount ?? "");
    setRating(s.rating ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* intentionally empty: hook read() is stable but searchParams triggers update through navigation */]);

  const handleApply = () => {
    const next: Partial<FiltersState> = {};
    if (q) next.q = q;
    else next.q = "";

    if (minPrice) next.minPrice = minPrice;
    else next.minPrice = "";

    if (maxPrice) next.maxPrice = maxPrice;
    else next.maxPrice = "";

    if (merchant) next.merchant = merchant;
    else next.merchant = "";

    if (sort) next.sort = sort;
    else next.sort = "";

    if (minDiscount) next.minDiscount = minDiscount;
    else next.minDiscount = "";

    if (maxDiscount) next.maxDiscount = maxDiscount;
    else next.maxDiscount = "";

    if (rating) next.rating = rating;
    else next.rating = "";

    apply(next);
    if (onApply) onApply(next);
  };

  const handleClear = () => {
    apply({
      q: "",
      minPrice: "",
      maxPrice: "",
      merchant: "",
      sort: "",
      minDiscount: "",
      maxDiscount: "",
      rating: "",
    });
    if (onApply) onApply({});
    if (onClose) onClose();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-lg font-semibold">Filters</h4>
        {showClose && onClose && (
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Search</label>
        <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full border rounded mt-1 p-2" placeholder="Search title or keywords" />
      </div>

      <div>
        <label className="text-sm font-medium">Price (₹)</label>
        <div className="flex gap-2 mt-1">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 border rounded p-2" />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Discount (%)</label>
        <div className="flex gap-2 mt-1">
          <input type="number" value={minDiscount} onChange={(e) => setMinDiscount(e.target.value)} placeholder="Min %" className="w-1/2 border rounded p-2" />
          <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="Max %" className="w-1/2 border rounded p-2" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Merchant / Partner</label>
        <input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="e.g. Amazon, Flipkart" className="w-full border rounded mt-1 p-2" />
      </div>

      <div>
        <label className="text-sm font-medium">Min Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border rounded mt-1 p-2">
          <option value="">Any</option>
          <option value="1">1★ & up</option>
          <option value="2">2★ & up</option>
          <option value="3">3★ & up</option>
          <option value="4">4★ & up</option>
          <option value="5">5★</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Sort</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border rounded mt-1 p-2">
          <option value="">Default (Relevance)</option>
          <option value="latest">Latest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="discount-desc">Discount: High → Low</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      <div className="flex gap-2 mt-2">
        <button onClick={handleApply} className="flex-1 bg-blue-600 text-white py-2 rounded">Apply</button>
        <button onClick={handleClear} className="flex-1 bg-gray-200 py-2 rounded">Clear</button>
      </div>
    </div>
  );
}
