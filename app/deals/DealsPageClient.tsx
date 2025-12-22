"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { mockDeals } from "@/data/mockDeals";

const CHUNK = 16;

export default function DealsPage() {
  const [visible, setVisible] = useState(CHUNK);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6">All Deals</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {mockDeals.slice(0, visible).map((deal, i) => (
          <a
            key={i}
            href={deal.dealUrl || "#"}
            className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={deal.image}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-3 font-semibold">{deal.title}</h3>
            <p className="text-sm text-gray-600">{deal.merchant}</p>
          </a>
        ))}
      </div>

      <div ref={loaderRef} className="h-10" />
    </section>
  );
}
