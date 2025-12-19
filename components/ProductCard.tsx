"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const handleCompare = () => {
    const p = new URLSearchParams(params.toString());
    p.set("compare", product.name); // ya product.id
    router.push(`?${p.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-3 flex flex-col">
      {/* Image */}
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
        <a
          href={product.dealUrl}
          target="_blank"
          className="flex-1 bg-red-600 text-white rounded-xl py-2 text-sm text-center"
        >
          Buy
        </a>

        {/* COMPARE */}
        <button
          onClick={handleCompare}
          className="flex-1 border rounded-xl py-2 text-sm"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
