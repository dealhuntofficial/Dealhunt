"use client";

import { useCompare } from "@/context/CompareContext";
import Image from "next/image";

export default function CompareStrip() {
  const { compareId, setCompareId } = useCompare();

  if (!compareId) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto">
        {/* Dummy item – backend later */}
        <div className="min-w-[160px] bg-gray-50 rounded-lg p-2 flex-shrink-0">
          <div className="relative h-20">
            <Image
              src="/images/placeholder.png"
              alt="compare"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs mt-2 line-clamp-2">{compareId}</p>
          <p className="text-sm font-semibold">₹ —</p>
        </div>

        <button
          onClick={() => setCompareId(null)}
          className="ml-auto text-sm text-red-600 whitespace-nowrap"
        >
          Close
        </button>
      </div>
    </div>
  );
}
