import type { User } from "firebase/auth";
import type { PremiumEntitlement } from "@/types/premium";

const FREE_ENTITLEMENT: PremiumEntitlement = {
  plan: "free",
  active: true,
  source: "default",
};

export async function getPremiumEntitlement(
  user: User | null
): Promise<PremiumEntitlement> {
  if (!user) return FREE_ENTITLEMENT;

  try {
    const token = await user.getIdTokenResult();
    const claims = token.claims;
    const isPremium = claims.premium === true || claims.plan === "premium";

    if (isPremium) {
      return {
        plan: "premium",
        active: true,
        source: "firebase_claim",
      };
    }
  } catch (error) {
    console.warn("Premium yetkisi okunamadı:", error);
  }

  return FREE_ENTITLEMENT;
}
