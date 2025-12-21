"use client";

import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const { setCompareId } = useCompare();

  return (
    <div className="bg-white rounded-2xl shadow p-3 flex flex-col">
      <div className="relative w-full h-40 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain rounded-xl"
        />
      </div>

      <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
      <p className="text-lg font-bold text-red-600 mt-1">₹{product.price}</p>

      <div className="mt-auto flex gap-2 pt-3">
        {product.dealUrl && (
          <a
            href={product.dealUrl}
            target="_blank"
            className="flex-1 bg-red-600 text-white rounded-xl py-2 text-sm text-center"
          >
            Buy
          </a>
        )}

        <button
          onClick={() => setCompareId(product.id)}
          className="flex-1 border rounded-xl py-2 text-sm"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
