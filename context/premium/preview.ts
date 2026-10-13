import type { SubscriptionPlan } from "@/types/premium";

const PREVIEW_KEY = "yks-kocu:premium-preview";

export function canUsePremiumPreview(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
}

export function readPremiumPreview(): SubscriptionPlan | null {
  if (!canUsePremiumPreview()) return null;
  const value = window.localStorage.getItem(PREVIEW_KEY);
  return value === "premium" || value === "free" ? value : null;
}

export function writePremiumPreview(plan: SubscriptionPlan): void {
  if (!canUsePremiumPreview()) return;
  window.localStorage.setItem(PREVIEW_KEY, plan);
}
