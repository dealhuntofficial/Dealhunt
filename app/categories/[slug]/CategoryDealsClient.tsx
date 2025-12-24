"use client";

import { useEffect, useRef, useState } from "react";
import DealCard from "@/components/DealCard";
import FiltersBar from "@/components/FiltersBar";
import BackButton from "@/components/BackButton";
import CompareStrip, { CompareItem } from "@/components/CompareStrip";

const CHUNK = 12;

export default function CategoryDealsClient({
  params,
}: {
  params: { slug: string };
}) {
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [visible, setVisible] = useState(CHUNK);
  const [loading, setLoading] = useState(true);

  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
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

  const addToCompare = (deal: any) => {
    setCompareItems(prev =>
      prev.find(i => i.id === deal.id)
        ? prev
        : [
            ...prev,
            {
              id: deal.id,
              title: deal.title,
              image: deal.image,
            },
          ]
    );
  };

  const removeFromCompare = (id: string) => {
    setCompareItems(prev => prev.filter(i => i.id !== id));
  };

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
                onCompare={() => addToCompare(d)}
              />
            ))}
          </div>
          <div ref={loaderRef} className="h-10" />
        </>
      )}

      {compareItems.length > 0 && (
        <CompareStrip
          items={compareItems}
          onRemove={removeFromCompare}
        />
      )}
    </div>
  );
}
