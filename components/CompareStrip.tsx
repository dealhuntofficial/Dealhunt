"use client";

import Image from "next/image";

type Props = {
  productName: string;
};

export default function CompareStrip({ productName }: Props) {
  // 🔹 Dummy sellers (backend baad me)
  const sellers = [
    { merchant: "Amazon", price: 3999, rating: 4.5 },
    { merchant: "Flipkart", price: 3899, rating: 4.3 },
    { merchant: "Myntra", price: 4099, rating: 4.6 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <h4 className="text-sm font-semibold mb-2">
          Comparing: <span className="text-red-600">{productName}</span>
        </h4>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {sellers.map((s, i) => (
            <div
              key={i}
              className="min-w-[180px] border rounded-lg p-3 flex-shrink-0"
            >
              <p className="font-medium text-sm">{s.merchant}</p>
              <p className="text-lg font-bold text-red-600">₹{s.price}</p>
              <p className="text-xs text-gray-500">⭐ {s.rating}</p>

              <a
                href="#"
                target="_blank"
                className="block mt-2 text-center bg-blue-600 text-white text-sm py-1.5 rounded"
              >
                Buy
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
