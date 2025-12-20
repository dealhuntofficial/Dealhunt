import { Suspense } from "react";
import DealsPageClient from "./DealsPageClient";

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading deals...</div>}>
      <DealsPageClient />
    </Suspense>
  );
}
