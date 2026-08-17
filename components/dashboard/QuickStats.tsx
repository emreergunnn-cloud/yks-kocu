"use client";

import { Card } from "@/components/ui/Card";

interface QuickStatsProps {
  totalExams: number;
  avgTytNet: number;
  avgAytNet: number;
  maxTytNet: number;
  maxAytNet: number;
}

export function QuickStats({
  totalExams,
  avgTytNet,
  avgAytNet,
  maxTytNet,
  maxAytNet,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-5">
        <p className="text-sm text-slate-500">
          Toplam Deneme
        </p>

        <p className="mt-2 text-3xl font-black">
          {totalExams}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Adet
        </p>
      </Card>

      <Card className="p-5">
        <p className="text-sm text-slate-500">
          Ortalama TYT
        </p>

        <p className="mt-2 text-3xl font-black text-blue-600">
          {avgTytNet}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          En yüksek: {maxTytNet} / 120
        </p>
      </Card>

      <Card className="p-5">
        <p className="text-sm text-slate-500">
          Ortalama AYT
        </p>

        <p className="mt-2 text-3xl font-black text-indigo-600">
          {avgAytNet}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          En yüksek: {maxAytNet} / 80
        </p>
      </Card>
    </div>
  );
}
