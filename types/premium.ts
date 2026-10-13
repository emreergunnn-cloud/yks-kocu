export type SubscriptionPlan = "free" | "premium";

export type PremiumEntitlementSource =
  | "default"
  | "firebase_claim"
  | "preview";

export interface PremiumEntitlement {
  plan: SubscriptionPlan;
  active: boolean;
  source: PremiumEntitlementSource;
}

export type PremiumFeature =
  | "core_study"
  | "basic_analytics"
  | "basic_exam_history"
  | "ad_free"
  | "advanced_analytics"
  | "weekly_report"
  | "monthly_report"
  | "adaptive_plan_plus";
