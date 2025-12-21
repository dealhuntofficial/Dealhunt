"use client";

import Image from "next/image";
import { useCompare } from "@/context/CompareContext";

export default function DealCard({ deal }: any) {
  const { setCompareId } = useCompare();

  return (
    <article className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div className="relative h-44">
        <Image src={deal.image} alt={deal.title} fill className="object-cover" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold line-clamp-2">{deal.title}</h3>
        <p className="text-lg font-bold mt-2">₹{deal.priceNow}</p>

        <div className="mt-auto flex gap-2 pt-3">
          <a
            href={deal.dealUrl}
            target="_blank"
            className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm text-center"
          >
            Buy
          </a>

          <button
            onClick={() => setCompareId(deal.id)}
            className="flex-1 border rounded-md py-2 text-sm"
          >
            Compare
          </button>
        </div>
      </div>
    </article>
  );
}
