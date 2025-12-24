"use client";

import Image from "next/image";

export default function CompareStrip({
  item,
  onClear,
}: {
  item: any;
  onClear: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <Image
              src={item.image || "/images/placeholder.png"}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-semibold line-clamp-1">
              {item.title}
            </p>
            <p className="text-xs text-gray-500">
              Compare prices across sellers
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-3 py-2 border rounded-md text-sm"
          >
            Remove
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
