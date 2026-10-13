"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasFeatureAccess } from "@/lib/premium/features";
import { getPremiumEntitlement } from "@/services/premium/entitlementService";
import type {
  PremiumEntitlement,
  PremiumFeature,
  SubscriptionPlan,
} from "@/types/premium";
import { PremiumContext } from "./context";
import {
  canUsePremiumPreview,
  readPremiumPreview,
  writePremiumPreview,
} from "./preview";

const DEFAULT_ENTITLEMENT: PremiumEntitlement = {
  plan: "free",
  active: true,
  source: "default",
};

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [entitlement, setEntitlement] = useState(DEFAULT_ENTITLEMENT);
  const [loading, setLoading] = useState(true);
  const [canPreview, setCanPreview] = useState(false);

  const refresh = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);
    const preview = readPremiumPreview();
    if (preview) {
      setEntitlement({ plan: preview, active: true, source: "preview" });
    } else {
      setEntitlement(await getPremiumEntitlement(user));
    }
    setLoading(false);
  }, [authLoading, user]);

  useEffect(() => {
    setCanPreview(canUsePremiumPreview());
    void refresh();
  }, [refresh]);

  const setPreviewPlan = useCallback((plan: SubscriptionPlan) => {
    if (!canUsePremiumPreview()) return;
    writePremiumPreview(plan);
    setEntitlement({ plan, active: true, source: "preview" });
  }, []);

  const value = useMemo(() => ({
    entitlement,
    plan: entitlement.plan,
    isPremium: entitlement.plan === "premium" && entitlement.active,
    loading,
    canPreview,
    canAccess: (feature: PremiumFeature) => {
      const effectivePlan = entitlement.plan === "premium" && entitlement.active
        ? "premium"
        : "free";
      return hasFeatureAccess(feature, effectivePlan);
    },
    refresh,
    setPreviewPlan,
  }), [canPreview, entitlement, loading, refresh, setPreviewPlan]);

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}
