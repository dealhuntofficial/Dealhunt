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
  brand: string;
  rating: number;
};

const deals: Deal[] = [
  {
    id: "1",
    category: "electronics",
    subcategory: "mobiles",
    title: "Apple iPhone 15",
    image: "/iphone.jpg",
    priceNow: 69999,
    priceOld: 79999,
    discount: 12,
    dealUrl: "https://amazon.in",
    merchant: "amazon",
    brand: "Apple",
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
    brand: "HP",
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
    brand: "Nike",
    rating: 4.5,
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const merchant = searchParams.get("merchant");
  const brand = searchParams.get("brand");
  const rating = searchParams.get("rating");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");

  let filtered = [...deals];

  if (category) filtered = filtered.filter(d => d.category === category);
  if (subcategory) filtered = filtered.filter(d => d.subcategory === subcategory);
  if (merchant) filtered = filtered.filter(d => d.merchant === merchant);
  if (brand) filtered = filtered.filter(d => d.brand === brand);
  if (rating) filtered = filtered.filter(d => d.rating >= Number(rating));
  if (minPrice) filtered = filtered.filter(d => d.priceNow >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(d => d.priceNow <= Number(maxPrice));

  if (sort === "price_low") filtered.sort((a, b) => a.priceNow - b.priceNow);
  if (sort === "price_high") filtered.sort((a, b) => b.priceNow - a.priceNow);
  if (sort === "newest") filtered = filtered.reverse();

  const merchants = Array.from(new Set(filtered.map(d => d.merchant)));
  const brands = Array.from(new Set(filtered.map(d => d.brand)));

  return NextResponse.json({
    deals: filtered,
    merchants,
    brands,
  });
}
