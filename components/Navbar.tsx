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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [listening, setListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- SEARCH LOGIC ---------------- */

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(`/api/deals?search=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.deals && data.deals.length > 0) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  const handleSelect = (item: Suggestion) => {
    setSuggestions([]);
    setDrawerOpen(false);

    if (item.type === "deal") {
      router.push(`/#products?search=${encodeURIComponent(item.label)}`);
    } else {
      window.open(item.url, "_blank");
    }
  };

  const handleEnterSearch = () => {
    if (!searchQuery) return;
    handleSelect({ type: "deal", label: searchQuery });
  };

  /* ---------------- CAMERA SEARCH ---------------- */

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Option-1: user confirmation based search
    const keyword = prompt(
      "Enter product name from image (eg. iPhone 15, Nike Shoes)"
    );

    if (keyword) {
      setSearchQuery(keyword);
      fetchSuggestions(keyword);
    }
  };

  /* ---------------- MIC SEARCH ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      {/* CAMERA INPUT */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageSelect}
        hidden
      />

      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-yellow-500">Deal</span>Hunt
            </Link>
            <p className="text-sm font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Saving you money with verified deals
            </p>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-4 mt-3 md:mt-0">
            <div className="relative w-full max-w-md">
              <input
                value={searchQuery}
                onChange={handleChange}
                onKeyDown={e => e.key === "Enter" && handleEnterSearch()}
                placeholder="Search products..."
                className="w-full px-4 pr-28 py-2 rounded-full border"
              />

              {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white shadow-md mt-1 z-50">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelect(s)}
                      className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                    >
                      {s.label}
                    </li>
                  ))}
                </ul>
              )}

              <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                <FiCamera
                  className="cursor-pointer"
                  onClick={handleCameraClick}
                />
                <FiMic
                  onClick={handleMicClick}
                  className={listening ? "text-red-500" : ""}
                />
                <FiSearch onClick={handleEnterSearch} />
              </div>
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <FiUser onClick={() => router.push("/signin")} />
            <span>Hi, {displayName}</span>
            <FiMoreVertical onClick={() => setDrawerOpen(true)} />
          </div>
        </div>
      </div>
    </header>
  );
      }
