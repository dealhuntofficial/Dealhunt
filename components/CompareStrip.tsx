"use client";

import Image from "next/image";

export type CompareItem = {
  id: string;
  title: string;
  image?: string;
};

export default function CompareStrip({
  items,
  onRemove,
}: {
  items: CompareItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 border rounded px-2 py-1"
            >
              <div className="relative w-10 h-10">
                <Image
                  src={item.image || "/images/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              <span className="text-sm max-w-[120px] truncate">
                {item.title}
              </span>

              <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
