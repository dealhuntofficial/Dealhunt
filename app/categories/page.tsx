"use client";

import { categories } from "@/data/categories";
import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-3xl font-bold mb-10 text-center">
        All Categories
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              className="w-20 h-20 rounded-full object-cover"
            />
            <p className="mt-3 font-semibold">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
