// hooks/useFilters.ts
"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type FiltersState = {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  merchant?: string; // comma separated or single
  sort?: string;
  minDiscount?: string;
  maxDiscount?: string;
  rating?: string;
  partners?: string; // kept for compatibility (comma)
};

export default function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read helper — returns FiltersState
  const read = useCallback((): FiltersState => {
    return {
      q: searchParams.get("q") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      merchant: searchParams.get("merchant") || "",
      partners: searchParams.get("partners") || "",
      sort: searchParams.get("sort") || "",
      minDiscount: searchParams.get("minDiscount") || "",
      maxDiscount: searchParams.get("maxDiscount") || "",
      rating: searchParams.get("rating") || "",
    };
  }, [searchParams]);

  // Update URL with given FiltersState (merge optional)
  const apply = useCallback(
    (next: Partial<FiltersState>) => {
      const qs = new URLSearchParams();

      // use existing params as base
      const base = read();

      const merged: FiltersState = { ...base, ...next };

      if (merged.q) qs.set("q", String(merged.q));
      if (merged.minPrice) qs.set("minPrice", String(merged.minPrice));
      if (merged.maxPrice) qs.set("maxPrice", String(merged.maxPrice));
      if (merged.merchant) qs.set("merchant", String(merged.merchant));
      if (merged.partners) qs.set("partners", String(merged.partners));
      if (merged.sort) qs.set("sort", String(merged.sort));
      if (merged.minDiscount) qs.set("minDiscount", String(merged.minDiscount));
      if (merged.maxDiscount) qs.set("maxDiscount", String(merged.maxDiscount));
      if (merged.rating) qs.set("rating", String(merged.rating));

      const query = qs.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, read]
  );

  const replace = useCallback(
    (next: Partial<FiltersState>) => {
      // same as apply but replace (we use push here; Next.js router currently doesn't expose replace easily in this hook)
      apply(next);
    },
    [apply]
  );

  const clear = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    read,
    apply,
    replace,
    clear,
  };
}
