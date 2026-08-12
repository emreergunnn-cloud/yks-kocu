"use client";

import { Card } from "@/components/ui/Card";

interface RankingCalculatorResult {
  estimatedRank?: number;
  score?: number | string;
  [key: string]: any;
}

interface Props {
  year: number;
  result: RankingCalculatorResult | null | undefined;
}

export function RankingResultCard({
  year,
  result,
}: Props) {
  const rank = result?.estimatedRank;
  const score = result?.score;

  return (
    <Card className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {year} Tahmini
          </h3>

          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            {year === 2026 ? "Gelecek Tahmin" : "Tahmini"}
          </span>
        </div>

        {result ? (
          <div className="space-y-4">
            {rank !== undefined && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tahmini Başarı Sıralaması
                </p>

                <p className="mt-1 text-3xl font-black text-blue-600 dark:text-blue-400">
                  {year === 2026 ? (
                    <>
                      {Math.max(1, Math.round(Number(rank) * 0.9)).toLocaleString("tr-TR")} - {Math.round(Number(rank) * 1.1).toLocaleString("tr-TR")}
                    </>
                  ) : (
                    `#${Number(rank).toLocaleString("tr-TR")}`
                  )}
                </p>
                {year === 2026 && (
                  <p className="text-xs text-slate-400 mt-2">
                    Kesin sıralama değil, tahmini bir aralıktır.
                  </p>
                )}
              </div>
            )}

            {score !== undefined && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tahmini Puan
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {score}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Henüz hesaplama yapılmadı.
          </p>
        )}
      </div>
    </Card>
  );
}