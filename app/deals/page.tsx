"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// FIXED IMPORT 👇
import { mockDeals } from "@/data/mockDeals";

export default function DealsPage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    // FIXED DATA SOURCE 👇
    setList(mockDeals);
  }, []);

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">All Deals</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {list.map((deal, i) => (
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
    </section>
  );
}
