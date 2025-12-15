import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const merchant = searchParams.get("merchant");
    const realBrand = searchParams.get("realBrand");

    let deals = [...mockDeals];

    if (category) deals = deals.filter(d => d.category === category);
    if (subcategory) deals = deals.filter(d => d.subcategory === subcategory);
    if (merchant) deals = deals.filter(d => d.merchant === merchant);

    // ⭐ REAL BRAND (trusted merchants only)
    const realBrands = [
      "Amazon",
      "Flipkart",
      "Meesho",
      "Ajio",
      "Myntra"
    ];

    if (realBrand === "1") {
      deals = deals.filter(d => realBrands.includes(d.merchant));
    }

    // ⭐ PRICE FILTER
    if (minPrice)
      deals = deals.filter(d => d.priceNow >= Number(minPrice));

    if (maxPrice)
      deals = deals.filter(d => d.priceNow <= Number(maxPrice));

    // ⭐ RATING (mock safe)
    if (rating)
      deals = deals.filter(d => (d.rating ?? 0) >= Number(rating));

    // ⭐ SORT
    if (sort === "price_low")
      deals.sort((a, b) => a.priceNow - b.priceNow);

    if (sort === "price_high")
      deals.sort((a, b) => b.priceNow - a.priceNow);

    if (sort === "discount")
      deals.sort((a, b) => b.discount - a.discount);

    // ⭐ DYNAMIC MERCHANTS
    const merchants = Array.from(new Set(deals.map(d => d.merchant)));

    return NextResponse.json({
      deals,
      merchants
    });
  } catch (e) {
    console.error("API DEAL ERROR", e);
    return NextResponse.json({ deals: [], merchants: [] });
  }
  }
