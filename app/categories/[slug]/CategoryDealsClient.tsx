"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import DealCard from "@/components/DealCard";
import FiltersBar from "@/components/FiltersBar";
import BackButton from "@/components/BackButton";

const CHUNK = 12;

export default function CategoryDealsClient({
  params,
}: {
  params: { slug: string };
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const subcategory = searchParams.get("subcategory") || "";

  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [visible, setVisible] = useState(CHUNK);
  const [loading, setLoading] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);

    const url = new URL("/api/deals", window.location.origin);
    if (params.slug !== "all") url.searchParams.set("category", params.slug);
    if (search) url.searchParams.set("search", search);
    if (subcategory) url.searchParams.set("subcategory", subcategory);

    fetch(url.toString(), { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setAllDeals(d.deals || []);
        setVisible(CHUNK);
      })
      .finally(() => setLoading(false));
  }, [params.slug, search, subcategory]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(v => Math.min(v + CHUNK, allDeals.length));
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [allDeals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
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
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
          <div ref={loaderRef} className="h-10" />
        </>
      )}
    </div>
  );
}
