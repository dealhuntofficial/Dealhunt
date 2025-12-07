// app/api/merchants/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; 
// Ensures API runs dynamically on Vercel Edge/Server

// -------------------------
// Merchant Logo Mapper
// -------------------------
function getLogoForMerchant(name: string | undefined) {
  if (!name) return null;

  const n = name.toLowerCase().replace(/\s+/g, "");

  const map: Record<string, string> = {
    amazon: "/images/partners/amazon.png",
    flipkart: "/images/partners/flipkart.png",
    meesho: "/images/partners/meesho.png",
    myntra: "/images/partners/myntra.png",
    ajio: "/images/partners/ajio.png",
    tatacliq: "/images/partners/tatacliq.png",
    croma: "/images/partners/croma.png",
    reliancedigital: "/images/partners/reliancedigital.png",
    snapdeal: "/images/partners/snapdeal.png",
  };

  const key = Object.keys(map).find((k) => n.includes(k));
  return key ? map[key] : null;
}

// -------------------------
// GET API
// -------------------------
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const category = url.searchParams.get("category") || "";
    const subcategory = url.searchParams.get("subcategory") || "";

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);

    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const dealsUrl = `${base}/api/deals?${params.toString()}`;

    // Fetch deals
    const res = await fetch(dealsUrl, { cache: "no-store" });

    if (!res.ok) {
      console.warn("⚠ merchants route: deals API returned error");
      return NextResponse.json({ merchants: [] });
    }

    const json = await res.json();
    const deals = json.deals || [];

    const merchantSet = new Map<string, { name: string; logo?: string }>();

    // Collect unique merchants from deals
    for (const deal of deals) {
      const comps = deal.comparison || [];

      // Comparison merchants
      for (const c of comps) {
        const name = (c.site || c.merchant || c.partner || "").toString().trim();
        if (!name || merchantSet.has(name)) continue;

        merchantSet.set(name, {
          name,
          logo: getLogoForMerchant(name) || undefined,
        });
      }

      // Top-level merchant  
      const top = (deal.merchant || deal.seller || deal.brand || "").toString().trim();
      if (top && !merchantSet.has(top)) {
        merchantSet.set(top, {
          name: top,
          logo: getLogoForMerchant(top) || undefined,
        });
      }
    }

    return NextResponse.json({
      merchants: Array.from(merchantSet.values()),
    });

  } catch (err) {
    console.error("🔥 merchants API error:", err);
    return NextResponse.json({ merchants: [] });
  }
}
