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

const sampleSuggestions = [
  "Rolex Daytona",
  "Omega Seamaster",
  "Apple Watch Ultra",
  "Tag Heuer Carrera",
  "Cartier Tank",
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [listening, setListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 0) {
      setSuggestions(
        sampleSuggestions.filter(i =>
          i.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else setSuggestions([]);
  };

  const handleSelect = (item: string) => {
    setSearchQuery(item);
    setSuggestions([]);
    setDrawerOpen(false);
    router.push(`/#products?search=${encodeURIComponent(item)}`);
  };

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (e: any) =>
      setSearchQuery(e.results[0][0].transcript);
    recognition.start();
  };

  const handleNavigate = (href: string) => {
    setDrawerOpen(false);
    router.push(href);
  };

  const displayName = session?.user?.name
    ? session.user.name.split(" ").slice(0, 2).join(" ")
    : "Guest";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-yellow-500">Deal</span>Hunt
        </Link>

        <div className="hidden md:block w-1/3 relative">
          <input
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search products..."
            className="w-full border rounded-full px-4 py-2"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white w-full shadow mt-1 rounded">
              {suggestions.map(s => (
                <li
                  key={s}
                  onClick={() => handleSelect(s)}
                  className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          <div className="absolute right-2 top-2 flex gap-2">
            <FiCamera onClick={handleCameraClick} />
            <FiMic onClick={handleMicClick} />
            <FiSearch onClick={() => handleSelect(searchQuery)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FiUser onClick={() => router.push("/signin")} />
          <span>Hi, {displayName}</span>
          <FiMoreVertical onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {drawerOpen && (
        <aside className="fixed right-0 top-0 w-72 h-full bg-white shadow p-6">
          <FiX onClick={() => setDrawerOpen(false)} />
          <nav className="mt-6 flex flex-col gap-4">
            <button onClick={() => handleNavigate("/")}>Home</button>
            <button onClick={() => handleNavigate("/#products")}>Products</button>
            <button onClick={() => handleNavigate("/refer")}>Refer & Earn</button>
            <button onClick={() => handleNavigate("/wallet")}>Wallet</button>
          </nav>
        </aside>
      )}
    </header>
  );
                                                 }
