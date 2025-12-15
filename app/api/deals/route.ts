// app/api/deals/route.ts
import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

const REAL_BRANDS = [
  "Amazon",
  "Flipkart",
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "Boat",
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const sort = searchParams.get("sort");
    const rating = searchParams.get("rating");
    const merchant = searchParams.get("merchant");

    let deals = [...mockDeals];

    if (category) deals = deals.filter(d => d.category === category);

    if (subcategory) {
      if (subcategory === "real-brand") {
        deals = deals.filter(d => REAL_BRANDS.includes(d.merchant));
      } else {
        deals = deals.filter(d => d.subcategory === subcategory);
      }
    }

    if (merchant) deals = deals.filter(d => d.merchant === merchant);

    if (rating) deals = deals.filter(d => (d.rating || 0) >= Number(rating));

    if (sort === "price_low")
      deals.sort((a, b) => a.priceNow - b.priceNow);

    if (sort === "price_high")
      deals.sort((a, b) => b.priceNow - a.priceNow);

    if (sort === "discount")
      deals.sort((a, b) => b.discount - a.discount);

    const brands = Array.from(new Set(deals.map(d => d.merchant)));

    return NextResponse.json({ deals, brands });
  } catch {
    return NextResponse.json({ deals: [], brands: [] });
  }
}
