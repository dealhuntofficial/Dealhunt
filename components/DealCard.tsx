"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Deal = {
  id: string;
  title: string;
  image: string;
  priceNow: number;
  priceOld?: number;
  discount?: number;
  dealUrl: string;
  merchant: string;
};

export default function DealCard({ deal }: { deal: Deal }) {
  const router = useRouter();
  const params = useSearchParams();

  const handleCompare = () => {
    const p = new URLSearchParams(params.toString());
    p.set("compare", deal.title); // ya deal.id
    router.push(`?${p.toString()}`);
  };

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-44">
        <Image
          src={deal.image || "/images/placeholder.png"}
          alt={deal.title}
          fill
          className="object-cover"
        />
        {deal.discount && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 text-xs rounded-md font-semibold">
            {deal.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-sm line-clamp-2">{deal.title}</h3>

        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-lg font-bold">₹{deal.priceNow}</span>
          {deal.priceOld && (
            <span className="line-through text-sm text-gray-400">
              ₹{deal.priceOld}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {/* BUY */}
          <a
            href={deal.dealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Buy
          </a>

          {/* COMPARE */}
          <button
            onClick={handleCompare}
            className="flex-1 bg-gray-100 border rounded-md text-sm hover:bg-gray-200"
          >
            Compare
          </button>
        </div>

        <span className="mt-2 text-xs text-gray-500">{deal.merchant}</span>
      </div>
    </article>
  );
}
