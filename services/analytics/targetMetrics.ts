import type { UserProfile } from "@/types/user";

export function estimateTargetNet(profile: UserProfile | null) {
  const targetRank = Number(profile?.hedefSiralama) || 20000;
  if (targetRank <= 5000) return 175;
  if (targetRank <= 15000) return 160;
  if (targetRank <= 30000) return 145;
  if (targetRank <= 50000) return 130;
  return 110;
}

export function calculateTargetProgress(
  profile: UserProfile | null,
  latestTytNet: number,
  latestAytNet: number,
  estimatedTargetNet: number
) {
  const targetTyt = Number(profile?.targetTYT) || 0;
  const targetAyt = Number(profile?.targetAYT) || 0;
  const explicitTarget = targetTyt + targetAyt;
  const current = (targetTyt > 0 ? latestTytNet : 0) + (targetAyt > 0 ? latestAytNet : 0);

  if (explicitTarget > 0) {
    return Math.min(100, Math.round((current / explicitTarget) * 100));
  }

  const fallbackCurrent = latestTytNet + latestAytNet;
  return Math.min(100, Math.round((fallbackCurrent / estimatedTargetNet) * 100));
}
