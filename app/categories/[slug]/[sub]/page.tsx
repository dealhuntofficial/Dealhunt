// File: app/categories/[slug]/[sub]/page.tsx
import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import FilterSidebar from "@/components/FilterSidebar";

type Props = { params: { slug: string; sub: string }; searchParams?: any };

export default async function SubcategoryDealsPage({ params, searchParams }: Props) {
  const { slug, sub } = params;
  const category = categories.find((c) => c.slug === slug);
  const subCat = (subCategories[slug] || []).find((s) => s.slug === sub) || null;
  if (!category || !subCat) return <div className="p-8 text-center">Not found</div>;

  const qs = new URLSearchParams();
  if (searchParams?.minPrice) qs.set("minPrice", String(searchParams.minPrice));
  if (searchParams?.maxPrice) qs.set("maxPrice", String(searchParams.maxPrice));
  if (searchParams?.merchant) qs.set("merchant", String(searchParams.merchant));
  if (searchParams?.sort) qs.set("sort", String(searchParams.sort));
  if (searchParams?.q) qs.set("q", String(searchParams.q));

  let deals: any[] = [];
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || `https://${process.env.RENDER_EXTERNAL_URL || "dealhunt-1.onrender.com"}`;
    const url = new URL("/api/deals", base);
    url.searchParams.set("category", slug);
    url.searchParams.set("subcategory", sub);

    // append QS only if it has params (avoid trailing & issues)
    qs.toString().split("&").forEach((p) => {
      if (p) {
        const [k, v] = p.split("=");
        if (k && v !== undefined) url.searchParams.set(k, decodeURIComponent(v));
      }
    });

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      deals = json.deals || [];
    } else {
      console.error("Deals fetch failed", res.status);
      deals = [];
    }
  } catch (err) {
    console.error("Server fetch error for subcategory deals:", err);
    deals = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <FilterSidebar initial={searchParams} />
      </aside>

      <section className="lg:col-span-3">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{category.name} — {subCat.name}</h1>
          <p className="text-sm text-gray-500">Deals filtered to this subcategory only</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No deals found.</div>
          ) : (
            deals.map((d: any) => <DealCard key={d.id} deal={d} />)
          )}
        </div>
      </section>
    </div>
  );
}
