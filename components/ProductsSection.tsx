"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface ProductType {
  id: number | string;
  title: string;
  price: number;
  image: string;
  merchant?: string;
}

export default function ProductsSection({
  externalProducts = [],
}: {
  externalProducts?: ProductType[];
}) {
  const params = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ---------- FILTER LOGIC ---------- */
  useEffect(() => {
    let list = [...externalProducts];

    const minPrice = Number(params.get("minPrice")) || 0;
    const maxPrice = Number(params.get("maxPrice")) || Infinity;
    const q = params.get("q")?.toLowerCase() || "";
    const merchant = params.get("merchant")?.toLowerCase() || "";
    const sort = params.get("sort");

    list = list.filter((p) => {
      const price = Number(String(p.price).replace(/[^0-9.-]+/g, ""));
      return price >= minPrice && price <= maxPrice;
    });

    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (merchant) {
      list = list.filter((p) =>
        (p.merchant || "").toLowerCase().includes(merchant)
      );
    }

    if (sort === "price_low") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price_high") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredProducts(list);
    setVisibleCount(6);
  }, [params, externalProducts]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((p) => p + 4);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  return (
    <section id="products" className="py-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          🛍️ Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleCount).map((prod) => (
            <div
              key={prod.id}
              className="rounded-xl bg-white shadow border overflow-hidden"
            >
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 text-center">
                <h3 className="font-semibold truncate">{prod.title}</h3>
                <p className="font-bold text-blue-600">${prod.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={observerRef} className="h-10" />
      </div>
    </section>
  );
    }
