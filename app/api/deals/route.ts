import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const merchant = searchParams.get("merchant");
    const rating = searchParams.get("rating");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    let deals = [...mockDeals];

    // CATEGORY
    if (category) {
      deals = deals.filter(d => d.category === category);
    }

    // SUBCATEGORY
    if (subcategory && subcategory !== "real-brand") {
      deals = deals.filter(d => d.subcategory === subcategory);
    }

    // REAL BRAND
    const realBrands = [
      "Amazon",
      "Flipkart",
      "Apple",
      "Samsung",
      "Nike",
      "Adidas",
      "Puma",
      "Sony",
      "Boat",
      "HP",
      "Dell",
      "Lenovo"
    ];

    if (subcategory === "real-brand") {
      deals = deals.filter(d => realBrands.includes(d.merchant));
    }

    // MERCHANT
    if (merchant) {
      deals = deals.filter(d => d.merchant === merchant);
    }

    // RATING (mock safe)
    if (rating) {
      deals = deals.filter(d => (d as any).rating >= Number(rating));
    }

    // PRICE FILTER
    if (minPrice) {
      deals = deals.filter(d => d.priceNow >= Number(minPrice));
    }

    if (maxPrice) {
      deals = deals.filter(d => d.priceNow <= Number(maxPrice));
    }

    // SORTING
    if (sort === "price_low") {
      deals.sort((a, b) => a.priceNow - b.priceNow);
    }

    if (sort === "price_high") {
      deals.sort((a, b) => b.priceNow - a.priceNow);
    }

    if (sort === "discount") {
      deals.sort((a, b) => b.discount - a.discount);
    }

    // UNIQUE BRANDS
    const brands = Array.from(new Set(deals.map(d => d.merchant)));

    return NextResponse.json({ deals, brands });
  } catch (err) {
    console.error("API DEALS ERROR:", err);
    return NextResponse.json({ deals: [], brands: [] });
  }
  }
