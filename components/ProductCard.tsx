"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useCompare } from "@/context/CompareContext";

type Props = {
  product: Product & {
    dealUrl?: string;
    merchant?: string;
  };
};

export default function ProductCard({ product }: Props) {
  const { addItem } = useCompare();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-3 flex flex-col">
      <div className="relative w-full h-40 sm:h-48 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain rounded-xl"
        />
      </div>

      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-lg font-bold text-red-600 mt-1">
        ₹{product.price}
      </p>

      <div className="mt-auto flex gap-2 pt-3">
        {/* BUY */}
        {product.dealUrl && (
          <a
            href={product.dealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-red-600 text-white rounded-xl py-2 text-sm text-center"
          >
            Buy
          </a>
        )}

        {/* COMPARE */}
        <button
          onClick={() =>
            addItem({
              id: product.id,
              title: product.name,
              price: product.price,
              image: product.image,
              merchant: product.merchant || "Multiple",
              dealUrl: product.dealUrl || "#",
            })
          }
          className="flex-1 border rounded-xl py-2 text-sm hover:bg-gray-50"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
