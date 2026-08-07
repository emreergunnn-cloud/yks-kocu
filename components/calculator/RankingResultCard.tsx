import { Card } from "@/components/ui/Card";

interface Props {
  year: number;
  estimatedRank: number;
  confidence: number;
  target?: {
    tytMin: number;
    tytMax: number;
    aytMin: number;
    aytMax: number;
  };
}

export function RankingResultCard({
  year,
  estimatedRank,
  confidence,
  target,
}: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {year}
      </h2>

      <div className="mt-4">
        <p className="text-sm text-slate-500">
          Tahmini Sıralama
        </p>

        <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
          {estimatedRank.toLocaleString("tr-TR")}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3 text-sm">

        <p>
          TYT Hedef:{" "}
          {target
            ? `${target.tytMin}-${target.tytMax}`
            : "-"}
        </p>

        <p>
          AYT Hedef:{" "}
          {target
            ? `${target.aytMin}-${target.aytMax}`
            : "-"}
        </p>

        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
          Güven Oranı: %{confidence}
        </p>

      </div>
    </Card>
  );
}