// components/FilterSidebar.tsx
"use client";

import React, { useState } from "react";
import Filters from "./Filters";

type Props = {
  mobile?: boolean;
  className?: string;
};

export default function FilterSidebar({ mobile = false, className = "" }: Props) {
  const [open, setOpen] = useState(!mobile); // default open on desktop, closed on mobile

  return (
    <div className={className}>
      {mobile && (
        <button
          onClick={() => setOpen((s) => !s)}
          className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        >
          {open ? "Hide Filters" : "Show Filters"}
        </button>
      )}

      <div className={`${mobile ? (open ? "block" : "hidden") : "block"}`}>
        <Filters onClose={() => setOpen(false)} showClose={mobile} />
      </div>
    </div>
  );
}
