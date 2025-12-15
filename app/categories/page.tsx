// app/categories/page.tsx
"use client";

import { categories } from "@/data/categories";
import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center bg-white p-4 rounded-xl shadow"
          >
            <img src={cat.image} className="w-20 h-20 rounded-full" />
            <p className="mt-3 font-semibold">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
