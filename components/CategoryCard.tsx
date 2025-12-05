"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  slug: string;
  image?: string | null;
}

export default function CategoryCard({ title, slug, image }: Props) {
  const fallback = svgForCategory(title, 600);
  const src = image || fallback;

  return (
    <Link
      href={`/products?category=${encodeURIComponent(slug)}`}
      className="group block bg-white rounded-xl shadow hover:shadow-lg p-4 text-center transition"
    >
      <div className="w-28 h-28 mx-auto relative">
        {src.startsWith("data:") ? (
          <img
            src={src}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Image
            src={src}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        )}
      </div>

      <div className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-blue-600">
        {title}
      </div>
    </Link>
  );
            }
