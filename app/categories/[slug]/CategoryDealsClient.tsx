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

  // ✅ SINGLE compare item (IMPORTANT)
  const [compareItem, setCompareItem] = useState<any | null>(null);

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
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-40">
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
                onCompare={() => setCompareItem(d)} // ✅ REPLACE
              />
            ))}
          </div>
          <div ref={loaderRef} className="h-10" />
        </>
      )}

      {/* ✅ CompareStrip ONLY HERE */}
      {compareItem && (
        <CompareStrip
          item={compareItem}
          onClose={() => setCompareItem(null)}
        />
      )}
    </div>
  );
}
