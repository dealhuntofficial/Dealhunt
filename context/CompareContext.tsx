"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CompareContextType = {
  compareId: string | null;
  setCompareId: (id: string | null) => void;
};

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareId, setCompareId] = useState<string | null>(null);

  return (
    <CompareContext.Provider value={{ compareId, setCompareId }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
