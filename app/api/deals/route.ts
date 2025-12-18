import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const sort = searchParams.get("sort");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const rating = searchParams.get("rating");
  const merchant = searchParams.get("merchant");
  const brand = searchParams.get("brand");

  let deals = [...mockDeals];

  if (category) deals = deals.filter(d => d.category === category);
  if (subcategory) deals = deals.filter(d => d.subcategory === subcategory);
  if (merchant) deals = deals.filter(d => d.merchant === merchant);
  if (brand) deals = deals.filter(d => d.brand === brand);

  if (minPrice) deals = deals.filter(d => d.priceNow >= Number(minPrice));
  if (maxPrice) deals = deals.filter(d => d.priceNow <= Number(maxPrice));
  if (rating) deals = deals.filter(d => (d.rating ?? 0) >= Number(rating));

  if (sort === "price_low") deals.sort((a, b) => a.priceNow - b.priceNow);
  if (sort === "price_high") deals.sort((a, b) => b.priceNow - a.priceNow);
  if (sort === "newest") deals.sort((a, b) => +b.createdAt - +a.createdAt);

  const merchants = Array.from(new Set(deals.map(d => d.merchant)));
  const brands = Array.from(
    new Set(
      deals
        .filter(d => !merchant || d.merchant === merchant)
        .map(d => d.brand)
        .filter(Boolean)
    )
  );

  return NextResponse.json({ deals, merchants, brands });
}
