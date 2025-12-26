"use client";

import Image from "next/image";

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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">
            Compare prices from other sellers
          </p>
          <button
            onClick={onClear}
            className="text-sm px-3 py-1 border rounded-md"
          >
            Close
          </button>
        </div>

        {/* 🔥 horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map(item => (
            <a
              key={item.id}
              href={item.merchantUrl}
              target="_blank"
              className="min-w-[220px] border rounded-lg p-3 flex-shrink-0 hover:shadow"
            >
              <div className="relative w-full h-32 mb-2">
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

              {item.price && (
                <p className="text-sm font-semibold mt-1">
                  ₹{item.price}
                </p>
              )}

              {item.rating && (
                <p className="text-xs text-gray-500">
                  ⭐ {item.rating}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
