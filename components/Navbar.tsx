"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiUser,
  FiMoreVertical,
  FiX,
  FiCamera,
  FiMic,
  FiSearch,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Suggestion =
  | { type: "deal"; label: string }
  | { type: "merchant"; label: string; url: string };

const MERCHANT_SEARCH_URLS: Record<string, (q: string) => string> = {
  Amazon: q => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  Flipkart: q => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  Myntra: q => `https://www.myntra.com/${encodeURIComponent(q)}`,
  Meesho: q => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
};

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [listening, setListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ✅ CLEAR SEARCH WHEN PAGE CHANGES */
  useEffect(() => {
    setSearchQuery("");
    setSuggestions([]);
  }, [pathname, searchParams.toString()]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    alert("Image search coming soon");
    e.target.value = "";
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(`/api/deals?search=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.deals?.length) {
      setSuggestions(
        data.deals.slice(0, 6).map((d: any) => ({
          type: "deal",
          label: d.title,
        }))
      );
    } else {
      setSuggestions(
        Object.entries(MERCHANT_SEARCH_URLS).map(([name, fn]) => ({
          type: "merchant",
          label: `Search "${query}" on ${name}`,
          url: fn(query),
        }))
      );
    }
  };

  const handleSearch = (label: string) => {
    router.push(`/categories/all?search=${encodeURIComponent(label)}`);
  };

  const handleEnterSearch = () => {
    if (!searchQuery.trim()) return;
    handleSearch(searchQuery);
  };

  const displayName = session?.user?.name?.split(" ").slice(0, 2).join(" ") || "Guest";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      <input type="file" hidden ref={fileInputRef} onChange={handleImageSelect} />

      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* LOGO */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-yellow-500">Deal</span>Hunt
            </Link>
            <p className="text-sm bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Saving you money with verified deals
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:max-w-md mt-3 md:mt-0">
            <input
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              onKeyDown={e => e.key === "Enter" && handleEnterSearch()}
              placeholder="Search products..."
              className="w-full px-4 pr-28 py-2 rounded-full border"
            />

            {suggestions.length > 0 && (
              <ul className="absolute w-full bg-white shadow rounded mt-1 z-50">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                    onClick={() =>
                      s.type === "deal"
                        ? handleSearch(s.label)
                        : window.open(s.url, "_blank")
                    }
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}

            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              <FiCamera onClick={handleCameraClick} />
              <FiMic />
              <FiSearch onClick={handleEnterSearch} />
            </div>
          </div>

          {/* USER */}
          <div className="hidden md:flex gap-2 items-center">
            <FiUser />
            <span>Hi, {displayName}</span>
            <FiMoreVertical onClick={() => setDrawerOpen(true)} />
          </div>
        </div>
      </div>
    </header>
  );
}
