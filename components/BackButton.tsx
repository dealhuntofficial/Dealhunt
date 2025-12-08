"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold"
    >
      ← Back
    </button>
  );
}
