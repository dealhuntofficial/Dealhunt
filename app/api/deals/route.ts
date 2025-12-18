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

  const search = searchParams.get("search");

  let filtered = [...deals];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.subcategory.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    deals: filtered,
  });
}
