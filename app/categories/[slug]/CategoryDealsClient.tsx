"use client";

import { useEffect, useRef, useState } from "react";
import DealCard from "@/components/DealCard";
import FiltersBar from "@/components/FiltersBar";
import BackButton from "@/components/BackButton";
import CompareStrip from "@/components/CompareStrip";

const CHUNK = 12;

export default function CategoryDealsClient({
  params,
}: {
  params: { slug: string };
}) {
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [visible, setVisible] = useState(CHUNK);
  const [loading, setLoading] = useState(true);

  // ✅ selected deal only (single)
  const [compareBaseDeal, setCompareBaseDeal] = useState<any | null>(null);
  const [compareDeals, setCompareDeals] = useState<any[]>([]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);

    const url = new URL("/api/deals", window.location.origin);
    if (params.slug !== "all") {
      url.searchParams.set("category", params.slug);
    }

    fetch(url.toString(), { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setAllDeals(d.deals || []);
        setVisible(CHUNK);
        setCompareBaseDeal(null);
        setCompareDeals([]);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleCompare = (deal: any) => {
    setCompareBaseDeal(deal);

    // ✅ same product ke other merchants only
    const related = allDeals.filter(
      d =>
        d.id !== deal.id &&
        d.productId === deal.productId
    );

    setCompareDeals(related);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-56">
      <BackButton />
      <FiltersBar category={params.slug} />

      {loading ? (
        <div className="text-center py-12">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {allDeals.slice(0, visible).map(d => (
              <DealCard
                key={d.id}
                deal={d}
                onCompare={() => handleCompare(d)}
              />
            ))}
          </div>
          <div ref={loaderRef} className="h-10" />
        </>
      )}

      {compareBaseDeal && compareDeals.length > 0 && (
        <CompareStrip
          items={compareDeals}
          onClear={() => {
            setCompareBaseDeal(null);
            setCompareDeals([]);
          }}
        />
      )}
    </div>
  );
}
