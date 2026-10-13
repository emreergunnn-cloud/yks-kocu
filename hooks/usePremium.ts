"use client";

import { useContext } from "react";
import { PremiumContext } from "@/context/premium/context";

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium, PremiumProvider içinde kullanılmalıdır.");
  }
  return context;
}
