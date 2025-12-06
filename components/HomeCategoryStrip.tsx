// components/HomeCategoryStrip.tsx
"use client";
import Link from "next/link";
import { categories } from "@/data/categories";

export default function HomeCategoryStrip() {
  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-2">
      {categories.map((c) => (
        <Link key={c.slug} href={`/categories/${c.slug}/deals`} className="flex-shrink-0 w-28 text-center">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white shadow">
            <img src={c.image} className="w-full h-full object-cover" />
          </div>
          <div className="mt-2 text-sm font-medium">{c.name}</div>
        </Link>
      ))}
    </div>
  );
}
