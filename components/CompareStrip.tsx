"use client";

import { useSearchParams, useRouter } from "next/navigation";
import CompareItemCard from "./CompareItemCard";

const MOCK_COMPARE_DATA = [
  {
    id: "1",
    merchant: "Amazon",
    price: 3999,
    rating: 4.5,
    dealUrl: "https://amazon.in",
  },
  {
    id: "2",
    merchant: "Flipkart",
    price: 3899,
    rating: 4.3,
    dealUrl: "https://flipkart.com",
  },
  {
    id: "3",
    merchant: "Myntra",
    price: 4199,
    rating: 4.6,
    dealUrl: "https://myntra.com",
  },
];

export default function CompareStrip() {
  const params = useSearchParams();
  const router = useRouter();

  const compare = params.get("compare");
  if (!compare) return null;

  const closeCompare = () => {
    const p = new URLSearchParams(params.toString());
    p.delete("compare");
    router.push(`?${p.toString()}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm">
            Comparing: <span className="text-blue-600">{compare}</span>
          </h4>
          <button
            onClick={closeCompare}
            className="text-sm text-gray-500 hover:text-black"
          >
            ✕ Close
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {MOCK_COMPARE_DATA.map(item => (
            <CompareItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
