"use client";

import Image from "next/image";

type CompareDeal = {
  id: string;
  title: string;
  priceNow: number;
  priceOld?: number;
  rating?: number;
  image?: string;
  merchant?: string;
  dealUrl?: string;
};

export default function CompareStrip({
  items,
  onClear,
}: {
  items: CompareDeal[];
  onClear: () => void;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-black">
            Compare prices from other sellers
          </h3>

          <button
            onClick={onClear}
            className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* HORIZONTAL SCROLL */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map(item => (
            <a
              key={item.id}
              href={item.dealUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[220px] max-w-[220px] border rounded-lg p-3 flex-shrink-0 hover:shadow-md transition"
            >
              {/* IMAGE */}
              <div className="relative h-24 w-full mb-2">
                <Image
                  src={item.image || "/images/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* TITLE */}
              <p className="text-xs font-semibold line-clamp-2">
                {item.title}
              </p>

              {/* PRICE */}
              <div className="mt-1">
                <span className="font-bold text-black text-sm">
                  ₹{item.priceNow}
                </span>
                {item.priceOld && (
                  <span className="ml-2 text-xs line-through text-gray-400">
                    ₹{item.priceOld}
                  </span>
                )}
              </div>

              {/* RATING */}
              {item.rating && (
                <p className="text-xs text-gray-600 mt-1">
                  ⭐ {item.rating}/5
                </p>
              )}

              {/* MERCHANT */}
              <p className="text-xs text-gray-500 mt-1">
                {item.merchant}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
            }
