// components/DealCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

export default function DealCard({ deal }: any) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-44">
        <Image src={deal.image || "/images/placeholder.png"} alt={deal.title} fill className="object-cover" />
        {deal.discount && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 text-xs rounded-md font-semibold">
            {deal.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2">{deal.title}</h3>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-lg font-bold">₹{deal.priceNow}</span>
          {deal.priceOld && <span className="line-through text-sm text-gray-400">₹{deal.priceOld}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Link href={deal.dealUrl || "#"} className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm" target="_blank" rel="noopener noreferrer">
            Buy Deal
          </Link>
          <span className="text-xs text-gray-500">{deal.merchant}</span>
        </div>
      </div>
    </article>
  );
}
