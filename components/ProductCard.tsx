"use client";

import Image from "next/image";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative bg-white rounded-xl shadow p-3">

      {/* IMAGE */}
      <div className="relative h-36 w-full">
        <Image
          src={product.image}
          alt={product.title}   // ✅ title now exists
          fill
          className="object-contain"
        />
      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-sm font-semibold text-black">
        {product.title}
      </h3>

      {/* PRICE */}
      <div className="mt-1">
        <span className="font-bold text-black">₹{product.price}</span>
      </div>

      {/* BUY BUTTON */}
      <a
        href={product.url || "#"}
        target="_blank"
        className="mt-2 block text-center bg-blue-600 text-white py-2 rounded"
      >
        Buy Deal
      </a>

      {/* 🔥 COMPARE BUTTON (FORCE VISIBLE) */}
      <button
        type="button"
        className="mt-2 w-full border border-black text-black font-semibold py-2 rounded"
      >
        Compare
      </button>

      {/* MERCHANT */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {product.merchant}
      </div>
    </div>
  );
}
