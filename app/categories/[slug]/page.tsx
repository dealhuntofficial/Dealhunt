import { categories } from "@/data/categories";
import { subCategories } from "@/data/subcategories";
import DealCard from "@/components/DealCard";
import FilterSidebar from "@/components/FilterSidebar";

type Props = { params: { slug: string }; searchParams?: any };

export default async function CategoryDealsPage({ params, searchParams }: Props) {
  const slug = params.slug;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return <div className="p-8 text-center">Category not found</div>;

  const qs = new URLSearchParams();
  if (searchParams?.minPrice) qs.set("minPrice", String(searchParams.minPrice));
  if (searchParams?.maxPrice) qs.set("maxPrice", String(searchParams.maxPrice));
  if (searchParams?.merchant) qs.set("merchant", String(searchParams.merchant));
  if (searchParams?.sort) qs.set("sort", String(searchParams.sort));

  let deals: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/deals?category=${encodeURIComponent(slug)}&${qs.toString()}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      deals = json.deals || [];
    } else {
      console.error("Deals fetch failed", res.status);
      deals = [];
    }
  } catch (err) {
    console.error("Server fetch error for category deals:", err);
    deals = [];
  }

  const subs = subCategories[slug] || subCategories.default || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <FilterSidebar initial={searchParams} />
        <div className="mt-6 bg-white rounded p-4 shadow">
          <h4 className="font-semibold mb-2">Subcategories</h4>
          <div className="flex flex-wrap gap-2">
            {subs.map((s) => (
              <a key={s.slug} href={`/categories/${slug}/${s.slug}`} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
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
            <div className="col-span-full text-center text-gray-500 py-12">No deals found.</div>
          ) : (
            deals.map((d: any) => <DealCard key={d.id} deal={d} />)
          )}
        </div>
      </section>
    </div>
  );
}
