"use client";

import Image from "next/image";
import { useCompare } from "@/context/CompareContext";

export default function CompareStrip() {
  const { item, closeCompare } = useCompare();

  if (!item) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-sm">
            Compare prices for: {item.title}
          </h4>
          <button
            onClick={closeCompare}
            className="text-sm text-gray-500 hover:text-black"
          >
            ✕ Close
          </button>
        </div>

        {/* Scrollable merchants */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="min-w-[180px] border rounded-lg p-3 flex-shrink-0"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={120}
                height={80}
                className="mx-auto object-contain"
              />

              <p className="mt-2 text-sm font-medium">Merchant {i}</p>
              <p className="text-green-600 font-bold">
                ₹{item.basePrice + i * 200}
              </p>

              <button className="mt-2 w-full bg-blue-600 text-white rounded py-1 text-sm">
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
