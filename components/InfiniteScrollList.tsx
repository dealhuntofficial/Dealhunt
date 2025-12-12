"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  fetchFn: (page: number) => Promise<any[]>; // returns array of deals/products
  renderItem: (item: any) => React.ReactNode;
};

export default function InfiniteScrollList({ fetchFn, renderItem }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      const res = await fetchFn(page);

      if (res.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...res]);
      }

      setLoading(false);
    };

    load();
  }, [page]);

  // Observe bottom div
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, loading]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i}>{renderItem(item)}</div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600">Loading...</div>
      )}

      <div ref={loaderRef} className="h-10"></div>

      {!hasMore && (
        <div className="text-center py-4 text-gray-500">
          No more results
        </div>
      )}
    </>
  );
}
