"use client";

import { useRef } from "react";
import { FiCamera } from "react-icons/fi";

export default function FloatingAIButtons() {
  const fileInputRef = useRef(null);

  const handleCamera = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert(`Selected file: ${file.name}`);
    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ⬆️ moved UP to avoid CompareStrip overlap */}
      <div className="fixed bottom-24 right-5 z-50">
        <button
          onClick={handleCamera}
          className="bg-orange-500 hover:bg-orange-600 p-4 rounded-full shadow-lg text-white text-2xl"
        >
          <FiCamera />
        </button>
      </div>
    </>
  );
}
