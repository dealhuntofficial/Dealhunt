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

  // 🔥 ARRAY instead of single item
  const [compareItems, setCompareItems] = useState<any[]>([]);

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

  const handleCompare = (deal: any) => {
    // same product ke other sellers / merchants
    const sameProducts = allDeals.filter(
      d => d.productId === deal.productId && d.id !== deal.id
    );

    setCompareItems(sameProducts);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-48">
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

      {compareItems.length > 0 && (
        <CompareStrip
          items={compareItems}
          onClear={() => setCompareItems([])}
        />
      )}
    </div>
  );
}
