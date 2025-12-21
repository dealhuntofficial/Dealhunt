"use client";

import { useCompare } from "@/context/CompareContext";
import Image from "next/image";

type Props = {
  productName: string;
};

export default function CompareStrip({ productName }: Props) {
  const { items, removeItem, clear } = useCompare();

  if (!productName || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm">
            Comparing: <span className="text-blue-600">{productName}</span>
          </h4>
          <button
            onClick={clear}
            className="text-xs text-red-500 hover:underline"
          >
            Clear
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map(item => (
            <div
              key={item.id}
              className="min-w-[160px] border rounded-lg p-2 flex-shrink-0"
            >
              <div className="relative h-20 mb-2">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-xs font-medium line-clamp-2">
                {item.name}
              </p>

              <p className="text-sm font-bold mt-1">₹{item.price}</p>

              <button
                onClick={() => removeItem(item.id)}
                className="mt-1 text-xs text-gray-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
              }
