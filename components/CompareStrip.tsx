"use client";

import Image from "next/image";

type Seller = {
  id: string;
  name: string;
  price: number;
  rating?: number;
  logo?: string;
  url: string;
};

export default function CompareStrip({
  sellers,
  onClear,
}: {
  sellers: Seller[];
  onClear: () => void;
}) {
  if (!sellers.length) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="px-4 py-3 flex items-center gap-4 overflow-x-auto">
        {sellers.map(seller => (
          <a
            key={seller.id}
            href={seller.url}
            target="_blank"
            className="min-w-[220px] border rounded-lg p-3 flex gap-3 items-center"
          >
            <div className="relative w-10 h-10">
              <Image
                src={seller.logo || "/images/placeholder.png"}
                alt={seller.name}
                fill
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-semibold">{seller.name}</p>
              <p className="text-sm text-blue-600 font-bold">₹{seller.price}</p>
              {seller.rating && (
                <p className="text-xs text-gray-500">
                  ⭐ {seller.rating}
                </p>
              )}
            </div>
          </a>
        ))}

        <button
          onClick={onClear}
          className="ml-2 px-3 py-2 border rounded-md shrink-0"
        >
          Close
        </button>
      </div>
    </div>
  );
}
