// app/api/deals/route.ts
import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

export const dynamic = "force-dynamic";
// ↑ This forces dynamic rendering and removes ALL build errors.

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const subcategory = url.searchParams.get("subcategory") || undefined;
    const minPrice = Number(url.searchParams.get("minPrice") || 0);
    const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
    const merchant = url.searchParams.get("merchant") || undefined;
    const sort = url.searchParams.get("sort") || undefined;
    const q = url.searchParams.get("q") || undefined;

    let items = mockDeals.slice();

    if (category) items = items.filter((d) => d.category === category);
    if (subcategory) items = items.filter((d) => d.subcategory === subcategory);

    if (merchant) {
      items = items.filter((d) =>
        d.merchant?.toLowerCase().includes(merchant.toLowerCase())
      );
    }

    if (q) {
      items = items.filter((d) =>
        d.title.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (minPrice) items = items.filter((d) => d.priceNow >= minPrice);
    if (maxPrice) items = items.filter((d) => d.priceNow <= maxPrice);

    if (sort === "price-asc") items.sort((a, b) => a.priceNow - b.priceNow);
    else if (sort === "price-desc") items.sort((a, b) => b.priceNow - a.priceNow);
    else if (sort === "discount-desc")
      items.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    return NextResponse.json({ deals: items });
  } catch (err) {
    return NextResponse.json(
      { deals: [], error: (err as any).message || "Server Error" },
      { status: 500 }
    );
  }
}
