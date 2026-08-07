"use client";

import { Card } from "@/components/ui/Card";

interface QuickStatsProps {
  totalExams: number;
  avgTytNet: number;
  avgAytNet: number;
  avgToplamNet: number;
  maxTytNet: number;
  maxAytNet: number;
}

export function QuickStats({
  totalExams,
  avgTytNet,
  avgAytNet,
  avgToplamNet,
  maxTytNet,
  maxAytNet,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      <Card>
        <p className="text-sm text-slate-500">
          Toplam Deneme
        </p>

        <p className="mt-2 text-3xl font-black">
          {totalExams}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">
          Ortalama TYT
        </p>

        <p className="mt-2 text-3xl font-black text-blue-600">
          {avgTytNet}
        </p>

        <p className="text-xs text-slate-400 mt-2">
          Max: {maxTytNet}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">
          Ortalama AYT
        </p>

        <p className="mt-2 text-3xl font-black text-indigo-600">
          {avgAytNet}
        </p>

        <p className="text-xs text-slate-400 mt-2">
          Max: {maxAytNet}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">
          Ortalama Toplam Net
        </p>

        <p className="mt-2 text-3xl font-black text-emerald-600">
          {avgToplamNet}
        </p>
      </Card>

    </div>
  );
}