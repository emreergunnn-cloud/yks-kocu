import type { ReactNode } from "react";
import { BookOpenCheck, Clock3, RotateCcw, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { StudyStats } from "@/services/studyStatsService";

interface SubjectRow {
  id: string;
  name: string;
  total: number;
  studied: number;
  completed: number;
  review: number;
}

interface Summary {
  subjects: SubjectRow[];
  total: number;
  studied: number;
  completed: number;
  review: number;
}

function ratio(subject: SubjectRow) {
  return subject.total > 0 ? subject.studied / subject.total : 0;
}

export function SchoolAdvancedAnalytics({ summary, studyStats }: { summary: Summary; studyStats: StudyStats }) {
  const subjects = summary.subjects.filter((item) => item.total > 0);
  const strongest = [...subjects].sort((a, b) => ratio(b) - ratio(a))[0];
  const priority = [...subjects].sort((a, b) => ratio(a) - ratio(b))[0];
  const reviewHeavy = [...subjects].sort((a, b) => b.review - a.review)[0];
  const completion = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;
  const monthlyWeeklyAverage = studyStats.monthMinutes / 4;
  const paceDelta = Math.round((studyStats.weekMinutes - monthlyWeeklyAverage) / 6) / 10;

  return (
    <Card className="space-y-5 border-amber-200 p-5 dark:border-amber-900/70">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Premium</p>
        <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Gelişmiş Ders Analizi</h3>
        <p className="mt-1 text-xs text-slate-500">Konu ilerlemen ve çalışma tempon birlikte değerlendirilir.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={<BookOpenCheck className="h-4 w-4" />} label="En güçlü ders" value={strongest?.name ?? "Veri yok"} />
        <Metric icon={<Target className="h-4 w-4" />} label="Öncelikli ders" value={priority?.name ?? "Veri yok"} />
        <Metric icon={<RotateCcw className="h-4 w-4" />} label="En çok tekrar" value={reviewHeavy?.review ? `${reviewHeavy.name} · ${reviewHeavy.review}` : "Yok"} />
        <Metric icon={<Clock3 className="h-4 w-4" />} label="Haftalık tempo" value={`${paceDelta >= 0 ? "+" : ""}${paceDelta} sa`} />
      </div>

      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Tamamlanmış konu oranı</span>
          <span className="font-black text-slate-900 dark:text-white">%{completion}</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">Haftalık tempo, bu haftaki süreyi bu ayın yaklaşık haftalık ortalamasıyla karşılaştırır.</p>
      </div>
    </Card>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50">
      <div className="flex items-center gap-1 text-xs text-slate-500">{icon}{label}</div>
      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
