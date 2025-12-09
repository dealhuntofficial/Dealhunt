"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-sm px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all shadow-sm"
    >
      ← Back
    </button>
  );
}
