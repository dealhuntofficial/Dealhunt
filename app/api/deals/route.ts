import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Read all filters
    const category = url.searchParams.get("category") || undefined;
    const subcategory = url.searchParams.get("subcategory") || undefined;
    const q = url.searchParams.get("q") || "";
    const merchant = url.searchParams.get("merchant") || "";
    const sort = url.searchParams.get("sort") || "";

    const minPrice = Number(url.searchParams.get("minPrice") || 0);
    const maxPrice = Number(url.searchParams.get("maxPrice") || 0);

    const minDiscount = Number(url.searchParams.get("minDiscount") || 0);
    const maxDiscount = Number(url.searchParams.get("maxDiscount") || 0);

    const rating = Number(url.searchParams.get("rating") || 0);

    let items = mockDeals.slice();

    // FILTER: Category
    if (category) items = items.filter((d) => d.category === category);

    // FILTER: Subcategory
    if (subcategory) items = items.filter((d) => d.subcategory === subcategory);

    // FILTER: Search (title + description optional)
    if (q) {
      const qLower = q.toLowerCase();
      items = items.filter((d) =>
        d.title.toLowerCase().includes(qLower) ||
        d.description?.toLowerCase().includes(qLower)
      );
    }

    // FILTER: Merchant
    if (merchant) {
      const m = merchant.toLowerCase();
      items = items.filter((d) =>
        d.merchant?.toLowerCase().includes(m)
      );
    }

    // FILTER: Price
    if (minPrice > 0) items = items.filter((d) => d.priceNow >= minPrice);
    if (maxPrice > 0) items = items.filter((d) => d.priceNow <= maxPrice);

    // FILTER: Discount
    if (minDiscount > 0) items = items.filter((d) => (d.discount || 0) >= minDiscount);
    if (maxDiscount > 0) items = items.filter((d) => (d.discount || 0) <= maxDiscount);

    // FILTER: Rating
    if (rating > 0) items = items.filter((d) => (d.rating || 0) >= rating);

    // SORTING OPTIONS
    if (sort === "price-asc") {
      items.sort((a, b) => a.priceNow - b.priceNow);
    } else if (sort === "price-desc") {
      items.sort((a, b) => b.priceNow - a.priceNow);
    } else if (sort === "discount-desc") {
      items.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sort === "latest") {
      items.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sort === "popularity") {
      items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return NextResponse.json({ deals: items });
  } catch (err) {
    return NextResponse.json(
      { deals: [], error: (err as any).message || "Server Error" },
      { status: 500 }
    );
  }
}
