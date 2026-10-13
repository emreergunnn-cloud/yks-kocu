"use client";

import { useMemo, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, BookOpenCheck, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buildYksAdvancedAnalytics } from "@/services/analytics/advancedMetrics";
import type { ExamResult } from "@/types/exam";
import type { UserProfile } from "@/types/user";

interface Props {
  exams: ExamResult[];
  profile: UserProfile;
}

function ChangeValue({ value }: { value: number | null }) {
  if (value === null) return <span className="text-slate-400">Veri yetersiz</span>;
  const positive = value >= 0;
  return (
    <span className={`flex items-center gap-1 font-black ${positive ? "text-emerald-600" : "text-rose-600"}`}>
      {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      {value > 0 ? "+" : ""}{value} net
    </span>
  );
}

export function YksAdvancedAnalytics({ exams, profile }: Props) {
  const data = useMemo(() => buildYksAdvancedAnalytics(exams, profile), [exams, profile]);

  return (
    <Card className="space-y-5 border-amber-200 p-5 dark:border-amber-900/70">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Premium</p>
        <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Gelişmiş YKS Analizi</h3>
        <p className="mt-1 text-xs text-slate-500">Son dönem denemelerin, ders yüzdelerin ve hedef farkın birlikte değerlendirilir.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="TYT son dönem"><ChangeValue value={data.tytChange} /></Metric>
        <Metric label="AYT son dönem"><ChangeValue value={data.aytChange} /></Metric>
        <Metric label="En güçlü ders" value={data.strongestSection?.name ?? "Veri yok"} icon={<BookOpenCheck className="h-4 w-4" />} />
        <Metric label="Hedef net farkı" value={data.targetGap === null ? "Veri yok" : `${data.targetGap} net`} icon={<Target className="h-4 w-4" />} />
      </div>

      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/50">
        <p className="text-xs font-semibold text-slate-500">Öncelikli ders</p>
        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {data.prioritySection ? `${data.prioritySection.name} · %${data.prioritySection.percentage}` : "Henüz yeterli ders verisi yok."}
        </p>
        <p className="mt-1 text-xs text-slate-500">Karşılaştırma son {data.recentExamCount || 0} denemeye kadar olan güncel geçmişi kullanır.</p>
      </div>
    </Card>
  );
}

function Metric({ label, value, icon, children }: { label: string; value?: string; icon?: ReactNode; children?: ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50">
      <div className="flex items-center gap-1 text-xs text-slate-500">{icon}{label}</div>
      <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{children ?? value}</div>
    </div>
  );
}
