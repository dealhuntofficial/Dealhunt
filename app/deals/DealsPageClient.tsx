"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mockDeals } from "@/data/mockDeals";

const CHUNK = 16;

export default function DealsPageClient() {
  const [visible, setVisible] = useState(CHUNK);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(v => Math.min(v + CHUNK, mockDeals.length));
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">All Deals</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {mockDeals.slice(0, visible).map((deal, i) => (
          <Link
            key={i}
            href={deal.dealUrl || "#"}
            className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition"
          >
            <img
              src={deal.image}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-3 font-semibold">{deal.title}</h3>
            <p className="text-sm text-gray-600">{deal.merchant}</p>
          </Link>
        ))}
      </div>

      <div ref={loaderRef} className="h-10" />
    </section>
  );
}
