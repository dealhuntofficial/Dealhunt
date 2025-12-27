"use client";

import Image from "next/image";
import Link from "next/link";

export type CompareDeal = {
  id: string;
  title: string;
  image?: string;
  price?: number;
  rating?: number;
  merchantUrl?: string;
};

export default function CompareStrip({
  items,
  onClear,
}: {
  items: CompareDeal[];
  onClear: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">
            Compare prices from other sellers
          </p>
          <button
            onClick={onClear}
            className="text-sm text-gray-500"
          >
            Clear
          </button>
        </div>

        {/* ✅ horizontal scroll (mobile + desktop) */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map(item => (
            <Link
              key={item.id}
              href={item.merchantUrl || "#"}
              target="_blank"
              className="min-w-[220px] border rounded-lg p-3 flex-shrink-0 hover:shadow-md transition"
            >
              <div className="relative w-full h-28 mb-2">
                <Image
                  src={item.image || "/images/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-sm font-medium line-clamp-2">
                {item.title}
              </p>

              <div className="flex items-center justify-between mt-1">
                <span className="text-blue-600 font-semibold">
                  ₹{item.price}
                </span>
                {item.rating && (
                  <span className="text-xs text-gray-500">
                    ⭐ {item.rating}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
