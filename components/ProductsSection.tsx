"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function ProductsSection({
  externalProducts = [],
}: {
  externalProducts?: Product[];
}) {
  const params = useSearchParams();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ---------- FILTER & SORT ---------- */
  useEffect(() => {
    let list = [...externalProducts];

    const minPrice = Number(params.get("minPrice")) || 0;
    const maxPrice = Number(params.get("maxPrice")) || Infinity;
    const sort = params.get("sort");

    list = list.filter(p => {
      const price = Number(p.price);
      return price >= minPrice && price <= maxPrice;
    });

    if (sort === "price_low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === "price_high") {
      list.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(list);
    setVisibleCount(6);
  }, [params, externalProducts]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
        setVisibleCount(v => v + 4);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  return (
    <section className="py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.slice(0, visibleCount).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
    </section>
  );
}
