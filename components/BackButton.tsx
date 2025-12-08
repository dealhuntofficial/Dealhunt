// /components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 
                 text-white px-4 py-2 rounded-md shadow-sm transition"
    >
      ← Back
    </button>
  );
}
