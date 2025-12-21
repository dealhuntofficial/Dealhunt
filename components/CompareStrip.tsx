"use client";

import { useCompare } from "@/context/CompareContext";

export default function CompareStrip() {
  const { items, clearCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          {items.map(item => (
            <div
              key={item.id}
              className="min-w-[160px] bg-gray-100 rounded-lg p-2 text-sm"
            >
              <p className="font-medium line-clamp-2">{item.name}</p>
              <p className="text-red-600 font-semibold">₹{item.price}</p>
              <p className="text-xs text-gray-500">{item.merchant}</p>
            </div>
          ))}

          <button
            onClick={clearCompare}
            className="ml-auto text-sm px-4 py-2 border rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
