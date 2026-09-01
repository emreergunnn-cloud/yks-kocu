import {
  DIL_2024, DIL_2025, DIL_2026, EA_2024, EA_2025, EA_2026,
  SAYISAL_2024, SAYISAL_2025, SAYISAL_2026, SOZEL_2024, SOZEL_2025, SOZEL_2026,
  type RankingTarget,
} from "@/lib/constants/rankingTargets";
import type { Alan } from "./types";

export function getRankingTargets(alan: string, year: number): RankingTarget[] {
  const tables: Record<Alan, Record<number, RankingTarget[]>> = {
    Sayısal: { 2024: SAYISAL_2024, 2025: SAYISAL_2025, 2026: SAYISAL_2026 },
    "Eşit Ağırlık": { 2024: EA_2024, 2025: EA_2025, 2026: EA_2026 },
    Sözel: { 2024: SOZEL_2024, 2025: SOZEL_2025, 2026: SOZEL_2026 },
    Dil: { 2024: DIL_2024, 2025: DIL_2025, 2026: DIL_2026 },
  };
  const byYear = tables[alan as Alan];
  return byYear?.[year] ?? byYear?.[2026] ?? [];
}
