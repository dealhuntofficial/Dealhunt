import { NextResponse } from "next/server";

type Deal = {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  image: string;
  priceNow: number;
  priceOld: number;
  discount: number;
  dealUrl: string;
  merchant: string;
  brand: string;          // ✅ FIX ADDED
  rating: number;
};

const deals: Deal[] = [
  {
    id: "1",
    category: "electronics",
    subcategory: "smartphones",
    title: "Apple iPhone 15",
    image: "/iphone.jpg",
    priceNow: 69999,
    priceOld: 79999,
    discount: 12,
    dealUrl: "https://amazon.in",
    merchant: "amazon",
    brand: "Apple",       // ✅ FIX ADDED
    rating: 4.6,
  },
  {
    id: "2",
    category: "electronics",
    subcategory: "laptops",
    title: "HP Pavilion Laptop",
    image: "/hp.jpg",
    priceNow: 58999,
    priceOld: 65999,
    discount: 10,
    dealUrl: "https://flipkart.com",
    merchant: "flipkart",
    brand: "HP",          // ✅ FIX ADDED
    rating: 4.3,
  },
  {
    id: "3",
    category: "fashion",
    subcategory: "shoes",
    title: "Nike Running Shoes",
    image: "/nike.jpg",
    priceNow: 3999,
    priceOld: 4999,
    discount: 20,
    dealUrl: "https://myntra.com",
    merchant: "myntra",
    brand: "Nike",        // ✅ FIX ADDED
    rating: 4.5,
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const merchant = searchParams.get("merchant");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  let filteredDeals = [...deals];

  if (category)
    filteredDeals = filteredDeals.filter(d => d.category === category);

  if (subcategory)
    filteredDeals = filteredDeals.filter(d => d.subcategory === subcategory);

  if (merchant)
    filteredDeals = filteredDeals.filter(d => d.merchant === merchant);

  if (brand)
    filteredDeals = filteredDeals.filter(d => d.brand === brand); // ✅ NOW VALID

  if (minPrice)
    filteredDeals = filteredDeals.filter(d => d.priceNow >= Number(minPrice));

  if (maxPrice)
    filteredDeals = filteredDeals.filter(d => d.priceNow <= Number(maxPrice));

  if (sort === "low-high")
    filteredDeals.sort((a, b) => a.priceNow - b.priceNow);

  if (sort === "high-low")
    filteredDeals.sort((a, b) => b.priceNow - a.priceNow);

  if (sort === "newest")
    filteredDeals = filteredDeals.reverse();

  return NextResponse.json(filteredDeals);
}
