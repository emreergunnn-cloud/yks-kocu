"use client";

import type { ReactNode } from "react";
import { usePremium } from "@/hooks/usePremium";
import type { PremiumFeature } from "@/types/premium";

interface Props {
  feature: PremiumFeature;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PremiumGate({ feature, children, fallback = null }: Props) {
  const { canAccess, loading } = usePremium();
  if (loading) return null;
  return canAccess(feature) ? <>{children}</> : <>{fallback}</>;
}
