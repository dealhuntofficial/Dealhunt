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

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    alert(
      "Image selected ✔️\n\nImage search via AI will be added later.\nFor now please search using keywords."
    );

    e.target.value = "";
  };

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
      router.push(`/categories/all?search=${encodeURIComponent(item.label)}`);
    } else {
      window.open(item.url, "_blank");
    }
  };

  const handleEnterSearch = () => {
    if (!searchQuery) return;
    handleSelect({ type: "deal", label: searchQuery });
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageSelect}
        hidden
      />

      <div className="max-w-7xl mx-auto px-6 py-3 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="text-2xl font-bold tracking-wide">
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
                className="w-full px-4 pr-28 py-2 rounded-full border focus:ring-2 focus:ring-yellow-500"
              />

              {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white shadow-md rounded-b-md mt-1 z-50">
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
                <button onClick={handleCameraClick}>
                  <FiCamera />
                </button>
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

        {/* Mobile Search */}
        <div className="md:hidden mt-3 relative">
          <input
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={e => e.key === "Enter" && handleEnterSearch()}
            placeholder="Search products..."
            className="w-full px-4 pr-28 py-2 rounded-full border"
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            <button onClick={handleCameraClick}>
              <FiCamera />
            </button>
            <FiMic
              onClick={handleMicClick}
              className={listening ? "text-red-500" : ""}
            />
            <FiSearch onClick={handleEnterSearch} />
          </div>
        </div>

        {/* Mobile Profile */}
        <div className="flex justify-end gap-2 mt-2 md:hidden">
          <span>Hi, {displayName}</span>
          <FiUser onClick={() => router.push("/signin")} />
          <FiMoreVertical onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed right-0 top-0 w-72 h-full bg-white p-6 shadow-xl z-50">
            <FiX onClick={() => setDrawerOpen(false)} />
            <nav className="mt-6 flex flex-col gap-4">
              <button onClick={() => router.push("/")}>Home</button>
              <button onClick={() => router.push("/categories/all")}>
                Products
              </button>
              <button onClick={() => router.push("/refer")}>
                Refer & Earn
              </button>
              <button onClick={() => router.push("/wallet")}>Wallet</button>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
    }
