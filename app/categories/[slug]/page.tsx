import { Suspense } from "react";
import CategoryDealsClient from "./CategoryDealsClient";

export default function CategoryDealsPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading deals...</div>}>
      <CategoryDealsClient params={params} />
    </Suspense>
  );
}
