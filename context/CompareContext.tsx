"use client";

import { createContext, useContext, useState } from "react";

type CompareItem = {
  id: string;
  title: string;
  image: string;
  basePrice: number;
};

type CompareContextType = {
  item: CompareItem | null;
  openCompare: (item: CompareItem) => void;
  closeCompare: () => void;
};

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<CompareItem | null>(null);

  const openCompare = (item: CompareItem) => setItem(item);
  const closeCompare = () => setItem(null);

  return (
    <CompareContext.Provider value={{ item, openCompare, closeCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
};
