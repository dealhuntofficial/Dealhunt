// File: app/categories/[slug]/page.tsx

"use client";

import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import FilterSidebar from "@/components/FilterSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { params: { slug: string }; searchParams?: any };

export default function CategoryDealsPage({ params, searchParams }: Props) {
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);

  const slug = params.slug;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return <div className="p-8 text-center">Category not found</div>;

  const subs = subCategories[slug] || subCategories.default || [];

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const qs = new URLSearchParams();
        if (searchParams?.minPrice) qs.set("minPrice", searchParams.minPrice);
        if (searchParams?.maxPrice) qs.set("maxPrice", searchParams.maxPrice);
        if (searchParams?.merchant) qs.set("merchant", searchParams.merchant);
        if (searchParams?.sort) qs.set("sort", searchParams.sort);
        if (searchParams?.q) qs.set("q", searchParams.q);

        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.BASE_URL ||
          `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;

        const url = new URL("/api/deals", base);
        url.searchParams.set("category", slug);

        qs.forEach((v, k) => {
          url.searchParams.set(k, v);
        });

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) {
          setDeals([]);
          return;
        }

        const data = await res.json();
        setDeals(data.deals || []);
      } catch (err) {
        console.error("Deals fetch error", err);
        setDeals([]);
      }
    };

    fetchDeals();
  }, [slug, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-white/80 text-gray-800 text-sm font-medium shadow hover:bg-white transition"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        <aside className="lg:col-span-1">
          <FilterSidebar initial={searchParams} />

          <div className="mt-6 bg-white rounded p-4 shadow">
            <h4 className="font-semibold mb-2">Subcategories</h4>

            <div className="flex flex-wrap gap-2">
              {subs.map((s) => (
                <a
                  key={s.slug}
                  href={`/categories/${slug}/${s.slug}`}
                  className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">{category.name} — Best Deals</h1>
            <p className="text-sm text-gray-500">Mixed deals across subcategories</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No deals found.
              </div>
            ) : (
              deals.map((d: any) => <DealCard key={d.id} deal={d} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
