"use client";

import { Card } from "@/components/ui/Card";

interface RankingCalculatorResult {
  rank?: number | string;
  ranking?: number | string;
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
  const rank = result?.rank ?? result?.ranking;
  const score = result?.score;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {year} Tahmini
        </h3>

        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          Tahmini
        </span>
      </div>

      {result ? (
        <div className="space-y-4">
          {rank !== undefined && (
            <div>
              <p className="text-sm text-slate-500">
                Tahmini Başarı Sıralaması
              </p>

              <p className="mt-1 text-3xl font-black text-blue-600">
                #{Number(rank).toLocaleString("tr-TR")}
              </p>
            </div>
          )}

          {score !== undefined && (
            <div>
              <p className="text-sm text-slate-500">
                Tahmini Puan
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {score}
              </p>
            </div>
          )}

          {rank === undefined && score === undefined && (
            <p className="text-sm text-slate-500">
              Hesaplama sonucu hazır.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Henüz hesaplama yapılmadı.
        </p>
      )}
    </Card>
  );
}