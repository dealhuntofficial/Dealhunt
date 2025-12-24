"use client";

import Image from "next/image";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative bg-white rounded-xl shadow p-4 border">

      {/* IMAGE */}
      <div className="relative w-full h-40 mb-3">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>

      {/* TITLE */}
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
        {product.title}
      </h3>

      {/* PRICE */}
      <div className="mt-2">
        <span className="text-lg font-bold text-black">
          ₹{product.price}
        </span>
        {product.oldPrice && (
          <span className="ml-2 text-sm line-through text-gray-400">
            ₹{product.oldPrice}
          </span>
        )}
      </div>

      {/* BUY BUTTON */}
      <a
        href={product.url}
        target="_blank"
        className="mt-3 block text-center bg-blue-600 text-white py-2 rounded-lg"
      >
        Buy Deal
      </a>

      {/* 🔥 COMPARE BUTTON (FORCED VISIBLE) */}
      <button
        type="button"
        className="
          mt-3
          w-full
          block
          bg-yellow-400
          text-black
          font-bold
          py-2
          rounded-lg
          border-2
          border-black
          z-50
          opacity-100
          visible
        "
        onClick={() => alert(`Compare clicked: ${product.title}`)}
      >
        Compare
      </button>

    </div>
  );
}
