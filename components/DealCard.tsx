"use client";
import Image from "next/image";
import Link from "next/link";

export default function DealCard({
  deal,
  onCompare,
}: {
  deal: any;
  onCompare?: () => void;
}) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-44">
        <Image
          src={deal.image || "/images/placeholder.png"}
          alt={deal.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2">
          {deal.title}
        </h3>

        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-lg font-bold">₹{deal.priceNow}</span>
          {deal.priceOld && (
            <span className="line-through text-sm text-gray-400">
              ₹{deal.priceOld}
            </span>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={deal.dealUrl || "#"}
            target="_blank"
            className="bg-blue-600 text-white text-sm py-2 rounded text-center"
          >
            Buy Deal
          </Link>

          {/* ✅ WORKING COMPARE */}
          <button
            type="button"
            onClick={onCompare}
            className="border-2 border-black bg-white text-black font-semibold text-sm py-2 rounded"
          >
            Compare
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-right">
          {deal.merchant}
        </div>
      </div>
    </article>
  );
}
