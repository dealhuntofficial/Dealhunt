"use client";

import React, { useState, useRef } from "react";
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
import { useRouter } from "next/navigation";

type Suggestion =
  | { type: "deal"; label: string }
  | { type: "merchant"; label: string; url: string }
  | { type: "empty"; label: string };

const MERCHANT_SEARCH_URLS: Record<string, (q: string) => string> = {
  Amazon: q => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  Flipkart: q => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  Myntra: q => `https://www.myntra.com/${encodeURIComponent(q)}`,
  Meesho: q => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
};

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [listening, setListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(`/api/deals?search=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.deals && data.deals.length > 0) {
      setSuggestions(
        data.deals.slice(0, 5).map((d: any) => ({
          type: "deal",
          label: d.title,
        }))
      );
    } else {
      const merchantSuggestions = Object.entries(MERCHANT_SEARCH_URLS).map(
        ([name, fn]) => ({
          type: "merchant" as const,
          label: `Search "${query}" on ${name}`,
          url: fn(query),
        })
      );

      setSuggestions(
        merchantSuggestions.length > 0
          ? merchantSuggestions
          : [{ type: "empty", label: "No results found" }]
      );
    }
  };

  const handleSelect = (item: Suggestion) => {
    setSuggestions([]);
    setDrawerOpen(false);

    if (item.type === "deal") {
      router.push(`/#products?search=${encodeURIComponent(item.label)}`);
    } else if (item.type === "merchant") {
      window.open(item.url, "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      fetchSuggestions(searchQuery);
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    setListening(true);

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setSearchQuery(text);
      fetchSuggestions(text);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const displayName = session?.user?.name
    ? session.user.name.split(" ").slice(0, 2).join(" ")
    : "Guest";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <input ref={fileInputRef} type="file" hidden />

      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-yellow-500">Deal</span>Hunt
        </Link>

        {/* SEARCH BAR (DESKTOP + MOBILE) */}
        <div className="flex-1 mx-4 relative">
          <input
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search products, brands, deals..."
            className="w-full border rounded-full px-4 py-2 text-sm"
          />

          {/* TAGLINE (FIXED FOR MOBILE) */}
          <p className="text-xs text-gray-500 mt-1 hidden sm:block">
            Compare prices • Best deals • Trusted merchants
          </p>

          {suggestions.length > 0 && (
            <ul className="absolute bg-white w-full shadow mt-2 rounded z-50">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => s.type !== "empty" && handleSelect(s)}
                  className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                >
                  {s.label}
                </li>
              ))}
            </ul>
          )}

          <div className="absolute right-3 top-2 flex gap-2">
            <FiCamera />
            <FiMic
              className={listening ? "text-red-500" : ""}
              onClick={handleMicClick}
            />
            <FiSearch onClick={() => fetchSuggestions(searchQuery)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FiUser onClick={() => router.push("/signin")} />
          <span className="hidden sm:block">Hi, {displayName}</span>
          <FiMoreVertical onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {drawerOpen && (
        <aside className="fixed right-0 top-0 w-72 h-full bg-white shadow p-6 z-50">
          <FiX onClick={() => setDrawerOpen(false)} />
          <nav className="mt-6 flex flex-col gap-4">
            <button onClick={() => router.push("/")}>Home</button>
            <button onClick={() => router.push("/#products")}>Products</button>
            <button onClick={() => router.push("/refer")}>Refer & Earn</button>
            <button onClick={() => router.push("/wallet")}>Wallet</button>
          </nav>
        </aside>
      )}
    </header>
  );
     }
