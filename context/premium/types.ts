import type {
  PremiumEntitlement,
  PremiumFeature,
  SubscriptionPlan,
} from "@/types/premium";

export interface PremiumContextType {
  entitlement: PremiumEntitlement;
  plan: SubscriptionPlan;
  isPremium: boolean;
  loading: boolean;
  canPreview: boolean;
  canAccess: (feature: PremiumFeature) => boolean;
  refresh: () => Promise<void>;
  setPreviewPlan: (plan: SubscriptionPlan) => void;
}
