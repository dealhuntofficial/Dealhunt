"use client";

import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories"; // ✅ Correct Import

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold shadow"
        >
          ⬅ Back
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shop by Categories
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <CategoryCard
            key={cat.slug}
            title={cat.name}
            slug={cat.slug}
            image={cat.image} // ✅ Now image exists
          />
        ))}
      </div>
    </div>
  );
}
