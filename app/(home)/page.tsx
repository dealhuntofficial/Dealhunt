import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading homepage...</div>}>
      <HomePageClient />
    </Suspense>
  );
}
