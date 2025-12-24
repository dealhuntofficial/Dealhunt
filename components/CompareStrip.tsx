"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

type CompareItem = {
  title: string;
  image?: string;
};

export default function CompareStrip({
  items = [],
}: {
  items: CompareItem[];
}) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  const clearCompare = () => {
    router.replace(window.location.pathname);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* ITEMS */}
          <div className="flex gap-4 overflow-x-auto">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 min-w-[180px]">
                <div className="relative w-12 h-12">
                  <Image
                    src={item.image || "/images/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <p className="text-sm font-semibold line-clamp-1">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-sm border rounded-md"
            >
              Close
            </button>

            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
            >
              Compare
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
