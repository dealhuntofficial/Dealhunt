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
    <div className="fixed bottom-20 left-0 right-0 z-50">
      {/* STRIP CONTAINER */}
      <div className="max-w-7xl mx-auto bg-white border shadow-xl rounded-xl mx-3 px-4 py-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">
            Compare Deals
          </h3>

          <button
            onClick={onClear}
            className="text-xs px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Clear
          </button>
        </div>

        {/* ITEMS (HORIZONTAL SCROLL) */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          
          {/* SINGLE ITEM (future-ready for multiple) */}
          <div className="min-w-[140px] max-w-[160px] flex-shrink-0 border rounded-lg p-2">
            <div className="relative h-20 w-full">
              <Image
                src={item.image || "/images/placeholder.png"}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>

            <p className="mt-2 text-xs font-semibold line-clamp-2">
              {item.title}
            </p>

            {item.priceNow && (
              <p className="mt-1 text-sm font-bold text-blue-600">
                ₹{item.priceNow}
              </p>
            )}
          </div>

        </div>

        {/* ACTION BUTTON */}
        <div className="mt-4 flex justify-end">
          <button className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}
