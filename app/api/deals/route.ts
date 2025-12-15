import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/Deal";

export async function GET(req: Request) {
  try {
    // 1️⃣ DB CONNECT
    await dbConnect();

    // 2️⃣ QUERY PARAMS
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const merchant = searchParams.get("merchant");
    const q = searchParams.get("q");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const minDiscount = searchParams.get("minDiscount");
    const maxDiscount = searchParams.get("maxDiscount");
    const sortParam = searchParams.get("sort");

    // 3️⃣ BUILD QUERY
    const query: any = {};

    if (category) query.category = category;
    if (subcategory && subcategory !== "real-brand")
      query.subcategory = subcategory;

    if (merchant) query.merchant = merchant;

    if (q)
      query.title = { $regex: q, $options: "i" };

    if (rating)
      query.rating = { $gte: Number(rating) };

    if (minPrice || maxPrice) {
      query.final_price = {};
      if (minPrice) query.final_price.$gte = Number(minPrice);
      if (maxPrice) query.final_price.$lte = Number(maxPrice);
    }

    if (minDiscount || maxDiscount) {
      query.discount_percent = {};
      if (minDiscount)
        query.discount_percent.$gte = Number(minDiscount);
      if (maxDiscount)
        query.discount_percent.$lte = Number(maxDiscount);
    }

    // 4️⃣ ⭐ REAL BRAND LOGIC
    const realBrands = [
      "Apple",
      "Samsung",
      "OnePlus",
      "Boat",
      "Sony",
      "Puma",
      "Nike",
      "Adidas",
      "Lenovo",
      "Dell",
      "HP"
    ];

    if (subcategory === "real-brand") {
      query.merchant = { $in: realBrands };
    }

    // 5️⃣ SORTING
    const sort: any = {};
    if (sortParam === "price_low") sort.final_price = 1;
    if (sortParam === "price_high") sort.final_price = -1;
    if (sortParam === "discount") sort.discount_percent = -1;
    if (sortParam === "newest") sort.createdAt = -1;

    // 6️⃣ FETCH DEALS
    const deals = await Deal.find(query).sort(sort);

    // 7️⃣ AUTO BRAND LIST (FOR UI)
    const availableBrands = [
      ...new Set(
        deals
          .map((d: any) => d.merchant)
          .filter((b: string) => realBrands.includes(b))
      )
    ];

    // 8️⃣ RESPONSE
    return NextResponse.json({
      deals,
      brands: availableBrands
    });
  } catch (error) {
    console.error("API DEAL ERROR:", error);
    return NextResponse.json({
      deals: [],
      brands: []
    });
  }
}
