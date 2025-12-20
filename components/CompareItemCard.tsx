"use client";

type Props = {
  item: {
    merchant: string;
    price: number;
    rating: number;
    dealUrl: string;
  };
};

export default function CompareItemCard({ item }: Props) {
  return (
    <div className="min-w-[180px] border rounded-lg p-3 flex-shrink-0">
      <p className="text-sm font-medium">{item.merchant}</p>

      <p className="text-lg font-bold text-red-600 mt-1">
        ₹{item.price}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        ⭐ {item.rating}
      </p>

      <a
        href={item.dealUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 text-center bg-blue-600 text-white text-sm py-2 rounded-md"
      >
        Buy
      </a>
    </div>
  );
}
