// app/api/merchants/route.ts
import { NextResponse } from "next/server";

function getLogoForMerchant(name: string | undefined) {
  if (!name) return null;
  const n = name.toLowerCase();
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

  // best-effort normalize
  const key = Object.keys(map).find((k) => n.includes(k));
  return key ? map[key] : null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || "";
    const subcategory = url.searchParams.get("subcategory") || "";
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (subcategory) q.set("subcategory", subcategory);

    // Build internal deals URL (use base if provided)
    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const dealsUrl = `${base}/api/deals?${q.toString()}`;

    const res = await fetch(dealsUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ merchants: [] });
    }

    const json = await res.json();
    const items = json.deals || [];

    const merchantSet = new Map<string, { name: string; logo?: string }>();

    items.forEach((it: any) => {
      const comps = it.comparison || [];
      comps.forEach((c: any) => {
        const name = (c.site || c.merchant || c.partner || "").toString().trim();
        if (!name) return;
        if (!merchantSet.has(name)) {
          merchantSet.set(name, { name, logo: getLogoForMerchant(name) || undefined });
        }
      });

      // also try top-level merchant/merchantName fields
      const top = (it.merchant || it.seller || it.brand || "").toString().trim();
      if (top && !merchantSet.has(top)) {
        merchantSet.set(top, { name: top, logo: getLogoForMerchant(top) || undefined });
      }
    });

    const merchants = Array.from(merchantSet.values());

    return NextResponse.json({ merchants });
  } catch (err) {
    console.error("GET /api/merchants error:", err);
    return NextResponse.json({ merchants: [] });
  }
}
