"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function CompareStrip() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const compare = searchParams.get("compare");

  if (!compare) return null;

  const clearCompare = () => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("compare");
    router.push(`?${p.toString()}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* PRODUCT INFO */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="w-14 h-14 relative flex-shrink-0">
              <Image
                src="/images/placeholder.png"
                alt={compare}
                fill
                className="object-contain rounded"
              />
            </div>

            <div>
              <p className="text-sm font-semibold line-clamp-1">
                {compare}
              </p>
              <p className="text-xs text-gray-500">
                Compare prices from multiple sellers
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Close
            </button>

            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
