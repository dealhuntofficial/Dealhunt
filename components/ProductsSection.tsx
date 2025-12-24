"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import DealCard from "@/components/DealCard";

export default function ProductsSection({
  externalProducts = [],
}: {
  externalProducts?: any[];
}) {
  const params = useSearchParams();

  const [filtered, setFiltered] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let list = [...externalProducts];

    const minPrice = Number(params.get("minPrice")) || 0;
    const maxPrice = Number(params.get("maxPrice")) || Infinity;

    list = list.filter(p => {
      const price = Number(p.priceNow || p.price);
      return price >= minPrice && price <= maxPrice;
    });

    setFiltered(list);
    setVisibleCount(6);
  }, [params, externalProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (
        entries[0].isIntersecting &&
        visibleCount < filtered.length
      ) {
        setVisibleCount(v => v + 4);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  return (
    <section className="py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.slice(0, visibleCount).map(item => (
          <DealCard key={item.id} deal={item} />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
    </section>
  );
}
