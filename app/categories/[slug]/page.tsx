"use client";

import { useEffect, useState } from "react";
import DealCard from "@/components/DealCard";
import FiltersBar from "@/components/FiltersBar";
import BackButton from "@/components/BackButton";

export default function CategoryDealsPage({ params }: { params: { slug: string } }) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/deals?category=${params.slug}`, { cache: "no-store" })
      .then(r => r.json())
      .then(d => setDeals(d.deals || []))
      .finally(() => setLoading(false));
  }, [params.slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BackButton />
      <FiltersBar category={params.slug} />

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No deals found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {deals.map(d => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
    </div>
  );
}
