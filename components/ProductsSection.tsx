"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface ProductType {
  id: number | string;
  title: string;
  price: number;
  image: string;
  merchant?: string;
  buyUrl?: string;
}

export default function ProductsSection({
  externalProducts = [],
}: {
  externalProducts?: ProductType[];
}) {
  const params = useSearchParams();
  const router = useRouter();

  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let list = [...externalProducts];

    const minPrice = Number(params.get("minPrice")) || 0;
    const maxPrice = Number(params.get("maxPrice")) || Infinity;
    const merchant = params.get("merchant")?.toLowerCase() || "";
    const sort = params.get("sort");

    list = list.filter(p => {
      const price = Number(p.price);
      return price >= minPrice && price <= maxPrice;
    });

    if (merchant) {
      list = list.filter(p =>
        (p.merchant || "").toLowerCase().includes(merchant)
      );
    }

    if (sort === "price_low") list.sort((a, b) => a.price - b.price);
    if (sort === "price_high") list.sort((a, b) => b.price - a.price);

    setFilteredProducts(list);
    setVisibleCount(6);
  }, [params, externalProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleCount(v => v + 4);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.slice(0, visibleCount).map(prod => (
          <div key={prod.id} className="bg-white rounded-xl shadow p-3">
            <img
              src={prod.image}
              alt={prod.title}
              className="h-40 w-full object-cover"
            />

            <h3 className="mt-2 font-semibold truncate">{prod.title}</h3>
            <p className="font-bold text-blue-600">₹{prod.price}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="flex-1 text-sm border rounded py-1"
                onClick={() =>
                  router.push(`?compare=${encodeURIComponent(prod.title)}`)
                }
              >
                Compare
              </button>

              <a
                href={prod.buyUrl || "#"}
                target="_blank"
                className="flex-1 text-sm bg-blue-600 text-white rounded py-1 text-center"
              >
                Buy
              </a>
            </div>
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
    </section>
  );
}
