// app/categories/[slug]/[sub]/page.tsx
"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

type Props = { params: { slug: string; sub: string } };

export default function SubcategoryDealsPage({ params }: Props) {
  const { slug, sub } = params;

  const category = categories.find(c => c.slug === slug);
  const subCat =
    (subCategories[slug] || subCategories.default).find(s => s.slug === sub);

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        `https://${process.env.RENDER_EXTERNAL_URL}`;

      const url = new URL("/api/deals", base);
      url.searchParams.set("category", slug);
      url.searchParams.set("subcategory", sub);

      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();

      setDeals(data.deals || []);
      setLoading(false);
    };

    fetchDeals();
  }, [slug, sub]);

  if (!category || !subCat) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(d => (
            <DealCard key={d.id} deal={d} />
          ))}
        </div>
      )}
    </div>
  );
          }
