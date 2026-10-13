import type {
  PremiumFeature,
  SubscriptionPlan,
} from "@/types/premium";

export interface PremiumFeatureDefinition {
  id: PremiumFeature;
  title: string;
  description: string;
  requiredPlan: SubscriptionPlan;
  status: "active" | "planned";
}

export const PREMIUM_FEATURES: readonly PremiumFeatureDefinition[] = [
  {
    id: "core_study",
    title: "Temel çalışma araçları",
    description: "Konu takibi, çalışma planı, Pomodoro, takvim ve kaynaklar.",
    requiredPlan: "free",
    status: "active",
  },
  {
    id: "basic_analytics",
    title: "Temel analizler",
    description: "Net, konu ve çalışma ilerlemesinin temel görünümü.",
    requiredPlan: "free",
    status: "active",
  },
  {
    id: "basic_exam_history",
    title: "Deneme geçmişi",
    description: "Denemelerini kaydet ve geçmiş sonuçlarını görüntüle.",
    requiredPlan: "free",
    status: "active",
  },
  {
    id: "ad_free",
    title: "Reklamsız kullanım",
    description: "Premium hesaplarda uygulama içi banner reklamları gösterilmez.",
    requiredPlan: "premium",
    status: "planned",
  },
  {
    id: "advanced_analytics",
    title: "Gelişmiş analizler",
    description: "Son dönem değişimleri, ders öncelikleri ve hedef farkı analizi.",
    requiredPlan: "premium",
    status: "active",
  },
  {
    id: "weekly_report",
    title: "Haftalık gelişim raporu",
    description: "Haftanın çalışma, konu ve deneme performansının kişisel özeti.",
    requiredPlan: "premium",
    status: "planned",
  },
  {
    id: "monthly_report",
    title: "Aylık performans özeti",
    description: "Aylık ilerleme, güçlü alanlar ve gelişmesi gereken noktalar.",
    requiredPlan: "premium",
    status: "planned",
  },
  {
    id: "adaptive_plan_plus",
    title: "Gelişmiş plan optimizasyonu",
    description: "Geçmiş performansa göre daha ayrıntılı çalışma öncelikleri.",
    requiredPlan: "premium",
    status: "planned",
  },
];

export function hasFeatureAccess(
  feature: PremiumFeature,
  plan: SubscriptionPlan
): boolean {
  const definition = PREMIUM_FEATURES.find((item) => item.id === feature);
  if (!definition || definition.status !== "active") return false;
  return definition.requiredPlan === "free" || plan === "premium";
}
