import {
  SAYISAL_2024,
  SAYISAL_2025,
  SAYISAL_2026,
  EA_2024,
  EA_2025,
  EA_2026,
  SOZEL_2024,
  SOZEL_2025,
  SOZEL_2026,
  DIL_2024,
  DIL_2025,
  DIL_2026,
  type RankingTarget,
} from "@/lib/constants/rankingTargets";

export interface RankingCalculatorResult {
  ranking: number;
  tytNet: number;
  aytNet: number;
}

type Alan =
  | "Sayısal"
  | "Eşit Ağırlık"
  | "Sözel"
  | "Dil";

/**
 * Alan ve yıla göre sıralama tablosunu getirir.
 */
export function getRankingTargets(
  alan: string,
  year: number
): RankingTarget[] {
  switch (alan as Alan) {
    case "Sayısal":
      if (year === 2024) return SAYISAL_2024;
      if (year === 2025) return SAYISAL_2025;
      return SAYISAL_2026;

    case "Eşit Ağırlık":
      if (year === 2024) return EA_2024;
      if (year === 2025) return EA_2025;
      return EA_2026;

    case "Sözel":
      if (year === 2024) return SOZEL_2024;
      if (year === 2025) return SOZEL_2025;
      return SOZEL_2026;

    case "Dil":
      if (year === 2024) return DIL_2024;
      if (year === 2025) return DIL_2025;
      return DIL_2026;

    default:
      return [];
  }
}

/**
 * Bir sıralama satırındaki ortalama TYT netini hesaplar.
 */
function getTytNet(target: RankingTarget): number {
  return Number(
    ((target.tytMin + target.tytMax) / 2).toFixed(1)
  );
}

/**
 * Bir sıralama satırındaki ortalama AYT netini hesaplar.
 */
function getAytNet(target: RankingTarget): number {
  return Number(
    ((target.aytMin + target.aytMax) / 2).toFixed(1)
  );
}

/**
 * İki sıralama noktası arasında doğrusal tahmin yapar.
 */
function interpolate(
  lower: RankingTarget,
  upper: RankingTarget,
  ratio: number
): RankingCalculatorResult {
  const lowerTyt = getTytNet(lower);
  const upperTyt = getTytNet(upper);

  const lowerAyt = getAytNet(lower);
  const upperAyt = getAytNet(upper);

  return {
    ranking: Math.round(
      lower.rank +
        (upper.rank - lower.rank) * ratio
    ),

    tytNet: Number(
      (
        lowerTyt +
        (upperTyt - lowerTyt) * ratio
      ).toFixed(1)
    ),

    aytNet: Number(
      (
        lowerAyt +
        (upperAyt - lowerAyt) * ratio
      ).toFixed(1)
    ),
  };
}

/**
 * Verilen TYT + AYT netine göre
 * tahmini sıralama hesaplar.
 *
 * Bu fonksiyon coachService tarafından kullanılır.
 */
export function calculateRanking(
  targets: RankingTarget[],
  tytNet: number,
  aytNet: number
): RankingCalculatorResult {
  if (!targets.length) {
    return {
      ranking: 0,
      tytNet,
      aytNet,
    };
  }

  const totalNet = tytNet + aytNet;

  const sorted = [...targets].sort(
    (a, b) =>
      getTytNet(a) +
      getAytNet(a) -
      (getTytNet(b) + getAytNet(b))
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstTotal =
    getTytNet(first) + getAytNet(first);

  const lastTotal =
    getTytNet(last) + getAytNet(last);

  /*
   * En yüksek net seviyesinin üzerindeyse
   * en iyi sıralamayı döndür.
   */
  if (totalNet >= firstTotal) {
    return {
      ranking: first.rank,
      tytNet,
      aytNet,
    };
  }

  /*
   * En düşük net seviyesinin altındaysa
   * en düşük sıralamayı döndür.
   */
  if (totalNet <= lastTotal) {
    return {
      ranking: last.rank,
      tytNet,
      aytNet,
    };
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const upper = sorted[i];
    const lower = sorted[i + 1];

    const upperTotal =
      getTytNet(upper) + getAytNet(upper);

    const lowerTotal =
      getTytNet(lower) + getAytNet(lower);

    if (
      totalNet <= upperTotal &&
      totalNet >= lowerTotal
    ) {
      const ratio =
        upperTotal === lowerTotal
          ? 0
          : (totalNet - lowerTotal) /
            (upperTotal - lowerTotal);

      return interpolate(
        lower,
        upper,
        ratio
      );
    }
  }

  return {
    ranking: last.rank,
    tytNet,
    aytNet,
  };
}

/**
 * Hedef sıralamaya ulaşmak için yaklaşık
 * gerekli TYT + AYT netlerini hesaplar.
 *
 * coachService.ts tarafından kullanılır.
 */
export function calculateTarget(
  alan: string,
  targetRanking: number,
  year: number
): RankingCalculatorResult {
  const targets = getRankingTargets(
    alan,
    year
  );

  if (!targets.length) {
    return {
      ranking: targetRanking,
      tytNet: 0,
      aytNet: 0,
    };
  }

  /*
   * Sıralamayı küçükten büyüğe sırala.
   * Örn:
   * 1000
   * 2500
   * 5000
   * ...
   */
  const sorted = [...targets].sort(
    (a, b) => a.rank - b.rank
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  /*
   * Hedef sıralama tablonun en iyi
   * sıralamasından daha büyükse,
   * ilk satırdaki netleri kullan.
   */
  if (targetRanking <= first.rank) {
    return {
      ranking: targetRanking,
      tytNet: getTytNet(first),
      aytNet: getAytNet(first),
    };
  }

  /*
   * Hedef sıralama tablonun en düşük
   * sıralamasından daha büyükse,
   * son satırdaki netleri kullan.
   */
  if (targetRanking >= last.rank) {
    return {
      ranking: targetRanking,
      tytNet: getTytNet(last),
      aytNet: getAytNet(last),
    };
  }

  /*
   * İki sıralama noktası arasında
   * doğrusal interpolasyon yap.
   */
  for (let i = 0; i < sorted.length - 1; i++) {
    const better = sorted[i];
    const worse = sorted[i + 1];

    if (
      targetRanking >= better.rank &&
      targetRanking <= worse.rank
    ) {
      const ratio =
        worse.rank === better.rank
          ? 0
          : (targetRanking - better.rank) /
            (worse.rank - better.rank);

      const betterTyt = getTytNet(better);
      const worseTyt = getTytNet(worse);

      const betterAyt = getAytNet(better);
      const worseAyt = getAytNet(worse);

      return {
        ranking: targetRanking,

        tytNet: Number(
          (
            betterTyt +
            (worseTyt - betterTyt) * ratio
          ).toFixed(1)
        ),

        aytNet: Number(
          (
            betterAyt +
            (worseAyt - betterAyt) * ratio
          ).toFixed(1)
        ),
      };
    }
  }

  return {
    ranking: targetRanking,
    tytNet: getTytNet(last),
    aytNet: getAytNet(last),
  };
}