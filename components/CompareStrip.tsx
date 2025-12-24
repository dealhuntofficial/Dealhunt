"use client";

import Image from "next/image";

export default function CompareStrip({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 relative">
            <Image
              src={item.image || "/images/placeholder.png"}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-gray-500">
              Compare prices from sellers
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm border rounded-md"
          >
            Close
          </button>

          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
