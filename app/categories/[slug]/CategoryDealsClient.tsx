"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  // 🔥 READ FILTERS FROM URL
  const search = searchParams.get("search") || "";
  const subcategory = searchParams.get("subcategory") || "";

  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [visible, setVisible] = useState(CHUNK);
  const [loading, setLoading] = useState(true);

  // ✅ ONLY ONE DEAL IN COMPARE
  const [compareItem, setCompareItem] = useState<any | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* ---------- FETCH DEALS WITH FILTERS ---------- */
  useEffect(() => {
    setLoading(true);

    const url = new URL("/api/deals", window.location.origin);

    // ✅ CATEGORY
    if (params.slug !== "all") {
      url.searchParams.set("category", params.slug);
    }

    // ✅ SEARCH
    if (search) {
      url.searchParams.set("search", search);
    }

    // ✅ SUBCATEGORY
    if (subcategory) {
      url.searchParams.set("subcategory", subcategory);
    }

    fetch(url.toString(), { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setAllDeals(d.deals || []);
        setVisible(CHUNK);
      })
      .finally(() => setLoading(false));
  }, [params.slug, search, subcategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-48">
      <BackButton />
      <FiltersBar category={params.slug} />

      {loading ? (
        <div className="text-center py-12">Loading…</div>
      ) : allDeals.length === 0 ? (
        <div className="text-center py-12">No deals found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {allDeals.slice(0, visible).map(d => (
              <DealCard
                key={d.id}
                deal={d}
                onCompare={() => setCompareItem(d)}
              />
            ))}
          </div>
          <div ref={loaderRef} className="h-10" />
        </>
      )}

      {compareItem && (
        <CompareStrip
          item={compareItem}
          onClear={() => setCompareItem(null)}
        />
      )}
    </div>
  );
}
