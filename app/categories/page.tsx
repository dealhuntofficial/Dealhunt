"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import Link from "next/link";

export default function CategoriesPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-6">All Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div key={cat.slug} className="relative group">
            <Link
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center bg-white p-4 rounded-xl shadow"
            >
              <img src={cat.image} className="w-20 h-20 rounded-full object-cover" />
              <p className="mt-3 font-semibold">{cat.name}</p>
            </Link>

            <button
              onClick={() => setOpen(open === cat.slug ? null : cat.slug)}
              className="w-full mt-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              {open === cat.slug ? "Hide" : "See All"}
            </button>

            {open === cat.slug && (
              <div className="mt-2 bg-gray-100 rounded-lg p-3 shadow-inner">
                { (subCategories[cat.slug] || subCategories.default).map(sub => (
                  <Link
                    key={sub.slug}
                    href={`/categories/${cat.slug}/${sub.slug}`}
                    className="block py-1 text-sm hover:underline"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
