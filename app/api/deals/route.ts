// app/api/deals/route.ts
import { NextResponse } from "next/server";
import { mockDeals } from "@/data/mockDeals";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const q = searchParams.get("q");

    let deals = [...mockDeals];

    if (category) {
      deals = deals.filter(d => d.category === category);
    }

    if (subcategory) {
      deals = deals.filter(d => d.subcategory === subcategory);
    }

    if (q) {
      deals = deals.filter(d =>
        d.title.toLowerCase().includes(q.toLowerCase())
      );
    }

    return NextResponse.json({ deals });
  } catch (err) {
    console.error("Deals API error:", err);
    return NextResponse.json({ deals: [] }, { status: 500 });
  }
}
