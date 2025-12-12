import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/Deal";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    const query: any = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    // Global filters
    if (searchParams.get("q"))
      query.title = { $regex: searchParams.get("q"), $options: "i" };

    if (searchParams.get("minPrice"))
      query.final_price = { $gte: Number(searchParams.get("minPrice")) };

    if (searchParams.get("maxPrice"))
      query.final_price = {
        ...(query.final_price || {}),
        $lte: Number(searchParams.get("maxPrice"))
      };

    if (searchParams.get("merchant"))
      query.merchant = searchParams.get("merchant");

    if (searchParams.get("rating"))
      query.rating = { $gte: Number(searchParams.get("rating")) };

    if (searchParams.get("minDiscount"))
      query.discount_percent = {
        $gte: Number(searchParams.get("minDiscount"))
      };

    if (searchParams.get("maxDiscount"))
      query.discount_percent = {
        ...(query.discount_percent || {}),
        $lte: Number(searchParams.get("maxDiscount"))
      };

    // --------------------------------------------
    // ⭐ NEW: REAL BRAND FILTERING
    // --------------------------------------------
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

    // --------------------------------------------

    // Sorting
    let sort: any = {};
    const sortParam = searchParams.get("sort");

    if (sortParam === "price_low") sort.final_price = 1;
    if (sortParam === "price_high") sort.final_price = -1;
    if (sortParam === "discount") sort.discount_percent = -1;
    if (sortParam === "newest") sort.createdAt = -1;

    const deals = await Deal.find(query).sort(sort);

    return NextResponse.json({ deals });
  } catch (err) {
    console.error("API DEAL ERROR:", err);
    return NextResponse.json({ deals: [] });
  }
}
